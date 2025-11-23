"use client";

import { createContext, useContext, useState, useEffect, ReactNode } from "react";

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
}

export type CartItem = CartService | CartProduct;

interface CartContextType {
  items: CartItem[];
  addService: (service: Omit<CartService, "type">) => void;
  addProduct: (product: Omit<CartProduct, "type">) => void;
  removeItem: (id: number, type: "service" | "product") => void;
  updateProductQuantity: (productId: number, quantity: number) => void;
  clearCart: () => void;
  getServices: () => CartService[];
  getProducts: () => CartProduct[];
  getTotalPrice: () => number;
  getServiceTotal: () => number;
  getProductTotal: () => number;
}

const CartContext = createContext<CartContextType | undefined>(undefined);

export function CartProvider({ children }: { children: ReactNode }) {
  const [items, setItems] = useState<CartItem[]>([]);

  // Load cart from localStorage on mount
  useEffect(() => {
    const savedCart = localStorage.getItem("cart");
    if (savedCart) {
      try {
        setItems(JSON.parse(savedCart));
      } catch (error) {
        console.error("Failed to load cart:", error);
      }
    }
  }, []);

  // Save cart to localStorage whenever it changes
  useEffect(() => {
    localStorage.setItem("cart", JSON.stringify(items));
  }, [items]);

  const addService = (service: Omit<CartService, "type">) => {
    setItems((prev) => [...prev, { ...service, type: "service" }]);
  };

  const addProduct = (product: Omit<CartProduct, "type">) => {
    setItems((prev) => {
      // Check if product already exists in cart
      const existingProductIndex = prev.findIndex(
        (item) => item.type === "product" && item.product_id === product.product_id
      );

      if (existingProductIndex > -1) {
        // Update quantity if product exists
        const newItems = [...prev];
        const existingProduct = newItems[existingProductIndex] as CartProduct;
        newItems[existingProductIndex] = {
          ...existingProduct,
          quantity: existingProduct.quantity + product.quantity,
        };
        return newItems;
      }

      // Add new product
      return [...prev, { ...product, type: "product" }];
    });
  };

  const removeItem = (id: number, type: "service" | "product") => {
    setItems((prev) =>
      prev.filter((item) => {
        if (type === "service") {
          return !(item.type === "service" && item.appointment_id === id);
        } else {
          return !(item.type === "product" && item.product_id === id);
        }
      })
    );
  };

  const updateProductQuantity = (productId: number, quantity: number) => {
    if (quantity <= 0) {
      removeItem(productId, "product");
      return;
    }

    setItems((prev) =>
      prev.map((item) => {
        if (item.type === "product" && item.product_id === productId) {
          return { ...item, quantity };
        }
        return item;
      })
    );
  };

  const clearCart = () => {
    setItems([]);
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
