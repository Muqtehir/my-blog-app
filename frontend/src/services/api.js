const api = {
  base: "/api",
};

function getToken() {
  return localStorage.getItem("token");
}

async function request(path, options = {}) {
  const headers = options.headers || {};
  headers["Content-Type"] = "application/json";
  const token = getToken();
  if (token) headers["Authorization"] = `Bearer ${token}`;

  const res = await fetch(`${api.base}${path}`, {
    ...options,
    headers,
  });

  const data = await res.json().catch(() => null);
  if (!res.ok) {
    const err = data && data.message ? data.message : res.statusText;
    throw new Error(err || "Request failed");
  }
  return data;
}

export const apiGet = (path) => request(path, { method: "GET" });
export const apiPost = (path, body) =>
  request(path, { method: "POST", body: JSON.stringify(body) });
export const apiPut = (path, body) =>
  request(path, { method: "PUT", body: JSON.stringify(body) });
export const apiDelete = (path) => request(path, { method: "DELETE" });

export default api;
