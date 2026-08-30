import fs from "node:fs/promises";
import path from "node:path";
import { compileComponentForExport } from "./component-export";
import {
  GENERATED_ROOT,
  readComponentBundleFromDisk,
  type ComponentDiskBundle,
} from "./component-fs";
import { generateFrameworkBundles } from "./framework-codegen";
import { resolveInstanceVariantProps, type VariantQuery } from "./variant-props";

export type ComponentFramework = "vanilla" | "react" | "vue";

async function exists(filePath: string) {
  try {
    await fs.access(filePath);
    return true;
  } catch {
    return false;
  }
}

export function parseFramework(value?: string | null): ComponentFramework {
  if (value === "react" || value === "vue") return value;
  return "vanilla";
}

async function writeFileMap(dir: string, files: Record<string, string>) {
  await fs.mkdir(dir, { recursive: true });
  for (const [rel, content] of Object.entries(files)) {
    const target = path.join(dir, rel);
    await fs.mkdir(path.dirname(target), { recursive: true });
    await fs.writeFile(target, content, "utf8");
  }
}

async function writeVanillaBundle(bundle: ComponentDiskBundle) {
  const vanillaDir = path.join(GENERATED_ROOT, "vanilla", bundle.slug);
  await fs.mkdir(vanillaDir, { recursive: true });

  await fs.writeFile(path.join(vanillaDir, "vanilla.html"), bundle.html, "utf8");
  await fs.writeFile(path.join(vanillaDir, "vanilla.css"), bundle.css, "utf8");
  await fs.writeFile(path.join(vanillaDir, "runtime.js"), bundle.runtime, "utf8");
  await fs.writeFile(
    path.join(vanillaDir, "index.html"),
    `<!doctype html>
<html lang="en">
<head>
  <meta charset="utf-8" />
  <meta name="viewport" content="width=device-width, initial-scale=1" />
  <title>${bundle.json.name || bundle.slug}</title>
  <link rel="stylesheet" href="./vanilla.css" />
</head>
<body>
  <div id="root">${bundle.html}</div>
  <script type="module">
    import { mount } from "./runtime.js";
    const root = document.getElementById("root");
    mount(root, { instanceId: "${bundle.slug}" });
  </script>
</body>
</html>
`,
    "utf8",
  );
}

async function writeOutputs(bundle: ComponentDiskBundle) {
  const { react, vue } = generateFrameworkBundles(bundle);
  await writeVanillaBundle(bundle);
  await writeFileMap(path.join(GENERATED_ROOT, "react", bundle.slug), react);
  await writeFileMap(path.join(GENERATED_ROOT, "vue", bundle.slug), vue);

  // Legacy filenames for older downloads / previews
  await fs.writeFile(
    path.join(GENERATED_ROOT, "react", bundle.slug, "vanilla.css"),
    bundle.css,
    "utf8",
  );
  await fs.writeFile(
    path.join(GENERATED_ROOT, "vue", bundle.slug, "vanilla.css"),
    bundle.css,
    "utf8",
  );
  if (react["runtime.ts"]) {
    await fs.writeFile(
      path.join(GENERATED_ROOT, "react", bundle.slug, "runtime.js"),
      react["runtime.ts"],
      "utf8",
    );
    await fs.writeFile(
      path.join(GENERATED_ROOT, "vue", bundle.slug, "runtime.js"),
      react["runtime.ts"],
      "utf8",
    );
  }
}

export async function ensureGeneratedBundle(slug: string) {
  const bundle = await readComponentBundleFromDisk(slug);
  if (!bundle) return false;
  await writeOutputs(bundle);
  return true;
}

async function collectFiles(dir: string, prefix = ""): Promise<Record<string, string>> {
  const entries = await fs.readdir(dir, { withFileTypes: true });
  const out: Record<string, string> = {};
  for (const entry of entries) {
    const abs = path.join(dir, entry.name);
    const rel = prefix ? `${prefix}/${entry.name}` : entry.name;
    if (entry.isDirectory()) {
      const nested = await collectFiles(abs, rel);
      Object.assign(out, nested);
    } else {
      out[rel] = await fs.readFile(abs, "utf8");
    }
  }
  return out;
}

export async function getGeneratedBundleFiles(
  slug: string,
  framework: ComponentFramework,
): Promise<Record<string, string> | null> {
  const dir = path.join(GENERATED_ROOT, framework, slug);
  if (!(await exists(dir))) return null;
  return collectFiles(dir);
}

function variantQueryToProps(query: VariantQuery = {}): Record<string, string> {
  const props: Record<string, string> = {};
  for (const key of ["size", "tone", "density", "radius", "emphasis"] as const) {
    const value = query[key];
    if (value) props[key] = value;
  }
  return props;
}

export type SourceOverrides = {
  html: string;
  css: string;
  js: string;
};

/** Build download-ready files with variant baked to literal CSS (no token engine). */
export async function buildExportedBundleFiles(
  slug: string,
  framework: ComponentFramework,
  variantQuery: VariantQuery = {},
  sourceOverrides?: SourceOverrides,
): Promise<Record<string, string> | null> {
  const bundle = await readComponentBundleFromDisk(slug);
  if (!bundle) return null;

  const variantProps = resolveInstanceVariantProps(
    bundle.json.variants,
    variantQuery.variant,
    variantQueryToProps(variantQuery),
  );

  const baked = compileComponentForExport({
    html: sourceOverrides?.html ?? bundle.html,
    css: sourceOverrides?.css ?? bundle.css,
    js: sourceOverrides?.js ?? (bundle.runtime || bundle.js),
    variantProps,
  });

  const safe = bundle.slug.replace(/[^a-z0-9-_]/gi, "_") || "component";

  if (framework === "vanilla") {
    return {
      [`${safe}.html`]: baked.html,
      [`${safe}.css`]: baked.css,
      [`${safe}.runtime.js`]: baked.js,
      "vanilla.html": baked.html,
      "vanilla.css": baked.css,
      "runtime.js": baked.js,
    };
  }

  const bakedBundle: ComponentDiskBundle = {
    ...bundle,
    html: baked.html,
    css: baked.css,
    runtime: baked.js,
    js: baked.js,
  };
  const { react, vue } = generateFrameworkBundles(bakedBundle);
  return framework === "react" ? react : vue;
}
