import { proxyToBackend } from "@/lib/backend-proxy";

type Params = { params: Promise<{ slug: string }> };

export async function POST(request: Request, { params }: Params) {
  const { slug } = await params;
  return proxyToBackend(request, `/api/library/collections/${encodeURIComponent(slug)}/items`);
}
