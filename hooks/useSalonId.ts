"use client";
import { useEffect, useMemo, useState } from "react";
import { fetchWithRefresh } from "@/libs/api/fetchWithRefresh";

const useSalonId = () => {
  const [salonId, setSalonId] = useState<number | null>(null);
  const [salonSlug, setSalonSlug] = useState<string | null>(null);
  const [salonName, setSalonName] = useState<string | null>(null);
  const [ownerName, setOwnerName] = useState<string | null>(null);
  const [ownerEmail, setOwnerEmail] = useState<string | null>(null);
  const [loadingSalon, setLoadingSalon] = useState(true);

  useEffect(() => {
    const fetchUserSalon = async () => {
      try {
        const res = await fetchWithRefresh(
          `${process.env.NEXT_PUBLIC_API_URL}/api/auth/me`,
          { credentials: "include" }
        );
        const data = await res.json();

        if (res.ok && data.user) {
          if (data.user.salon_id) {
            setSalonId(Number(data.user.salon_id));
          }
          setSalonSlug(data.user.salon_slug || null);
          setSalonName(data.user.salon_name || null);
          setOwnerName(data.user.full_name || null);
          setOwnerEmail(data.user.email || null);
        } else {
          console.warn("No salon user payload returned from /api/auth/me");
        }
      } catch (err) {
        console.error("Error fetching salon info:", err);
      } finally {
        setLoadingSalon(false);
      }
    };

    fetchUserSalon();
  }, []);

  const ownerInitials = useMemo(() => {
    const source = ownerName?.trim() || ownerEmail?.trim() || "";
    if (!source) return "";
    const parts = source.split(/\s+/).slice(0, 2);
    if (!parts.length && ownerEmail) {
      return ownerEmail.slice(0, 2).toUpperCase();
    }
    return parts
      .map((chunk) => chunk.charAt(0).toUpperCase())
      .join("");
  }, [ownerName, ownerEmail]);

  return {
    salonId,
    salonSlug,
    salonName,
    ownerName,
    ownerInitials,
    loadingSalon,
  };
};

export default useSalonId;
