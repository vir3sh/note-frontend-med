const BASE = import.meta.env.VITE_API_URL || "http://localhost:5000";
const TOKEN_KEY = "token";

export const getToken = () => localStorage.getItem(TOKEN_KEY);
export const setToken = (t) => (t ? localStorage.setItem(TOKEN_KEY, t) : localStorage.removeItem(TOKEN_KEY));

async function request(path, options = {}) {
  const token = getToken();
  const res = await fetch(`${BASE}${path}`, {
    ...options,
    headers: {
      "Content-Type": "application/json",
      ...(token && { Authorization: `Bearer ${token}` }),
    },
  });
  if (res.status === 204) return null;

  const body = await res.json().catch(() => ({}));
  if (!res.ok) {
    // Token rejected -> tell AuthContext to log the user out
    if (res.status === 401 && token) {
      setToken(null);
      window.dispatchEvent(new Event("auth:expired"));
    }
    throw new Error(body?.error?.message || "Something went wrong");
  }
  return body;
}

export const api = {
  // auth
  signup: (input) => request("/auth/signup", { method: "POST", body: JSON.stringify(input) }),
  login: (input) => request("/auth/login", { method: "POST", body: JSON.stringify(input) }),
  me: () => request("/auth/me"),
  // tasks
  list: (filter, page, limit = 5) => {
    const q = new URLSearchParams({ page: String(page), limit: String(limit) });
    if (filter !== "all") q.set("status", filter);
    return request(`/tasks?${q}`);
  },
  create: (input) => request("/tasks", { method: "POST", body: JSON.stringify(input) }),
  complete: (id) => request(`/tasks/${id}`, { method: "PATCH", body: JSON.stringify({ status: "completed" }) }),
  remove: (id) => request(`/tasks/${id}`, { method: "DELETE" }),
};
