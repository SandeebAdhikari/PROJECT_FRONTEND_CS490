/* eslint-disable @typescript-eslint/no-explicit-any, @typescript-eslint/no-unused-vars, react-hooks/exhaustive-deps */
"use client";

import React, {
  useState,
  useEffect,
  useRef,
  useMemo,
  useCallback,
} from "react";
import { useRouter } from "next/navigation";
import Image from "next/image";
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
  Loader2,
  MapPin,
  Gift,
} from "lucide-react";
import { API_ENDPOINTS } from "@/libs/api/config";
import {
  addAppointmentToCart,
  addToCart,
  getUnifiedCart,
  removeFromCart,
} from "@/libs/api/shop";
import { createUnifiedCheckout } from "@/libs/api/payments";
import { getMyPoints, calculateDiscount } from "@/libs/api/loyalty";

// Helper function to safely parse appointment ID from notes
const parseAppointmentId = (notes: string | undefined | null): number => {
  if (!notes) return 0;
  const match = notes.match(/Appointment #(\d+)/);
  if (!match || !match[1]) return 0;
  const id = parseInt(match[1], 10);
  return isNaN(id) ? 0 : id;
};

const CartPage = () => {
  const router = useRouter();
  const cart = useCart();
  const [syncing, setSyncing] = useState(false);
  const [checkoutProcessing, setCheckoutProcessing] = useState(false);
  const [error, setError] = useState("");
  const [suggestions, setSuggestions] = useState<any[]>([]);
  const [loadingSuggestions, setLoadingSuggestions] = useState(false);
  const [duplicatesCleaned, setDuplicatesCleaned] = useState(false);
  const [paymentMethod, setPaymentMethod] = useState<
    "pay_in_full" | "pay_in_store"
  >("pay_in_full");
  const [depositPercentage, setDepositPercentage] = useState(0);
  const [availablePoints, setAvailablePoints] = useState(0);
  const [pointsToRedeem, setPointsToRedeem] = useState(0);
  const [discount, setDiscount] = useState(0);
  const [loadingPoints, setLoadingPoints] = useState(false);
  const [minPointsRedeem, setMinPointsRedeem] = useState(100); // Default to 100
  const isLoadingBackendCart = useRef(false); // Prevent infinite loops
  const loadedSalonId = useRef<number | null>(null); // Track which salonId we've loaded
  const hasLoadedBackendCart = useRef(false); // Track if we've loaded once

  // Get services, deduplicate, and filter out invalid/past appointments
  // Use useMemo to ensure this runs synchronously before render
  const { services, pastAppointmentIds } = useMemo(() => {
    const allServices = cart.getServices();
    const seenAppointmentIds = new Set<number>();
    const now = new Date();
    const pastIds: number[] = [];

    const filteredServices = allServices.filter((service) => {
      // Skip duplicates
      if (seenAppointmentIds.has(service.appointment_id)) {
        return false;
      }

      // Validate scheduled_time - must be valid and in the future
      if (
        !service.scheduled_time ||
        service.scheduled_time.trim() === "" ||
        service.scheduled_time === "Invalid Date"
      ) {
        console.log(
          `[Cart] Filtering out service with invalid scheduled_time for appointment ${service.appointment_id}`
        );
        pastIds.push(service.appointment_id);
        return false;
      }

      const appointmentDate = new Date(service.scheduled_time);
      if (isNaN(appointmentDate.getTime())) {
        console.log(
          `[Cart] Filtering out service with unparseable scheduled_time for appointment ${service.appointment_id}`
        );
        pastIds.push(service.appointment_id);
        return false;
      }

      // Remove if appointment is in the past (including today if time has passed)
      // Add 1 minute buffer to account for any timing issues
      const oneMinuteAgo = new Date(now.getTime() - 60000);
      if (appointmentDate <= oneMinuteAgo) {
        const diffMs = now.getTime() - appointmentDate.getTime();
        const diffMinutes = Math.floor(diffMs / 60000);
        console.log(
          `[Cart] Filtering out past appointment ${
            service.appointment_id
          } - scheduled: ${
            service.scheduled_time
          }, now: ${now.toISOString()}, diff: ${diffMinutes} minutes ago`
        );
        pastIds.push(service.appointment_id);
        return false;
      }

      seenAppointmentIds.add(service.appointment_id);
      return true; // Keep first occurrence with valid future time
    });

    return { services: filteredServices, pastAppointmentIds: pastIds };
  }, [cart.items]); // Recompute when cart items change

  // Remove past appointments immediately using useEffect
  useEffect(() => {
    if (pastAppointmentIds.length > 0) {
      console.log(
        `[Cart] Removing ${pastAppointmentIds.length} past appointments immediately:`,
        pastAppointmentIds
      );
      pastAppointmentIds.forEach((appointmentId) => {
        cart.removeItem(appointmentId, "service");
      });
    }
  }, [pastAppointmentIds.join(",")]); // Trigger when past appointment IDs change

  const products = cart.getProducts();

  // Clean up invalid services (past appointments, invalid scheduled_time) and duplicates - runs when items change
  // Also runs on mount to clean up any past appointments from localStorage
  // This runs more aggressively to catch any past appointments
  useEffect(() => {
    if (isLoadingBackendCart.current) return; // Don't run during backend load

    const allServices = cart.getServices();
    if (allServices.length === 0) return;

    const invalidServices: number[] = [];
    const seenAppointmentIds = new Set<number>();
    const duplicates: number[] = [];
    const now = new Date();
    // Add 1 minute buffer to ensure we catch appointments that just passed
    const oneMinuteAgo = new Date(now.getTime() - 60000);

    // Find invalid services and duplicates
    allServices.forEach((service) => {
      // Check for duplicates
      if (seenAppointmentIds.has(service.appointment_id)) {
        if (!duplicates.includes(service.appointment_id)) {
          duplicates.push(service.appointment_id);
        }
      } else {
        seenAppointmentIds.add(service.appointment_id);
      }

      // Check if scheduled_time is invalid or past (including appointments that have already occurred)
      if (
        !service.scheduled_time ||
        service.scheduled_time.trim() === "" ||
        service.scheduled_time === "Invalid Date"
      ) {
        invalidServices.push(service.appointment_id);
        console.log(
          `[Cart] Removing service with invalid scheduled_time: ${service.appointment_id}`
        );
      } else {
        const appointmentDate = new Date(service.scheduled_time);
        if (isNaN(appointmentDate.getTime())) {
          invalidServices.push(service.appointment_id);
          console.log(
            `[Cart] Removing service with unparseable scheduled_time: ${service.appointment_id}`
          );
        } else if (appointmentDate <= oneMinuteAgo) {
          // Remove if appointment is in the past (including today if time has passed)
          // Use oneMinuteAgo to catch appointments that just passed
          invalidServices.push(service.appointment_id);
          const diffMs = now.getTime() - appointmentDate.getTime();
          const diffMinutes = Math.floor(diffMs / 60000);
          console.log(
            `[Cart] Removing past appointment ${
              service.appointment_id
            } - scheduled: ${
              service.scheduled_time
            }, now: ${now.toISOString()}, diff: ${diffMinutes} minutes ago`
          );
        }
      }
    });

    // Remove invalid/past services immediately (synchronously)
    if (invalidServices.length > 0) {
      console.log(
        `[Cart] Removing ${invalidServices.length} invalid/past services`
      );
      invalidServices.forEach((appointmentId) => {
        cart.removeItem(appointmentId, "service");
      });
    }

    // Remove duplicates
    if (duplicates.length > 0) {
      console.log(
        `[Cart] Auto-removing ${duplicates.length} duplicate appointment IDs:`,
        duplicates
      );
      cart.removeDuplicateServices();
    }
  }, [cart.items.length]); // Run when items change
  const serviceTotal = cart.getServiceTotal();
  const productTotal = cart.getProductTotal();
  const total = cart.getTotalPrice();

  // Get salon_id from cart items (assuming all items are from the same salon)
  // Also check URL params for salonId if cart is empty
  const [urlSalonId, setUrlSalonId] = useState<string | null>(null);

  useEffect(() => {
    if (typeof window !== "undefined") {
      const params = new URLSearchParams(window.location.search);
      const salonIdParam = params.get("salonId");
      if (salonIdParam) {
        setUrlSalonId(salonIdParam);
      }
    }
  }, []);

  // Hard clear all past/paid appointments - runs once on mount
  useEffect(() => {
    const hardClearPastAppointments = async () => {
      console.log("[Cart] Starting hard clear of past/paid appointments...");

      // 1. Clear localStorage of past appointments
      const savedCart = localStorage.getItem("cart");
      if (savedCart) {
        try {
          const loadedItems = JSON.parse(savedCart);
          const now = new Date();
          const validItems = loadedItems.filter((item: any) => {
            if (item.type === "service") {
              if (
                !item.scheduled_time ||
                item.scheduled_time === "Invalid Date"
              ) {
                return false;
              }
              const appointmentDate = new Date(item.scheduled_time);
              if (isNaN(appointmentDate.getTime()) || appointmentDate <= now) {
                return false;
              }
            }
            return true;
          });

          if (validItems.length !== loadedItems.length) {
            console.log(
              `[Cart] Hard clear: Removed ${
                loadedItems.length - validItems.length
              } past appointments from localStorage`
            );
            localStorage.setItem("cart", JSON.stringify(validItems));
            cart.clearCart();
            // Reload valid items
            validItems.forEach((item: any) => {
              if (item.type === "service") {
                cart.addService(item);
              } else if (item.type === "product") {
                cart.addProduct(item);
              }
            });
          }
        } catch (error) {
          console.error("[Cart] Error clearing localStorage:", error);
          localStorage.removeItem("cart");
          cart.clearCart();
        }
      }

      // 2. Clear backend cart of past/paid appointments - get salonId from URL or cart items
      const currentSalonId = urlSalonId
        ? parseInt(urlSalonId, 10)
        : cart.getServices()[0]?.salon_id ||
          cart.getProducts()[0]?.salon_id ||
          null;

      if (currentSalonId) {
        try {
          const token = localStorage.getItem("token");
          if (!token) return;

          const numericSalonId =
            typeof currentSalonId === "string"
              ? parseInt(currentSalonId, 10)
              : currentSalonId;

          // Fetch current cart
          const backendCart = await getUnifiedCart(numericSalonId);
          if (backendCart.cart && backendCart.cart.items) {
            const now = new Date();
            const itemsToRemove: number[] = [];

            for (const item of backendCart.cart.items) {
              if (item.type === "service") {
                const appointmentId = parseInt(
                  item.notes?.match(/Appointment #(\d+)/)?.[1] || "0"
                );
                if (appointmentId > 0) {
                  // Check if appointment is past
                  try {
                    const appointmentResponse = await fetch(
                      `${API_ENDPOINTS.APPOINTMENTS.GET_BY_ID(appointmentId)}`,
                      {
                        headers: { Authorization: `Bearer ${token}` },
                      }
                    );
                    if (appointmentResponse.ok) {
                      const appointment = await appointmentResponse.json();
                      const appointmentDate = new Date(
                        appointment.scheduled_time
                      );
                      if (
                        appointmentDate <= now ||
                        appointment.status === "completed" ||
                        appointment.status === "cancelled"
                      ) {
                        itemsToRemove.push(item.item_id);
                      }
                    }
                  } catch (err) {
                    // If we can't fetch appointment, assume it's invalid and remove it
                    itemsToRemove.push(item.item_id);
                  }
                }
              }
            }

            // Remove items from backend
            for (const itemId of itemsToRemove) {
              await removeFromCart(itemId);
            }

            if (itemsToRemove.length > 0) {
              console.log(
                `[Cart] Hard clear: Removed ${itemsToRemove.length} past/paid appointments from backend cart`
              );
            }
          }
        } catch (error) {
          console.error("[Cart] Error clearing backend cart:", error);
        }
      }

      console.log("[Cart] Hard clear completed");
    };

    // Run once on mount with a small delay to ensure cart is initialized
    const timer = setTimeout(() => {
      hardClearPastAppointments();
    }, 500);

    return () => clearTimeout(timer);
  }, []); // Empty dependency array - run only once on mount

  // Delete ALL appointments from cart - for fresh start
  const deleteAllAppointments = useCallback(
    async (salonId: number | null) => {
      if (!salonId) {
        console.log("[Cart] No salonId provided, cannot delete appointments");
        return;
      }
      console.log(
        "[Cart] Starting deletion of ALL appointments from database for salon",
        salonId
      );

      try {
        const token = localStorage.getItem("token");
        if (!token) {
          console.error("[Cart] No token found");
          return;
        }

        // 1. Delete all service items from database using new endpoint
        const response = await fetch(
          `${API_ENDPOINTS.SHOP.DELETE_ALL_SERVICE_ITEMS}?salon_id=${salonId}`,
          {
            method: "DELETE",
            headers: {
              Authorization: `Bearer ${token}`,
              "Content-Type": "application/json",
            },
          }
        );

        if (response.ok) {
          const result = await response.json();
          console.log(
            `[Cart] Deleted ${
              result.deleted_count || 0
            } service items from database`
          );
        } else {
          const error = await response.json();
          console.error("[Cart] Error deleting from database:", error);
        }

        // 3. Clear ALL services from local cart
        const allServices = cart.getServices();
        allServices.forEach((service) => {
          cart.removeItem(service.appointment_id, "service");
        });
        console.log(
          `[Cart] Deleted ${allServices.length} appointments from local cart`
        );

        // 4. Clear services from localStorage
        const savedCart = localStorage.getItem("cart");
        if (savedCart) {
          try {
            const loadedItems = JSON.parse(savedCart);
            const validItems = loadedItems.filter(
              (item: any) => item.type !== "service"
            );
            localStorage.setItem("cart", JSON.stringify(validItems));
            console.log(`[Cart] Deleted services from localStorage`);
          } catch (error) {
            console.error("[Cart] Error updating localStorage:", error);
            localStorage.removeItem("cart");
          }
        }

        console.log("[Cart] All appointments deleted - fresh start!");

        // Reload the page to refresh the cart
        window.location.reload();
      } catch (error) {
        console.error("[Cart] Error deleting appointments:", error);
      }
    },
    [cart]
  );

  // More aggressive hard clear that checks for paid appointments - runs when backend cart loads
  const hardClearPaidAppointments = useCallback(
    async (salonId: number) => {
      console.log(
        "[Cart] Starting aggressive hard clear of paid appointments for salon",
        salonId
      );

      try {
        const token = localStorage.getItem("token");
        if (!token) return;

        // 1. Get all payments for this salon
        const paymentsResponse = await fetch(
          `${API_ENDPOINTS.PAYMENTS.SALON_PAYMENTS(salonId)}`,
          {
            headers: { Authorization: `Bearer ${token}` },
          }
        );

        const paidAppointmentIds = new Set<number>();
        if (paymentsResponse.ok) {
          const paymentsData = await paymentsResponse.json();
          const payments = paymentsData.payments || [];
          payments.forEach((payment: any) => {
            if (
              payment.appointment_id &&
              payment.payment_status === "completed"
            ) {
              paidAppointmentIds.add(payment.appointment_id);
              console.log(
                `[Cart] Found paid appointment: ${payment.appointment_id}`
              );
            }
          });
        }

        // 2. Get backend cart
        const backendCart = await getUnifiedCart(salonId);
        if (!backendCart.cart || !backendCart.cart.items) return;

        // 3. Remove all items for paid appointments
        const itemsToRemove: number[] = [];
        for (const item of backendCart.cart.items) {
          if (item.type === "service") {
            const appointmentId = parseInt(
              item.notes?.match(/Appointment #(\d+)/)?.[1] || "0"
            );
            if (appointmentId > 0 && paidAppointmentIds.has(appointmentId)) {
              itemsToRemove.push(item.item_id);
              console.log(
                `[Cart] Marking paid appointment ${appointmentId} (item ${item.item_id}) for removal`
              );
            }
          }
        }

        // 4. Remove from backend
        for (const itemId of itemsToRemove) {
          await removeFromCart(itemId);
        }

        // 5. Remove from local cart
        paidAppointmentIds.forEach((appointmentId) => {
          cart.removeItem(appointmentId, "service");
        });

        // 6. Clear from localStorage
        const savedCart = localStorage.getItem("cart");
        if (savedCart) {
          try {
            const loadedItems = JSON.parse(savedCart);
            const validItems = loadedItems.filter((item: any) => {
              if (item.type === "service" && item.appointment_id) {
                return !paidAppointmentIds.has(item.appointment_id);
              }
              return true;
            });
            localStorage.setItem("cart", JSON.stringify(validItems));
          } catch (error) {
            console.error("[Cart] Error updating localStorage:", error);
          }
        }

        if (itemsToRemove.length > 0 || paidAppointmentIds.size > 0) {
          console.log(
            `[Cart] Aggressive clear: Removed ${itemsToRemove.length} paid appointments from backend, ${paidAppointmentIds.size} from local cart`
          );
        }
      } catch (error) {
        console.error("[Cart] Error in aggressive hard clear:", error);
      }
    },
    [cart]
  );

  const salonId =
    services[0]?.salon_id ||
    products[0]?.salon_id ||
    (urlSalonId ? parseInt(urlSalonId, 10) : null);

  // Clean up past appointments and verify they haven't been paid for - runs aggressively
  // This is a safety net to catch any past/paid appointments that might have been added
  useEffect(() => {
    if (isLoadingBackendCart.current) return; // Don't run during backend load

    const cleanupPastAppointments = async () => {
      const allServices = cart.getServices();
      if (allServices.length === 0) return;

      const now = new Date();
      const oneMinuteAgo = new Date(now.getTime() - 60000);
      const pastAppointments: number[] = [];
      const paidAppointments: number[] = [];

      // Check each service to see if it's past or has been paid for
      for (const service of allServices) {
        if (!service.scheduled_time) {
          pastAppointments.push(service.appointment_id);
          continue;
        }

        const appointmentDate = new Date(service.scheduled_time);
        if (
          isNaN(appointmentDate.getTime()) ||
          appointmentDate <= oneMinuteAgo
        ) {
          pastAppointments.push(service.appointment_id);
          const diffMs = now.getTime() - appointmentDate.getTime();
          const diffMinutes = Math.floor(diffMs / 60000);
          console.log(
            `[Cart] Cleanup: Removing past appointment ${
              service.appointment_id
            } - scheduled: ${
              service.scheduled_time
            }, now: ${now.toISOString()}, diff: ${diffMinutes} minutes ago`
          );
          continue;
        }

        // Check if appointment has been paid for by fetching appointment details
        try {
          const token = localStorage.getItem("token");
          if (token) {
            const response = await fetch(
              `${API_ENDPOINTS.APPOINTMENTS.GET_BY_ID(service.appointment_id)}`,
              {
                headers: {
                  Authorization: `Bearer ${token}`,
                },
              }
            );
            if (response.ok) {
              const appointment = await response.json();
              // Check if appointment has been paid (check payment_status from payments table)
              // Also check for invalid statuses
              if (
                appointment.payment_status === "completed" ||
                appointment.payment_id ||
                appointment.status === "completed" ||
                appointment.status === "cancelled" ||
                (appointment.status !== "confirmed" &&
                  appointment.status !== "pending")
              ) {
                paidAppointments.push(service.appointment_id);
                console.log(
                  `[Cart] Cleanup: Removing paid/completed appointment ${
                    service.appointment_id
                  } - status: ${appointment.status}, payment_status: ${
                    appointment.payment_status || "none"
                  }, payment_id: ${appointment.payment_id || "none"}`
                );
              }
            }
          }
        } catch (err) {
          // Silently fail - don't block cleanup if we can't check payment status
          console.error(
            `[Cart] Failed to check payment status for appointment ${service.appointment_id}:`,
            err
          );
        }
      }

      // Remove past and paid appointments
      const appointmentsToRemove = [
        ...new Set([...pastAppointments, ...paidAppointments]),
      ];
      if (appointmentsToRemove.length > 0) {
        console.log(
          `[Cart] Cleanup: Removing ${appointmentsToRemove.length} past/paid appointments (${pastAppointments.length} past, ${paidAppointments.length} paid)`
        );
        appointmentsToRemove.forEach((appointmentId) => {
          cart.removeItem(appointmentId, "service");
        });
      }
    };

    // Run cleanup immediately
    cleanupPastAppointments();
  }, [cart.items.length]); // Run whenever cart items count changes

  // Load backend cart into local state ONCE per salonId (prevent infinite loops)
  useEffect(() => {
    const loadBackendCart = async () => {
      const numericSalonId =
        typeof salonId === "string" ? parseInt(salonId, 10) : salonId;
      if (!numericSalonId || isLoadingBackendCart.current) {
        return;
      }

      // Check if we should force refresh (e.g., coming from booking page)
      const comingFromBooking =
        document.referrer.includes("/customer/booking-page") ||
        document.referrer.includes("/booking-page");
      const shouldForceRefresh =
        comingFromBooking && loadedSalonId.current === numericSalonId;

      // If already loaded for this salon and not forcing refresh, skip
      if (loadedSalonId.current === numericSalonId && !shouldForceRefresh) {
        return;
      }

      // If forcing refresh, reset the loaded state
      if (shouldForceRefresh) {
        loadedSalonId.current = null;
      }

      isLoadingBackendCart.current = true;
      loadedSalonId.current = numericSalonId;

      try {
        const token = localStorage.getItem("token");
        if (!token) {
          isLoadingBackendCart.current = false;
          return;
        }

        const backendCart = await getUnifiedCart(numericSalonId);
        if (backendCart.error) {
          console.error("Failed to fetch backend cart:", backendCart.error);
          isLoadingBackendCart.current = false;
          return;
        }

        // CRITICAL: Before loading anything, check for paid appointments and remove them from backend
        // This ensures that even if cart items weren't deleted, we remove them now
        if (backendCart.cart?.items && backendCart.cart.items.length > 0) {
          const token = localStorage.getItem("token");
          const serviceItems = backendCart.cart.items.filter(
            (item: any) => item.type === "service"
          );
          if (serviceItems.length > 0) {
            const appointmentIds = serviceItems
              .map((item: any) =>
                parseInt(item.notes?.match(/Appointment #(\d+)/)?.[1] || "0")
              )
              .filter((id) => id > 0);

            // Check which appointments have completed payments
            try {
              const paymentsResponse = await fetch(
                `${API_ENDPOINTS.PAYMENTS.SALON_PAYMENTS(numericSalonId)}`,
                {
                  headers: {
                    Authorization: `Bearer ${token}`,
                  },
                }
              );

              if (paymentsResponse.ok) {
                const paymentsData = await paymentsResponse.json();
                const payments = paymentsData.payments || [];
                const paidAppointmentIds = new Set<number>();

                payments.forEach((payment: any) => {
                  if (
                    payment.appointment_id &&
                    payment.payment_status === "completed"
                  ) {
                    paidAppointmentIds.add(payment.appointment_id);
                  }
                });

                // Remove cart items for paid appointments
                if (paidAppointmentIds.size > 0) {
                  console.log(
                    `[Cart] Found ${paidAppointmentIds.size} paid appointments - removing from backend cart`
                  );
                  for (const item of serviceItems) {
                    const appointmentId = parseInt(
                      item.notes?.match(/Appointment #(\d+)/)?.[1] || "0"
                    );
                    if (paidAppointmentIds.has(appointmentId)) {
                      try {
                        await removeFromCart(item.item_id);
                        console.log(
                          `[Cart] Removed paid appointment ${appointmentId} (item ${item.item_id}) from backend`
                        );
                      } catch (err) {
                        console.error(
                          `[Cart] Failed to remove item ${item.item_id}:`,
                          err
                        );
                      }
                    }
                  }
                  // Reload cart after removing paid appointments
                  const updatedCart = await getUnifiedCart(numericSalonId);
                  if (updatedCart.cart) {
                    backendCart.cart = updatedCart.cart;
                  }
                }
              }
            } catch (err) {
              console.error("[Cart] Error checking paid appointments:", err);
            }
          }
        }

        // If backend cart is empty, check if local cart has valid future appointments
        // If local cart has valid appointments, sync them to backend instead of clearing
        if (!backendCart.cart?.items || backendCart.cart.items.length === 0) {
          const localServices = cart.getServices();
          const now = new Date();
          const validLocalServices = localServices.filter((service) => {
            if (!service.scheduled_time) return false;
            const appointmentDate = new Date(service.scheduled_time);
            return !isNaN(appointmentDate.getTime()) && appointmentDate > now;
          });

          if (validLocalServices.length > 0) {
            console.log(
              `[Cart] Backend cart is empty but local cart has ${validLocalServices.length} valid appointments - syncing to backend`
            );
            // Sync local appointments to backend instead of clearing
            for (const service of validLocalServices) {
              try {
                await addAppointmentToCart(
                  service.appointment_id,
                  service.salon_id
                );
              } catch (err) {
                console.error(
                  `[Cart] Failed to sync appointment ${service.appointment_id} to backend:`,
                  err
                );
              }
            }
            // Reload backend cart after syncing
            const updatedCart = await getUnifiedCart(numericSalonId);
            if (
              updatedCart.cart &&
              updatedCart.cart.items &&
              updatedCart.cart.items.length > 0
            ) {
              // Update backendCart to use the updated cart
              backendCart.cart = updatedCart.cart;
              // Continue with normal loading flow below
            } else {
              console.log(`[Cart] After syncing, backend cart is still empty`);
              isLoadingBackendCart.current = false;
              return;
            }
          } else {
            console.log(
              `[Cart] Backend cart is empty and local cart has no valid appointments - clearing local cart`
            );
            cart.clearCart();
            localStorage.removeItem("cart");
            isLoadingBackendCart.current = false;
            return;
          }
        }

        // Load backend items into local cart
        const backendItems = backendCart.cart.items || [];
        const currentLocalItems = cart.items;

        // Only update if backend has different items (avoid infinite loops)
        // For services, use appointment_id; for products, use product_id
        const backendItemIds = new Set(
          backendItems.map((item: any) => {
            if (item.type === "service") {
              const appointmentId = parseInt(
                item.notes?.match(/Appointment #(\d+)/)?.[1] || "0"
              );
              return `service-${appointmentId}`;
            }
            return `product-${item.product_id}`;
          })
        );
        const localItemIds = new Set(
          currentLocalItems.map((item) =>
            item.type === "service"
              ? `service-${item.appointment_id}`
              : `product-${item.product_id}`
          )
        );

        // If items are different, clear and reload
        if (
          backendItems.length !== currentLocalItems.length ||
          ![...backendItemIds].every((id) => localItemIds.has(id))
        ) {
          // FIRST: Deduplicate backend items BEFORE clearing/adding
          const seenServiceIds = new Set<number>();
          const seenProductIds = new Set<number>();
          const deduplicatedBackendItems: typeof backendItems = [];

          console.log(
            `[Cart] Loading ${backendItems.length} items from backend for salon ${numericSalonId}`
          );

          // Deduplicate services by appointment_id and validate
          for (const item of backendItems) {
            if (item.type === "service") {
              const appointmentId = parseInt(
                item.notes?.match(/Appointment #(\d+)/)?.[1] || "0"
              );
              if (appointmentId > 0) {
                if (!seenServiceIds.has(appointmentId)) {
                  seenServiceIds.add(appointmentId);
                  // Only add if we can extract appointment info (backend should have filtered, but double-check)
                  deduplicatedBackendItems.push(item);
                } else {
                  console.log(
                    `[Cart] Skipping duplicate service for appointment ${appointmentId}`
                  );
                }
              } else {
                console.warn(
                  `[Cart] Invalid appointment ID for service item:`,
                  item
                );
              }
            } else if (item.type === "product") {
              // For products, we can have multiple, but let's still deduplicate by product_id
              const productId = item.product_id;
              if (productId && !seenProductIds.has(productId)) {
                seenProductIds.add(productId);
                deduplicatedBackendItems.push(item);
              }
            }
          }

          console.log(
            `[Cart] Deduplicated to ${deduplicatedBackendItems.length} items (${seenServiceIds.size} unique services, ${seenProductIds.size} unique products)`
          );

          // NOW clear and add deduplicated items
          cart.clearCart();

          // Fetch appointment details for services to get scheduled_time and validate
          const appointmentIds = deduplicatedBackendItems
            .filter((item) => item.type === "service")
            .map((item) =>
              parseInt(item.notes?.match(/Appointment #(\d+)/)?.[1] || "0")
            )
            .filter((id) => id > 0);

          // Fetch appointment details in batch
          const appointmentDetailsMap = new Map<number, any>();

          // First, check which appointments have been paid for by fetching salon payments
          const paidAppointmentIds = new Set<number>();
          console.log(
            `[Cart] Checking payments for ${appointmentIds.length} appointments, salonId: ${numericSalonId}`
          );
          if (appointmentIds.length > 0 && numericSalonId) {
            try {
              const token = localStorage.getItem("token");
              console.log(
                `[Cart] Fetching payments from: ${API_ENDPOINTS.PAYMENTS.SALON_PAYMENTS(
                  numericSalonId
                )}`
              );
              const paymentsResponse = await fetch(
                `${API_ENDPOINTS.PAYMENTS.SALON_PAYMENTS(numericSalonId)}`,
                {
                  headers: {
                    Authorization: `Bearer ${token}`,
                  },
                }
              );
              console.log(
                `[Cart] Payments response status: ${paymentsResponse.status}`
              );
              if (paymentsResponse.ok) {
                const paymentsData = await paymentsResponse.json();
                const payments = paymentsData.payments || [];
                console.log(`[Cart] Found ${payments.length} total payments`);
                // Log payment details for debugging
                payments.forEach((payment: any) => {
                  console.log(
                    `[Cart] Payment ${payment.payment_id}: appointment_id=${payment.appointment_id}, status=${payment.payment_status}, amount=${payment.amount}`
                  );
                });
                // Find all appointments that have completed payments
                payments.forEach((payment: any) => {
                  if (
                    payment.appointment_id &&
                    payment.payment_status === "completed"
                  ) {
                    paidAppointmentIds.add(payment.appointment_id);
                    console.log(
                      `[Cart] Payment ${payment.payment_id} is completed for appointment ${payment.appointment_id}`
                    );
                  }
                });
                console.log(`[Cart] Checking appointments:`, appointmentIds);
                console.log(
                  `[Cart] Paid appointment IDs found:`,
                  Array.from(paidAppointmentIds)
                );
                if (paidAppointmentIds.size > 0) {
                  console.log(
                    `[Cart] Found ${paidAppointmentIds.size} appointments with completed payments:`,
                    Array.from(paidAppointmentIds)
                  );
                } else {
                  console.log(
                    `[Cart] No completed payments found for any of the ${appointmentIds.length} appointments`
                  );
                }
              } else {
                const errorText = await paymentsResponse.text();
                console.error(
                  `[Cart] Payments API returned error ${paymentsResponse.status}:`,
                  errorText
                );
              }
            } catch (err) {
              console.error(
                "[Cart] Failed to fetch payments to check paid appointments:",
                err
              );
            }
          } else {
            console.log(
              `[Cart] Skipping payment check - appointmentIds.length: ${appointmentIds.length}, numericSalonId: ${numericSalonId}`
            );
          }

          if (appointmentIds.length > 0) {
            try {
              const token = localStorage.getItem("token");
              for (const appointmentId of appointmentIds) {
                // Skip if appointment has been paid for
                if (paidAppointmentIds.has(appointmentId)) {
                  console.log(
                    `[Cart] Skipping appointment ${appointmentId} - has completed payment`
                  );
                  continue;
                }

                try {
                  const response = await fetch(
                    `${API_ENDPOINTS.APPOINTMENTS.GET_BY_ID(appointmentId)}`,
                    {
                      headers: {
                        Authorization: `Bearer ${token}`,
                      },
                    }
                  );
                  if (response.ok) {
                    const appointment = await response.json();
                    console.log(
                      `[Cart] Fetched appointment ${appointmentId}: status=${
                        appointment.status
                      }, scheduled=${appointment.scheduled_time}, payment_id=${
                        appointment.payment_id || "none"
                      }, payment_status=${appointment.payment_status || "none"}`
                    );

                    // CRITICAL: Skip if appointment has been paid (check payment_status from payments table)
                    if (
                      appointment.payment_status === "completed" ||
                      appointment.payment_id
                    ) {
                      console.log(
                        `[Cart] Skipping appointment ${appointmentId} - already paid (payment_status: ${
                          appointment.payment_status
                        }, payment_id: ${appointment.payment_id || "none"})`
                      );
                      continue;
                    }

                    // Only include if appointment is in the future, valid status, and not already paid/completed
                    if (
                      appointment.scheduled_time &&
                      ["confirmed", "pending"].includes(appointment.status)
                    ) {
                      const appointmentDate = new Date(
                        appointment.scheduled_time
                      );
                      const now = new Date();
                      // Add 1 minute buffer to ensure we don't add appointments that just passed
                      const oneMinuteAgo = new Date(now.getTime() - 60000);
                      // Must be in the future (strict check with buffer)
                      if (appointmentDate > oneMinuteAgo) {
                        // Backend should already filter out paid appointments, but double-check status
                        if (
                          appointment.status === "completed" ||
                          appointment.status === "cancelled"
                        ) {
                          console.log(
                            `[Cart] Skipping appointment ${appointmentId} - status is ${appointment.status}`
                          );
                        } else {
                          appointmentDetailsMap.set(appointmentId, appointment);
                          console.log(
                            `[Cart] Adding appointment ${appointmentId} to cart (status: ${appointment.status}, scheduled: ${appointment.scheduled_time})`
                          );
                        }
                      } else {
                        console.log(
                          `[Cart] Skipping past appointment ${appointmentId} - scheduled: ${
                            appointment.scheduled_time
                          }, now: ${now.toISOString()}`
                        );
                      }
                    } else {
                      console.log(
                        `[Cart] Skipping appointment ${appointmentId} - invalid status (${appointment.status}) or missing scheduled_time`
                      );
                    }
                  }
                } catch (err) {
                  console.error(
                    `Failed to fetch appointment ${appointmentId}:`,
                    err
                  );
                }
              }
            } catch (err) {
              console.error("Failed to fetch appointment details:", err);
            }
          }

          // Add deduplicated backend items to local cart (only if appointment is valid and in the future)
          for (const item of deduplicatedBackendItems) {
            if (item.type === "service") {
              const appointmentId = parseInt(
                item.notes?.match(/Appointment #(\d+)/)?.[1] || "0"
              );
              const appointment = appointmentDetailsMap.get(appointmentId);

              // Only add if appointment exists, is valid, and is in the future
              // (This is a double-check since we already filtered when building appointmentDetailsMap)
              if (appointment && appointment.scheduled_time) {
                // CRITICAL: Double-check payment_status before adding (payment_id is from payments table, not appointments table)
                if (
                  appointment.payment_status === "completed" ||
                  appointment.payment_id
                ) {
                  console.log(
                    `[Cart] Double-check: Skipping appointment ${appointmentId} - already paid (payment_status: ${
                      appointment.payment_status
                    }, payment_id: ${appointment.payment_id || "none"})`
                  );
                  continue;
                }

                const appointmentDate = new Date(appointment.scheduled_time);
                const now = new Date();
                // Add 1 minute buffer to ensure we don't add appointments that just passed
                const oneMinuteAgo = new Date(now.getTime() - 60000);

                // Skip past appointments - they should have been removed after checkout
                // Use buffer to ensure we don't add appointments at current time or just passed
                if (appointmentDate <= oneMinuteAgo) {
                  console.log(
                    `[Cart] Double-check: Skipping past appointment ${appointmentId} - scheduled: ${
                      appointment.scheduled_time
                    }, now: ${now.toISOString()}`
                  );
                  continue;
                }

                cart.addService({
                  appointment_id: appointmentId,
                  salon_id: numericSalonId,
                  salon_name: appointment.salon_name || "",
                  staff_id: appointment.staff_id || 0,
                  staff_name: appointment.staff_name || "",
                  service_id: item.service_id || 0,
                  service_name: item.item_name || "",
                  scheduled_time: appointment.scheduled_time,
                  price: parseFloat(String(item.price || 0)) || 0,
                });
              } else {
                console.log(
                  `[Cart] Skipping service for appointment ${appointmentId} - appointment not found or invalid`
                );
              }
            } else if (item.type === "product") {
              const productId = item.product_id;
              if (productId) {
                cart.addProduct({
                  product_id: productId,
                  name: item.item_name || "",
                  description: item.item_description || "",
                  price: parseFloat(String(item.price || 0)) || 0,
                  quantity: item.quantity || 1,
                  salon_id: numericSalonId || undefined,
                  salon_name: "",
                });
              }
            }
          }
        }
      } catch (err) {
        console.error("Failed to load backend cart:", err);
      } finally {
        isLoadingBackendCart.current = false;
      }
    };

    loadBackendCart();

    // Also listen for focus events to refresh cart when user returns to the page
    const handleFocus = () => {
      if (salonId && !isLoadingBackendCart.current) {
        // Reset loaded salon ID to force refresh
        loadedSalonId.current = null;
        loadBackendCart();
      }
    };

    window.addEventListener("focus", handleFocus);

    return () => {
      window.removeEventListener("focus", handleFocus);
    };
  }, [salonId]);

  // Fetch suggestions when we have a salonId
  useEffect(() => {
    const fetchSuggestions = async () => {
      // Show suggestions even if cart is empty, as long as we have a salonId
      const numericSalonId =
        typeof salonId === "string" ? parseInt(salonId, 10) : salonId;
      if (!numericSalonId) {
        console.log("[Cart] No salonId available, skipping suggestions");
        setSuggestions([]);
        return;
      }

      console.log("[Cart] Fetching suggestions for salonId:", numericSalonId);
      setLoadingSuggestions(true);
      try {
        const token = localStorage.getItem("token");
        if (!token) {
          console.log("[Cart] No token, skipping suggestions");
          setLoadingSuggestions(false);
          return;
        }

        const result = await getUnifiedCart(numericSalonId);
        if (result.error) {
          console.error("[Cart] Error fetching suggestions:", result.error);
          setSuggestions([]);
        } else {
          // Suggestions are now included in the cart object
          const fetchedSuggestions = result.cart?.suggestions || [];
          console.log(
            "[Cart] Fetched",
            fetchedSuggestions.length,
            "suggestions for salon",
            salonId
          );
          console.log("[Cart] Full result structure:", {
            hasCart: !!result.cart,
            hasSuggestions: !!result.cart?.suggestions,
            suggestionsLength: fetchedSuggestions.length,
          });
          if (fetchedSuggestions.length > 0) {
            console.log(
              "[Cart] Suggestion products:",
              fetchedSuggestions.map((s) => ({
                id: s.product_id,
                name: s.name,
                price: s.price,
              }))
            );
          } else {
            console.log(
              "[Cart] No suggestions returned. Check if salon has products with stock > 0"
            );
          }
          setSuggestions(fetchedSuggestions);
        }
      } catch (err) {
        console.error("[Cart] Failed to fetch suggestions:", err);
        setSuggestions([]);
      } finally {
        setLoadingSuggestions(false);
      }
    };

    fetchSuggestions();
  }, [salonId, services.length, products.length]);

  // Fetch salon deposit settings
  useEffect(() => {
    const fetchDepositSettings = async () => {
      if (!salonId) return;

      try {
        const token = localStorage.getItem("token");
        const numericSalonId =
          typeof salonId === "string" ? parseInt(salonId, 10) : salonId;
        const response = await fetch(
          `${API_ENDPOINTS.SALONS.GET_PUBLIC(numericSalonId)}`,
          {
            headers: {
              ...(token ? { Authorization: `Bearer ${token}` } : {}),
            },
          }
        );

        if (response.ok) {
          const salonData = await response.json();
          const depositPct = salonData.bookingSettings?.depositPercentage || 0;
          setDepositPercentage(depositPct);
        }
      } catch (err) {
        console.error("Failed to fetch salon deposit settings:", err);
      }
    };

    fetchDepositSettings();
  }, [salonId]);

  // Fetch loyalty points - refetch periodically to get updated points after payments
  useEffect(() => {
    const fetchLoyaltyPoints = async () => {
      if (!salonId) {
        console.log("[Cart] No salonId, skipping loyalty points fetch");
        return;
      }

      setLoadingPoints(true);
      try {
        const numericSalonId =
          typeof salonId === "string" ? parseInt(salonId, 10) : salonId;
        console.log(
          "[Cart] Fetching loyalty points for salon:",
          numericSalonId
        );
        const result = await getMyPoints(numericSalonId);
        console.log(
          "[Cart] Loyalty points result:",
          JSON.stringify(result, null, 2)
        );

        if (result.error) {
          console.error("[Cart] Error fetching loyalty points:", result.error);
          setAvailablePoints(0);
        } else if (result.data) {
          // Backend returns: { salon_id, points, min_points_redeem, redeem_rate, can_redeem, estimated_discount }
          const points =
            typeof result.data.points === "number"
              ? result.data.points
              : parseInt(result.data.points) || 0;
          const minPoints =
            typeof result.data.min_points_redeem === "number"
              ? result.data.min_points_redeem
              : parseInt(result.data.min_points_redeem) || 100;
          console.log(
            "[Cart] Setting available points to:",
            points,
            "min_points_redeem:",
            minPoints,
            "from result.data:",
            result.data
          );
          setAvailablePoints(points);
          setMinPointsRedeem(minPoints);
        } else {
          console.warn("[Cart] No data in loyalty points result:", result);
          setAvailablePoints(0);
        }
      } catch (err) {
        console.error("[Cart] Failed to fetch loyalty points:", err);
        setAvailablePoints(0);
      } finally {
        setLoadingPoints(false);
      }
    };

    fetchLoyaltyPoints();

    // Refetch loyalty points every 10 seconds to catch updates after payments (reduced from 30s)
    const interval = setInterval(fetchLoyaltyPoints, 10000);

    // Also refresh when window regains focus (user returns from payment page)
    const handleFocus = () => {
      console.log("[Cart] Window focused, refreshing loyalty points");
      fetchLoyaltyPoints();
    };

    // Also refresh when visibility changes (tab becomes visible)
    const handleVisibilityChange = () => {
      if (!document.hidden) {
        console.log("[Cart] Tab visible, refreshing loyalty points");
        fetchLoyaltyPoints();
      }
    };

    // Check if we're returning from payment success page
    const checkPaymentReturn = () => {
      const paymentReturned = sessionStorage.getItem("payment_completed");
      const refreshTime = sessionStorage.getItem("loyalty_refresh_time");

      if (paymentReturned === "true") {
        // If refresh was set more than 3 seconds ago, refresh again (backend might have just finished processing)
        const shouldRefresh =
          !refreshTime || Date.now() - parseInt(refreshTime) > 3000;

        if (shouldRefresh) {
          console.log(
            "[Cart] Payment completed flag detected, refreshing loyalty points immediately"
          );
          sessionStorage.removeItem("payment_completed");
          sessionStorage.removeItem("loyalty_refresh_needed");
          sessionStorage.removeItem("loyalty_refresh_time");
          fetchLoyaltyPoints();

          // Also refresh again after 2 seconds to catch any delayed processing
          setTimeout(() => {
            console.log("[Cart] Delayed loyalty points refresh after payment");
            fetchLoyaltyPoints();
          }, 2000);
        }
      }
    };

    // Check immediately and also on focus/visibility
    checkPaymentReturn();

    window.addEventListener("focus", () => {
      handleFocus();
      checkPaymentReturn();
    });
    document.addEventListener("visibilitychange", () => {
      handleVisibilityChange();
      if (!document.hidden) {
        checkPaymentReturn();
      }
    });

    return () => {
      clearInterval(interval);
      window.removeEventListener("focus", handleFocus);
      document.removeEventListener("visibilitychange", handleVisibilityChange);
    };
  }, [salonId]);

  // Calculate discount when points to redeem changes
  useEffect(() => {
    const calculateDiscountAmount = async () => {
      if (!salonId || pointsToRedeem <= 0) {
        setDiscount(0);
        return;
      }

      // Check if points to redeem meets minimum requirement before calling API
      if (pointsToRedeem < minPointsRedeem) {
        console.log(
          `[Cart] Points to redeem (${pointsToRedeem}) is less than minimum (${minPointsRedeem}), skipping discount calculation`
        );
        setDiscount(0);
        return;
      }

      try {
        const numericSalonId =
          typeof salonId === "string" ? parseInt(salonId, 10) : salonId;
        console.log(
          "[Cart] Calculating discount for",
          pointsToRedeem,
          "points at salon",
          numericSalonId
        );
        const result = await calculateDiscount(numericSalonId, pointsToRedeem);
        console.log("[Cart] Discount calculation result:", result);
        if (result.discount !== undefined) {
          setDiscount(result.discount);
          console.log("[Cart] Discount set to:", result.discount);
        } else if (result.error) {
          // Only log as warning, not error, since we're handling it gracefully
          console.warn(
            "[Cart] Discount calculation returned error:",
            result.error
          );
          setDiscount(0);
        }
      } catch (err) {
        // Only log as warning, not error, since we're handling it gracefully
        console.warn("[Cart] Failed to calculate discount:", err);
        setDiscount(0);
      }
    };

    calculateDiscountAmount();
  }, [pointsToRedeem, salonId, minPointsRedeem]);

  // Sync local cart with backend cart and clear if backend cart is empty
  useEffect(() => {
    const syncCartWithBackend = async () => {
      const numericSalonId =
        typeof salonId === "string" ? parseInt(salonId, 10) : salonId;
      if (!numericSalonId) return;

      setSyncing(true);
      try {
        const token = localStorage.getItem("token");
        if (!token) return;

        // First, check backend cart status
        const backendCart = await getUnifiedCart(numericSalonId);
        if (backendCart.error) {
          console.error("Failed to fetch backend cart:", backendCart.error);
          return;
        }

        // If backend cart is empty (checked out), clear local cart and localStorage
        if (!backendCart.cart?.items || backendCart.cart.items.length === 0) {
          cart.clearCart();
          // Also clear localStorage directly to ensure it's cleared
          localStorage.removeItem("cart");
          return;
        }

        // If local cart is empty but backend has items, clear the backend cart (old items)
        if (services.length === 0 && products.length === 0) {
          // Backend has old items but local cart is empty - clear backend cart
          if (backendCart.cart?.items && backendCart.cart.items.length > 0) {
            console.log(
              `[Cart] Local cart is empty but backend has ${backendCart.cart.items.length} items. Clearing backend cart.`
            );
            // Clear backend cart by removing all items
            const cartId = backendCart.cart.cart_id;
            if (cartId) {
              // Delete all items from backend cart
              for (const item of backendCart.cart.items) {
                try {
                  await fetch(
                    API_ENDPOINTS.SHOP.REMOVE_FROM_CART(item.item_id),
                    {
                      method: "DELETE",
                      headers: {
                        "Content-Type": "application/json",
                        Authorization: `Bearer ${token}`,
                      },
                    }
                  );
                } catch (err) {
                  console.error(
                    "Failed to remove item from backend cart:",
                    err
                  );
                }
              }
            }
          }
          return;
        }

        // Add appointments to backend cart
        for (const service of services) {
          try {
            await addAppointmentToCart(
              service.appointment_id,
              service.salon_id
            );
          } catch (err) {
            console.error("Failed to add appointment to cart:", err);
          }
        }

        // Add products to backend cart
        for (const product of products) {
          try {
            const productSalonId = product.salon_id || salonId;
            await addToCart({
              product_id: product.product_id,
              quantity: product.quantity,
              price: parseFloat(String(product.price || 0)) || 0,
              salon_id:
                typeof productSalonId === "string"
                  ? parseInt(productSalonId, 10)
                  : productSalonId || 0,
            });
          } catch (err) {
            console.error("Failed to add product to cart:", err);
          }
        }
      } catch (err) {
        console.error("Failed to sync cart:", err);
      } finally {
        setSyncing(false);
      }
    };

    syncCartWithBackend();
  }, [salonId, services.length, products.length]);

  const handleUnifiedCheckout = async () => {
    if (!salonId || (services.length === 0 && products.length === 0)) {
      setError("Cart is empty");
      return;
    }

    setCheckoutProcessing(true);
    setError("");

    try {
      const token = localStorage.getItem("token");
      if (!token) {
        throw new Error("Please login to continue");
      }

      // Get the backend cart first
      const numericSalonId =
        typeof salonId === "string" ? parseInt(salonId, 10) : salonId;
      if (!numericSalonId) {
        throw new Error("Invalid salon ID");
      }

      let cartResult = await getUnifiedCart(numericSalonId);
      if (cartResult.error) {
        throw new Error(cartResult.error || "Failed to get cart");
      }

      // Get or create cart_id
      const cart_id = cartResult.cart?.cart_id;
      if (!cart_id) {
        throw new Error("Failed to get cart ID");
      }

      // Clear old items from backend cart first
      // Delete all existing items to ensure we start fresh with only current items
      if (cartResult.cart?.items && cartResult.cart.items.length > 0) {
        console.log(
          `[Cart] Clearing ${cartResult.cart.items.length} old items from backend cart before checkout`
        );
        for (const item of cartResult.cart.items) {
          try {
            await fetch(API_ENDPOINTS.SHOP.REMOVE_FROM_CART(item.item_id), {
              method: "DELETE",
              headers: {
                "Content-Type": "application/json",
                Authorization: `Bearer ${token}`,
              },
            });
          } catch (err) {
            console.error("Failed to remove old item from backend cart:", err);
          }
        }
      }

      // Filter out past appointments before adding to backend
      const currentTime = new Date();
      const validServices = services.filter((service) => {
        const appointmentDate = new Date(service.scheduled_time);
        return appointmentDate > currentTime;
      });

      // Now add only current items from local cart to backend (excluding past appointments)
      for (const service of validServices) {
        try {
          await addAppointmentToCart(service.appointment_id, service.salon_id);
        } catch (err) {
          console.error("Failed to add appointment to cart:", err);
        }
      }

      for (const product of products) {
        try {
          const productSalonId = product.salon_id || numericSalonId;
          await addToCart({
            product_id: product.product_id,
            quantity: product.quantity,
            price: parseFloat(String(product.price || 0)) || 0,
            salon_id:
              typeof productSalonId === "string"
                ? parseInt(productSalonId, 10)
                : productSalonId || 0,
          });
        } catch (err) {
          console.error("Failed to add product to cart:", err);
        }
      }

      // Get the updated cart (should only have current items now)
      cartResult = await getUnifiedCart(numericSalonId);
      if (cartResult.error || !cartResult.cart || !cartResult.cart.cart_id) {
        throw new Error(cartResult.error || "Failed to get cart after sync");
      }

      // Create unified checkout
      console.log(
        "[Cart] Creating unified checkout for cart_id:",
        cartResult.cart.cart_id
      );
      const checkoutResult = await createUnifiedCheckout(
        numericSalonId,
        cartResult.cart.cart_id,
        pointsToRedeem
      );

      console.log("[Cart] Checkout result:", {
        success: checkoutResult.success,
        hasPaymentLink: !!checkoutResult.payment_link,
        error: checkoutResult.error,
      });

      if (!checkoutResult.success || !checkoutResult.payment_link) {
        console.error("[Cart] Checkout failed:", checkoutResult.error);
        throw new Error(checkoutResult.error || "Failed to create checkout");
      }

      // Verify payment_link is a valid URL before redirecting
      if (
        !checkoutResult.payment_link ||
        !checkoutResult.payment_link.startsWith("http")
      ) {
        console.error(
          "[Cart] Invalid payment link:",
          checkoutResult.payment_link
        );
        throw new Error("Invalid payment link received from server");
      }

      // Clear local cart and localStorage before redirecting
      // Also remove any past appointments that might still be in the cart
      const checkoutTime = new Date();
      const allCartServices = cart.getServices();
      allCartServices.forEach((service) => {
        const appointmentDate = new Date(service.scheduled_time);
        if (appointmentDate <= checkoutTime) {
          cart.removeItem(service.appointment_id, "service");
        }
      });

      // Clear cart before redirect (this is correct - cart should be empty after checkout)
      cart.clearCart();
      localStorage.removeItem("cart");

      // Redirect to Stripe checkout
      console.log(
        "[Cart] Redirecting to Stripe checkout:",
        checkoutResult.payment_link
      );
      console.log(
        "[Cart] Payment link is valid URL:",
        checkoutResult.payment_link.startsWith("http")
      );

      // Use window.location.replace to prevent back button from going back to cart
      // This will navigate away from the cart page to Stripe
      try {
        window.location.replace(checkoutResult.payment_link);
      } catch (redirectError) {
        console.error(
          "[Cart] Redirect failed, trying href instead:",
          redirectError
        );
        // Fallback to href if replace fails
        window.location.href = checkoutResult.payment_link;
      }
    } catch (err) {
      setError(
        err instanceof Error
          ? err.message
          : "Checkout failed. Please try again."
      );
      setCheckoutProcessing(false);
    }
  };

  const handleCheckoutServices = async () => {
    if (services.length === 0) return;

    if (paymentMethod === "pay_in_store") {
      // Handle pay in store for services
      setCheckoutProcessing(true);
      setError("");

      try {
        const token = localStorage.getItem("token");
        if (!token) {
          throw new Error("Please login to continue");
        }

        // For multiple services, we'll use the first one's appointment_id
        // In a real scenario, you might want to handle multiple appointments differently
        const firstService = services[0];
        const totalAmount = serviceTotal;

        const response = await fetch(API_ENDPOINTS.PAYMENTS.PAY_IN_STORE, {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${token}`,
          },
          body: JSON.stringify({
            amount: totalAmount,
            appointment_id: firstService.appointment_id,
            points_to_redeem: pointsToRedeem,
            salon_id: firstService.salon_id,
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
          // Clear cart and redirect
          cart.clearCart();
          localStorage.removeItem("cart");
          alert(
            "Appointment confirmed! You can pay when you arrive at the salon."
          );
          router.push(`/customer/appointments/${firstService.appointment_id}`);
        }
      } catch (err) {
        setError(
          err instanceof Error
            ? err.message
            : "Checkout failed. Please try again."
        );
        setCheckoutProcessing(false);
      }
    } else {
      // Pay in full - redirect to checkout page
      const firstService = services[0];
      router.push(
        `/customer/checkout?appointmentId=${firstService.appointment_id}`
      );
    }
  };

  const handleCheckoutProducts = () => {
    if (products.length === 0) return;
    router.push(`/customer/checkout/products`);
  };

  if (services.length === 0 && products.length === 0) {
    return (
      <div className="min-h-screen bg-muted p-4 sm:p-8">
        <div className="max-w-6xl mx-auto">
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
            {/* Empty Cart Message */}
            <div className="lg:col-span-2">
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

            {/* Suggestions Sidebar - Show even when cart is empty if we have salonId */}
            {salonId && suggestions.length > 0 && (
              <div className="lg:col-span-1">
                <div className="bg-card border border-border rounded-2xl p-6 shadow-soft-br sticky top-8">
                  <h2 className="text-xl font-bold mb-4">
                    You might also like
                  </h2>
                  {loadingSuggestions ? (
                    <div className="flex items-center justify-center py-8">
                      <Loader2 className="w-6 h-6 animate-spin text-primary" />
                    </div>
                  ) : (
                    <div className="space-y-4">
                      {suggestions.slice(0, 3).map((suggestion) => (
                        <div
                          key={suggestion.product_id}
                          className="border border-border rounded-lg p-3 hover:bg-muted/50 transition cursor-pointer"
                          onClick={() => {
                            cart.addProduct({
                              product_id: suggestion.product_id,
                              name: suggestion.name,
                              description: suggestion.description || "",
                              price: parseFloat(suggestion.price) || 0,
                              quantity: 1,
                              salon_id: salonId && !isNaN(Number(salonId)) && Number(salonId) > 0 ? Number(salonId) : 0,
                              salon_name: "",
                            });
                          }}
                        >
                          <div className="w-full h-24 bg-muted rounded-lg flex items-center justify-center mb-2">
                            <Package className="w-6 h-6 text-muted-foreground" />
                          </div>
                          <h3 className="font-semibold text-sm mb-1">
                            {suggestion.name}
                          </h3>
                          <div className="flex items-center justify-between">
                            <span className="font-bold text-primary text-sm">
                              ${parseFloat(suggestion.price || 0).toFixed(2)}
                            </span>
                            <button
                              onClick={(e) => {
                                e.stopPropagation();
                                cart.addProduct({
                                  product_id: suggestion.product_id,
                                  name: suggestion.name,
                                  description: suggestion.description || "",
                                  price: parseFloat(suggestion.price) || 0,
                                  quantity: 1,
                                  salon_id: salonId && !isNaN(Number(salonId)) && Number(salonId) > 0 ? Number(salonId) : 0,
                                  salon_name: "",
                                });
                              }}
                              className="px-2 py-1 bg-primary text-white text-xs rounded hover:bg-primary/90 transition-colors flex items-center gap-1"
                            >
                              <Plus className="w-3 h-3" />
                              Add
                            </button>
                          </div>
                        </div>
                      ))}
                    </div>
                  )}
                </div>
              </div>
            )}
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
                    className="text-sm text-muted-foreground hover:text-foreground font-semibold"
                  >
                    Clear All
                  </button>
                </div>

                <div className="space-y-4">
                  {services.map((service, index) => {
                    const appointmentDate = new Date(service.scheduled_time);
                    return (
                      <div
                        key={`service-${service.appointment_id}-${service.service_id}-${index}`}
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
                              ${(service.price || 0).toFixed(2)}
                            </p>
                            <button
                              type="button"
                              aria-label="Remove service from cart"
                              title="Remove service from cart"
                              onClick={() =>
                                cart.removeItem(
                                  service.appointment_id,
                                  "service"
                                )
                              }
                              className="mt-2 p-2 text-red-600 hover:bg-red-50 rounded-lg transition"
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

                          <div className="flex items-center gap-3 mt-3">
                            <button
                              onClick={() =>
                                cart.updateProductQuantity(
                                  product.product_id,
                                  product.quantity - 1
                                )
                              }
                              className="p-1 border border-border rounded hover:bg-muted transition"
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
                            >
                              <Plus className="w-4 h-4" />
                            </button>
                          </div>
                        </div>

                        <div className="text-right">
                          <p className="text-lg font-bold text-primary">
                            $
                            {((product.price || 0) * product.quantity).toFixed(
                              2
                            )}
                          </p>
                          <p className="text-sm text-muted-foreground">
                            ${(product.price || 0).toFixed(2)} each
                          </p>
                          <button
                            onClick={() =>
                              cart.removeItem(product.product_id, "product")
                            }
                            className="mt-2 p-2 text-red-600 hover:bg-red-50 rounded-lg transition"
                            title="Remove product from cart"
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

            {/* Product Suggestions - Always show if we have salonId */}
            {salonId && (
              <div className="bg-card border border-border rounded-2xl p-6 shadow-soft-br">
                <h2 className="text-xl font-bold mb-4">You might also like</h2>
                {loadingSuggestions ? (
                  <div className="flex items-center justify-center py-8">
                    <Loader2 className="w-6 h-6 animate-spin text-primary" />
                    <span className="ml-2 text-sm text-muted-foreground">
                      Loading suggestions...
                    </span>
                  </div>
                ) : suggestions.length > 0 ? (
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                    {suggestions.map((suggestion) => (
                      <div
                        key={suggestion.product_id}
                        className="border border-border rounded-lg p-4 hover:bg-muted/50 transition cursor-pointer"
                        onClick={() => {
                          cart.addProduct({
                            product_id: suggestion.product_id,
                            name: suggestion.name,
                            description: suggestion.description || "",
                            price: parseFloat(suggestion.price) || 0,
                            quantity: 1,
                            salon_id: salonId || 0,
                            salon_name: "",
                          });
                          // Refresh suggestions after adding
                          setTimeout(() => {
                            const fetchSuggestions = async () => {
                              try {
                                const numericSalonId =
                                  typeof salonId === "string"
                                    ? parseInt(salonId, 10)
                                    : salonId;
                                if (!numericSalonId) return;
                                const result = await getUnifiedCart(
                                  numericSalonId
                                );
                                if (!result.error) {
                                  setSuggestions(
                                    result.cart?.suggestions || []
                                  );
                                }
                              } catch (err) {
                                console.error(
                                  "Failed to refresh suggestions:",
                                  err
                                );
                              }
                            };
                            fetchSuggestions();
                          }, 500);
                        }}
                      >
                        <div className="w-full h-32 bg-muted rounded-lg flex items-center justify-center mb-2">
                          <Package className="w-8 h-8 text-muted-foreground" />
                        </div>
                        <h3 className="font-semibold text-sm mb-1">
                          {suggestion.name}
                        </h3>
                        {suggestion.description && (
                          <p className="text-xs text-muted-foreground mb-2 line-clamp-2">
                            {suggestion.description}
                          </p>
                        )}
                        <div className="flex items-center justify-between">
                          <span className="font-bold text-primary">
                            ${parseFloat(suggestion.price || 0).toFixed(2)}
                          </span>
                          <button
                            onClick={(e) => {
                              e.stopPropagation();
                              cart.addProduct({
                                product_id: suggestion.product_id,
                                name: suggestion.name,
                                description: suggestion.description || "",
                                price: parseFloat(suggestion.price) || 0,
                                quantity: 1,
                                salon_id: salonId || 0,
                                salon_name: "",
                              });
                              // Refresh suggestions after adding
                              setTimeout(() => {
                                const fetchSuggestions = async () => {
                                  try {
                                    const result = await getUnifiedCart(
                                      salonId
                                    );
                                    if (!result.error) {
                                      setSuggestions(
                                        result.cart?.suggestions || []
                                      );
                                    }
                                  } catch (err) {
                                    console.error(
                                      "Failed to refresh suggestions:",
                                      err
                                    );
                                  }
                                };
                                fetchSuggestions();
                              }, 500);
                            }}
                            className="px-3 py-1 bg-primary text-white text-xs rounded-lg hover:bg-primary/90 transition-colors flex items-center gap-1"
                          >
                            <Plus className="w-3 h-3" />
                            Add
                          </button>
                        </div>
                      </div>
                    ))}
                  </div>
                ) : (
                  <div className="text-center py-8 text-muted-foreground">
                    <Package className="w-12 h-12 mx-auto mb-2 opacity-50" />
                    <p className="text-sm">
                      No product suggestions available at this time
                    </p>
                  </div>
                )}
              </div>
            )}
          </div>

          {/* Summary Sidebar */}
          <div className="lg:col-span-1">
            <div className="bg-card border border-border rounded-2xl p-6 shadow-soft-br sticky top-8 space-y-6">
              <h2 className="text-xl font-bold mb-4">Order Summary</h2>

              {services.length > 0 && (
                <div className="space-y-2 pb-3 border-b border-border mb-3">
                  <h3 className="font-semibold text-sm">Services</h3>
                  <div className="flex justify-between text-sm">
                    <span className="text-muted-foreground">
                      {services.length} service(s)
                    </span>
                    <span className="font-semibold">
                      ${serviceTotal.toFixed(2)}
                    </span>
                  </div>
                </div>
              )}

              {products.length > 0 && (
                <div className="space-y-2 pb-3 border-b border-border mb-3">
                  <h3 className="font-semibold text-sm">Products</h3>
                  <div className="flex justify-between text-sm">
                    <span className="text-muted-foreground">
                      {products.reduce((sum, p) => sum + p.quantity, 0)} item(s)
                    </span>
                    <span className="font-semibold">
                      ${productTotal.toFixed(2)}
                    </span>
                  </div>
                </div>
              )}

              <div className="pt-3 border-t border-border mb-4">
                {discount > 0 && (
                  <div className="flex justify-between text-sm mb-2">
                    <span className="text-muted-foreground">
                      Loyalty Discount
                    </span>
                    <span className="font-semibold text-green-600">
                      -${discount.toFixed(2)}
                    </span>
                  </div>
                )}
                <div className="flex justify-between text-lg font-bold mb-4">
                  <span>Total</span>
                  <span className="text-primary">
                    ${(total - discount).toFixed(2)}
                  </span>
                </div>

                {error && (
                  <div className="mb-4 p-3 bg-red-50 border border-red-200 rounded-lg text-red-700 text-sm">
                    {error}
                  </div>
                )}

                {/* Loyalty Points Section */}
                <div className="mb-4 p-4 bg-muted/50 rounded-lg border border-border">
                  <div className="flex items-center gap-2 mb-3">
                    <Gift className="w-4 h-4 text-primary" />
                    <span className="text-sm font-semibold">
                      Loyalty Points
                    </span>
                  </div>
                  {loadingPoints ? (
                    <div className="text-xs text-muted-foreground">
                      Loading points...
                    </div>
                  ) : (
                    <>
                      <div className="text-xs text-muted-foreground mb-2">
                        Available Points: {availablePoints.toLocaleString()}
                      </div>
                      {availablePoints > 0 ? (
                        <div className="space-y-2">
                          <div className="flex items-center gap-2">
                            <input
                              type="number"
                              min="0"
                              max={availablePoints}
                              value={pointsToRedeem}
                              onChange={(e) => {
                                const value = Math.max(
                                  0,
                                  Math.min(
                                    availablePoints,
                                    parseInt(e.target.value) || 0
                                  )
                                );
                                setPointsToRedeem(value);
                              }}
                              className="flex-1 px-3 py-2 border border-border rounded-lg text-sm"
                              placeholder="Points to redeem"
                            />
                            {pointsToRedeem > 0 && discount > 0 && (
                              <span className="text-xs text-green-600 font-semibold whitespace-nowrap">
                                -${discount.toFixed(2)}
                              </span>
                            )}
                          </div>
                          {pointsToRedeem > 0 && discount === 0 && (
                            <div className="text-xs text-orange-600">
                              Minimum points required to redeem. Check salon
                              settings.
                            </div>
                          )}
                        </div>
                      ) : (
                        <div className="text-xs text-muted-foreground italic">
                          No points available. Earn points by making purchases!
                        </div>
                      )}
                    </>
                  )}
                </div>

                {/* Payment Method Selection - Only show for services */}
                {services.length > 0 && (
                  <div className="mb-4 space-y-3">
                    <label className="block text-sm font-semibold mb-2">
                      Payment Method
                    </label>
                    <div className="space-y-2">
                      <label className="flex items-center gap-3 p-3 border-2 rounded-lg cursor-pointer hover:bg-muted/50 transition-colors">
                        <input
                          type="radio"
                          name="paymentMethod"
                          value="pay_in_full"
                          checked={paymentMethod === "pay_in_full"}
                          onChange={(e) =>
                            setPaymentMethod(
                              e.target.value as "pay_in_full" | "pay_in_store"
                            )
                          }
                          className="w-4 h-4 text-primary"
                        />
                        <div className="flex-1">
                          <div className="font-semibold">Pay in Full</div>
                          <div className="text-xs text-muted-foreground">
                            Pay online now with Stripe
                          </div>
                        </div>
                        <CreditCard className="w-5 h-5 text-primary" />
                      </label>
                      <label className="flex items-center gap-3 p-3 border-2 rounded-lg cursor-pointer hover:bg-muted/50 transition-colors">
                        <input
                          type="radio"
                          name="paymentMethod"
                          value="pay_in_store"
                          checked={paymentMethod === "pay_in_store"}
                          onChange={(e) =>
                            setPaymentMethod(
                              e.target.value as "pay_in_full" | "pay_in_store"
                            )
                          }
                          className="w-4 h-4 text-primary"
                        />
                        <div className="flex-1">
                          <div className="font-semibold">Pay in Store</div>
                          <div className="text-xs text-muted-foreground">
                            {depositPercentage > 0
                              ? `Pay ${depositPercentage}% deposit now, rest at salon`
                              : "Pay when you arrive at the salon"}
                          </div>
                        </div>
                        <MapPin className="w-5 h-5 text-primary" />
                      </label>
                    </div>
                    {paymentMethod === "pay_in_store" &&
                      depositPercentage > 0 && (
                        <div className="mt-2 p-2 bg-blue-50 border border-blue-200 rounded text-xs text-blue-700">
                          A deposit of $
                          {((serviceTotal * depositPercentage) / 100).toFixed(
                            2
                          )}{" "}
                          will be required to confirm your appointment.
                          You'll pay the remaining $
                          {(
                            serviceTotal -
                            (serviceTotal * depositPercentage) / 100
                          ).toFixed(2)}{" "}
                          when you arrive.
                        </div>
                      )}
                  </div>
                )}

                {/* Unified Checkout Button */}
                {services.length > 0 && products.length > 0 && (
                  <button
                    onClick={handleUnifiedCheckout}
                    disabled={checkoutProcessing || syncing}
                    className="w-full px-6 py-3 bg-primary text-white rounded-lg font-semibold hover:bg-primary/90 transition-colors flex items-center justify-center gap-2 disabled:opacity-50 disabled:cursor-not-allowed"
                  >
                    {checkoutProcessing || syncing ? (
                      <>
                        <Loader2 className="w-5 h-5 animate-spin" />
                        {syncing ? "Syncing..." : "Processing..."}
                      </>
                    ) : (
                      <>
                        <CreditCard className="w-5 h-5" />
                        Checkout All ({services.length + products.length} items)
                      </>
                    )}
                  </button>
                )}

                {/* Separate checkout buttons if only one type */}
                {services.length > 0 && products.length === 0 && (
                  <button
                    onClick={handleCheckoutServices}
                    disabled={checkoutProcessing || syncing}
                    className="w-full px-6 py-3 bg-primary text-white rounded-lg font-semibold hover:bg-primary/90 transition-colors flex items-center justify-center gap-2 disabled:opacity-50 disabled:cursor-not-allowed"
                  >
                    {checkoutProcessing || syncing ? (
                      <>
                        <Loader2 className="w-5 h-5 animate-spin" />
                        Processing...
                      </>
                    ) : (
                      <>
                        <CreditCard className="w-5 h-5" />
                        Checkout Services
                      </>
                    )}
                  </button>
                )}

                {products.length > 0 && services.length === 0 && (
                  <button
                    onClick={handleCheckoutProducts}
                    disabled={checkoutProcessing || syncing}
                    className="w-full px-6 py-3 bg-primary text-white rounded-lg font-semibold hover:bg-primary/90 transition-colors flex items-center justify-center gap-2 disabled:opacity-50 disabled:cursor-not-allowed"
                  >
                    {checkoutProcessing || syncing ? (
                      <>
                        <Loader2 className="w-5 h-5 animate-spin" />
                        Processing...
                      </>
                    ) : (
                      <>
                        <CreditCard className="w-5 h-5" />
                        Checkout Products
                      </>
                    )}
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
