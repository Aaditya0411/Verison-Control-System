const API_URL = import.meta.env.VITE_API_URL || "/api";

async function request(path, options = {}) {
  const response = await fetch(`${API_URL}${path}`, {
    ...options,
    headers: { 
      "Content-Type": "application/json", 
      "Bypass-Tunnel-Reminder": "true", 
      ...(localStorage.getItem("token") ? { Authorization: `Bearer ${localStorage.getItem("token")}` } : {}), 
      ...options.headers 
    },
  });
  const data = await response.json().catch(() => ({}));
  if (!response.ok) throw new Error(data.message || data.error || "Something went wrong. Please try again.");
  return data;
}

export const api = {
  get: (path) => request(path), post: (path, body) => request(path, { method: "POST", body: JSON.stringify(body) }),
  put: (path, body) => request(path, { method: "PUT", body: JSON.stringify(body) }), patch: (path, body = {}) => request(path, { method: "PATCH", body: JSON.stringify(body) }), delete: (path) => request(path, { method: "DELETE" }),
};
