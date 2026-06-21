import api from "./axios.js";

export const ratingsApi = {
  myStores: (params) => api.get("/ratings/my-stores", { params }),
  getMyRating: (storeId) => api.get(`/ratings/${storeId}/my-rating`),
  submit: (storeId, value) => api.post(`/ratings/${storeId}`, { value }),
  update: (storeId, value) => api.patch(`/ratings/${storeId}`, { value }),
};
