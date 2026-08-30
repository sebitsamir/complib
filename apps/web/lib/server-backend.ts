import { auth } from "@clerk/nextjs/server";

const DEFAULT_BACKEND = "http://127.0.0.1:5000";

export function backendBase(): string {
  return (process.env.COMPLIB_BACKEND_URL ?? DEFAULT_BACKEND).replace(/\/$/, "");
}

/** Server-side fetch to the Express API with Clerk session token when signed in. */
export async function backendFetch(
  path: string,
  init: RequestInit = {},
): Promise<Response> {
  const headers = new Headers(init.headers);
  if (!headers.has("content-type") && init.body) {
    headers.set("content-type", "application/json");
  }

  try {
    const { getToken } = await auth();
    const token = await getToken();
    if (token) {
      headers.set("authorization", `Bearer ${token}`);
    }
  } catch {
    // Clerk disabled in dev — unauthenticated request.
  }

  return fetch(`${backendBase()}${path}`, {
    ...init,
    headers,
    cache: "no-store",
  });
}
