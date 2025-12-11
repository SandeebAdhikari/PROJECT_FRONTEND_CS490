/* eslint-disable react-hooks/exhaustive-deps, react/no-unescaped-entities */
"use client";

import React, { useState, useEffect, Suspense } from "react";
import { useRouter, useSearchParams } from "next/navigation";
import { Calendar, Clock, User, Scissors, MapPin, Mail, CreditCard, Gift } from "lucide-react";
import { API_ENDPOINTS, fetchConfig } from "@/libs/api/config";
import { getMyPoints, calculateDiscount } from "@/libs/api/loyalty";

export const dynamic = 'force-dynamic';

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

const CheckoutPageContent = () => {
  const router = useRouter();
  const searchParams = useSearchParams();
  const appointmentId = searchParams.get("appointmentId");

  const [appointment, setAppointment] = useState<AppointmentDetails | null>(null);
  const [loading, setLoading] = useState(true);
  const [processing, setProcessing] = useState(false);
  const [error, setError] = useState("");
  const [paymentMethod, setPaymentMethod] = useState<"pay_in_full" | "pay_in_store">("pay_in_full");
  const [availablePoints, setAvailablePoints] = useState(0);
  const [pointsToRedeem, setPointsToRedeem] = useState(0);
  const [discount, setDiscount] = useState(0);
  const [_loadingPoints, setLoadingPoints] = useState(false);
  const [depositPercentage, setDepositPercentage] = useState(0);

  useEffect(() => {
    if (appointmentId) {
      fetchAppointmentDetails();
    }
  }, [appointmentId]);

  useEffect(() => {
    if (appointment?.salon_id) {
      fetchLoyaltyPoints();
      fetchSalonDepositSettings();
    }
  }, [appointment?.salon_id]);

  const fetchSalonDepositSettings = async () => {
    if (!appointment?.salon_id) return;
    try {
      const token = localStorage.getItem("token") || localStorage.getItem("authToken");
      const response = await fetch(`${API_ENDPOINTS.SALONS.GET_PUBLIC(appointment.salon_id)}`, {
        ...fetchConfig,
        headers: {
          ...fetchConfig.headers,
          ...(token ? { Authorization: `Bearer ${token}` } : {}),
        },
      });

      if (response.ok) {
        const salonData = await response.json();
        const depositPct = salonData.bookingSettings?.depositPercentage || 0;
        setDepositPercentage(depositPct);
      }
    } catch (err) {
      console.error("Failed to fetch salon deposit settings:", err);
    }
  };

  useEffect(() => {
    if (pointsToRedeem > 0 && appointment?.salon_id) {
      calculateDiscountAmount();
    } else {
      setDiscount(0);
    }
  }, [pointsToRedeem, appointment?.salon_id]);

  const fetchAppointmentDetails = async () => {
    try {
      setLoading(true);
      const token = localStorage.getItem("token") || localStorage.getItem("authToken");

      const response = await fetch(`${API_ENDPOINTS.APPOINTMENTS.BOOK}/${appointmentId}`, {
        ...fetchConfig,
        headers: {
          ...fetchConfig.headers,
          ...(token ? { Authorization: `Bearer ${token}` } : {}),
        },
      });

      if (!response.ok) {
        throw new Error("Failed to fetch appointment details");
      }

      const data = await response.json();
      setAppointment(data);
    } catch (err) {
      setError(err instanceof Error ? err.message : "Failed to load appointment");
    } finally {
      setLoading(false);
    }
  };

  const fetchLoyaltyPoints = async () => {
    if (!appointment?.salon_id) return;
    setLoadingPoints(true);
    try {
      const result = await getMyPoints(appointment.salon_id);
      if (result.data) {
        setAvailablePoints(result.data.points);
      }
    } catch (err) {
      console.error("Failed to fetch loyalty points:", err);
    } finally {
      setLoadingPoints(false);
    }
  };

  const calculateDiscountAmount = async () => {
    if (!appointment?.salon_id || pointsToRedeem <= 0) {
      setDiscount(0);
      return;
    }
    try {
      const result = await calculateDiscount(appointment.salon_id, pointsToRedeem);
      if (result.discount !== undefined) {
        setDiscount(result.discount);
      }
    } catch (err) {
      console.error("Failed to calculate discount:", err);
      setDiscount(0);
    }
  };

  const handleProceedToPayment = async () => {
    if (!appointment) {
      setError("Appointment not found");
      return;
    }

    setProcessing(true);
    setError("");

    try {
      const token = localStorage.getItem("token") || localStorage.getItem("authToken");

      if (!token) {
        throw new Error("Please login to continue");
      }

      // Calculate total amount (price + tax - discount)
      const taxAmount = appointment.price * 0.08;
      let totalAmount = appointment.price + taxAmount;
      totalAmount = Math.max(0, totalAmount - discount); // Apply discount, ensure total is not negative

      if (paymentMethod === "pay_in_store") {
        // Handle pay in store option
        const response = await fetch(API_ENDPOINTS.PAYMENTS.PAY_IN_STORE, {
          ...fetchConfig,
          method: "POST",
          headers: {
            ...fetchConfig.headers,
            Authorization: `Bearer ${token}`,
          },
          body: JSON.stringify({
            amount: totalAmount,
            appointment_id: appointmentId,
            points_to_redeem: pointsToRedeem,
            salon_id: appointment.salon_id,
          }),
        });

        if (!response.ok) {
          const errorData = await response.json();
          throw new Error(errorData.error || "Failed to process payment");
        }

        const data = await response.json();
        
        // If deposit is required, redirect to deposit payment
        if (data.deposit_required && data.payment_link) {
          window.location.href = data.payment_link;
        } else {
          alert("Appointment confirmed! You can pay when you arrive at the salon.");
          router.push(`/customer/appointments/${appointmentId}`);
        }
      } else {
        // Handle pay in full (Stripe checkout)
        const response = await fetch(API_ENDPOINTS.PAYMENTS.CHECKOUT, {
          ...fetchConfig,
          method: "POST",
          headers: {
            ...fetchConfig.headers,
            Authorization: `Bearer ${token}`,
          },
          body: JSON.stringify({
            amount: totalAmount,
            appointment_id: appointmentId,
            points_to_redeem: pointsToRedeem,
            salon_id: appointment.salon_id,
          }),
        });

        if (!response.ok) {
          const errorData = await response.json();
          throw new Error(errorData.error || "Failed to create checkout session");
        }

        const data = await response.json();

        // Redirect to Stripe payment page
        window.location.href = data.payment_link;
      }
    } catch (err) {
      setError(err instanceof Error ? err.message : "Payment failed. Please try again.");
      setProcessing(false);
    }
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-muted flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-16 w-16 border-b-4 border-primary mx-auto"></div>
          <p className="mt-4 text-muted-foreground font-semibold">Loading checkout...</p>
        </div>
      </div>
    );
  }

  if (error && !appointment) {
    return (
      <div className="min-h-screen bg-muted flex items-center justify-center p-4">
        <div className="max-w-md w-full bg-card border border-border rounded-2xl p-8 text-center">
          <div className="w-16 h-16 bg-red-100 rounded-full flex items-center justify-center mx-auto mb-4">
            <svg className="w-8 h-8 text-red-600" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
            </svg>
          </div>
          <h2 className="text-2xl font-bold mb-2">Checkout Error</h2>
          <p className="text-muted-foreground mb-6">{error}</p>
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

  if (!appointment) return null;

  const appointmentDate = new Date(appointment.scheduled_time);
  const taxAmount = appointment.price * 0.08; // 8% tax
  const subtotal = appointment.price + taxAmount;
  const totalAmount = Math.max(0, subtotal - discount);
  
  // Calculate deposit amount if pay in store and deposit percentage is set
  const depositAmount = paymentMethod === "pay_in_store" && depositPercentage > 0
    ? (totalAmount * depositPercentage) / 100
    : 0;

  return (
    <div className="min-h-screen bg-muted p-4 sm:p-8">
      <div className="max-w-4xl mx-auto">
        <div className="mb-6">
          <h1 className="text-3xl font-bold">Review & Pay</h1>
          <p className="text-muted-foreground mt-2">Review your appointment and proceed to payment</p>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          {/* Order Summary */}
          <div className="lg:col-span-2">
            <div className="bg-card border border-border rounded-2xl p-6 sm:p-8 shadow-soft-br">
              <h2 className="text-2xl font-bold mb-6">Appointment Summary</h2>

              {/* Appointment Details */}
              <div className="space-y-5">
                <div className="flex items-start gap-4 pb-4 border-b border-border">
                  <div className="w-12 h-12 bg-primary/10 rounded-full flex items-center justify-center flex-shrink-0">
                    <MapPin className="w-6 h-6 text-primary" />
                  </div>
                  <div className="flex-1">
                    <p className="text-sm text-muted-foreground">Salon</p>
                    <p className="text-xl font-semibold">{appointment.salon_name}</p>
                  </div>
                </div>

                <div className="flex items-start gap-4 pb-4 border-b border-border">
                  <div className="w-12 h-12 bg-primary/10 rounded-full flex items-center justify-center flex-shrink-0">
                    <Scissors className="w-6 h-6 text-primary" />
                  </div>
                  <div className="flex-1">
                    <p className="text-sm text-muted-foreground">Service</p>
                    <p className="text-xl font-semibold">{appointment.service_name}</p>
                  </div>
                </div>

                <div className="flex items-start gap-4 pb-4 border-b border-border">
                  <div className="w-12 h-12 bg-primary/10 rounded-full flex items-center justify-center flex-shrink-0">
                    <User className="w-6 h-6 text-primary" />
                  </div>
                  <div className="flex-1">
                    <p className="text-sm text-muted-foreground">Stylist</p>
                    <p className="text-xl font-semibold">{appointment.staff_name}</p>
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

                {appointment.notes && (
                  <div className="mt-4 p-4 bg-muted rounded-lg">
                    <p className="text-sm font-semibold mb-1">Notes:</p>
                    <p className="text-sm text-muted-foreground">{appointment.notes}</p>
                  </div>
                )}
              </div>
            </div>

            {/* Payment Info */}
            {paymentMethod === "pay_in_full" && (
              <div className="mt-6 bg-blue-50 border border-blue-200 rounded-xl p-6">
                <div className="flex items-start gap-3">
                  <Mail className="w-5 h-5 text-blue-600 flex-shrink-0 mt-0.5" />
                  <div className="flex-1">
                    <p className="font-semibold text-blue-900 mb-1">Payment Link Will Be Sent to Your Email</p>
                    <p className="text-sm text-blue-700">
                      After clicking "Proceed to Payment", we'll send you a secure payment link via email.
                      You'll then be redirected to complete your payment through Stripe's secure checkout.
                    </p>
                  </div>
                </div>
              </div>
            )}
            {paymentMethod === "pay_in_store" && (
              <div className="mt-6 bg-green-50 border border-green-200 rounded-xl p-6">
                <div className="flex items-start gap-3">
                  <MapPin className="w-5 h-5 text-green-600 flex-shrink-0 mt-0.5" />
                  <div className="flex-1">
                    <p className="font-semibold text-green-900 mb-1">
                      {depositAmount > 0 ? "Pay Deposit Now, Rest at Salon" : "Pay When You Arrive"}
                    </p>
                    <p className="text-sm text-green-700">
                      {depositAmount > 0 
                        ? `A deposit of $${depositAmount.toFixed(2)} is required to confirm your appointment. You'll pay the remaining $${(totalAmount - depositAmount).toFixed(2)} when you arrive at the salon.`
                        : "Your appointment will be confirmed. You can pay when you arrive at the salon on the day of your appointment."}
                    </p>
                  </div>
                </div>
              </div>
            )}
          </div>

          {/* Price Summary & Payment */}
          <div className="lg:col-span-1">
            <div className="bg-card border border-border rounded-2xl p-6 shadow-soft-br sticky top-8">
              <h2 className="text-xl font-bold mb-4">Price Summary</h2>

              {/* Price Breakdown */}
              <div className="space-y-3 mb-4 pb-4 border-b border-border">
                <div className="flex justify-between">
                  <span className="text-muted-foreground">Service Price</span>
                  <span className="font-semibold">${appointment.price.toFixed(2)}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-muted-foreground">Tax (8%)</span>
                  <span className="font-semibold">${taxAmount.toFixed(2)}</span>
                </div>
                {discount > 0 && (
                  <div className="flex justify-between text-green-600">
                    <span className="text-muted-foreground">Loyalty Discount</span>
                    <span className="font-semibold">-${discount.toFixed(2)}</span>
                  </div>
                )}
                {depositAmount > 0 && (
                  <div className="flex justify-between text-orange-600">
                    <span className="text-muted-foreground">Deposit Required ({depositPercentage.toFixed(0)}%)</span>
                    <span className="font-semibold">${depositAmount.toFixed(2)}</span>
                  </div>
                )}
              </div>

              {/* Loyalty Points Section */}
              {availablePoints > 0 && (
                <div className="mb-6 p-4 bg-muted/50 rounded-lg border border-border">
                  <div className="flex items-center gap-2 mb-3">
                    <Gift className="w-4 h-4 text-primary" />
                    <span className="text-sm font-semibold">Redeem Loyalty Points</span>
                  </div>
                  <div className="text-xs text-muted-foreground mb-2">
                    You have {availablePoints} points available
                  </div>
                  <div className="flex items-center gap-2">
                    <input
                      type="number"
                      min="0"
                      max={availablePoints}
                      value={pointsToRedeem}
                      onChange={(e) => {
                        const value = Math.max(0, Math.min(availablePoints, parseInt(e.target.value) || 0));
                        setPointsToRedeem(value);
                      }}
                      className="flex-1 px-3 py-2 border border-border rounded-lg text-sm"
                      placeholder="Points to redeem"
                    />
                    {pointsToRedeem > 0 && discount > 0 && (
                      <span className="text-xs text-green-600 font-semibold">
                        -${discount.toFixed(2)}
                      </span>
                    )}
                  </div>
                </div>
              )}

              <div className="flex justify-between items-center mb-6">
                <span className="text-lg font-bold">
                  {depositAmount > 0 ? "Total (Due at Salon)" : "Total"}
                </span>
                <span className="text-2xl font-bold text-primary">
                  ${depositAmount > 0 ? (totalAmount - depositAmount).toFixed(2) : totalAmount.toFixed(2)}
                </span>
              </div>
              {depositAmount > 0 && (
                <div className="mb-6 p-3 bg-orange-50 border border-orange-200 rounded-lg">
                  <p className="text-sm text-orange-800">
                    <strong>Deposit:</strong> ${depositAmount.toFixed(2)} will be charged now. 
                    Remaining ${(totalAmount - depositAmount).toFixed(2)} due at salon.
                  </p>
                </div>
              )}

              {/* Payment Method Selection */}
              <div className="mb-6 space-y-3">
                <label className="block text-sm font-semibold mb-2">Payment Method</label>
                <div className="space-y-2">
                  <label className="flex items-center gap-3 p-3 border-2 rounded-lg cursor-pointer hover:bg-muted/50 transition-colors">
                    <input
                      type="radio"
                      name="paymentMethod"
                      value="pay_in_full"
                      checked={paymentMethod === "pay_in_full"}
                      onChange={(e) => setPaymentMethod(e.target.value as "pay_in_full" | "pay_in_store")}
                      className="w-4 h-4 text-primary"
                    />
                    <div className="flex-1">
                      <div className="font-semibold">Pay in Full</div>
                      <div className="text-xs text-muted-foreground">Pay online now with Stripe</div>
                    </div>
                    <CreditCard className="w-5 h-5 text-primary" />
                  </label>
                  <label className="flex items-center gap-3 p-3 border-2 rounded-lg cursor-pointer hover:bg-muted/50 transition-colors">
                    <input
                      type="radio"
                      name="paymentMethod"
                      value="pay_in_store"
                      checked={paymentMethod === "pay_in_store"}
                      onChange={(e) => setPaymentMethod(e.target.value as "pay_in_full" | "pay_in_store")}
                      className="w-4 h-4 text-primary"
                    />
                    <div className="flex-1">
                      <div className="font-semibold">Pay in Store</div>
                      <div className="text-xs text-muted-foreground">Pay when you arrive at the salon</div>
                    </div>
                    <MapPin className="w-5 h-5 text-primary" />
                  </label>
                </div>
              </div>

              {/* Payment Button */}
              <button
                onClick={handleProceedToPayment}
                disabled={processing}
                className="w-full px-6 py-4 bg-primary text-white rounded-lg font-semibold text-lg hover:bg-primary/90 transition-colors disabled:opacity-50 flex items-center justify-center gap-2 mb-4"
              >
                <CreditCard className="w-5 h-5" />
                {processing 
                  ? "Processing..." 
                  : paymentMethod === "pay_in_store" 
                    ? (depositAmount > 0 ? `Pay $${depositAmount.toFixed(2)} Deposit` : "Confirm Appointment")
                    : "Proceed to Payment"}
              </button>

              <button
                onClick={() => router.back()}
                disabled={processing}
                className="w-full px-6 py-3 border-2 border-border rounded-lg font-semibold hover:bg-muted transition-colors disabled:opacity-50"
              >
                Go Back
              </button>

              {error && (
                <div className="mt-4 p-3 bg-red-50 border border-red-200 text-red-700 rounded-lg text-sm">
                  {error}
                </div>
              )}

              <div className="mt-6 pt-6 border-t border-border">
                <div className="flex items-center gap-2 text-xs text-muted-foreground">
                  <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 15v2m-6 4h12a2 2 0 002-2v-6a2 2 0 00-2-2H6a2 2 0 00-2 2v6a2 2 0 002 2zm10-10V7a4 4 0 00-8 0v4h8z" />
                  </svg>
                  <span>Payments secured by Stripe</span>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

const CheckoutPage = () => {
  return (
    <Suspense fallback={
      <div className="min-h-screen bg-muted flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-16 w-16 border-b-4 border-primary mx-auto"></div>
          <p className="mt-4 text-muted-foreground font-semibold">Loading...</p>
        </div>
      </div>
    }>
      <CheckoutPageContent />
    </Suspense>
  );
};

export default CheckoutPage;
