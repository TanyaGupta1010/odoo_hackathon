import axios from "axios";

import { getToken } from "../utils/user";

const API = "http://localhost:5001/api";

/** fetch wrapper that attaches the stored JWT and parses JSON. */
export async function apiFetch(path: string, options: RequestInit = {}) {
  const token = getToken();
  const res = await fetch(`${API}${path}`, {
    ...options,
    headers: {
      "Content-Type": "application/json",
      ...(token ? { Authorization: `Bearer ${token}` } : {}),
      ...options.headers,
    },
  });
  return res.json();
}

/** axios instance for components that use axios (attaches the JWT per request). */
export const api = axios.create({ baseURL: API });

api.interceptors.request.use((config) => {
  const token = getToken();
  if (token) config.headers.Authorization = `Bearer ${token}`;
  return config;
});
