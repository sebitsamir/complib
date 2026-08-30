import fs from "node:fs/promises";
import path from "node:path";
import vm from "node:vm";

const repoRoot = process.cwd();
const mockDataPath = path.join(repoRoot, "lib", "mock-data.ts");
const outRoot = path.join(repoRoot, "components");

function extractMockArray(sourceText) {
  const marker = "export const mockComponents: Component[] =";
  const idx = sourceText.indexOf(marker);
  if (idx < 0) throw new Error("mockComponents declaration not found");
  const eqIdx = sourceText.indexOf("=", idx);
  const startArray = sourceText.indexOf("[", eqIdx);
  if (startArray < 0) throw new Error("mockComponents array start not found");

  let depth = 0;
  let inSingle = false;
  let inDouble = false;
  let inTemplate = false;
  let escaped = false;

  for (let i = startArray; i < sourceText.length; i += 1) {
    const ch = sourceText[i];

    if (escaped) {
      escaped = false;
      continue;
    }
    if (ch === "\\") {
      escaped = true;
      continue;
    }

    if (!inDouble && !inTemplate && ch === "'" && !inSingle) {
      inSingle = true;
      continue;
    } else if (inSingle && ch === "'") {
      inSingle = false;
      continue;
    }

    if (!inSingle && !inTemplate && ch === '"' && !inDouble) {
      inDouble = true;
      continue;
    } else if (inDouble && ch === '"') {
      inDouble = false;
      continue;
    }

    if (!inSingle && !inDouble && ch === "`" && !inTemplate) {
      inTemplate = true;
      continue;
    } else if (inTemplate && ch === "`") {
      inTemplate = false;
      continue;
    }

    if (inSingle || inDouble || inTemplate) continue;

    if (ch === "[") depth += 1;
    if (ch === "]") {
      depth -= 1;
      if (depth === 0) {
        return sourceText.slice(startArray, i + 1);
      }
    }
  }
  throw new Error("Could not parse mockComponents array");
}

function sanitizeSlug(raw) {
  const s = String(raw || "")
    .trim()
    .toLowerCase()
    .replace(/[^a-z0-9-_]/g, "-")
    .replace(/-+/g, "-")
    .replace(/^-|-$/g, "");
  return s || "component";
}

function buildComponentJson(c) {
  const moduleSlug = sanitizeSlug(c.module?.slug || "general");
  const layer = moduleSlug.includes("hero") || moduleSlug.includes("footer")
    ? "sections"
    : moduleSlug.includes("template") || moduleSlug.includes("dashboard")
      ? "templates"
      : moduleSlug.includes("layout") || moduleSlug.includes("input")
        ? "primitives"
        : "patterns";
  return {
    id: String(c.id),
    name: String(c.name),
    slug: sanitizeSlug(c.slug),
    description: String(c.description || ""),
    tags: Array.isArray(c.tags) ? c.tags.map((x) => String(x)) : [],
    tier: c.tier === "PRO" || c.tier === "ENTERPRISE" ? c.tier : "FREE",
    layer,
    category: moduleSlug,
    problemTags: layer === "templates" ? ["build-landing-page"] : ["build-ui-sections"],
    viewCount: Number.isFinite(c.viewCount) ? c.viewCount : 0,
    styleVariants: {
      vanilla: true,
      tailwind: false,
    },
    runtimeContract: {
      mount: "mount",
      unmount: "unmount",
    },
  };
}

function runtimeTemplate(userJs) {
  const raw = String(userJs || "").trim();
  let safeJs = raw;
  if (raw) {
    try {
      new Function(raw);
    } catch {
      safeJs = `/* Invalid legacy JS payload was ignored:\n${raw.replace(/\*\//g, "*\\/")}\n*/`;
    }
  }
  return `export function mount(root, props = {}) {
  if (!root) return {};

  // Backward compatibility: expose root for legacy scripts that read global document.
  const instanceId = props.instanceId || root.getAttribute("data-complib-instance") || "instance";
  try {
${safeJs
  .split("\n")
  .map((line) => `    ${line}`)
  .join("\n")}
  } catch (err) {
    // Keep runtime failures non-fatal for previews/download exports.
    console.error("CompLib runtime error:", err);
  }

  return {
    unmount() {
      // Add component-specific cleanup here when needed.
      void instanceId;
    },
  };
}
`;
}

async function main() {
  const text = await fs.readFile(mockDataPath, "utf8");
  const arrayLiteral = extractMockArray(text);
  const mockComponents = vm.runInNewContext(`(${arrayLiteral})`);
  if (!Array.isArray(mockComponents)) {
    throw new Error("mockComponents did not evaluate to an array");
  }

  await fs.mkdir(outRoot, { recursive: true });

  for (const c of mockComponents) {
    const slug = sanitizeSlug(c.slug);
    const dir = path.join(outRoot, slug);
    await fs.mkdir(dir, { recursive: true });

    const meta = buildComponentJson(c);
    await fs.writeFile(
      path.join(dir, "component.json"),
      `${JSON.stringify(meta, null, 2)}\n`,
      "utf8",
    );
    await fs.writeFile(path.join(dir, "vanilla.html"), String(c.html || ""), "utf8");
    await fs.writeFile(path.join(dir, "vanilla.css"), String(c.css || ""), "utf8");
    await fs.writeFile(path.join(dir, "runtime.js"), runtimeTemplate(c.js || ""), "utf8");
  }

  console.log(`Migrated ${mockComponents.length} components into ${outRoot}`);
}

main().catch((err) => {
  console.error(err);
  process.exit(1);
});

