import { useState, useEffect } from 'react';

const FAVORITES_KEY = 'favorite_salons';

export function useFavorites() {
  const [favorites, setFavorites] = useState<string[]>([]);

  useEffect(() => {
    // Load favorites from localStorage
    const loadFavorites = () => {
      if (typeof window === 'undefined') return;
      const saved = localStorage.getItem(FAVORITES_KEY);
      if (saved) {
        try {
          setFavorites(JSON.parse(saved));
        } catch (e) {
          console.error('Error parsing favorites:', e);
          setFavorites([]);
        }
      }
    };

    loadFavorites();

    // Listen for storage changes (e.g., from other tabs/components)
    const handleStorageChange = (e: StorageEvent) => {
      if (e.key === FAVORITES_KEY) {
        loadFavorites();
      }
    };

    window.addEventListener('storage', handleStorageChange);
    return () => window.removeEventListener('storage', handleStorageChange);
  }, []);

  const toggleFavorite = (salonId: string) => {
    const salonIdStr = String(salonId);
    setFavorites((prev) => {
      const newFavorites = prev.includes(salonIdStr)
        ? prev.filter((id) => id !== salonIdStr)
        : [...prev, salonIdStr];
      
      localStorage.setItem(FAVORITES_KEY, JSON.stringify(newFavorites));
      return newFavorites;
    });
  };

  const isFavorite = (salonId: string) => {
    const salonIdStr = String(salonId);
    return favorites.includes(salonIdStr);
  };

  return { favorites, toggleFavorite, isFavorite };
}

