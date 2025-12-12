const API_BASE_URL = process.env.NEXT_PUBLIC_API_URL || "http://localhost:4000";

export interface Reward {
  reward_id: number;
  salon_id: number;
  name: string;
  description: string;
  points_required: number;
  is_active: boolean;
}

export interface RedeemedReward {
  id: number;
  name: string;
  points_required: number;
  salon_name: string;
  redeemed_at: string;
  status: string;
}

export async function getSalonRewards(salonId: number): Promise<{ rewards?: Reward[]; error?: string }> {
  try {
    const res = await fetch(`${API_BASE_URL}/api/loyalty/rewards/salon/${salonId}`);
    const data = await res.json();
    return res.ok ? { rewards: data.rewards } : { error: data.error };
  } catch { return { error: "Network error" }; }
}

export async function redeemReward(salonId: number, rewardId: number): Promise<{ success?: boolean; error?: string }> {
  try {
    const token = localStorage.getItem("token");
    const res = await fetch(`${API_BASE_URL}/api/loyalty/rewards/redeem`, {
      method: "POST",
      headers: { "Content-Type": "application/json", Authorization: `Bearer ${token}` },
      body: JSON.stringify({ salon_id: salonId, reward_id: rewardId }),
    });
    const data = await res.json();
    return res.ok ? { success: true } : { error: data.error };
  } catch { return { error: "Network error" }; }
}

export async function getMyRewards(): Promise<{ rewards?: RedeemedReward[]; error?: string }> {
  try {
    const token = localStorage.getItem("token");
    const res = await fetch(`${API_BASE_URL}/api/loyalty/rewards/my`, {
      headers: { Authorization: `Bearer ${token}` },
    });
    const data = await res.json();
    return res.ok ? { rewards: data.rewards } : { error: data.error };
  } catch { return { error: "Network error" }; }
}

export async function createReward(salonId: number, name: string, description: string, pointsRequired: number): Promise<{ reward_id?: number; error?: string }> {
  try {
    const token = localStorage.getItem("token");
    const res = await fetch(`${API_BASE_URL}/api/loyalty/rewards`, {
      method: "POST",
      headers: { "Content-Type": "application/json", Authorization: `Bearer ${token}` },
      body: JSON.stringify({ salon_id: salonId, name, description, points_required: pointsRequired }),
    });
    const data = await res.json();
    return res.ok ? { reward_id: data.reward_id } : { error: data.error };
  } catch { return { error: "Network error" }; }
}

export async function deleteReward(rewardId: number, salonId: number): Promise<{ success?: boolean; error?: string }> {
  try {
    const token = localStorage.getItem("token");
    const res = await fetch(`${API_BASE_URL}/api/loyalty/rewards/${rewardId}`, {
      method: "DELETE",
      headers: { "Content-Type": "application/json", Authorization: `Bearer ${token}` },
      body: JSON.stringify({ salon_id: salonId }),
    });
    const data = await res.json();
    return res.ok ? { success: true } : { error: data.error };
  } catch { return { error: "Network error" }; }
}

