const DEFAULT_BACKEND = "http://127.0.0.1:5000";

function backendBase(): string {
  return (process.env.COMPLIB_BACKEND_URL ?? DEFAULT_BACKEND).replace(/\/$/, "");
}

/** Forwards a Next.js /api request to the Express backend (cookies + body preserved). */
export async function proxyToBackend(
  request: Request,
  backendPath: string,
): Promise<Response> {
  const incoming = new URL(request.url);
  const target = new URL(backendPath, `${backendBase()}/`);
  target.search = incoming.search;

  const headers = new Headers();
  const contentType = request.headers.get("content-type");
  if (contentType) headers.set("content-type", contentType);
  const cookie = request.headers.get("cookie");
  if (cookie) headers.set("cookie", cookie);
  const authorization = request.headers.get("authorization");
  if (authorization) headers.set("authorization", authorization);

  const init: RequestInit = {
    method: request.method,
    headers,
    cache: "no-store",
  };

  if (request.method !== "GET" && request.method !== "HEAD") {
    init.body = await request.arrayBuffer();
  }

  const upstream = await fetch(target.toString(), init);
  const responseHeaders = new Headers();
  const zipType = upstream.headers.get("content-type");
  if (zipType) responseHeaders.set("content-type", zipType);
  const disposition = upstream.headers.get("content-disposition");
  if (disposition) responseHeaders.set("content-disposition", disposition);
  const cacheControl = upstream.headers.get("cache-control");
  if (cacheControl) responseHeaders.set("cache-control", cacheControl);

  return new Response(upstream.body, {
    status: upstream.status,
    headers: responseHeaders,
  });
}
