/**
 * Axios instance with base URL and Bearer token interceptor.
 * Token is read from localStorage (user: auth_token, admin: admin_token).
 */

const getBaseURL = () => typeof window !== "undefined" && process.env.NEXT_PUBLIC_API_URL
  ? process.env.NEXT_PUBLIC_API_URL
  : "";

async function getClient(isAdmin = false) {
  const { default: axios } = await import("axios");
  const tokenKey = isAdmin ? "admin_token" : "auth_token";
  const token = typeof window !== "undefined" ? localStorage.getItem(tokenKey) : null;

  const client = axios.create({
    baseURL: getBaseURL() ? `${getBaseURL()}/api` : "/api",
    headers: {
      "Content-Type": "application/json",
      ...(token ? { Authorization: `Bearer ${token}` } : {}),
    },
  });

  client.interceptors.response.use(
    (res) => res,
    (err) => {
      if (err.response?.status === 401 && typeof window !== "undefined") {
        const url = window.location.pathname || "";
        if (isAdmin && !url.includes("/admin/login")) {
          localStorage.removeItem("admin_token");
          localStorage.removeItem("admin");
          window.location.href = "/admin/login";
        } else if (!isAdmin && !url.includes("/login") && !url.includes("/signup")) {
          localStorage.removeItem("auth_token");
          localStorage.removeItem("current_user");
          window.location.href = "/login";
        }
      }
      return Promise.reject(err);
    }
  );
  return client;
}

export { getClient, getBaseURL };
