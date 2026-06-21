import api from "./axios.js";

export const usersApi = {
  list: (filters) => api.get("/users", { params: filters }),
  getOne: (id) => api.get(`/users/${id}`),
  create: (data) => api.post("/users", data),
};
