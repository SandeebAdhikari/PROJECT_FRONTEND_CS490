import { API_ENDPOINTS, API_BASE_URL } from "./config";

export const GalleryAPI = {
  list: async (salonId: string, token?: string) => {
    const res = await fetch(API_ENDPOINTS.PHOTOS.LIST(salonId), {
      credentials: "include",
      headers: token ? { Authorization: `Bearer ${token}` } : {},
    });
    return res;
  },

  add: async (salonId: string, file: File, caption: string, token: string) => {
    const formData = new FormData();
    formData.append("photo", file);
    formData.append("salon_id", salonId);
    if (caption) formData.append("caption", caption);

    const res = await fetch(API_ENDPOINTS.PHOTOS.ADD_SALON, {
      method: "POST",
      headers: {
        Authorization: `Bearer ${token}`,
      },
      body: formData,
      credentials: "include",
    });

    return res;
  },

  delete: async (photoId: number, token: string) => {
    const res = await fetch(API_ENDPOINTS.PHOTOS.DELETE_SALON(photoId), {
      method: "DELETE",
      headers: {
        Authorization: `Bearer ${token}`,
      },
      credentials: "include",
    });

    return res;
  },

  imageUrl: (relativePath: string) => `${API_BASE_URL}${relativePath}`,
};
