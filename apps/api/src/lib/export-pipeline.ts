import type { ExportFile } from "@complib/export-engine";
import { runExportPipeline } from "@complib/export-engine";

/** Run export validation/formatting on scaffold output before ZIP delivery. */
export function validateScaffoldFiles(
  framework: "vanilla" | "react" | "vue",
  files: ExportFile[],
) {
  return runExportPipeline({ framework, files });
}
