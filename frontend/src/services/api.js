import axios from "axios";
import { getToken } from "./auth";

const API = axios.create({
  baseURL: "http://localhost:5000/api", // backend base URL
});

// Attach token to every request if present
API.interceptors.request.use((config) => {
  const token = getToken();
  if (token) {
    config.headers = config.headers || {};
    config.headers.Authorization = `Bearer ${token}`;
  }
  return config;
});

export default API;
