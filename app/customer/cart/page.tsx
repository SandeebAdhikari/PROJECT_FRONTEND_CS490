"use client";

import React, { useState, useEffect } from "react";
import Image from "next/image";
import { useRouter } from "next/navigation";
import { useCart } from "@/hooks/useCart";
import { API_ENDPOINTS, fetchConfig } from "@/libs/api/config";
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

interface ProductSuggestion {
  product_id: number;
  name: string;
  category: string;
  description?: string;
  price: number;
  stock: number;
}

const CartPage = () => {
  const router = useRouter();
  const cart = useCart();
  const [suggestions, setSuggestions] = useState<ProductSuggestion[]>([]);
  const [loadingSuggestions, setLoadingSuggestions] = useState(false);

  const services = cart.getServices();
  const products = cart.getProducts();
  const serviceTotal = cart.getServiceTotal();
  const productTotal = cart.getProductTotal();

  // Get salon_id from cart items
  const salonId = services[0]?.salon_id || products[0]?.salon_id;

  useEffect(() => {
    const fetchSuggestions = async () => {
      if (!salonId) return;
      
      setLoadingSuggestions(true);
      try {
        const token = localStorage.getItem("token");
        const response = await fetch(
          `${API_ENDPOINTS.SHOP.CART}?salon_id=${salonId}`,
          {
            ...fetchConfig,
            headers: {
              ...fetchConfig.headers,
              Authorization: token ? `Bearer ${token}` : "",
            },
          }
        );

        if (response.ok) {
          const data = await response.json();
          const normalizedSuggestions = (data.suggestions || []).map((p: ProductSuggestion) => ({
            ...p,
            price: typeof p.price === "string" ? parseFloat(p.price) || 0 : p.price || 0,
            stock: typeof p.stock === "string" ? parseInt(p.stock) || 0 : p.stock || 0,
          }));
          setSuggestions(normalizedSuggestions);
        }
      } catch (error) {
        console.error("Error fetching suggestions:", error);
      } finally {
        setLoadingSuggestions(false);
      }
    };

    if (salonId && (services.length > 0 || products.length > 0)) {
      fetchSuggestions();
    }
  }, [salonId, services.length, products.length]);

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
                              ${Number(service.price).toFixed(2)}
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
                          {product.stock !== undefined && product.stock > 0 && (
                            <p className="text-xs text-muted-foreground mt-1">
                              {product.stock - product.quantity > 0
                                ? `${product.stock - product.quantity} remaining in stock`
                                : "All available stock in cart"}
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
                              {product.stock !== undefined && (
                                <span className="text-xs text-muted-foreground block">
                                  / {product.stock}
                                </span>
                              )}
                            </span>
                            <button
                              onClick={() =>
                                cart.updateProductQuantity(
                                  product.product_id,
                                  product.quantity + 1
                                )
                              }
                              disabled={product.quantity >= (product.stock || Infinity)}
                              className={[
                                "p-1 border border-border rounded transition",
                                product.quantity >= (product.stock || Infinity)
                                  ? "opacity-50 cursor-not-allowed"
                                  : "hover:bg-muted"
                              ].join(" ")}
                              aria-label="Increase quantity"
                              title={
                                product.quantity >= (product.stock || Infinity)
                                  ? "Stock limit reached"
                                  : "Increase quantity"
                              }
                            >
                              <Plus className="w-4 h-4" />
                            </button>
                          </div>
                          {product.stock !== undefined && product.quantity >= product.stock && (
                            <p className="text-xs text-orange-600 mt-1">
                              Maximum stock reached
                            </p>
                          )}
                        </div>

                        <div className="text-right">
                          <p className="text-lg font-bold text-primary">
                            ${(Number(product.price) * product.quantity).toFixed(2)}
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

            {/* Product Suggestions */}
            {suggestions.length > 0 && (
              <div className="bg-card border border-border rounded-2xl p-6 shadow-soft-br">
                <h2 className="text-xl font-bold mb-4">
                  You might also like
                </h2>
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  {suggestions.map((product) => (
                    <div
                      key={product.product_id}
                      className="border border-border rounded-lg p-4 hover:bg-muted/50 transition"
                    >
                      <div className="flex items-start gap-3">
                        <div className="w-16 h-16 bg-muted rounded-lg flex items-center justify-center flex-shrink-0">
                          <Package className="w-8 h-8 text-muted-foreground" />
                        </div>
                        <div className="flex-1 min-w-0">
                          <h3 className="font-semibold text-sm truncate">
                            {product.name}
                          </h3>
                          <p className="text-xs text-muted-foreground mt-1">
                            {product.category}
                          </p>
                          <p className="text-lg font-bold text-primary mt-2">
                            ${Number(product.price).toFixed(2)}
                          </p>
                          <button
                            onClick={() => {
                              const stock = Number(product.stock);
                              if (stock <= 0) {
                                alert("This product is out of stock");
                                return;
                              }
                              
                              cart.addProduct({
                                product_id: product.product_id,
                                name: product.name,
                                description: product.description || "",
                                price: Number(product.price),
                                quantity: 1,
                                salon_id: salonId,
                                stock: stock,
                              });
                              // Refresh suggestions after adding
                              setSuggestions(
                                suggestions.filter(
                                  (p) => p.product_id !== product.product_id
                                )
                              );
                            }}
                            disabled={Number(product.stock) <= 0}
                            className={[
                              "mt-2 w-full px-3 py-1.5 rounded-lg transition text-sm font-medium",
                              Number(product.stock) > 0
                                ? "bg-primary text-primary-foreground hover:bg-primary/90"
                                : "bg-muted text-muted-foreground cursor-not-allowed opacity-50"
                            ].join(" ")}
                          >
                            <Plus className="w-3 h-3 inline mr-1" />
                            {Number(product.stock) > 0 ? "Add to Cart" : "Out of Stock"}
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

              <div className="space-y-3">
                {services.length > 0 && (
                  <div className="flex justify-between text-sm">
                    <span className="text-muted-foreground">
                      Services ({services.length})
                    </span>
                    <span className="font-semibold">
                      ${serviceTotal.toFixed(2)}
                    </span>
                  </div>
                )}

                {products.length > 0 && (
                  <div className="flex justify-between text-sm">
                    <span className="text-muted-foreground">
                      Products ({products.reduce((sum, p) => sum + p.quantity, 0)} items)
                    </span>
                    <span className="font-semibold">
                      ${productTotal.toFixed(2)}
                    </span>
                  </div>
                )}
              </div>

              <div className="pt-4 border-t border-border">
                <div className="flex justify-between text-lg font-bold mb-4">
                  <span>Total</span>
                  <span className="text-primary">
                    ${cart.getTotalPrice().toFixed(2)}
                  </span>
                </div>
                
                {(services.length > 0 || products.length > 0) && (
                  <button
                    onClick={() => {
                      if (services.length > 0) {
                        handleCheckoutServices();
                      } else if (products.length > 0) {
                        handleCheckoutProducts();
                      }
                    }}
                    className="w-full px-6 py-3 bg-primary text-white rounded-lg font-semibold hover:bg-primary/90 transition-colors flex items-center justify-center gap-2"
                  >
                    <CreditCard className="w-5 h-5" />
                    Checkout
                  </button>
                )}
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default CartPage;
