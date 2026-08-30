import { proxyToBackend } from "@/lib/backend-proxy";

type Params = { params: Promise<{ slug: string }> };

export async function GET(request: Request, { params }: Params) {
  const { slug } = await params;
  return proxyToBackend(request, `/api/registry/${encodeURIComponent(slug)}`);
}
