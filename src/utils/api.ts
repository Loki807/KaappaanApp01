import axios from "axios";
import * as SecureStore from "expo-secure-store";

export const BASE_URL = "https://kaappaan-api-d7gmdnf3csf6ahd9.centralindia-01.azurewebsites.net/api";

const api = axios.create({
  baseURL: BASE_URL,
  headers: { "Content-Type": "application/json" },
});

// ⭐ Automatically attach token for secure requests
api.interceptors.request.use(async (config) => {
  const token = await SecureStore.getItemAsync("token");
  if (token) config.headers.Authorization = `Bearer ${token}`;
  return config;
});

export default api;
