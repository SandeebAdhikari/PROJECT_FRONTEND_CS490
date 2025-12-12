/* eslint-disable react/no-unescaped-entities, @next/next/no-img-element */
"use client";

import React, { useState } from "react";
import { useRouter } from "next/navigation";
import { Package, CreditCard, Mail } from "lucide-react";
import { useCart } from "@/hooks/useCart";
import { API_ENDPOINTS, fetchConfig } from "@/libs/api/config";

const ProductCheckoutPage = () => {
  const router = useRouter();
  const cart = useCart();
  const [processing, setProcessing] = useState(false);
  const [error, setError] = useState("");

  const products = cart.getProducts();
  const productTotal = cart.getProductTotal();
  const taxAmount = productTotal * 0.08; // 8% tax
  const totalAmount = productTotal + taxAmount;

  const handleProceedToPayment = async () => {
    if (products.length === 0) {
      setError("No products in cart");
      return;
    }

    setProcessing(true);
    setError("");

    try {
      const token = localStorage.getItem("token") || localStorage.getItem("authToken");

      if (!token) {
        throw new Error("Please login to continue");
      }

      // Call backend to create checkout session for products
      const response = await fetch(API_ENDPOINTS.PAYMENTS.CHECKOUT, {
        ...fetchConfig,
        method: "POST",
        headers: {
          ...fetchConfig.headers,
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify({
          amount: totalAmount,
          type: "products",
          items: products.map(p => ({
            product_id: p.product_id,
            name: p.name,
            quantity: p.quantity,
            price: p.price,
          })),
        }),
      });

      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.error || "Failed to create checkout session");
      }

      const data = await response.json();

      // Clear products from cart after successful checkout initiation
      products.forEach(p => cart.removeItem(p.product_id, "product"));

      // Redirect to Stripe payment page
      window.location.href = data.payment_link;
    } catch (err) {
      setError(err instanceof Error ? err.message : "Payment failed. Please try again.");
      setProcessing(false);
    }
  };

  if (products.length === 0) {
    return (
      <div className="min-h-screen bg-muted flex items-center justify-center p-4">
        <div className="max-w-md w-full bg-card border border-border rounded-2xl p-8 text-center">
          <div className="w-16 h-16 bg-muted rounded-full flex items-center justify-center mx-auto mb-4">
            <Package className="w-8 h-8 text-muted-foreground" />
          </div>
          <h2 className="text-2xl font-bold mb-2">No Products to Checkout</h2>
          <p className="text-muted-foreground mb-6">Add some products to your cart first</p>
          <button
            onClick={() => router.push("/customer/cart")}
            className="px-6 py-3 bg-primary text-white rounded-lg hover:bg-primary/90 font-semibold transition-colors"
          >
            Go to Cart
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-muted p-4 sm:p-8">
      <div className="max-w-4xl mx-auto">
        <div className="mb-6">
          <h1 className="text-3xl font-bold">Checkout Products</h1>
          <p className="text-muted-foreground mt-2">Review your products and proceed to payment</p>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          {/* Product List */}
          <div className="lg:col-span-2">
            <div className="bg-card border border-border rounded-2xl p-6 sm:p-8 shadow-soft-br">
              <h2 className="text-2xl font-bold mb-6">Products</h2>

              <div className="space-y-4">
                {products.map((product) => (
                  <div
                    key={product.product_id}
                    className="flex gap-4 pb-4 border-b border-border last:border-0"
                  >
                    {product.image_url ? (
                      <img
                        src={product.image_url}
                        alt={product.name}
                        className="w-20 h-20 object-cover rounded-lg"
                      />
                    ) : (
                      <div className="w-20 h-20 bg-muted rounded-lg flex items-center justify-center">
                        <Package className="w-8 h-8 text-muted-foreground" />
                      </div>
                    )}

                    <div className="flex-1">
                      <h3 className="font-semibold">{product.name}</h3>
                      {product.description && (
                        <p className="text-sm text-muted-foreground mt-1">{product.description}</p>
                      )}
                      <p className="text-sm text-muted-foreground mt-1">
                        ${product.price.toFixed(2)} × {product.quantity}
                      </p>
                    </div>

                    <div className="text-right">
                      <p className="text-lg font-bold text-primary">
                        ${(product.price * product.quantity).toFixed(2)}
                      </p>
                    </div>
                  </div>
                ))}
              </div>
            </div>

            {/* Payment Info */}
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
          </div>

          {/* Price Summary */}
          <div className="lg:col-span-1">
            <div className="bg-card border border-border rounded-2xl p-6 shadow-soft-br sticky top-8">
              <h2 className="text-xl font-bold mb-4">Order Summary</h2>

              <div className="space-y-3 mb-6 pb-4 border-b border-border">
                <div className="flex justify-between">
                  <span className="text-muted-foreground">Subtotal</span>
                  <span className="font-semibold">${productTotal.toFixed(2)}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-muted-foreground">Tax (8%)</span>
                  <span className="font-semibold">${taxAmount.toFixed(2)}</span>
                </div>
              </div>

              <div className="flex justify-between items-center mb-6">
                <span className="text-lg font-bold">Total</span>
                <span className="text-2xl font-bold text-primary">${totalAmount.toFixed(2)}</span>
              </div>

              <button
                onClick={handleProceedToPayment}
                disabled={processing}
                className="w-full px-6 py-4 bg-primary text-white rounded-lg font-semibold text-lg hover:bg-primary/90 transition-colors disabled:opacity-50 flex items-center justify-center gap-2 mb-4"
              >
                <CreditCard className="w-5 h-5" />
                {processing ? "Processing..." : "Proceed to Payment"}
              </button>

              <button
                onClick={() => router.push("/customer/cart")}
                disabled={processing}
                className="w-full px-6 py-3 border-2 border-border rounded-lg font-semibold hover:bg-muted transition-colors disabled:opacity-50"
              >
                Back to Cart
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

export default ProductCheckoutPage;
