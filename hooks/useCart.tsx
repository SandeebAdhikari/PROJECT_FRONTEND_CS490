"use client";

import { createContext, useContext, useState, useEffect, useRef, ReactNode } from "react";

export interface CartService {
  type: "service";
  appointment_id: number;
  salon_id: number;
  salon_name: string;
  service_id: number;
  service_name: string;
  staff_id: number;
  staff_name: string;
  scheduled_time: string;
  price: number;
  notes?: string;
}

export interface CartProduct {
  type: "product";
  product_id: number;
  name: string;
  description?: string;
  price: number;
  quantity: number;
  image_url?: string;
  salon_id?: number;
  salon_name?: string;
  stock?: number;
}

export type CartItem = CartService | CartProduct;

interface CartContextType {
  items: CartItem[];
  addService: (service: Omit<CartService, "type">) => void;
  addProduct: (product: Omit<CartProduct, "type">) => void;
  removeItem: (id: number, type: "service" | "product") => void;
  updateProductQuantity: (productId: number, quantity: number) => void;
  clearCart: () => void;
  removeDuplicateServices: () => void;
  getServices: () => CartService[];
  getProducts: () => CartProduct[];
  getTotalPrice: () => number;
  getServiceTotal: () => number;
  getProductTotal: () => number;
}

const CartContext = createContext<CartContextType | undefined>(undefined);

export function CartProvider({ children }: { children: ReactNode }) {
  const [items, setItems] = useState<CartItem[]>([]);
  const isDeduplicating = useRef(false);

  // Load cart from localStorage on mount, deduplicate, and validate appointments
  useEffect(() => {
    const savedCart = localStorage.getItem("cart");
    if (savedCart) {
      try {
        const loadedItems = JSON.parse(savedCart);
        // Deduplicate and validate services when loading
        const seenServiceKeys = new Set<string>();
        const validItems: CartItem[] = [];

        loadedItems.forEach((item: CartItem) => {
          if (item.type === "service") {
            const key = `service-${item.appointment_id}`;
            // Skip duplicates
            if (seenServiceKeys.has(key)) {
              return;
            }
            
            // Validate service: must have valid scheduled_time (not empty, not "Invalid Date")
            // AND must be in the future (not past)
            const now = new Date();
            const hasValidTime = item.scheduled_time && 
                                 item.scheduled_time.trim() !== "" && 
                                 item.scheduled_time !== "Invalid Date" &&
                                 !isNaN(new Date(item.scheduled_time).getTime());
            
            if (hasValidTime) {
              const appointmentDate = new Date(item.scheduled_time);
              // Must be in the future - use <= to catch appointments exactly at current time
              if (appointmentDate > now) {
                seenServiceKeys.add(key);
                validItems.push(item);
              } else {
                console.log(`[Cart Hook] Removing past service with appointment_id ${item.appointment_id} - scheduled: ${item.scheduled_time}, now: ${now.toISOString()}`);
              }
            } else {
              console.log(`[Cart Hook] Removing invalid service with appointment_id ${item.appointment_id} - invalid scheduled_time`);
            }
          } else {
            // Products are always valid
            validItems.push(item);
          }
        });

        const removedCount = loadedItems.length - validItems.length;
        if (removedCount > 0) {
          console.log(`[Cart] Removed ${removedCount} invalid/duplicate items from localStorage`);
        }
        
        // Update localStorage with cleaned items
        if (validItems.length !== loadedItems.length) {
          localStorage.setItem("cart", JSON.stringify(validItems));
        }
        
        setItems(validItems);
      } catch (error) {
        console.error("Failed to load cart:", error);
        // Clear corrupted localStorage
        localStorage.removeItem("cart");
      }
    }
  }, []);

  // Aggressively remove duplicates and past appointments from items whenever they change
  useEffect(() => {
    if (items.length === 0 || isDeduplicating.current) return;
    
    const seenServiceKeys = new Set<string>();
    const deduplicatedItems: CartItem[] = [];
    const now = new Date();

    items.forEach((item) => {
      if (item.type === "service") {
        const key = `service-${item.appointment_id}`;
        // Skip duplicates
        if (seenServiceKeys.has(key)) {
          return;
        }
        
        // Also check if appointment is in the past
        if (item.scheduled_time) {
          const appointmentDate = new Date(item.scheduled_time);
          if (!isNaN(appointmentDate.getTime()) && appointmentDate <= now) {
            console.log(`[Cart Hook] Removing past appointment ${item.appointment_id} during deduplication - scheduled: ${item.scheduled_time}`);
            return; // Skip past appointments
          }
        }
        
        seenServiceKeys.add(key);
        deduplicatedItems.push(item);
      } else {
        deduplicatedItems.push(item);
      }
    });

    // Always update if we found duplicates or past appointments (immediate removal, no delay)
    if (deduplicatedItems.length < items.length) {
      const removedCount = items.length - deduplicatedItems.length;
      console.log(`[Cart Hook] Automatically removing ${removedCount} duplicate/past services`);
      // Update localStorage first, then state (ensures persistence)
      localStorage.setItem("cart", JSON.stringify(deduplicatedItems));
      isDeduplicating.current = true;
      setItems(deduplicatedItems);
      // Reset flag immediately (synchronous)
      isDeduplicating.current = false;
    }
  }, [items]);

  // Save cart to localStorage whenever it changes
  useEffect(() => {
    localStorage.setItem("cart", JSON.stringify(items));
  }, [items]);

  const addService = (service: Omit<CartService, "type">) => {
    setItems((prev) => {
      // Check if service already exists in cart
      const existingServiceIndex = prev.findIndex(
        (item) => item.type === "service" && item.appointment_id === service.appointment_id
      );

      if (existingServiceIndex > -1) {
        // Service already exists, don't add duplicate
        console.warn("Service already in cart");
        return prev;
      }

      // Add new service
      return [...prev, { ...service, type: "service" }];
    });
  };

  const addProduct = (product: Omit<CartProduct, "type">) => {
    // Check stock before adding
    const stock = product.stock || Infinity;
    if (stock <= 0) {
      console.warn("Cannot add product: out of stock");
      return;
    }

    setItems((prev) => {
      // Check if product already exists in cart
      const existingProductIndex = prev.findIndex(
        (item) => item.type === "product" && item.product_id === product.product_id
      );

      if (existingProductIndex > -1) {
        // Update quantity if product exists, but respect stock limit
        const newItems = [...prev];
        const existingProduct = newItems[existingProductIndex] as CartProduct;
        const newQuantity = existingProduct.quantity + product.quantity;
        const maxQuantity = Math.min(newQuantity, stock);
        
        if (maxQuantity < newQuantity) {
          console.warn(`Cannot add more than ${stock} items. Stock limit reached.`);
        }
        
        newItems[existingProductIndex] = {
          ...existingProduct,
          quantity: maxQuantity,
        };
        return newItems;
      }

      // Add new product, but ensure quantity doesn't exceed stock
      const quantity = Math.min(product.quantity, stock);
      return [...prev, { ...product, quantity, type: "product" }];
    });
  };

  const removeItem = (id: number, type: "service" | "product") => {
    setItems((prev) => {
      if (type === "service") {
        // For services, remove ALL items with this appointment_id (handles duplicates)
        return prev.filter((item) => {
          return !(item.type === "service" && item.appointment_id === id);
        });
      } else {
        return prev.filter((item) => {
          return !(item.type === "product" && item.product_id === id);
        });
      }
    });
  };

  // Function to remove all duplicate services (keep first occurrence of each appointment_id)
  const removeDuplicateServices = () => {
    setItems((prev) => {
      const seenAppointmentIds = new Set<number>();
      const deduplicated = prev.filter((item) => {
        if (item.type === "service") {
          if (seenAppointmentIds.has(item.appointment_id)) {
            return false; // Remove duplicate
          }
          seenAppointmentIds.add(item.appointment_id);
          return true; // Keep first occurrence
        }
        return true; // Keep all products
      });
      
      if (deduplicated.length !== prev.length) {
        console.log(`[Cart] Removed ${prev.length - deduplicated.length} duplicate services`);
      }
      
      return deduplicated;
    });
  };

  const updateProductQuantity = (productId: number, quantity: number) => {
    if (quantity <= 0) {
      removeItem(productId, "product");
      return;
    }

    setItems((prev) =>
      prev.map((item) => {
        if (item.type === "product" && item.product_id === productId) {
          // Check stock limit
          const maxStock = item.stock || Infinity;
          const newQuantity = Math.min(quantity, maxStock);
          if (newQuantity < quantity) {
            console.warn(`Cannot add more than ${maxStock} items. Stock limit reached.`);
          }
          return { ...item, quantity: newQuantity };
        }
        return item;
      })
    );
  };

  const clearCart = () => {
    setItems([]);
    localStorage.removeItem("cart");
  };

  const getServices = (): CartService[] => {
    return items.filter((item) => item.type === "service") as CartService[];
  };

  const getProducts = (): CartProduct[] => {
    return items.filter((item) => item.type === "product") as CartProduct[];
  };

  const getTotalPrice = (): number => {
    return items.reduce((total, item) => {
      if (item.type === "product") {
        return total + item.price * item.quantity;
      }
      return total + item.price;
    }, 0);
  };

  const getServiceTotal = (): number => {
    return getServices().reduce((total, service) => total + service.price, 0);
  };

  const getProductTotal = (): number => {
    return getProducts().reduce((total, product) => total + product.price * product.quantity, 0);
  };

  return (
    <CartContext.Provider
      value={{
        items,
        addService,
        addProduct,
        removeItem,
        updateProductQuantity,
        clearCart,
        removeDuplicateServices,
        getServices,
        getProducts,
        getTotalPrice,
        getServiceTotal,
        getProductTotal,
      }}
    >
      {children}
    </CartContext.Provider>
  );
}

export function useCart() {
  const context = useContext(CartContext);
  if (context === undefined) {
    throw new Error("useCart must be used within a CartProvider");
  }
  return context;
}
