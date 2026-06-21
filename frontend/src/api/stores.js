import api from "./axios.js";

export const storesApi = {
  list: (params) => api.get("/stores", { params }),
  getOne: (id) => api.get(`/stores/${id}`),
  create: (data) => api.post("/stores", data),
  update: (id, data) => api.patch(`/stores/${id}`, data),
  delete: (id) => api.delete(`/stores/${id}`),
  ownerDashboard: () => api.get("/stores/owner/dashboard"),
};
