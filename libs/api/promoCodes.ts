const API_BASE_URL = process.env.NEXT_PUBLIC_API_URL || "http://localhost:4000";

export interface PromoCode {
  promo_id: number;
  salon_id: number;
  code: string;
  discount_type: "percentage" | "fixed";
  discount_value: number;
  usage_limit: number;
  used_count: number;
  end_date: string | null;
  is_active: boolean;
}

export async function validatePromoCode(code: string, salonId: number, subtotal: number): Promise<{ valid: boolean; discount?: number; error?: string }> {
  try {
    const res = await fetch(`${API_BASE_URL}/api/loyalty/promo/validate`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ code, salon_id: salonId, subtotal }),
    });
    return await res.json();
  } catch { return { valid: false, error: "Network error" }; }
}

export async function getSalonPromoCodes(salonId: number): Promise<{ codes?: PromoCode[]; error?: string }> {
  try {
    const token = localStorage.getItem("token");
    const res = await fetch(`${API_BASE_URL}/api/loyalty/promo/salon/${salonId}`, {
      headers: { Authorization: `Bearer ${token}` },
    });
    const data = await res.json();
    return res.ok ? { codes: data.codes } : { error: data.error };
  } catch { return { error: "Network error" }; }
}

export async function createPromoCode(
  salonId: number, 
  code: string, 
  discountType: "percent" | "fixed", 
  discountValue: number
): Promise<{ promo_id?: number; error?: string }> {
  try {
    const token = localStorage.getItem("token");
    const res = await fetch(`${API_BASE_URL}/api/loyalty/promo`, {
      method: "POST",
      headers: { "Content-Type": "application/json", Authorization: `Bearer ${token}` },
      body: JSON.stringify({ salon_id: salonId, code, discount_type: discountType, discount_value: discountValue }),
    });
    const data = await res.json();
    return res.ok ? { promo_id: data.promo_id } : { error: data.error };
  } catch { return { error: "Network error" }; }
}

export async function deletePromoCode(promoId: number, salonId: number): Promise<{ success?: boolean; error?: string }> {
  try {
    const token = localStorage.getItem("token");
    const res = await fetch(`${API_BASE_URL}/api/loyalty/promo/${promoId}`, {
      method: "DELETE",
      headers: { "Content-Type": "application/json", Authorization: `Bearer ${token}` },
      body: JSON.stringify({ salon_id: salonId }),
    });
    const data = await res.json();
    return res.ok ? { success: true } : { error: data.error };
  } catch { return { error: "Network error" }; }
}

