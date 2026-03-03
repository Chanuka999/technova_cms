const rawApiUrl = (import.meta.env.VITE_API_URL || "").trim();

const trimmedApiUrl = rawApiUrl.replace(/\/+$/, "");

export const API_BASE_URL = trimmedApiUrl
  ? trimmedApiUrl.endsWith("/api")
    ? trimmedApiUrl
    : `${trimmedApiUrl}/api`
  : "/api";
