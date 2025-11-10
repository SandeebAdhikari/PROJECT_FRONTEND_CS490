import { API_ENDPOINTS, fetchConfig } from './config';

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

export async function getProducts(salonId?: number): Promise<{ products?: Product[]; error?: string }> {
  try {
    const url = salonId 
      ? `${API_ENDPOINTS.SHOP.PRODUCTS}?salon_id=${salonId}`
      : API_ENDPOINTS.SHOP.PRODUCTS;

    const response = await fetch(url, {
      ...fetchConfig,
    });

    const result = await response.json();

    if (!response.ok) {
      return { error: result.error || 'Failed to get products' };
    }

    return { products: result };
  } catch (error) {
    return { error: 'Network error. Please try again.' };
  }
}

export async function getProduct(productId: number): Promise<{ product?: Product; error?: string }> {
  try {
    const response = await fetch(API_ENDPOINTS.SHOP.PRODUCT(productId), {
      ...fetchConfig,
    });

    const result = await response.json();

    if (!response.ok) {
      return { error: result.error || 'Failed to get product' };
    }

    return { product: result };
  } catch (error) {
    return { error: 'Network error. Please try again.' };
  }
}

export async function addProduct(data: AddProductData): Promise<{ product_id?: number; message?: string; error?: string }> {
  try {
    const token = localStorage.getItem('token');
    if (!token) {
      return { error: 'Not authenticated' };
    }

    const response = await fetch(API_ENDPOINTS.SHOP.ADD, {
      ...fetchConfig,
      method: 'POST',
      headers: {
        ...fetchConfig.headers,
        'Authorization': `Bearer ${token}`,
      },
      body: JSON.stringify(data),
    });

    const result = await response.json();

    if (!response.ok) {
      return { error: result.error || 'Failed to add product' };
    }

    return result;
  } catch (error) {
    return { error: 'Network error. Please try again.' };
  }
}

export async function updateProduct(productId: number, data: Partial<AddProductData>): Promise<{ message?: string; error?: string }> {
  try {
    const token = localStorage.getItem('token');
    if (!token) {
      return { error: 'Not authenticated' };
    }

    const response = await fetch(API_ENDPOINTS.SHOP.UPDATE(productId), {
      ...fetchConfig,
      method: 'PUT',
      headers: {
        ...fetchConfig.headers,
        'Authorization': `Bearer ${token}`,
      },
      body: JSON.stringify(data),
    });

    const result = await response.json();

    if (!response.ok) {
      return { error: result.error || 'Failed to update product' };
    }

    return result;
  } catch (error) {
    return { error: 'Network error. Please try again.' };
  }
}

export async function deleteProduct(productId: number): Promise<{ message?: string; error?: string }> {
  try {
    const token = localStorage.getItem('token');
    if (!token) {
      return { error: 'Not authenticated' };
    }

    const response = await fetch(API_ENDPOINTS.SHOP.DELETE(productId), {
      ...fetchConfig,
      method: 'DELETE',
      headers: {
        ...fetchConfig.headers,
        'Authorization': `Bearer ${token}`,
      },
    });

    const result = await response.json();

    if (!response.ok) {
      return { error: result.error || 'Failed to delete product' };
    }

    return result;
  } catch (error) {
    return { error: 'Network error. Please try again.' };
  }
}

