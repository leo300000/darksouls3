import { completionManifest } from "@/lib/completion";

export const dynamic = "force-static";

export function GET() {
  return Response.json(completionManifest(), { headers: { "Cache-Control": "public, max-age=3600" } });
}
