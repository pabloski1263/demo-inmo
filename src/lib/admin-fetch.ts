export async function adminFetch(url: string, options?: RequestInit): Promise<Response> {
  const token = typeof window !== "undefined" ? sessionStorage.getItem("inmo_token") : null;

  const headers: Record<string, string> = { ...(options?.headers as Record<string, string>) };

  if (token) {
    headers["Authorization"] = `Bearer ${token}`;
  }

  if (options?.body && typeof options.body === "string" && !headers["Content-Type"]) {
    headers["Content-Type"] = "application/json";
  }

  const res = await fetch(url, { ...options, headers });

  if (res.status === 401) {
    sessionStorage.removeItem("inmo_token");
    if (typeof window !== "undefined" && !window.location.pathname.startsWith("/admin/login")) {
      window.location.href = "/admin/login";
    }
  }

  return res;
}
