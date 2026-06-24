import axios from "axios";

const API_BASE_URL = import.meta.env.VITE_API_BASE_URL || "http://localhost:5001/api";

const api = axios.create({
  baseURL: API_BASE_URL,
  headers: {
    "Content-Type": "application/json"
  }
});

// Inject auth token dynamically
api.interceptors.request.use(
  (config) => {
    const token = localStorage.getItem("token");
    if (token && config.headers) {
      config.headers.Authorization = `Bearer ${token}`;
    }
    return config;
  },
  (error) => {
    return Promise.reject(error);
  }
);

// Auto-retry on network issues or gateway/server errors (e.g., Render spin-up delays)
api.interceptors.response.use(
  (response) => response,
  async (error) => {
    const config = error.config;
    
    // If it's a GET request and failed due to network/server errors, retry
    if (config && config.method === "get" && (!error.response || [502, 503, 504].includes(error.response.status))) {
      config.retry = config.retry ?? 3;
      config.retryCount = config.retryCount ?? 0;
      
      if (config.retryCount < config.retry) {
        config.retryCount += 1;
        // Wait with backoff: 1.5s, 3.0s, 4.5s
        await new Promise((resolve) => setTimeout(resolve, config.retryCount * 1500));
        return api(config);
      }
    }
    return Promise.reject(error);
  }
);

export default api;
