export const API_BASE_URL = "http://localhost:4000"; // Backend base URL

interface ApiOptions {
  method?: string;
  body?: any;
  token?: string | null;
  headers?: Record<string, string>;
}

export async function apiFetch<T = any>(path: string, { method = "GET", body, token, headers = {} }: ApiOptions = {}) {
  const res = await fetch(`${API_BASE_URL}${path}`, {
    method,
    headers: {
      "Content-Type": "application/json",
      ...(token ? { Authorization: `Bearer ${token}` } : {}),
      ...headers,
    },
    credentials: "include", // allows HttpOnly cookie-based sessions too
    body: body ? JSON.stringify(body) : undefined,
  });

  const text = await res.text();
  const data = text ? JSON.parse(text) : null;
  if (!res.ok) {
    const message = (data && (data.message || data.error)) || `Request failed: ${res.status}`;
    throw new Error(message);
  }
  return data as T;
}

export type PasswordRecord = {
  id: string;
  accountName: string;
  username: string;
};

// Auth
export const apiRegister = (payload: { username: string; email: string; password: string }) =>
  apiFetch<{ message: string }>("/auth/register", { method: "POST", body: payload });

export const apiLogin = (payload: { email: string; password: string }) =>
  apiFetch<{ token: string }>("/auth/login", { method: "POST", body: payload });

// Passwords
export const apiGetPasswords = (token: string) =>
  apiFetch<PasswordRecord[]>("/password", { token });

export const apiAddPassword = (
  token: string,
  payload: { accountName: string; username: string; password: string }
) => apiFetch<PasswordRecord>("/password", { method: "POST", body: payload, token });

export const apiUpdatePassword = (
  token: string,
  id: string,
  payload: Partial<{ accountName: string; username: string; password: string }>
) => apiFetch<PasswordRecord>(`/password/${id}`, { method: "PUT", body: payload, token });

export const apiDeletePassword = (token: string, id: string) =>
  apiFetch<{ success: boolean }>(`/password/${id}`, { method: "DELETE", token });

export const apiRevealPassword = (token: string, id: string) =>
  apiFetch<{ password: string }>(`/password/${id}/reveal`, { method: "POST", token });
