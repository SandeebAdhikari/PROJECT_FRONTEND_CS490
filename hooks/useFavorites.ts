import { useState, useEffect } from 'react';

export function useFavorites() {
  const [favorites, setFavorites] = useState<string[]>([]);

  useEffect(() => {
    const saved = localStorage.getItem('favorites');
    if (saved) {
      setFavorites(JSON.parse(saved));
    }
  }, []);

  const toggleFavorite = (salonId: string) => {
    setFavorites((prev) => {
      const newFavorites = prev.includes(salonId)
        ? prev.filter((id) => id !== salonId)
        : [...prev, salonId];
      
      localStorage.setItem('favorites', JSON.stringify(newFavorites));
      return newFavorites;
    });
  };

  const isFavorite = (salonId: string) => favorites.includes(salonId);

  return { favorites, toggleFavorite, isFavorite };
}

