import type { ComponentVariant } from "@/lib/component-fs";
import type { LibraryStyleOption } from "@/lib/variant-utils";

export type BuilderCatalogItem = {
  slug: string;
  name: string;
  category: string;
  layer: string;
  tier: "FREE" | "PRO" | "ENTERPRISE";
  variants?: ComponentVariant[];
};

export type PaletteDragPayload = {
  slug: string;
  style: LibraryStyleOption;
};
