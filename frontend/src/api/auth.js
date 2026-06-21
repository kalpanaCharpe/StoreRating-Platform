import api from "./axios.js";

export const authApi = {
  register: (data) => api.post("/auth/register", data),
  login: (email, password) => api.post("/auth/login", { email, password }),
  me: () => api.get("/auth/me"),
  changePassword: (currentPassword, newPassword) =>
    api.patch("/auth/change-password", { currentPassword, newPassword }),
};
