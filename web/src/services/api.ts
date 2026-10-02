
const API_URL = "http://127.0.0.1:8000";

export async function apiRequest<T>(
  path: string,
  options: RequestInit = {},
  token?: string | null
): Promise<T> {
  const headers = new Headers(options.headers);

  if (options.body && !headers.has("Content-Type")) {
    headers.set("Content-Type", "application/json");
  }

  if (token) {
    headers.set("Authorization", `Bearer ${token}`);
  }

  const response = await fetch(`${API_URL}${path}`, {
    ...options,
    headers,
  });

  if (!response.ok) {
    const errorData = await response.json().catch(() => null);
    const detail = errorData?.detail;

    const message = Array.isArray(detail)
      ? detail.map((item: { msg?: string }) => item.msg ?? "").join(", ")
      : typeof detail === "string"
        ? detail
        : `Erreur HTTP ${response.status}`;

    throw new Error(message || `Erreur HTTP ${response.status}`);
  }

  if (response.status === 204) {
    return undefined as T;
  }

  return response.json() as Promise<T>;
}