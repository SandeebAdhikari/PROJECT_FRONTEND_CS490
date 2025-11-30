"use client";

import React, { useState, useEffect, useCallback } from "react";
import { useRouter, useSearchParams } from "next/navigation";
import {
  CheckCircle,
  Calendar,
  Clock,
  User,
  Scissors,
  MapPin,
  DollarSign,
  Mail,
  Download,
} from "lucide-react";
import { API_ENDPOINTS, fetchConfig } from "@/libs/api/config";

interface AppointmentDetails {
  appointment_id: number;
  salon_id: number;
  salon_name: string;
  staff_id: number;
  staff_name: string;
  service_id: number;
  service_name: string;
  scheduled_time: string;
  status: string;
  price: number;
  notes?: string;
}

interface PaymentDetails {
  payment_id: number;
  amount: number;
  payment_method: string;
  payment_status: string;
  created_at: string;
  stripe_checkout_session_id: string;
}

const PaymentSuccessPage = () => {
  const router = useRouter();
  const searchParams = useSearchParams();
  const sessionId = searchParams.get("session_id");

  const [appointment, setAppointment] = useState<AppointmentDetails | null>(
    null
  );
  const [payment, setPayment] = useState<PaymentDetails | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  const fetchPaymentDetails = useCallback(async () => {
    try {
      setLoading(true);
      const token =
        localStorage.getItem("token") || localStorage.getItem("authToken");

      // In a real implementation, you would call an endpoint that verifies the session
      // and returns both payment and appointment details
      // For now, we'll fetch from appointment history
      const response = await fetch(API_ENDPOINTS.HISTORY.APPOINTMENTS, {
        ...fetchConfig,
        headers: {
          ...fetchConfig.headers,
          ...(token ? { Authorization: `Bearer ${token}` } : {}),
        },
      });

      if (!response.ok) {
        throw new Error("Failed to fetch payment details");
      }

      const appointments = await response.json();

      // Get the most recent appointment (assuming it's the one just paid for)
      if (appointments && appointments.length > 0) {
        const recentAppointment = appointments[0];
        setAppointment(recentAppointment);

        // Mock payment details based on appointment
        setPayment({
          payment_id: 1,
          amount: recentAppointment.price || 0,
          payment_method: "stripe",
          payment_status: "completed",
          created_at: new Date().toISOString(),
          stripe_checkout_session_id: sessionId || "",
        });
      }
    } catch (err) {
      setError(
        err instanceof Error ? err.message : "Failed to load payment details"
      );
    } finally {
      setLoading(false);
    }
  }, [sessionId]);

  const handleDownloadReceipt = () => {
    // In production, this would generate a PDF receipt
    alert("Receipt download feature coming soon!");
  };

  const handleEmailReceipt = () => {
    // In production, this would email the receipt
    alert("Email receipt feature coming soon!");
  };

  useEffect(() => {
    if (sessionId) {
      fetchPaymentDetails();
    } else {
      setError("No payment session found");
      setLoading(false);
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [sessionId]);

  if (loading) {
    return (
      <div className="min-h-screen bg-muted flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-16 w-16 border-b-4 border-primary mx-auto"></div>
          <p className="mt-4 text-muted-foreground font-semibold">
            Verifying payment...
          </p>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="min-h-screen bg-muted flex items-center justify-center p-4">
        <div className="max-w-md w-full bg-card border border-border rounded-2xl p-8 text-center">
          <div className="w-16 h-16 bg-red-100 rounded-full flex items-center justify-center mx-auto mb-4">
            <svg
              className="w-8 h-8 text-red-600"
              fill="none"
              viewBox="0 0 24 24"
              stroke="currentColor"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={2}
                d="M6 18L18 6M6 6l12 12"
              />
            </svg>
          </div>
          <h2 className="text-2xl font-bold mb-2">
            Payment Verification Failed
          </h2>
          <p className="text-muted-foreground mb-6">{error}</p>
          <button
            onClick={() => router.push("/customer/my-profile")}
            className="px-6 py-3 bg-primary text-white rounded-lg hover:bg-primary/90 font-semibold transition-colors"
          >
            View My Appointments
          </button>
        </div>
      </div>
    );
  }

  if (!appointment || !payment) {
    return (
      <div className="min-h-screen bg-muted flex items-center justify-center p-4">
        <div className="max-w-md w-full bg-card border border-border rounded-2xl p-8 text-center">
          <h2 className="text-2xl font-bold mb-2">No Payment Information</h2>
          <p className="text-muted-foreground mb-6">
            Unable to find payment details
          </p>
          <button
            onClick={() => router.push("/customer")}
            className="px-6 py-3 bg-primary text-white rounded-lg hover:bg-primary/90 font-semibold transition-colors"
          >
            Back to Home
          </button>
        </div>
      </div>
    );
  }

  const appointmentDate = new Date(appointment.scheduled_time);
  const paymentDate = new Date(payment.created_at);
  const taxAmount = (payment.amount * 0.08) / 1.08; // Calculate tax from total
  const subtotal = payment.amount - taxAmount;

  return (
    <div className="min-h-screen bg-muted p-4 sm:p-8">
      <div className="max-w-4xl mx-auto">
        {/* Success Header */}
        <div className="bg-card border border-border rounded-2xl p-8 sm:p-10 shadow-soft-br mb-6 text-center">
          <div className="w-24 h-24 bg-green-100 rounded-full flex items-center justify-center mx-auto mb-4">
            <CheckCircle className="w-14 h-14 text-green-600" />
          </div>
          <h1 className="text-4xl font-bold mb-3 text-green-600">
            Payment Successful!
          </h1>
          <p className="text-muted-foreground text-lg mb-2">
            Your payment has been confirmed
          </p>
          <p className="text-sm text-muted-foreground">
            Payment ID:{" "}
            <span className="font-mono font-semibold">
              #{payment.payment_id}
            </span>
          </p>
        </div>

        {/* Order Summary */}
        <div className="bg-card border border-border rounded-2xl p-6 sm:p-8 shadow-soft-br mb-6">
          <div className="flex items-center justify-between mb-6">
            <h2 className="text-2xl font-bold">Order Summary</h2>
            <span className="px-4 py-2 bg-green-100 text-green-800 rounded-full text-sm font-semibold">
              PAID
            </span>
          </div>

          {/* Appointment Details */}
          <div className="space-y-5 mb-6 pb-6 border-b border-border">
            <div className="flex items-start gap-4">
              <div className="w-12 h-12 bg-primary/10 rounded-full flex items-center justify-center flex-shrink-0">
                <MapPin className="w-6 h-6 text-primary" />
              </div>
              <div className="flex-1">
                <p className="text-sm text-muted-foreground">Salon</p>
                <p className="text-xl font-semibold">
                  {appointment.salon_name}
                </p>
              </div>
            </div>

            <div className="flex items-start gap-4">
              <div className="w-12 h-12 bg-primary/10 rounded-full flex items-center justify-center flex-shrink-0">
                <Scissors className="w-6 h-6 text-primary" />
              </div>
              <div className="flex-1">
                <p className="text-sm text-muted-foreground">Service</p>
                <p className="text-xl font-semibold">
                  {appointment.service_name}
                </p>
              </div>
            </div>

            <div className="flex items-start gap-4">
              <div className="w-12 h-12 bg-primary/10 rounded-full flex items-center justify-center flex-shrink-0">
                <User className="w-6 h-6 text-primary" />
              </div>
              <div className="flex-1">
                <p className="text-sm text-muted-foreground">Stylist</p>
                <p className="text-xl font-semibold">
                  {appointment.staff_name}
                </p>
              </div>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div className="flex items-start gap-4">
                <div className="w-12 h-12 bg-primary/10 rounded-full flex items-center justify-center flex-shrink-0">
                  <Calendar className="w-6 h-6 text-primary" />
                </div>
                <div className="flex-1">
                  <p className="text-sm text-muted-foreground">Date</p>
                  <p className="text-lg font-semibold">
                    {appointmentDate.toLocaleDateString("en-US", {
                      month: "short",
                      day: "numeric",
                      year: "numeric",
                    })}
                  </p>
                </div>
              </div>

              <div className="flex items-start gap-4">
                <div className="w-12 h-12 bg-primary/10 rounded-full flex items-center justify-center flex-shrink-0">
                  <Clock className="w-6 h-6 text-primary" />
                </div>
                <div className="flex-1">
                  <p className="text-sm text-muted-foreground">Time</p>
                  <p className="text-lg font-semibold">
                    {appointmentDate.toLocaleTimeString("en-US", {
                      hour: "2-digit",
                      minute: "2-digit",
                    })}
                  </p>
                </div>
              </div>
            </div>
          </div>

          {/* Payment Breakdown */}
          <div className="space-y-4 mb-6">
            <h3 className="text-lg font-bold">Payment Details</h3>

            <div className="space-y-3">
              <div className="flex justify-between text-base">
                <span className="text-muted-foreground">Subtotal</span>
                <span className="font-semibold">${subtotal.toFixed(2)}</span>
              </div>
              <div className="flex justify-between text-base">
                <span className="text-muted-foreground">Tax (8%)</span>
                <span className="font-semibold">${taxAmount.toFixed(2)}</span>
              </div>
              <div className="h-px bg-border"></div>
              <div className="flex justify-between text-xl">
                <span className="font-bold">Total Paid</span>
                <span className="font-bold text-primary">
                  ${payment.amount.toFixed(2)}
                </span>
              </div>
            </div>

            <div className="mt-4 p-4 bg-muted rounded-lg">
              <div className="flex items-center gap-2 text-sm">
                <DollarSign className="w-4 h-4 text-muted-foreground" />
                <span className="text-muted-foreground">Payment Method:</span>
                <span className="font-semibold capitalize">
                  {payment.payment_method}
                </span>
              </div>
              <div className="flex items-center gap-2 text-sm mt-2">
                <Calendar className="w-4 h-4 text-muted-foreground" />
                <span className="text-muted-foreground">Payment Date:</span>
                <span className="font-semibold">
                  {paymentDate.toLocaleDateString("en-US", {
                    month: "short",
                    day: "numeric",
                    year: "numeric",
                    hour: "2-digit",
                    minute: "2-digit",
                  })}
                </span>
              </div>
            </div>
          </div>

          {/* Receipt Actions */}
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 pt-6 border-t border-border">
            <button
              onClick={handleDownloadReceipt}
              className="flex items-center justify-center gap-2 px-6 py-3 border-2 border-primary text-primary rounded-lg font-semibold hover:bg-primary/5 transition-colors"
            >
              <Download className="w-5 h-5" />
              Download Receipt
            </button>
            <button
              onClick={handleEmailReceipt}
              className="flex items-center justify-center gap-2 px-6 py-3 border-2 border-border rounded-lg font-semibold hover:bg-muted transition-colors"
            >
              <Mail className="w-5 h-5" />
              Email Receipt
            </button>
          </div>
        </div>

        {/* Next Steps */}
        <div className="bg-card border border-border rounded-2xl p-6 sm:p-8 shadow-soft-br mb-6">
          <h2 className="text-xl font-bold mb-4">What&apos;s Next?</h2>
          <div className="space-y-4">
            <div className="flex items-start gap-3">
              <div className="w-8 h-8 bg-primary rounded-full flex items-center justify-center flex-shrink-0 text-white font-bold">
                1
              </div>
              <div>
                <p className="font-semibold">Confirmation Email</p>
                <p className="text-sm text-muted-foreground">
                  You&apos;ll receive a confirmation email with your appointment
                  details and receipt.
                </p>
              </div>
            </div>
            <div className="flex items-start gap-3">
              <div className="w-8 h-8 bg-primary rounded-full flex items-center justify-center flex-shrink-0 text-white font-bold">
                2
              </div>
              <div>
                <p className="font-semibold">Appointment Reminder</p>
                <p className="text-sm text-muted-foreground">
                  We&apos;ll send you a reminder 24 hours before your
                  appointment.
                </p>
              </div>
            </div>
            <div className="flex items-start gap-3">
              <div className="w-8 h-8 bg-primary rounded-full flex items-center justify-center flex-shrink-0 text-white font-bold">
                3
              </div>
              <div>
                <p className="font-semibold">Arrive on Time</p>
                <p className="text-sm text-muted-foreground">
                  Please arrive 5-10 minutes early to check in for your
                  appointment.
                </p>
              </div>
            </div>
          </div>
        </div>

        {/* Action Buttons */}
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
          <button
            onClick={() => router.push("/customer/my-profile")}
            className="px-6 py-4 bg-primary text-white rounded-lg font-semibold text-lg hover:bg-primary/90 transition-colors"
          >
            View My Appointments
          </button>
          <button
            onClick={() => router.push("/customer")}
            className="px-6 py-4 border-2 border-border rounded-lg font-semibold text-lg hover:bg-muted transition-colors"
          >
            Book Another Appointment
          </button>
        </div>

        {/* Help Section */}
        <div className="mt-6 text-center">
          <p className="text-sm text-muted-foreground">
            Questions about your appointment?{" "}
            <a
              href="mailto:support@salon.com"
              className="text-primary hover:underline font-semibold"
            >
              Contact Support
            </a>
          </p>
        </div>
      </div>
    </div>
  );
};

export default PaymentSuccessPage;
