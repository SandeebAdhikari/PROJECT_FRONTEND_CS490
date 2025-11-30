"use client";

import React from "react";
import Image from "next/image";
import { useRouter } from "next/navigation";
import { useCart } from "@/hooks/useCart";
import {
  ShoppingCart,
  Trash2,
  Plus,
  Minus,
  Calendar,
  Clock,
  User,
  Scissors,
  Package,
  CreditCard,
} from "lucide-react";

const CartPage = () => {
  const router = useRouter();
  const cart = useCart();

  const services = cart.getServices();
  const products = cart.getProducts();
  const serviceTotal = cart.getServiceTotal();
  const productTotal = cart.getProductTotal();

  const handleCheckoutServices = () => {
    if (services.length === 0) return;

    // For now, checkout the first service
    // In the future, you might want to create a batch checkout for multiple services
    const firstService = services[0];
    router.push(
      `/customer/checkout?appointmentId=${firstService.appointment_id}`
    );
  };

  const handleCheckoutProducts = () => {
    if (products.length === 0) return;
    router.push(`/customer/checkout/products`);
  };

  if (services.length === 0 && products.length === 0) {
    return (
      <div className="min-h-screen bg-muted p-4 sm:p-8">
        <div className="max-w-4xl mx-auto">
          <div className="bg-card border border-border rounded-2xl p-8 sm:p-12 text-center">
            <div className="w-20 h-20 bg-muted rounded-full flex items-center justify-center mx-auto mb-4">
              <ShoppingCart className="w-10 h-10 text-muted-foreground" />
            </div>
            <h2 className="text-2xl font-bold mb-2">Your Cart is Empty</h2>
            <p className="text-muted-foreground mb-6">
              Add some services or products to get started!
            </p>
            <div className="flex gap-4 justify-center">
              <button
                onClick={() => router.push("/customer")}
                className="px-6 py-3 bg-primary text-white rounded-lg hover:bg-primary/90 font-semibold transition-colors"
              >
                Browse Salons
              </button>
              <button
                onClick={() => router.push("/customer")}
                className="px-6 py-3 border-2 border-border rounded-lg font-semibold hover:bg-muted transition-colors"
              >
                Shop Products
              </button>
            </div>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-muted p-4 sm:p-8">
      <div className="max-w-6xl mx-auto">
        <div className="mb-6">
          <h1 className="text-3xl font-bold">Shopping Cart</h1>
          <p className="text-muted-foreground mt-2">
            Review your items and checkout
          </p>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          {/* Cart Items */}
          <div className="lg:col-span-2 space-y-6">
            {/* Services Section */}
            {services.length > 0 && (
              <div className="bg-card border border-border rounded-2xl p-6 shadow-soft-br">
                <div className="flex items-center justify-between mb-4">
                  <h2 className="text-xl font-bold">
                    Services ({services.length})
                  </h2>
                  <button
                    onClick={() =>
                      services.forEach((s) =>
                        cart.removeItem(s.appointment_id, "service")
                      )
                    }
                    className="text-sm text-red-600 hover:text-red-700 font-semibold"
                  >
                    Clear All
                  </button>
                </div>

                <div className="space-y-4">
                  {services.map((service) => {
                    const appointmentDate = new Date(service.scheduled_time);
                    return (
                      <div
                        key={service.appointment_id}
                        className="border border-border rounded-lg p-4 hover:bg-muted/50 transition"
                      >
                        <div className="flex justify-between items-start">
                          <div className="flex-1">
                            <h3 className="font-semibold text-lg">
                              {service.salon_name}
                            </h3>

                            <div className="mt-3 space-y-2">
                              <div className="flex items-center gap-2 text-sm">
                                <Scissors className="w-4 h-4 text-primary" />
                                <span>{service.service_name}</span>
                              </div>
                              <div className="flex items-center gap-2 text-sm">
                                <User className="w-4 h-4 text-primary" />
                                <span>{service.staff_name}</span>
                              </div>
                              <div className="flex items-center gap-2 text-sm">
                                <Calendar className="w-4 h-4 text-primary" />
                                <span>
                                  {appointmentDate.toLocaleDateString("en-US", {
                                    month: "short",
                                    day: "numeric",
                                    year: "numeric",
                                  })}
                                </span>
                              </div>
                              <div className="flex items-center gap-2 text-sm">
                                <Clock className="w-4 h-4 text-primary" />
                                <span>
                                  {appointmentDate.toLocaleTimeString("en-US", {
                                    hour: "2-digit",
                                    minute: "2-digit",
                                  })}
                                </span>
                              </div>
                            </div>

                            {service.notes && (
                              <p className="mt-2 text-sm text-muted-foreground italic">
                                Note: {service.notes}
                              </p>
                            )}
                          </div>

                          <div className="text-right ml-4">
                            <p className="text-xl font-bold text-primary">
                              ${service.price.toFixed(2)}
                            </p>
                            <button
                              onClick={() =>
                                cart.removeItem(
                                  service.appointment_id,
                                  "service"
                                )
                              }
                              className="mt-2 p-2 text-red-600 hover:bg-red-50 rounded-lg transition"
                              aria-label="Remove service from cart"
                            >
                              <Trash2 className="w-4 h-4" />
                            </button>
                          </div>
                        </div>
                      </div>
                    );
                  })}
                </div>
              </div>
            )}

            {/* Products Section */}
            {products.length > 0 && (
              <div className="bg-card border border-border rounded-2xl p-6 shadow-soft-br">
                <div className="flex items-center justify-between mb-4">
                  <h2 className="text-xl font-bold">
                    Products ({products.length})
                  </h2>
                  <button
                    onClick={() =>
                      products.forEach((p) =>
                        cart.removeItem(p.product_id, "product")
                      )
                    }
                    className="text-sm text-red-600 hover:text-red-700 font-semibold"
                  >
                    Clear All
                  </button>
                </div>

                <div className="space-y-4">
                  {products.map((product) => (
                    <div
                      key={product.product_id}
                      className="border border-border rounded-lg p-4 hover:bg-muted/50 transition"
                    >
                      <div className="flex gap-4">
                        {product.image_url ? (
                          <Image
                            src={product.image_url}
                            alt={product.name}
                            width={80}
                            height={80}
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
                            <p className="text-sm text-muted-foreground mt-1">
                              {product.description}
                            </p>
                          )}
                          {product.salon_name && (
                            <p className="text-sm text-muted-foreground mt-1">
                              From: {product.salon_name}
                            </p>
                          )}

                          <div className="flex items-center gap-2 mt-3">
                            <button
                              onClick={() =>
                                cart.updateProductQuantity(
                                  product.product_id,
                                  product.quantity - 1
                                )
                              }
                              className="p-1 border border-border rounded hover:bg-muted transition"
                              aria-label="Decrease quantity"
                            >
                              <Minus className="w-4 h-4" />
                            </button>
                            <span className="font-semibold w-8 text-center">
                              {product.quantity}
                            </span>
                            <button
                              onClick={() =>
                                cart.updateProductQuantity(
                                  product.product_id,
                                  product.quantity + 1
                                )
                              }
                              className="p-1 border border-border rounded hover:bg-muted transition"
                              aria-label="Increase quantity"
                            >
                              <Plus className="w-4 h-4" />
                            </button>
                          </div>
                        </div>

                        <div className="text-right">
                          <p className="text-lg font-bold text-primary">
                            ${(product.price * product.quantity).toFixed(2)}
                          </p>
                          <button
                            onClick={() =>
                              cart.removeItem(product.product_id, "product")
                            }
                            className="mt-2 p-2 text-red-600 hover:bg-red-50 rounded-lg transition"
                            aria-label="Remove product from cart"
                          >
                            <Trash2 className="w-4 h-4" />
                          </button>
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            )}
          </div>

          {/* Summary Sidebar */}
          <div className="lg:col-span-1">
            <div className="bg-card border border-border rounded-2xl p-6 shadow-soft-br sticky top-8 space-y-6">
              <h2 className="text-xl font-bold">Order Summary</h2>

              {services.length > 0 && (
                <div className="space-y-3 pb-4 border-b border-border">
                  <h3 className="font-semibold">Services</h3>
                  <div className="flex justify-between">
                    <span className="text-muted-foreground">
                      {services.length} service(s)
                    </span>
                    <span className="font-semibold">
                      ${serviceTotal.toFixed(2)}
                    </span>
                  </div>
                  <button
                    onClick={handleCheckoutServices}
                    className="w-full px-6 py-3 bg-primary text-white rounded-lg font-semibold hover:bg-primary/90 transition-colors flex items-center justify-center gap-2"
                  >
                    <CreditCard className="w-5 h-5" />
                    Checkout Services
                  </button>
                </div>
              )}

              {products.length > 0 && (
                <div className="space-y-3">
                  <h3 className="font-semibold">Products</h3>
                  <div className="flex justify-between">
                    <span className="text-muted-foreground">
                      {products.reduce((sum, p) => sum + p.quantity, 0)} item(s)
                    </span>
                    <span className="font-semibold">
                      ${productTotal.toFixed(2)}
                    </span>
                  </div>
                  <button
                    onClick={handleCheckoutProducts}
                    className="w-full px-6 py-3 bg-primary text-white rounded-lg font-semibold hover:bg-primary/90 transition-colors flex items-center justify-center gap-2"
                  >
                    <CreditCard className="w-5 h-5" />
                    Checkout Products
                  </button>
                </div>
              )}

              <div className="pt-4 border-t border-border">
                <div className="flex justify-between text-lg font-bold">
                  <span>Total</span>
                  <span className="text-primary">
                    ${cart.getTotalPrice().toFixed(2)}
                  </span>
                </div>
                <p className="text-xs text-muted-foreground mt-2">
                  * Checkout services and products separately
                </p>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default CartPage;
