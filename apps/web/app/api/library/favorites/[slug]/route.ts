import { proxyToBackend } from "@/lib/backend-proxy";

type RouteContext = { params: Promise<{ slug: string }> };

export async function POST(request: Request, context: RouteContext) {
  const { slug } = await context.params;
  return proxyToBackend(request, `/api/library/favorites/${encodeURIComponent(slug)}`);
}

export async function DELETE(request: Request, context: RouteContext) {
  const { slug } = await context.params;
  return proxyToBackend(request, `/api/library/favorites/${encodeURIComponent(slug)}`);
}
