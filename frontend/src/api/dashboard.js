import api from "./axios.js";

export const dashboardApi = {
  stats: () => api.get("/dashboard"),
};
