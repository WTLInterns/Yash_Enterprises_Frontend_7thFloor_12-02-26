export function createApiClient({ baseUrl = "" } = {}) {
  async function get(path) {
    const res = await fetch(baseUrl + path, {
      method: "GET",
      headers: {
        Accept: "application/json",
      },
    });

    if (!res.ok) {
      const text = await res.text().catch(() => "");
      throw new Error(`Request failed (${res.status}): ${text || res.statusText}`);
    }

    return res.json();
  }

  return { get };
}

export function delay(ms) {
  return new Promise((resolve) => setTimeout(resolve, ms));
}
