"use client";

import React, { useState, useEffect } from "react";
import { Package, Plus } from "lucide-react";
import { API_ENDPOINTS } from "@/libs/api/config";
import { useCart } from "@/hooks/useCart";
import { addToCart } from "@/libs/api/shop";

interface Product {
  product_id: number;
  name: string;
  category: string;
  description?: string;
  price: number;
  stock: number;
}

export default function SalonDetailProducts({ salonId }: { salonId: string }) {
  const [products, setProducts] = useState<Product[]>([]);
  const [loading, setLoading] = useState(true);
  const [activeCategory, setActiveCategory] = useState("All Products");
  const cart = useCart();

  useEffect(() => {
    const fetchProducts = async () => {
      if (!salonId) {
        setLoading(false);
        return;
      }
      try {
        const response = await fetch(
          API_ENDPOINTS.SALONS.PRODUCTS_PUBLIC(salonId)
        );
        if (response.ok) {
          const data = await response.json();
          const normalizedProducts = Array.isArray(data)
            ? data.map((p: Product) => ({
                ...p,
                price: typeof p.price === "string" ? parseFloat(p.price) || 0 : p.price || 0,
                stock: typeof p.stock === "string" ? parseInt(p.stock) || 0 : p.stock || 0,
              }))
            : [];
          setProducts(normalizedProducts);
        } else {
          setProducts([]);
        }
      } catch (error) {
        console.error("Error fetching products:", error);
        setProducts([]);
      } finally {
        setLoading(false);
      }
    };

    fetchProducts();
  }, [salonId]);

  const categories = [
    "All Products",
    ...Array.from(new Set(products.map((p) => p.category))),
  ];

  const filtered =
    activeCategory === "All Products"
      ? products
      : products.filter((p) => p.category === activeCategory);

  const handleAddToCart = async (product: Product, event?: React.MouseEvent<HTMLButtonElement>) => {
    const stock = Number(product.stock);
    if (stock <= 0) {
      alert("This product is out of stock");
      return;
    }

    try {
      const productPrice = Number(product.price);
      const productSalonId = Number(salonId);
      
      const productData = {
        product_id: product.product_id,
        name: product.name,
        description: product.description || "",
        price: productPrice,
        quantity: 1,
        salon_id: productSalonId,
        stock: stock,
      };
      
      // Add to local cart
      cart.addProduct(productData);
      
      // Sync to backend
      try {
        await addToCart({
          product_id: product.product_id,
          quantity: 1,
          price: productPrice,
          salon_id: productSalonId,
        });
      } catch (err) {
        console.error("Failed to sync product to backend:", err);
      }
      
      // Visual feedback
      if (event?.currentTarget) {
        const button = event.currentTarget;
        const originalText = button.innerHTML;
        button.innerHTML = "✓ Added!";
        button.classList.add("bg-green-600");
        setTimeout(() => {
          button.innerHTML = originalText;
          button.classList.remove("bg-green-600");
        }, 1500);
      } else {
        // Fallback: show alert if button reference not available
        alert(`${product.name} added to cart!`);
      }
    } catch (error) {
      console.error("Error adding product to cart:", error);
      alert("Failed to add product to cart. Please try again.");
    }
  };

  if (loading) {
    return (
      <section className="mt-5 w-full">
        <p className="text-muted-foreground">Loading products...</p>
      </section>
    );
  }

  if (products.length === 0) {
    return null; // Don't show section if no products
  }

  return (
    <section className="mt-5 w-full">
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4 mb-6">
        <h2 className="text-2xl font-extrabold">Products</h2>
      </div>

      <div className="flex gap-2 mb-8 overflow-x-auto scrollbar-hide bg-muted rounded-lg sm:w-fit p-1 font-inter">
        {categories.map((c) => (
          <button
            key={c}
            onClick={() => setActiveCategory(c)}
            className={[
              "px-4 py-2 rounded-lg text-sm font-medium transition whitespace-nowrap cursor-pointer",
              activeCategory === c
                ? "bg-primary-foreground text-foreground"
                : "text-muted-foreground hover:text-foreground",
            ].join(" ")}
          >
            {c}
          </button>
        ))}
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
        {filtered.map((product) => (
          <div
            key={product.product_id}
            className="border border-border rounded-lg p-4 hover:shadow-md transition-shadow bg-card"
          >
            <div className="flex items-start justify-between mb-2">
              <div className="flex items-center gap-2">
                <Package className="w-5 h-5 text-primary" />
                <h3 className="font-semibold text-lg">{product.name}</h3>
              </div>
              <span className="text-xs text-muted-foreground bg-secondary px-2 py-0.5 rounded-full">
                {product.category}
              </span>
            </div>

            {product.description && (
              <p className="text-sm text-muted-foreground mb-3 line-clamp-2">
                {product.description}
              </p>
            )}

            <div className="flex items-center justify-between mt-4">
              <div>
                <p className="text-xl font-bold text-primary">
                  ${Number(product.price).toFixed(2)}
                </p>
                <p className="text-xs text-muted-foreground">
                  {product.stock > 0
                    ? `${product.stock} in stock`
                    : "Out of stock"}
                </p>
              </div>

              <button
                onClick={(e) => {
                  e.preventDefault();
                  e.stopPropagation();
                  handleAddToCart(product, e);
                }}
                disabled={product.stock <= 0}
                className={[
                  "flex items-center gap-2 px-4 py-2 rounded-lg font-medium transition",
                  product.stock > 0
                    ? "bg-primary text-primary-foreground hover:bg-primary/90"
                    : "bg-muted text-muted-foreground cursor-not-allowed",
                ].join(" ")}
              >
                <Plus className="w-4 h-4" />
                Add to Cart
              </button>
            </div>
          </div>
        ))}
      </div>
    </section>
  );
}

