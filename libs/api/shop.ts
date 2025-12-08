import { API_ENDPOINTS, fetchConfig } from "./config";

export interface Product {
  product_id: number;
  salon_id: number;
  name: string;
  description: string;
  price: number;
  stock_quantity: number;
  image_url?: string;
  created_at: string;
}

export interface AddProductData {
  salon_id: number;
  name: string;
  description: string;
  price: number;
  stock_quantity: number;
  image_url?: string;
}

export async function getProducts(
  salonId?: number
): Promise<{ products?: Product[]; error?: string }> {
  try {
    const url = salonId
      ? `${API_ENDPOINTS.SHOP.PRODUCTS(salonId)}?salon_id=${salonId}`
      : typeof API_ENDPOINTS.SHOP.PRODUCTS === 'string' 
        ? API_ENDPOINTS.SHOP.PRODUCTS 
        : API_ENDPOINTS.SHOP.PRODUCTS('');

    const response = await fetch(url, {
      ...fetchConfig,
    });

    const result = await response.json();

    if (!response.ok) {
      return { error: result.error || "Failed to get products" };
    }

    return { products: result };
  } catch {
    return { error: "Network error. Please try again." };
  }
}

export async function getProduct(
  productId: number
): Promise<{ product?: Product; error?: string }> {
  try {
    const response = await fetch(API_ENDPOINTS.SHOP.PRODUCT(productId), {
      ...fetchConfig,
    });

    const result = await response.json();

    if (!response.ok) {
      return { error: result.error || "Failed to get product" };
    }

    return { product: result };
  } catch {
    return { error: "Network error. Please try again." };
  }
}

export async function addProduct(
  data: AddProductData
): Promise<{ product_id?: number; message?: string; error?: string }> {
  try {
    const token = localStorage.getItem("token");
    if (!token) {
      return { error: "Not authenticated" };
    }

    const response = await fetch(API_ENDPOINTS.SHOP.ADD, {
      ...fetchConfig,
      method: "POST",
      headers: {
        ...fetchConfig.headers,
        Authorization: `Bearer ${token}`,
      },
      body: JSON.stringify(data),
    });

    const result = await response.json();

    if (!response.ok) {
      return { error: result.error || "Failed to add product" };
    }

    return result;
  } catch {
    return { error: "Network error. Please try again." };
  }
}

export async function updateProduct(
  productId: number,
  data: Partial<AddProductData>
): Promise<{ message?: string; error?: string }> {
  try {
    const token = localStorage.getItem("token");
    if (!token) {
      return { error: "Not authenticated" };
    }

    const response = await fetch(API_ENDPOINTS.SHOP.UPDATE(productId), {
      ...fetchConfig,
      method: "PUT",
      headers: {
        ...fetchConfig.headers,
        Authorization: `Bearer ${token}`,
      },
      body: JSON.stringify(data),
    });

    const result = await response.json();

    if (!response.ok) {
      return { error: result.error || "Failed to update product" };
    }

    return result;
  } catch {
    return { error: "Network error. Please try again." };
  }
}

export async function deleteProduct(
  productId: number
): Promise<{ message?: string; error?: string }> {
  try {
    const token = localStorage.getItem("token");
    if (!token) {
      return { error: "Not authenticated" };
    }

    const response = await fetch(API_ENDPOINTS.SHOP.DELETE(productId), {
      ...fetchConfig,
      method: "DELETE",
      headers: {
        ...fetchConfig.headers,
        Authorization: `Bearer ${token}`,
      },
    });

    const result = await response.json();

    if (!response.ok) {
      return { error: result.error || "Failed to delete product" };
    }

    return result;
  } catch {
    return { error: "Network error. Please try again." };
  }
}

export interface CartItem {
  item_id: number;
  cart_id: number;
  type: "product" | "service";
  quantity: number;
  price: number;
  notes?: string;
  item_name: string;
  item_description?: string;
  product_id?: number;
  service_id?: number;
}

export interface ProductSuggestion {
  product_id: number;
  name: string;
  category: string;
  description?: string;
  price: number;
  stock: number;
}

export interface UnifiedCart {
  cart_id: number | null;
  items: CartItem[];
  total: number;
  item_count: number;
  suggestions?: ProductSuggestion[];
}

/**
 * Add product to cart
 */
export async function addToCart(data: {
  product_id: number;
  quantity: number;
  price: number;
  salon_id: number | string;
}): Promise<{ message?: string; error?: string }> {
  try {
    const token = localStorage.getItem("token");
    if (!token) {
      return { error: "Not authenticated" };
    }

    const response = await fetch(API_ENDPOINTS.SHOP.ADD_TO_CART, {
      ...fetchConfig,
      method: "POST",
      headers: {
        ...fetchConfig.headers,
        Authorization: `Bearer ${token}`,
      },
      body: JSON.stringify(data),
    });

    const result = await response.json();

    if (!response.ok) {
      return { error: result.error || "Failed to add to cart" };
    }

    return { message: result.message || "Added to cart" };
  } catch {
    return { error: "Network error. Please try again." };
  }
}

/**
 * Get unified cart (products + services)
 */
export async function getUnifiedCart(
  salonId: number | string
): Promise<{ cart?: UnifiedCart; error?: string }> {
  try {
    const token = localStorage.getItem("token");
    if (!token) {
      return { error: "Not authenticated" };
    }

    const response = await fetch(
      `${API_ENDPOINTS.SHOP.UNIFIED_CART}?salon_id=${salonId}`,
      {
        ...fetchConfig,
        headers: {
          ...fetchConfig.headers,
          Authorization: `Bearer ${token}`,
        },
      }
    );

    const result = await response.json();

    if (!response.ok) {
      return { error: result.error || "Failed to fetch cart" };
    }

    // Backend returns: { cart_id, items, total, item_count, suggestions }
    // Wrap it in cart object but preserve suggestions
    return { 
      cart: {
        cart_id: result.cart_id,
        items: result.items,
        total: result.total,
        item_count: result.item_count,
        suggestions: result.suggestions || [],
      }
    };
  } catch {
    return { error: "Network error. Please try again." };
  }
}

/**
 * Add appointment to cart
 */
export async function addAppointmentToCart(
  appointmentId: number,
  salonId: number | string
): Promise<{ message?: string; error?: string }> {
  try {
    const token = localStorage.getItem("token");
    if (!token) {
      return { error: "Not authenticated" };
    }

    const response = await fetch(API_ENDPOINTS.SHOP.ADD_APPOINTMENT_TO_CART, {
      ...fetchConfig,
      method: "POST",
      headers: {
        ...fetchConfig.headers,
        Authorization: `Bearer ${token}`,
      },
      body: JSON.stringify({
        appointment_id: appointmentId,
        salon_id: salonId,
      }),
    });

    const result = await response.json();

    if (!response.ok) {
      return { error: result.error || "Failed to add appointment to cart" };
    }

    return { message: result.message || "Appointment added to cart" };
  } catch {
    return { error: "Network error. Please try again." };
  }
}

/**
 * Remove item from cart
 */
export async function removeFromCart(
  itemId: number | string
): Promise<{ message?: string; error?: string }> {
  try {
    const token = localStorage.getItem("token");
    if (!token) {
      return { error: "Not authenticated" };
    }

    const response = await fetch(API_ENDPOINTS.SHOP.REMOVE_FROM_CART(itemId), {
      ...fetchConfig,
      method: "DELETE",
      headers: {
        ...fetchConfig.headers,
        Authorization: `Bearer ${token}`,
      },
    });

    const result = await response.json();

    if (!response.ok) {
      return { error: result.error || "Failed to remove item from cart" };
    }

    return { message: result.message || "Item removed from cart" };
  } catch {
    return { error: "Network error. Please try again." };
  }
}
