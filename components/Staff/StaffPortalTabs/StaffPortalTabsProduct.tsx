"use client";

import React from "react";
import { PackageCheck, TrendingUp } from "lucide-react";
import { StaffPortalProduct } from "@/components/Staff/staffPortalTypes";

interface StaffPortalTabsProductProps {
  products: StaffPortalProduct[];
}

const StaffPortalTabsProduct: React.FC<StaffPortalTabsProductProps> = ({
  products,
}) => {
  const heroProduct = products.find((p) => p.hero) || products[0];
  const supporting = products.filter((p) => p.id !== heroProduct?.id);

  return (
    <div className="space-y-6">
      {heroProduct && (
        <article className="rounded-2xl border border-border bg-gradient-to-r from-primary/10 via-white to-emerald-50 p-5 shadow-soft-br">
          <div className="flex flex-wrap items-center justify-between gap-3">
            <div>
              <p className="text-xs uppercase tracking-wide text-muted-foreground">
                Feature focus
              </p>
              <h3 className="text-2xl font-semibold">
                {heroProduct.name} · ${heroProduct.retailPrice}
              </h3>
              <p className="text-sm text-muted-foreground">
                {heroProduct.brand} • Promote after color services
              </p>
            </div>
            <span className="inline-flex items-center gap-2 rounded-full bg-white px-4 py-2 text-sm font-semibold text-primary">
              <TrendingUp className="h-4 w-4" />
              Attach {heroProduct.attachRate}%
            </span>
          </div>
        </article>
      )}

      <div className="grid gap-4 md:grid-cols-2">
        {supporting.map((product) => (
          <article
            key={product.id}
            className="rounded-2xl border border-border bg-white p-5 shadow-soft-br"
          >
            <div className="flex items-center justify-between">
              <div>
                <p className="text-lg font-semibold">{product.name}</p>
                <p className="text-sm text-muted-foreground">
                  {product.brand}
                </p>
              </div>
              <span className="text-sm font-semibold text-primary">
                ${product.retailPrice}
              </span>
            </div>
            <div className="mt-3 flex flex-wrap items-center gap-4 text-sm">
              <p className="inline-flex items-center gap-1 text-muted-foreground">
                <PackageCheck className="h-4 w-4" />
                Stock {product.stock}
              </p>
              <p className="text-muted-foreground">
                Attach{" "}
                <span className="font-semibold text-foreground">
                  {product.attachRate}%
                </span>
              </p>
            </div>
          </article>
        ))}
      </div>
    </div>
  );
};

export default StaffPortalTabsProduct;
