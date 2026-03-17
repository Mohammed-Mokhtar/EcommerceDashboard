// Helper utilities for API error handling and auth token parsing.

export function getApiErrorMessage(error) {
  if (!error) return "Unknown error";

  // Axios error response
  const resp = error.response;
  if (resp) {
    const data = resp.data;
    if (typeof data === "string") return data;
    if (data?.message) return data.message;
    if (data?.err) return data.err;
    if (data?.error) return data.error;
    if (resp.status) return `Request failed (${resp.status})`;
  }

  // Fallback to generic error message
  return error.message || "Unknown error";
}

export function getUserRoleFromToken(token) {
  if (!token) return null;
  const parts = token.split(".");
  if (parts.length !== 3) return null;

  try {
    const payload = JSON.parse(
      atob(parts[1].replace(/-/g, "+").replace(/_/g, "/")),
    );
    return payload?.role || null;
  } catch {
    return null;
  }
}
