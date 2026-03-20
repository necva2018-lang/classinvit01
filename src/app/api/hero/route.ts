import { handleSiteHeroGet, handleSiteHeroUpsert } from "@/lib/hero-server";

export const dynamic = "force-dynamic";

export async function GET() {
  return handleSiteHeroGet();
}

export async function PUT(req: Request) {
  return handleSiteHeroUpsert(req);
}

export async function POST(req: Request) {
  return handleSiteHeroUpsert(req);
}
