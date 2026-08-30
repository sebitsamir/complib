import type { CatalogComponentDef } from "@/lib/catalog/shared";
import { PATTERN_COMPONENTS } from "@/lib/catalog/patterns";
import { HERO } from "@/lib/catalog/sections/hero";
import { FEATURES } from "@/lib/catalog/sections/features";
import { SOCIAL_PROOF } from "@/lib/catalog/sections/social-proof";
import { SAAS } from "@/lib/catalog/templates/saas";
import { DASHBOARD } from "@/lib/catalog/templates/dashboard";
import { COMMERCE } from "@/lib/catalog/templates/commerce";
import { MARKETING } from "@/lib/catalog/templates/marketing";
import { CONTENT } from "@/lib/catalog/templates/content";

export const SECTION_COMPONENTS: CatalogComponentDef[] = [
  ...HERO,
  ...FEATURES,
  ...SOCIAL_PROOF,
];

export const TEMPLATE_COMPONENTS: CatalogComponentDef[] = [
  ...SAAS,
  ...DASHBOARD,
  ...COMMERCE,
  ...MARKETING,
  ...CONTENT,
];

export const ALL_CATALOG_COMPONENTS: CatalogComponentDef[] = [
  ...PATTERN_COMPONENTS,
  ...SECTION_COMPONENTS,
  ...TEMPLATE_COMPONENTS,
];
