import { NextRequest } from "next/server";
import { proxyToBackend } from "@/lib/backend-proxy";

type Params = { params: Promise<{ slug: string }> };

export async function GET(request: NextRequest, { params }: Params) {
  const { slug } = await params;
  return proxyToBackend(request, `/api/components/${encodeURIComponent(slug)}/edit`);
}
