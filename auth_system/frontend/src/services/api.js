import axios from "axios";

// Different base URLs for different operations
const AUTH_API_BASE_URL =
  import.meta.env.VITE_AUTH_API_URL || "http://localhost:8000/api";
const USER_API_BASE_URL =
  import.meta.env.VITE_USER_API_URL || "http://localhost:6000/api";

console.log("Auth API Base URL:", AUTH_API_BASE_URL);
console.log("User API Base URL:", USER_API_BASE_URL);

// Create axios instance for auth operations
const authApi = axios.create({
  baseURL: AUTH_API_BASE_URL,
  headers: {
    "Content-Type": "application/json",
  },
  timeout: 10000,
  withCredentials: false,
});

// Create axios instance for user operations
const userApi = axios.create({
  baseURL: USER_API_BASE_URL,
  headers: {
    "Content-Type": "application/json",
  },
  timeout: 10000,
  withCredentials: false,
});

// Add request interceptor for auth API
authApi.interceptors.request.use(
  (config) => {
    console.log("Auth API Request:", {
      method: config.method?.toUpperCase(),
      url: config.url,
      baseURL: config.baseURL,
      fullURL: `${config.baseURL}${config.url}`,
      data: config.data,
    });

    const token = localStorage.getItem("token");
    if (token) {
      config.headers.Authorization = `Bearer ${token}`;
    }
    return config;
  },
  (error) => {
    console.error("Auth API Request error:", error);
    return Promise.reject(error);
  }
);

// Add request interceptor for user API
userApi.interceptors.request.use(
  (config) => {
    console.log("User API Request:", {
      method: config.method?.toUpperCase(),
      url: config.url,
      baseURL: config.baseURL,
      fullURL: `${config.baseURL}${config.url}`,
      data: config.data,
    });

    const token = localStorage.getItem("token");
    if (token) {
      config.headers.Authorization = `Bearer ${token}`;
    }
    return config;
  },
  (error) => {
    console.error("User API Request error:", error);
    return Promise.reject(error);
  }
);

// Add response interceptors
const handleResponse = (response) => {
  console.log("API Response:", {
    status: response.status,
    data: response.data,
    url: response.config.url,
  });
  return response;
};

const handleError = (error) => {
  console.error("API Error:", {
    message: error.message,
    status: error.response?.status,
    data: error.response?.data,
    url: error.config?.url,
    code: error.code,
  });

  if (error.response?.status === 401) {
    localStorage.removeItem("token");
    window.location.href = "/login";
  }
  return Promise.reject(error);
};

authApi.interceptors.response.use(handleResponse, handleError);
userApi.interceptors.response.use(handleResponse, handleError);

// Auth API endpoints
export const authAPI = {
  signup: (data) => authApi.post("/auth/signup", data),
  login: (data) => authApi.post("/auth/login", data),
  forgotPassword: (data) => authApi.post("/auth/forgot-password", data),
  verifyOtp: (data) => authApi.post("/auth/verify-otp", data),
  resetPassword: (data) => authApi.post("/auth/reset-password", data),
  getProfile: () => authApi.get("/user/profile"),
  updateProfile: (data) => userApi.put("/user/profile", data),
};

export default authApi;
