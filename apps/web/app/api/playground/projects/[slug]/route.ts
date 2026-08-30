import { proxyToBackend } from "@/lib/backend-proxy";

type Params = { params: Promise<{ slug: string }> };

export async function GET(request: Request, { params }: Params) {
  const { slug } = await params;
  return proxyToBackend(request, `/api/playground/projects/${encodeURIComponent(slug)}`);
}

export async function PUT(request: Request, { params }: Params) {
  const { slug } = await params;
  return proxyToBackend(request, `/api/playground/projects/${encodeURIComponent(slug)}`);
}

export async function DELETE(request: Request, { params }: Params) {
  const { slug } = await params;
  return proxyToBackend(request, `/api/playground/projects/${encodeURIComponent(slug)}`);
}
