export function createApiClient({ baseUrl = "" } = {}) {
  async function request(path, { method = "GET", body } = {}) {
    const res = await fetch(baseUrl + path, {
      method,
      headers: {
        Accept: "application/json",
        "Content-Type": body ? "application/json" : undefined,
      },
      body: body ? JSON.stringify(body) : undefined,
    });

    if (!res.ok) {
      const text = await res.text().catch(() => "");
      throw new Error(`Request failed (${res.status}): ${text || res.statusText}`);
    }

    const contentType = res.headers.get("content-type") || "";
    if (contentType.includes("application/json")) {
      return res.json();
    }

    const text = await res.text().catch(() => "");
    throw new Error(`Expected JSON but received: ${contentType || "unknown"}. Body: ${text}`);
  }

  function get(path) {
    return request(path, { method: "GET" });
  }

  function post(path, body) {
    return request(path, { method: "POST", body });
  }

  function put(path, body) {
    return request(path, { method: "PUT", body });
  }

  function del(path) {
    return request(path, { method: "DELETE" });
  }

  return { get, post, put, delete: del };
}

export const backendApi = createApiClient({ baseUrl: "http://localhost:8080/api" });

export function delay(ms) {
  return new Promise((resolve) => setTimeout(resolve, ms));
}
