
export const API_CONFIG = {
  BASE_URL:
    import.meta.env.VITE_API_BASE_URL ||
    "http://localhost:5001/api/v1/",
  TIMEOUT: 1200000,
  HEADERS: {
    "Content-Type": "application/json",
    Accept: "application/json",
  },
} as const;

export const APP_ENV = import.meta.env.VITE_APP_ENV || "development";
export const isDevelopment = import.meta.env.DEV;
export const isProduction = import.meta.env.PROD;

if (import.meta.env.DEV) {
  console.log("🔧 API Config:", {
    BASE_URL: API_CONFIG.BASE_URL,
    ENV: APP_ENV,
    MODE: import.meta.env.MODE,
  });
}
