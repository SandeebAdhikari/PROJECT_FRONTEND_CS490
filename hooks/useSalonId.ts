"use client";
import { useEffect, useState } from "react";
import { fetchWithRefresh } from "@/libs/api/fetchWithRefresh";

const useSalonId = () => {
  const [salonId, setSalonId] = useState<number | null>(null);
  const [salonSlug, setSalonSlug] = useState<string | null>(null);
  const [loadingSalon, setLoadingSalon] = useState(true);

  useEffect(() => {
    const fetchUserSalon = async () => {
      try {
        const res = await fetchWithRefresh(
          `${process.env.NEXT_PUBLIC_API_URL}/api/auth/me`,
          { credentials: "include" }
        );
        const data = await res.json();

        if (res.ok && data.user?.salon_id) {
          setSalonId(Number(data.user.salon_id));
          setSalonSlug(data.user.salon_slug || null);
        } else {
          console.warn("No salon_id or salon_slug found in user object");
        }
      } catch (err) {
        console.error("Error fetching salon info:", err);
      } finally {
        setLoadingSalon(false);
      }
    };

    fetchUserSalon();
  }, []);

  return { salonId, salonSlug, loadingSalon };
};

export default useSalonId;
