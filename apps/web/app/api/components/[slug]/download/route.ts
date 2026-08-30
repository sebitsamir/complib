import { proxyToBackend } from "@/lib/backend-proxy";

export async function GET(
  request: Request,
  context: { params: Promise<{ slug: string }> },
) {
  const { slug } = await context.params;
  return proxyToBackend(
    request,
    `/api/components/${encodeURIComponent(slug)}/download`,
  );
}

export async function POST(
  request: Request,
  context: { params: Promise<{ slug: string }> },
) {
  const { slug } = await context.params;
  return proxyToBackend(
    request,
    `/api/components/${encodeURIComponent(slug)}/download`,
  );
}
