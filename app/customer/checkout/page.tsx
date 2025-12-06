"use client";
export const dynamic = "force-dynamic";
export const fetchCache = "force-no-store";

import React, { Suspense, useState, useEffect, useCallback } from "react";
import { useRouter, useSearchParams } from "next/navigation";
import {
  Calendar,
  Clock,
  User,
  Scissors,
  MapPin,
  Mail,
  CreditCard,
  Package,
  Gift,
} from "lucide-react";
import { API_ENDPOINTS, fetchConfig } from "@/libs/api/config";
import { useCart } from "@/hooks/useCart";
import { getMyPoints } from "@/libs/api/loyalty";
import type { LoyaltyPointsDetail } from "@/libs/api/loyalty";

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
  const cart = useCart();

  const [appointment, setAppointment] = useState<AppointmentDetails | null>(
    null
  );
  const [loading, setLoading] = useState(true);
  const [processing, setProcessing] = useState(false);
  const [error, setError] = useState("");
  const [loyaltyPoints, setLoyaltyPoints] = useState<LoyaltyPointsDetail | null>(null);
  const [pointsToRedeem, setPointsToRedeem] = useState(0);

  // Get products from cart
  const cartProducts = cart.getProducts();

  const fetchAppointmentDetails = useCallback(async () => {
    try {
      setLoading(true);
      const token =
        localStorage.getItem("token") || localStorage.getItem("authToken");

      const response = await fetch(
        `${API_ENDPOINTS.APPOINTMENTS.BOOK}/${appointmentId}`,
        {
          ...fetchConfig,
          headers: {
            ...fetchConfig.headers,
            ...(token ? { Authorization: `Bearer ${token}` } : {}),
          },
        }
      );

      if (!response.ok) {
        throw new Error("Failed to fetch appointment details");
      }

      const data = await response.json();
      setAppointment(data);
    } catch (err) {
      setError(
        err instanceof Error ? err.message : "Failed to load appointment"
      );
    } finally {
      setLoading(false);
    }
  }, [appointmentId]);

  useEffect(() => {
    if (appointmentId) {
      fetchAppointmentDetails();
    }
  }, [appointmentId, fetchAppointmentDetails]);

  // Fetch loyalty points when appointment is loaded
  useEffect(() => {
    const fetchLoyaltyPoints = async () => {
      if (!appointment?.salon_id) return;

      const result = await getMyPoints(appointment.salon_id);
      if (result.points) {
        setLoyaltyPoints(result.points);
      }
    };

    fetchLoyaltyPoints();
  }, [appointment]);

  const handleProceedToPayment = async () => {
    setProcessing(true);
    setError("");

    try {
      const token =
        localStorage.getItem("token") || localStorage.getItem("authToken");

      if (!token) {
        throw new Error("Please login to continue");
      }

      if (!appointment) {
        throw new Error("Appointment details not found");
      }

      // Calculate total amount (appointment price + products + loyalty discount + tax)
      const serviceTotal = appointment.price;
      const productTotal = cartProducts.reduce(
        (total, product) => total + product.price * product.quantity,
        0
      );
      const subtotal = serviceTotal + productTotal;

      // Calculate loyalty discount
      const loyaltyDiscount = loyaltyPoints && pointsToRedeem > 0
        ? Math.min(pointsToRedeem * loyaltyPoints.redeem_rate, subtotal)
        : 0;

      const afterDiscount = subtotal - loyaltyDiscount;
      const taxAmount = afterDiscount * 0.08;
      const totalAmount = afterDiscount + taxAmount;

      // Call backend to create checkout session and send email
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
          products: cartProducts.map((p) => ({
            product_id: p.product_id,
            quantity: p.quantity,
            price: p.price,
          })),
          points_to_redeem: pointsToRedeem,
          salon_id: appointment.salon_id,
        }),
      });

      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.error || "Failed to create checkout session");
      }

      const data = await response.json();

      // Clear products from cart after successful checkout initiation
      cartProducts.forEach((p) => cart.removeItem(p.product_id, "product"));

      // Redirect to Stripe payment page
      window.location.href = data.payment_link;
    } catch (err) {
      setError(
        err instanceof Error ? err.message : "Payment failed. Please try again."
      );
      setProcessing(false);
    }
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-muted flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-16 w-16 border-b-4 border-primary mx-auto"></div>
          <p className="mt-4 text-muted-foreground font-semibold">
            Loading checkout...
          </p>
        </div>
      </div>
    );
  }

  if (error && !appointment) {
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
  const serviceTotal = appointment.price;
  const productTotal = cartProducts.reduce(
    (total, product) => total + product.price * product.quantity,
    0
  );
  const subtotal = serviceTotal + productTotal;

  // Calculate loyalty discount
  const loyaltyDiscount = loyaltyPoints && pointsToRedeem > 0
    ? Math.min(pointsToRedeem * loyaltyPoints.redeem_rate, subtotal)
    : 0;

  const afterDiscount = subtotal - loyaltyDiscount;
  const taxAmount = afterDiscount * 0.08; // 8% tax
  const totalAmount = afterDiscount + taxAmount;

  return (
    <div className="min-h-screen bg-muted p-4 sm:p-8">
      <div className="max-w-4xl mx-auto">
        <div className="mb-6">
          <h1 className="text-3xl font-bold">Review & Pay</h1>
          <p className="text-muted-foreground mt-2">
            Review your appointment and proceed to payment
          </p>
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
                    <p className="text-xl font-semibold">
                      {appointment.salon_name}
                    </p>
                  </div>
                </div>

                <div className="flex items-start gap-4 pb-4 border-b border-border">
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

                <div className="flex items-start gap-4 pb-4 border-b border-border">
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

                {appointment.notes && (
                  <div className="mt-4 p-4 bg-muted rounded-lg">
                    <p className="text-sm font-semibold mb-1">Notes:</p>
                    <p className="text-sm text-muted-foreground">
                      {appointment.notes}
                    </p>
                  </div>
                )}

                {/* Products Section */}
                {cartProducts.length > 0 && (
                  <div className="mt-6 pt-6 border-t border-border">
                    <h3 className="text-lg font-semibold mb-4">Products</h3>
                    <div className="space-y-3">
                      {cartProducts.map((product) => (
                        <div
                          key={product.product_id}
                          className="flex items-center justify-between p-3 bg-muted rounded-lg"
                        >
                          <div className="flex items-center gap-3 flex-1">
                            <div className="w-10 h-10 bg-primary/10 rounded-full flex items-center justify-center flex-shrink-0">
                              <Package className="w-5 h-5 text-primary" />
                            </div>
                            <div className="flex-1">
                              <p className="font-semibold">{product.name}</p>
                              <p className="text-sm text-muted-foreground">
                                Quantity: {product.quantity}
                              </p>
                            </div>
                          </div>
                          <div className="text-right">
                            <p className="font-semibold">
                              ${(product.price * product.quantity).toFixed(2)}
                            </p>
                          </div>
                        </div>
                      ))}
                    </div>
                  </div>
                )}
              </div>
            </div>

            {/* Payment Info */}
            <div className="mt-6 bg-blue-50 border border-blue-200 rounded-xl p-6">
              <div className="flex items-start gap-3">
                <Mail className="w-5 h-5 text-blue-600 flex-shrink-0 mt-0.5" />
                <div className="flex-1">
                  <p className="font-semibold text-blue-900 mb-1">
                    Payment Link Will Be Sent to Your Email
                  </p>
                  <p className="text-sm text-blue-700">
                    After clicking &ldquo;Proceed to Payment&rdquo;, we&apos;ll
                    send you a secure payment link via email. You&apos;ll then
                    be redirected to complete your payment through Stripe&apos;s
                    secure checkout.
                  </p>
                </div>
              </div>
            </div>
          </div>

          {/* Price Summary & Payment */}
          <div className="lg:col-span-1">
            <div className="bg-card border border-border rounded-2xl p-6 shadow-soft-br sticky top-8">
              <h2 className="text-xl font-bold mb-4">Price Summary</h2>

              {/* Loyalty Points Section */}
              {loyaltyPoints && loyaltyPoints.points > 0 && (
                <div className="mb-6 pb-6 border-b border-border">
                  <div className="bg-gradient-to-r from-purple-500 to-pink-500 rounded-xl p-4 text-white mb-3">
                    <div className="flex items-center justify-between mb-2">
                      <div className="flex items-center gap-2">
                        <Gift className="w-5 h-5" />
                        <span className="font-semibold">Loyalty Points</span>
                      </div>
                      <span className="text-2xl font-bold">{loyaltyPoints.points}</span>
                    </div>
                    {loyaltyPoints.can_redeem && (
                      <p className="text-xs opacity-90">
                        Worth up to ${loyaltyPoints.estimated_discount}
                      </p>
                    )}
                  </div>

                  {loyaltyPoints.can_redeem ? (
                    <div>
                      <label className="block text-sm font-semibold mb-2">
                        Redeem Points
                      </label>
                      <div className="flex items-center gap-2 mb-2">
                        <input
                          type="number"
                          min="0"
                          max={Math.min(loyaltyPoints.points, Math.ceil(subtotal / loyaltyPoints.redeem_rate))}
                          value={pointsToRedeem}
                          onChange={(e) => {
                            const value = parseInt(e.target.value) || 0;
                            const maxPoints = Math.min(
                              loyaltyPoints.points,
                              Math.ceil(subtotal / loyaltyPoints.redeem_rate)
                            );
                            setPointsToRedeem(Math.min(value, maxPoints));
                          }}
                          className="flex-1 px-3 py-2 border border-border rounded-lg focus:outline-none focus:ring-2 focus:ring-primary"
                        />
                        <button
                          onClick={() => {
                            const maxPoints = Math.min(
                              loyaltyPoints.points,
                              Math.ceil(subtotal / loyaltyPoints.redeem_rate)
                            );
                            setPointsToRedeem(maxPoints);
                          }}
                          className="px-4 py-2 bg-primary text-white rounded-lg font-semibold text-sm hover:bg-primary/90"
                        >
                          Max
                        </button>
                      </div>
                      <p className="text-xs text-muted-foreground">
                        Each point = ${loyaltyPoints.redeem_rate.toFixed(2)} discount
                      </p>
                    </div>
                  ) : (
                    <p className="text-sm text-muted-foreground">
                      Need {loyaltyPoints.min_points_redeem} points to redeem
                    </p>
                  )}
                </div>
              )}

              {/* Price Breakdown */}
              <div className="space-y-3 mb-6 pb-4 border-b border-border">
                <div className="flex justify-between">
                  <span className="text-muted-foreground">Service Price</span>
                  <span className="font-semibold">
                    ${serviceTotal.toFixed(2)}
                  </span>
                </div>
                {cartProducts.length > 0 && (
                  <div className="flex justify-between">
                    <span className="text-muted-foreground">Products</span>
                    <span className="font-semibold">
                      ${productTotal.toFixed(2)}
                    </span>
                  </div>
                )}
                <div className="flex justify-between pt-2 border-t border-border">
                  <span className="text-muted-foreground">Subtotal</span>
                  <span className="font-semibold">
                    ${subtotal.toFixed(2)}
                  </span>
                </div>
                {loyaltyDiscount > 0 && (
                  <div className="flex justify-between text-green-600">
                    <span className="flex items-center gap-1">
                      <Gift className="w-4 h-4" />
                      Loyalty Discount ({pointsToRedeem} pts)
                    </span>
                    <span className="font-semibold">
                      -${loyaltyDiscount.toFixed(2)}
                    </span>
                  </div>
                )}
                <div className="flex justify-between">
                  <span className="text-muted-foreground">Tax (8%)</span>
                  <span className="font-semibold">${taxAmount.toFixed(2)}</span>
                </div>
              </div>

              <div className="flex justify-between items-center mb-6">
                <span className="text-lg font-bold">Total</span>
                <span className="text-2xl font-bold text-primary">
                  ${totalAmount.toFixed(2)}
                </span>
              </div>

              {/* Payment Button */}
              <button
                onClick={handleProceedToPayment}
                disabled={processing}
                className="w-full px-6 py-4 bg-primary text-white rounded-lg font-semibold text-lg hover:bg-primary/90 transition-colors disabled:opacity-50 flex items-center justify-center gap-2 mb-4"
              >
                <CreditCard className="w-5 h-5" />
                {processing ? "Processing..." : "Proceed to Payment"}
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
                  <svg
                    className="w-4 h-4"
                    fill="none"
                    viewBox="0 0 24 24"
                    stroke="currentColor"
                  >
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      strokeWidth={2}
                      d="M12 15v2m-6 4h12a2 2 0 002-2v-6a2 2 0 00-2-2H6a2 2 0 00-2 2v6a2 2 0 002 2zm10-10V7a4 4 0 00-8 0v4h8z"
                    />
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

const CheckoutPage = () => (
  <Suspense
    fallback={
      <div className="min-h-screen bg-muted flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-16 w-16 border-b-4 border-primary mx-auto"></div>
          <p className="mt-4 text-muted-foreground font-semibold">
            Loading checkout...
          </p>
        </div>
      </div>
    }
  >
    <CheckoutPageContent />
  </Suspense>
);

export default CheckoutPage;
