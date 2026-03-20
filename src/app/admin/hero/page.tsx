import {
  isHeroDatabaseConfigured,
  loadSiteHeroForAdmin,
} from "@/lib/hero-server";

import { HeroAdminClient } from "./hero-admin-client";

export const dynamic = "force-dynamic";

export default async function AdminHeroPage() {
  const dbConfigured = isHeroDatabaseConfigured();
  const { content, fromDatabase, error } = await loadSiteHeroForAdmin();

  return (
    <HeroAdminClient
      content={content}
      fromDatabase={fromDatabase}
      loadError={error}
      dbConfigured={dbConfigured}
    />
  );
}
