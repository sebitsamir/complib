import path from "node:path";
import type { ComponentDiskBundle, StyleVariantConfig } from "./component-fs";

export type VariantManifestFiles = {
  html: string;
  css: string;
  js: string;
};

export type VariantManifestSupports = {
  darkMode: boolean;
  resizable: boolean;
  draggable: boolean;
  frameworks: Array<"vanilla" | "react" | "vue">;
};

export type VariantManifest = StyleVariantConfig & {
  component: string;
  variant: string;
  files: VariantManifestFiles;
  supports: VariantManifestSupports;
};

export function buildVariantManifest(
  bundle: Pick<ComponentDiskBundle, "slug" | "json">,
  styleId: string,
  label: string,
): VariantManifest {
  const themes = bundle.json.themes ?? ["light", "dark", "auto"];
  return {
    id: styleId,
    label,
    component: bundle.slug,
    variant: styleId,
    description: bundle.json.description,
    themes,
    files: {
      html: "html/index.html",
      css: "html/style.css",
      js: "html/script.js",
    },
    supports: {
      darkMode: themes.includes("dark") || themes.includes("auto"),
      resizable: bundle.json.layer === "primitives" || bundle.json.layer === "patterns",
      draggable: true,
      frameworks: ["vanilla", "react", "vue"],
    },
  };
}

export function relativeComponentPath(absoluteDir: string, componentsRoot: string): string {
  return path
    .relative(componentsRoot, absoluteDir)
    .split(path.sep)
    .join("/");
}

export function relativeVariantPath(componentRelativePath: string, styleId: string): string {
  return `${componentRelativePath}/variants/${styleId}`;
}

export function normalizeSearchText(parts: Array<string | undefined | null>): string {
  return parts
    .filter((part): part is string => typeof part === "string" && part.trim().length > 0)
    .join(" ")
    .toLowerCase()
    .replace(/\s+/g, " ")
    .trim();
}

export function slugifyTag(value: string): string {
  return value
    .trim()
    .toLowerCase()
    .replace(/\s+/g, "-")
    .replace(/[^a-z0-9_-]/g, "");
}

export function titleCaseTag(value: string): string {
  return value
    .replace(/[-_]+/g, " ")
    .replace(/\s+/g, " ")
    .trim()
    .replace(/\b\w/g, (match) => match.toUpperCase());
}
