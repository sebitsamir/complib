import type { Phase1PrimitiveDef } from "./shared";
import { LAYOUT } from "./layout";
import { TYPOGRAPHY } from "./typography";
import { INPUTS } from "./inputs";
import { DATA_DISPLAY } from "./data-display";
import { UTILITY } from "./utility";

export {
  buildManifest,
  buildStyleVariants,
  defaultDimensions,
} from "./shared";

/** Full Phase-1 primitive catalog (50). */
export const PHASE1_PRIMITIVES: Phase1PrimitiveDef[] = [
  ...LAYOUT,
  ...TYPOGRAPHY,
  ...INPUTS,
  ...DATA_DISPLAY,
  ...UTILITY,
];

export function assertPhase1Count(): number {
  return PHASE1_PRIMITIVES.length;
}
