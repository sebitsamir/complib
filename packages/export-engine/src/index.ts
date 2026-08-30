export const EXPORT_FRAMEWORKS = ["vanilla", "react", "vue"] as const;
export type ExportFramework = (typeof EXPORT_FRAMEWORKS)[number];

export const SCAFFOLD_TARGETS = [
  "vanilla",
  "vite-react",
  "vite-vue",
  "next-app",
] as const;
export type ScaffoldTarget = (typeof SCAFFOLD_TARGETS)[number];

export type ExportFile = {
  path: string;
  contents: string;
};

export function isExportFramework(value: string): value is ExportFramework {
  return (EXPORT_FRAMEWORKS as readonly string[]).includes(value);
}

export function isScaffoldTarget(value: string): value is ScaffoldTarget {
  return (SCAFFOLD_TARGETS as readonly string[]).includes(value);
}
