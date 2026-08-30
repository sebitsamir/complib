import type { CatalogComponentDef } from "@/lib/catalog/shared";
import { CARDS } from "./cards";
import { DATA } from "./data";
import { FEEDBACK } from "./feedback";
import { FORMS } from "./forms";
import { NAVIGATION } from "./navigation";

export const PATTERN_COMPONENTS: CatalogComponentDef[] = [
  ...CARDS,
  ...FORMS,
  ...NAVIGATION,
  ...DATA,
  ...FEEDBACK,
];
