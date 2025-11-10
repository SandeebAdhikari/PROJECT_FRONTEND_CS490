"use client";
import { useEffect, useState } from "react";
import { fetchWithRefresh } from "@/libs/api/fetchWithRefresh";

const useSalonId = () => {
  const [salonId, setSalonId] = useState<number | null>(null);
  const [loadingSalon, setLoadingSalon] = useState(true);

  useEffect(() => {
    const fetchUserSalon = async () => {
      try {
        const res = await fetchWithRefresh(
          `${process.env.NEXT_PUBLIC_API_URL}/api/users/me`,
          { credentials: "include" }
        );
        const data = await res.json();

        if (res.ok && data.salon_id) {
          setSalonId(Number(data.salon_id));
        } else {
          console.warn("No salon_id found in user object");
        }
      } catch (err) {
        console.error("Error fetching salonId:", err);
      } finally {
        setLoadingSalon(false);
      }
    };

    fetchUserSalon();
  }, []);

  return { salonId, loadingSalon };
};

export default useSalonId;
