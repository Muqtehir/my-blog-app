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

  // Try to parse JSON body (if any)
  const data = await res.json().catch(() => null);

  // Global handling for unauthorized
  if (res.status === 401) {
    // Clear token and notify app to logout
    try {
      localStorage.removeItem("token");
    } catch (e) {}
    // dispatch a custom event so context/providers can react in this tab
    try {
      window.dispatchEvent(new CustomEvent("auth:logout"));
    } catch (e) {}
    // redirect to login
    try {
      window.location.hash = "#/login";
    } catch (e) {}
    const errMsg = (data && data.message) || "Not authorized";
    throw new Error(errMsg);
  }

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
