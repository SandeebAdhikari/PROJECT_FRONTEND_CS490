"use client";

import React, { useState, useEffect } from "react";
import { Plus, Edit2, Trash2, Package } from "lucide-react";
import { API_ENDPOINTS, fetchConfig } from "@/libs/api/config";
import { checkOwnerSalon } from "@/libs/api/salons";

interface Product {
  product_id: number;
  name: string;
  category: string;
  description: string;
  price: number;
  stock: number;
  reorder_level?: number;
  sku?: string;
  supplier_name?: string;
  is_active: boolean;
}

const SalonProductsManagement = () => {
  const [products, setProducts] = useState<Product[]>([]);
  const [loading, setLoading] = useState(true);
  const [showModal, setShowModal] = useState(false);
  const [editingProduct, setEditingProduct] = useState<Product | null>(null);
  const [salonId, setSalonId] = useState<number | string | null>(null);

  const [formData, setFormData] = useState({
    name: "",
    category: "Hair",
    description: "",
    price: "",
    stock: "",
  });

  const categories = ["Hair", "Skin", "Nails", "Other"];

  useEffect(() => {
    const fetchSalonId = async () => {
      try {
        const result = await checkOwnerSalon();
        if (result.hasSalon && result.salon?.salon_id) {
          setSalonId(result.salon.salon_id);
        } else {
          console.warn("No salon found for owner");
          setLoading(false);
        }
      } catch (error) {
        console.error("Error fetching salon:", error);
        setLoading(false);
      }
    };
    fetchSalonId();
  }, []);

  useEffect(() => {
    if (salonId) {
      fetchProducts(salonId);
    } else {
      setLoading(false);
    }
  }, [salonId]);

  // ----------------------------
  // FETCH PRODUCTS
  // ----------------------------
  const fetchProducts = async (currentSalonId: number | string) => {
    try {
      const token = localStorage.getItem("token");

      const response = await fetch(
        API_ENDPOINTS.SALONS.PRODUCTS(currentSalonId),
        {
          ...fetchConfig,
          headers: {
            ...fetchConfig.headers,
            Authorization: `Bearer ${token}`,
          },
        }
      );

      if (response.ok) {
        const data = await response.json();
        setProducts(data || []);
      } else {
        const errorData = await response.json().catch(() => ({ error: response.statusText }));
        console.error("Error fetching products:", errorData.error || response.statusText);
        setProducts([]);
      }
    } catch (error) {
      console.error("Error fetching products:", error);
      setProducts([]);
    } finally {
      setLoading(false);
    }
  };

  // ----------------------------
  // ADD/UPDATE PRODUCT
  // ----------------------------
  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!salonId) return;

    try {
      const token = localStorage.getItem("token");

      const url = API_ENDPOINTS.SHOP.ADD;
      const method = editingProduct ? "PUT" : "POST";

      const response = await fetch(
        editingProduct ? API_ENDPOINTS.SHOP.UPDATE(editingProduct.product_id) : url,
        {
          method,
          headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${token}`,
          },
          body: JSON.stringify({
            salon_id: salonId,
            name: formData.name,
            category: formData.category,
            description: formData.description,
            price: Number(formData.price),
            stock: Number(formData.stock),
            is_active: true,
          }),
        }
      );

      if (!response.ok) {
        const err = await response.json();
        const errorMessage =
          err.error || err.message || "Failed to save product";
        console.error("Product creation error:", err);
        alert(errorMessage);
        return;
      }

      setShowModal(false);
      setEditingProduct(null);
      setFormData({
        name: "",
        category: "Hair",
        description: "",
        price: "",
        stock: "",
      });
      fetchProducts(salonId);
    } catch (error) {
      console.error("Error saving product:", error);
      alert("Failed to save product.");
    }
  };

  // ----------------------------
  // EDIT PRODUCT
  // ----------------------------
  const handleEdit = (product: Product) => {
    setEditingProduct(product);
      setFormData({
        name: product.name,
        category: product.category,
        description: product.description || "",
        price: product.price.toString(),
        stock: product.stock.toString(),
      });
    setShowModal(true);
  };

  // ----------------------------
  // DELETE PRODUCT
  // ----------------------------
  const handleDelete = async (productId: number) => {
    if (!confirm("Are you sure you want to delete this product?")) return;

    try {
      const token = localStorage.getItem("token");
      const response = await fetch(API_ENDPOINTS.SHOP.UPDATE(productId), {
        method: "PUT",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify({ is_active: false }),
      });

      if (response.ok && salonId) {
        fetchProducts(salonId);
      } else {
        alert("Failed to delete product.");
      }
    } catch (error) {
      console.error("Error deleting product:", error);
      alert("Failed to delete product.");
    }
  };

  // ----------------------------
  // OPEN ADD MODAL
  // ----------------------------
  const openAddModal = () => {
    setEditingProduct(null);
    setFormData({
      name: "",
      category: "Hair",
      description: "",
      price: "",
      stock: "",
    });
    setShowModal(true);
  };

  if (loading) {
    return <div className="text-sm text-gray-500">Loading products...</div>;
  }

  // ----------------------------
  // RENDER UI
  // ----------------------------
  return (
    <div className="bg-card border border-border rounded-2xl p-6 col-span-2">
      <div className="flex items-center justify-between mb-4">
        <div className="flex items-center gap-2">
          <Package className="w-5 h-5" />
          <h2 className="text-lg font-bold">Products</h2>
        </div>

        <button
          onClick={openAddModal}
          className="flex items-center gap-2 px-4 py-2 bg-primary text-primary-foreground rounded-lg hover:bg-primary-dark transition-smooth text-sm font-medium"
        >
          <Plus className="w-4 h-4" />
          Add Product
        </button>
      </div>

      {products.length === 0 ? (
        <p className="text-sm text-muted-foreground text-center py-8">
          No products yet. Add your first product to get started.
        </p>
      ) : (
        <div className="space-y-2">
          {products.map((product) => (
            <div
              key={product.product_id}
              className="flex items-center justify-between p-3 border border-border rounded-lg hover:bg-muted transition-smooth"
            >
              <div className="flex-1">
                <div className="flex items-center gap-2">
                  <h3 className="font-semibold text-sm">{product.name}</h3>
                  <span className="text-xs text-muted-foreground bg-secondary px-2 py-0.5 rounded-full">
                    {product.category}
                  </span>
                </div>

                <div className="flex items-center gap-4 mt-1 text-xs text-muted-foreground">
                  <span className="font-semibold text-primary">
                    ${product.price}
                  </span>
                  <span>Stock: {product.stock}</span>
                </div>
              </div>

              <div className="flex items-center gap-2">
                <button
                  onClick={() => handleEdit(product)}
                  className="p-2 text-blue-600 hover:bg-blue-50 rounded-lg"
                  title="Edit"
                >
                  <Edit2 className="w-4 h-4" />
                </button>

                <button
                  onClick={() => handleDelete(product.product_id)}
                  className="p-2 text-red-600 hover:bg-red-50 rounded-lg"
                  title="Delete"
                >
                  <Trash2 className="w-4 h-4" />
                </button>
              </div>
            </div>
          ))}
        </div>
      )}

      {/* ----------------------------
          MODAL FOR ADD/EDIT PRODUCT
        ----------------------------- */}
      {showModal && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
          <div className="bg-card border border-border rounded-2xl p-6 max-w-md w-full max-h-[90vh] overflow-y-auto">
            <h2 className="text-xl font-bold mb-4">
              {editingProduct ? "Edit Product" : "Add New Product"}
            </h2>

            <form onSubmit={handleSubmit} className="space-y-4">
              {/* Product Name */}
              <div>
                <label className="block text-sm font-medium mb-1">
                  Product Name *
                </label>
                <input
                  type="text"
                  required
                  value={formData.name}
                  onChange={(e) =>
                    setFormData({ ...formData, name: e.target.value })
                  }
                  className="w-full mt-1 rounded-lg border border-border px-3 py-2 focus:outline-none focus:ring-2 focus:ring-primary"
                  placeholder="e.g., Shampoo"
                />
              </div>

              {/* Category */}
              <div>
                <label className="block text-sm font-medium mb-1">
                  Category *
                </label>
                <select
                  value={formData.category}
                  onChange={(e) =>
                    setFormData({ ...formData, category: e.target.value })
                  }
                  className="w-full mt-1 rounded-lg border border-border px-3 py-2 focus:outline-none focus:ring-2 focus:ring-primary"
                >
                  {categories.map((cat) => (
                    <option key={cat}>{cat}</option>
                  ))}
                </select>
              </div>

              {/* Description */}
              <div>
                <label className="block text-sm font-medium mb-1">
                  Description
                </label>
                <textarea
                  value={formData.description}
                  onChange={(e) =>
                    setFormData({ ...formData, description: e.target.value })
                  }
                  className="w-full mt-1 rounded-lg border border-border px-3 py-2 focus:outline-none focus:ring-2 focus:ring-primary"
                  placeholder="Product description"
                  rows={3}
                />
              </div>

              {/* Price */}
              <div>
                <label className="block text-sm font-medium mb-1">
                  Price ($) *
                </label>
                <input
                  type="number"
                  min="0"
                  step="0.01"
                  required
                  value={formData.price}
                  onChange={(e) =>
                    setFormData({ ...formData, price: e.target.value })
                  }
                  className="w-full mt-1 rounded-lg border border-border px-3 py-2 focus:outline-none focus:ring-2 focus:ring-primary"
                  placeholder="0.00"
                />
              </div>

              {/* Stock */}
              <div>
                <label className="block text-sm font-medium mb-1">
                  Stock *
                </label>
                <input
                  type="number"
                  min="0"
                  required
                  value={formData.stock}
                  onChange={(e) =>
                    setFormData({ ...formData, stock: e.target.value })
                  }
                  className="w-full mt-1 rounded-lg border border-border px-3 py-2 focus:outline-none focus:ring-2 focus:ring-primary"
                  placeholder="0"
                />
              </div>

              {/* Modal Buttons */}
              <div className="flex gap-3 mt-6">
                <button
                  type="button"
                  onClick={() => {
                    setShowModal(false);
                    setEditingProduct(null);
                  }}
                  className="flex-1 px-4 py-2 border border-border rounded-lg hover:bg-muted transition-smooth"
                >
                  Cancel
                </button>

                <button
                  type="submit"
                  className="flex-1 px-4 py-2 bg-primary text-primary-foreground rounded-lg hover:bg-primary-dark transition-smooth"
                >
                  {editingProduct ? "Update" : "Add"} Product
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};

export default SalonProductsManagement;

