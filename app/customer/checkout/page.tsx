/* eslint-disable react-hooks/exhaustive-deps, react/no-unescaped-entities */
"use client";

import React, { useState, useEffect, Suspense } from "react";
import { useRouter, useSearchParams } from "next/navigation";
import { Calendar, Clock, User, Scissors, MapPin, CreditCard, Gift, Tag, Package } from "lucide-react";
import { API_ENDPOINTS, fetchConfig } from "@/libs/api/config";
import { getMyPoints, calculateDiscount } from "@/libs/api/loyalty";
import { validatePromoCode } from "@/libs/api/promoCodes";
import { getUnifiedCart } from "@/libs/api/shop";

export const dynamic = 'force-dynamic';

interface ServiceItem {
  service_id: number;
  custom_name: string;
  price: number;
  appointment_id?: number;
  staff_name?: string;
  scheduled_time?: string;
}

interface ProductItem {
  product_id: number;
  name: string;
  price: number;
  quantity: number;
}

interface AppointmentDetails {
  appointment_id: number;
  salon_id: number;
  salon_name: string;
  staff_id: number;
  staff_name: string;
  service_id: number;
  service_name: string;
  services?: ServiceItem[];
  products?: ProductItem[];
  scheduled_time: string;
  status: string;
  price: number;
  notes?: string;
}

const CheckoutPageContent = () => {
  const router = useRouter();
  const searchParams = useSearchParams();
  const appointmentId = searchParams.get("appointmentId");
  const salonIdParam = searchParams.get("salonId");

  const [appointment, setAppointment] = useState<AppointmentDetails | null>(null);
  const [cartItems, setCartItems] = useState<{services: ServiceItem[], products: ProductItem[]}>({services: [], products: []});
  const [cartId, setCartId] = useState<number | null>(null);
  const [loading, setLoading] = useState(true);
  const [processing, setProcessing] = useState(false);
  const [error, setError] = useState("");
  const [paymentMethod, setPaymentMethod] = useState<"pay_in_full" | "pay_in_store">("pay_in_full");
  const [availablePoints, setAvailablePoints] = useState(0);
  const [pointsToRedeem, setPointsToRedeem] = useState(0);
  const [discount, setDiscount] = useState(0);
  const [_loadingPoints, setLoadingPoints] = useState(false);
  const [depositPercentage, setDepositPercentage] = useState(0);
  const [promoCode, setPromoCode] = useState("");
  const [promoDiscount, setPromoDiscount] = useState(0);
  const [promoError, setPromoError] = useState("");
  const [promoApplied, setPromoApplied] = useState(false);
  const [salonName, setSalonName] = useState("");

  // Determine if this is a cart checkout or single appointment checkout
  const isCartCheckout = !!salonIdParam && !appointmentId;
  const effectiveSalonId = appointment?.salon_id || (salonIdParam ? parseInt(salonIdParam) : null);

  useEffect(() => {
    if (appointmentId) {
      fetchAppointmentDetails();
    } else if (salonIdParam) {
      fetchCartItems();
    }
  }, [appointmentId, salonIdParam]);

  const fetchCartItems = async () => {
    try {
      setLoading(true);
      
      if (!salonIdParam) {
        throw new Error("Salon ID is required");
      }
      
      // Fetch unified cart (same as cart page)
      const result = await getUnifiedCart(parseInt(salonIdParam));
      
      if (result.error) {
        throw new Error(result.error);
      }

      const cart = result.cart;
      if (!cart) {
        throw new Error("Cart not found");
      }
      
      console.log("[Checkout] Cart data:", cart);
      
      setCartId(cart.cart_id);
      
      // Parse cart items into services and products
      const services: ServiceItem[] = [];
      const products: ProductItem[] = [];
      
      // Parse items by type
      if (cart.items && cart.items.length > 0) {
        for (const item of cart.items) {
          console.log("[Checkout] Processing item:", item);
          
          if (item.type === 'service') {
            services.push({
              service_id: item.service_id || item.item_id,
              custom_name: item.item_name || 'Service',
              price: parseFloat(String(item.price)) || 0,
              appointment_id: item.appointment_id,
              staff_name: item.staff_name,
              scheduled_time: item.scheduled_time,
            });
          } else if (item.type === 'product') {
            // item.price should be the UNIT price, not total
            let unitPrice = parseFloat(String(item.price)) || 0;
            let quantity = parseInt(String(item.quantity)) || 1;
            
            // Safeguard: If quantity seems unreasonably high (> 100), something went wrong
            if (quantity > 100) {
              console.warn("[Checkout] Detected abnormally high quantity:", quantity, "Resetting to 1");
              quantity = 1;
            }
            
            // Safeguard: If price seems unreasonably high for a unit price (> $500), might be a total price
            if (unitPrice > 500) {
              console.warn("[Checkout] Price seems too high for unit price:", unitPrice, "Dividing by quantity");
              unitPrice = unitPrice / quantity;
            }
            
            console.log("[Checkout] Product:", {
              name: item.item_name,
              unitPrice,
              quantity,
              totalForThisProduct: unitPrice * quantity
            });
            
            products.push({
              product_id: item.product_id || item.item_id,
              name: item.item_name || 'Product',
              price: unitPrice,
              quantity: quantity,
            });
          }
        }
      }
      
      console.log("[Checkout] Parsed services:", services);
      console.log("[Checkout] Parsed products:", products);
      
      setCartItems({ services, products });

      // Fetch salon name
      if (salonIdParam) {
        try {
          const salonResponse = await fetch(API_ENDPOINTS.SALONS.GET_PUBLIC(salonIdParam));
          if (salonResponse.ok) {
            const salonData = await salonResponse.json();
            setSalonName(salonData.salon?.name || salonData.name || 'Salon');
          }
        } catch (e) {
          console.error("Failed to fetch salon name:", e);
        }
      }
    } catch (err) {
      setError(err instanceof Error ? err.message : "Failed to load cart");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    if (effectiveSalonId) {
      fetchLoyaltyPoints();
      fetchSalonDepositSettings();
    }
  }, [effectiveSalonId]);

  const fetchSalonDepositSettings = async () => {
    if (!effectiveSalonId) return;
    try {
      const token = localStorage.getItem("token") || localStorage.getItem("authToken");
      const response = await fetch(`${API_ENDPOINTS.SALONS.GET_PUBLIC(effectiveSalonId)}`, {
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
    if (!effectiveSalonId) return;
    setLoadingPoints(true);
    try {
      const result = await getMyPoints(effectiveSalonId);
      if (result.data) {
        setAvailablePoints(result.data.points);
      }
    } catch (err) {
      console.error("Failed to fetch loyalty points:", err);
    } finally {
      setLoadingPoints(false);
    }
  };

  const applyPromoCode = async () => {
    if (!effectiveSalonId || !promoCode.trim()) return;
    setPromoError("");
    const subtotal = getSubtotal() - discount;
    const result = await validatePromoCode(promoCode, effectiveSalonId, subtotal);
    if (result.valid && result.discount) {
      setPromoDiscount(result.discount);
      setPromoApplied(true);
    } else {
      setPromoError(result.error || "Invalid code");
      setPromoDiscount(0);
      setPromoApplied(false);
    }
  };

  // Calculate subtotal based on whether this is a cart or single appointment checkout
  const getSubtotal = () => {
    if (isCartCheckout) {
      const servicesTotal = cartItems.services.reduce((sum, s) => sum + s.price, 0);
      const productsTotal = cartItems.products.reduce((sum, p) => sum + (p.price * p.quantity), 0);
      return servicesTotal + productsTotal;
    }
    return appointment?.price || 0;
  };

  const calculateDiscountAmount = async () => {
    if (!effectiveSalonId || pointsToRedeem <= 0) {
      setDiscount(0);
      return;
    }
    try {
      const result = await calculateDiscount(effectiveSalonId, pointsToRedeem);
      if (result.discount !== undefined) {
        setDiscount(result.discount);
      }
    } catch (err) {
      console.error("Failed to calculate discount:", err);
      setDiscount(0);
    }
  };

  const handleProceedToPayment = async () => {
    if (!isCartCheckout && !appointment) {
      setError("Appointment not found");
      return;
    }

    if (isCartCheckout && cartItems.services.length === 0 && cartItems.products.length === 0) {
      setError("Cart is empty");
      return;
    }

    setProcessing(true);
    setError("");

    try {
      const token = localStorage.getItem("token") || localStorage.getItem("authToken");

      if (!token) {
        throw new Error("Please login to continue");
      }

      // Calculate total amount (subtotal + tax - discounts)
      const subtotal = getSubtotal();
      const taxAmount = subtotal * 0.08;
      let totalAmount = subtotal + taxAmount;
      totalAmount = Math.max(0, totalAmount - discount - promoDiscount); // Apply discounts

      if (isCartCheckout) {
        // Handle cart checkout (unified checkout)
        if (!cartId) {
          throw new Error("Cart not found");
        }

        const response = await fetch(API_ENDPOINTS.PAYMENTS.UNIFIED_CHECKOUT, {
          ...fetchConfig,
          method: "POST",
          headers: {
            ...fetchConfig.headers,
            Authorization: `Bearer ${token}`,
          },
          body: JSON.stringify({
            salon_id: effectiveSalonId,
            cart_id: cartId,
            points_to_redeem: pointsToRedeem,
            promo_code: promoApplied ? promoCode : undefined,
            promo_discount: promoApplied ? promoDiscount : 0,
          }),
        });

        if (!response.ok) {
          const errorData = await response.json();
          throw new Error(errorData.error || "Failed to create checkout");
        }

        const data = await response.json();
        
        if (data.payment_link) {
          // Clear cart before redirect
          localStorage.removeItem("cart");
          window.location.href = data.payment_link;
        } else {
          throw new Error("No payment link received");
        }
      } else if (paymentMethod === "pay_in_store") {
        // Handle pay in store option for single appointment
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
            salon_id: appointment!.salon_id,
            promo_code: promoApplied ? promoCode : undefined,
            promo_discount: promoApplied ? promoDiscount : 0,
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
        // Handle pay in full (Stripe checkout) for single appointment
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
            salon_id: appointment!.salon_id,
            promo_code: promoApplied ? promoCode : undefined,
            promo_discount: promoApplied ? promoDiscount : 0,
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

  if (error && !appointment && !isCartCheckout) {
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

  if (!appointment && !isCartCheckout) return null;

  const appointmentDate = appointment ? new Date(appointment.scheduled_time) : null;
  const subtotalAmount = getSubtotal();
  const taxAmount = subtotalAmount * 0.08; // 8% tax
  const subtotalWithTax = subtotalAmount + taxAmount;
  const totalAmount = Math.max(0, subtotalWithTax - discount - promoDiscount);
  
  // Calculate deposit amount if pay in store and deposit percentage is set
  const depositAmount = paymentMethod === "pay_in_store" && depositPercentage > 0
    ? (totalAmount * depositPercentage) / 100
    : 0;
    
  const displaySalonName = salonName || appointment?.salon_name || "Salon";

  return (
    <div className="min-h-screen bg-muted p-4 sm:p-8">
      <div className="max-w-4xl mx-auto">
        <div className="mb-6">
          <h1 className="text-3xl font-bold">Review & Pay</h1>
          <p className="text-muted-foreground mt-2">
            {isCartCheckout ? "Review your cart and proceed to payment" : "Review your appointment and proceed to payment"}
          </p>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          {/* Order Summary */}
          <div className="lg:col-span-2">
            <div className="bg-card border border-border rounded-2xl p-6 sm:p-8 shadow-soft-br">
              <h2 className="text-2xl font-bold mb-6">{isCartCheckout ? "Order Summary" : "Appointment Summary"}</h2>

              {/* Salon Name */}
              <div className="space-y-5">
                <div className="flex items-start gap-4 pb-4 border-b border-border">
                  <div className="w-12 h-12 bg-primary/10 rounded-full flex items-center justify-center flex-shrink-0">
                    <MapPin className="w-6 h-6 text-primary" />
                  </div>
                  <div className="flex-1">
                    <p className="text-sm text-muted-foreground">Salon</p>
                    <p className="text-xl font-semibold">{displaySalonName}</p>
                  </div>
                </div>

                {/* Services Section - Cart Checkout */}
                {isCartCheckout && cartItems.services.length > 0 && (
                  <>
                    {cartItems.services.map((service, idx) => {
                      const serviceDate = service.scheduled_time ? new Date(service.scheduled_time) : null;
                      return (
                        <div key={idx} className="pb-4 border-b border-border">
                          <div className="flex items-start gap-4 mb-3">
                            <div className="w-12 h-12 bg-primary/10 rounded-full flex items-center justify-center flex-shrink-0">
                              <Scissors className="w-6 h-6 text-primary" />
                            </div>
                            <div className="flex-1">
                              <p className="text-sm text-muted-foreground">Service</p>
                              <div className="flex justify-between items-center">
                                <p className="text-lg font-semibold">{service.custom_name}</p>
                                <p className="text-muted-foreground">${service.price.toFixed(2)}</p>
                              </div>
                            </div>
                          </div>
                          {/* Show appointment details if available */}
                          {(service.staff_name || serviceDate) && (
                            <div className="ml-16 space-y-2">
                              {service.staff_name && (
                                <div className="flex items-center gap-2 text-sm">
                                  <User className="w-4 h-4 text-muted-foreground" />
                                  <span className="text-muted-foreground">with {service.staff_name}</span>
                                </div>
                              )}
                              {serviceDate && (
                                <div className="flex items-center gap-3 text-sm">
                                  <div className="flex items-center gap-1">
                                    <Calendar className="w-4 h-4 text-muted-foreground" />
                                    <span className="text-muted-foreground">
                                      {serviceDate.toLocaleDateString("en-US", {
                                        month: "short",
                                        day: "numeric",
                                      })}
                                    </span>
                                  </div>
                                  <div className="flex items-center gap-1">
                                    <Clock className="w-4 h-4 text-muted-foreground" />
                                    <span className="text-muted-foreground">
                                      {serviceDate.toLocaleTimeString("en-US", {
                                        hour: "numeric",
                                        minute: "2-digit",
                                      })}
                                    </span>
                                  </div>
                                </div>
                              )}
                            </div>
                          )}
                        </div>
                      );
                    })}
                  </>
                )}

                {/* Services Section - Single Appointment */}
                {!isCartCheckout && appointment && (
                  <div className="flex items-start gap-4 pb-4 border-b border-border">
                    <div className="w-12 h-12 bg-primary/10 rounded-full flex items-center justify-center flex-shrink-0">
                      <Scissors className="w-6 h-6 text-primary" />
                    </div>
                    <div className="flex-1">
                      <p className="text-sm text-muted-foreground">Service{(appointment.services?.length || 0) > 1 ? 's' : ''}</p>
                      {appointment.services && appointment.services.length > 0 ? (
                        <div className="space-y-1">
                          {appointment.services.map((service, idx) => (
                            <p key={idx} className="text-lg font-semibold">{service.custom_name}</p>
                          ))}
                        </div>
                      ) : appointment.service_name ? (
                        <p className="text-xl font-semibold">{appointment.service_name}</p>
                      ) : (
                        <p className="text-lg text-muted-foreground italic">No service selected</p>
                      )}
                    </div>
                  </div>
                )}

                {/* Products Section - Cart Checkout */}
                {isCartCheckout && cartItems.products.length > 0 && (
                  <div className="flex items-start gap-4 pb-4 border-b border-border">
                    <div className="w-12 h-12 bg-orange-100 rounded-full flex items-center justify-center flex-shrink-0">
                      <Package className="w-6 h-6 text-orange-600" />
                    </div>
                    <div className="flex-1">
                      <p className="text-sm text-muted-foreground">Product{cartItems.products.length > 1 ? 's' : ''}</p>
                      <div className="space-y-2">
                        {cartItems.products.map((product, idx) => (
                          <div key={idx} className="flex justify-between items-center">
                            <p className="text-lg font-semibold">
                              {product.name}
                              {product.quantity > 1 && <span className="text-sm text-muted-foreground ml-2">x{product.quantity}</span>}
                            </p>
                            <p className="text-muted-foreground">${(product.price * product.quantity).toFixed(2)}</p>
                          </div>
                        ))}
                      </div>
                    </div>
                  </div>
                )}

                {/* Products Section - Single Appointment */}
                {!isCartCheckout && appointment?.products && appointment.products.length > 0 && (
                  <div className="flex items-start gap-4 pb-4 border-b border-border">
                    <div className="w-12 h-12 bg-orange-100 rounded-full flex items-center justify-center flex-shrink-0">
                      <Package className="w-6 h-6 text-orange-600" />
                    </div>
                    <div className="flex-1">
                      <p className="text-sm text-muted-foreground">Product{appointment.products.length > 1 ? 's' : ''}</p>
                      <div className="space-y-1">
                        {appointment.products.map((product, idx) => (
                          <div key={idx} className="flex justify-between items-center">
                            <p className="text-lg font-semibold">
                              {product.name}
                              {product.quantity > 1 && <span className="text-sm text-muted-foreground ml-2">x{product.quantity}</span>}
                            </p>
                            <p className="text-sm text-muted-foreground">${(product.price * product.quantity).toFixed(2)}</p>
                          </div>
                        ))}
                      </div>
                    </div>
                  </div>
                )}

                {/* Stylist - Only for single appointment */}
                {!isCartCheckout && appointment && (
                  <div className="flex items-start gap-4 pb-4 border-b border-border">
                    <div className="w-12 h-12 bg-primary/10 rounded-full flex items-center justify-center flex-shrink-0">
                      <User className="w-6 h-6 text-primary" />
                    </div>
                    <div className="flex-1">
                      <p className="text-sm text-muted-foreground">Stylist</p>
                      <p className="text-xl font-semibold">{appointment.staff_name}</p>
                    </div>
                  </div>
                )}

                {/* Date/Time - Only for single appointment */}
                {!isCartCheckout && appointmentDate && (
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
                )}

                {!isCartCheckout && appointment?.notes && (
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
                  <CreditCard className="w-5 h-5 text-blue-600 flex-shrink-0 mt-0.5" />
                  <div className="flex-1">
                    <p className="font-semibold text-blue-900 mb-1">Secure Payment with Stripe</p>
                    <p className="text-sm text-blue-700">
                      After clicking "Proceed to Payment", you'll be redirected to Stripe's secure checkout to complete your payment.
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
                {/* Cart Checkout - Services */}
                {isCartCheckout && cartItems.services.map((service, idx) => (
                  <div key={`cart-svc-${idx}`} className="flex justify-between">
                    <span className="text-muted-foreground">{service.custom_name}</span>
                    <span className="font-semibold">${Number(service.price).toFixed(2)}</span>
                  </div>
                ))}
                
                {/* Cart Checkout - Products */}
                {isCartCheckout && cartItems.products.map((product, idx) => (
                  <div key={`cart-prod-${idx}`} className="flex justify-between">
                    <span className="text-muted-foreground">
                      {product.name}
                      {product.quantity > 1 && ` x${product.quantity}`}
                    </span>
                    <span className="font-semibold">${(product.price * product.quantity).toFixed(2)}</span>
                  </div>
                ))}
                
                {/* Single Appointment - Services */}
                {!isCartCheckout && appointment && (
                  <>
                    {appointment.services && appointment.services.length > 0 ? (
                      appointment.services.map((service, idx) => (
                        <div key={idx} className="flex justify-between">
                          <span className="text-muted-foreground">{service.custom_name}</span>
                          <span className="font-semibold">${Number(service.price).toFixed(2)}</span>
                        </div>
                      ))
                    ) : (
                      <div className="flex justify-between">
                        <span className="text-muted-foreground">{appointment.service_name || 'Service'}</span>
                        <span className="font-semibold">${appointment.price.toFixed(2)}</span>
                      </div>
                    )}
                  </>
                )}
                
                {/* Single Appointment - Products */}
                {!isCartCheckout && appointment?.products && appointment.products.length > 0 && (
                  <>
                    {appointment.products.map((product, idx) => (
                      <div key={idx} className="flex justify-between">
                        <span className="text-muted-foreground">
                          {product.name}
                          {product.quantity > 1 && ` x${product.quantity}`}
                        </span>
                        <span className="font-semibold">${(product.price * product.quantity).toFixed(2)}</span>
                      </div>
                    ))}
                  </>
                )}
                
                <div className="flex justify-between">
                  <span className="text-muted-foreground">Tax (8%)</span>
                  <span className="font-semibold">${taxAmount.toFixed(2)}</span>
                </div>
                {discount > 0 && (
                  <div className="flex justify-between">
                    <span className="text-muted-foreground">Loyalty Discount</span>
                    <span className="font-semibold text-green-600">-${discount.toFixed(2)}</span>
                  </div>
                )}
                {promoDiscount > 0 && (
                  <div className="flex justify-between">
                    <span className="text-muted-foreground">Promo Discount</span>
                    <span className="font-semibold text-green-600">-${promoDiscount.toFixed(2)}</span>
                  </div>
                )}
                {depositAmount > 0 && (
                  <div className="flex justify-between text-orange-600">
                    <span className="text-muted-foreground">Deposit Required ({depositPercentage.toFixed(0)}%)</span>
                    <span className="font-semibold">${depositAmount.toFixed(2)}</span>
                  </div>
                )}
              </div>

              {/* Discounts Section */}
              <div className="space-y-3 mb-4">
                {/* Loyalty Points */}
                {availablePoints > 0 && (
                  <div className="p-4 bg-gradient-to-r from-purple-50 to-pink-50 rounded-xl border border-purple-100 overflow-hidden">
                    <div className="flex items-center gap-2 mb-2">
                      <Gift className="w-4 h-4 text-purple-600 flex-shrink-0" />
                      <span className="text-sm font-semibold text-purple-900">Redeem Loyalty Points</span>
                    </div>
                    <p className="text-xs text-purple-700 mb-3">
                      You have <span className="font-bold">{availablePoints}</span> points available
                    </p>
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
                        className="flex-1 min-w-0 px-3 py-2 border border-purple-200 rounded-lg text-sm bg-white focus:ring-2 focus:ring-purple-300 focus:border-purple-300"
                        placeholder="Enter points"
                      />
                      {pointsToRedeem > 0 && discount > 0 && (
                        <span className="flex-shrink-0 px-3 py-2 bg-green-100 text-green-700 text-sm font-semibold rounded-lg">
                          -${discount.toFixed(2)}
                        </span>
                      )}
                    </div>
                  </div>
                )}

                {/* Promo Code */}
                <div className="p-4 bg-gradient-to-r from-blue-50 to-cyan-50 rounded-xl border border-blue-100 overflow-hidden">
                  <div className="flex items-center gap-2 mb-2">
                    <Tag className="w-4 h-4 text-blue-600 flex-shrink-0" />
                    <span className="text-sm font-semibold text-blue-900">Promo Code</span>
                  </div>
                  <div className="flex items-center gap-2">
                    <input
                      type="text"
                      value={promoCode}
                      onChange={(e) => { setPromoCode(e.target.value.toUpperCase()); setPromoApplied(false); setPromoError(""); }}
                      placeholder="ENTER CODE"
                      disabled={promoApplied}
                      className="flex-1 min-w-0 px-3 py-2 border border-blue-200 rounded-lg text-sm font-mono uppercase bg-white disabled:bg-blue-50 focus:ring-2 focus:ring-blue-300 focus:border-blue-300"
                    />
                    {promoApplied ? (
                      <button
                        onClick={() => { setPromoCode(""); setPromoDiscount(0); setPromoApplied(false); }}
                        className="flex-shrink-0 px-3 py-2 text-sm font-medium text-red-600 bg-red-50 hover:bg-red-100 rounded-lg border border-red-200 transition-colors"
                      >
                        Remove
                      </button>
                    ) : (
                      <button
                        onClick={applyPromoCode}
                        disabled={!promoCode.trim()}
                        className="flex-shrink-0 px-3 py-2 bg-blue-600 text-white text-sm font-medium rounded-lg hover:bg-blue-700 disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
                      >
                        Apply
                      </button>
                    )}
                  </div>
                  {promoError && <p className="text-xs text-red-500 mt-2">{promoError}</p>}
                  {promoApplied && promoDiscount > 0 && (
                    <p className="text-xs text-green-600 font-semibold mt-2">✓ ${promoDiscount.toFixed(2)} saved!</p>
                  )}
                </div>
              </div>

              <div className="flex justify-between items-center py-4 border-t border-border">
                <span className="text-lg font-bold text-foreground">
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
