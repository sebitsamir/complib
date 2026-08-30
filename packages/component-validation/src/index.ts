import type { ComponentLayer } from "@complib/contracts";
import { validateTaxonomy } from "@complib/taxonomy";

export type ValidationSeverity = "error" | "warn" | "info";

export type ValidationIssue = {
  code: string;
  severity: ValidationSeverity;
  field?: string;
  message: string;
};

export type PublishPipelineStep =
  | "metadata"
  | "taxonomy"
  | "source"
  | "variants"
  | "styles"
  | "frameworks"
  | "accessibility";

export type PublishValidationInput = {
  name: string;
  slug: string;
  description: string;
  tier: string;
  layer: string;
  category: string;
  problemTags: string[];
  html: string;
  css: string;
  js: string;
  variants?: Array<{ id: string; label: string }>;
  styleFamilies?: string[];
  themes?: string[];
};

export type PublishValidationResult = {
  ok: boolean;
  issues: ValidationIssue[];
  steps: Record<PublishPipelineStep, "pass" | "fail" | "warn" | "skip">;
};

const FORBIDDEN_JS_PATTERNS: Array<{ code: string; pattern: RegExp; message: string }> = [
  { code: "FORBIDDEN_EVAL", pattern: /\beval\s*\(/, message: "JavaScript must not use eval()." },
  {
    code: "FORBIDDEN_DOCUMENT_COOKIE",
    pattern: /document\.cookie/,
    message: "JavaScript must not access document.cookie.",
  },
  {
    code: "FORBIDDEN_PARENT_WINDOW",
    pattern: /parent\.(window|document|location)/,
    message: "JavaScript must not access the parent window.",
  },
];

const MAX_SOURCE_BYTES = 512 * 1024;

function stepStatus(issues: ValidationIssue[], fields: string[]): "pass" | "fail" | "warn" {
  const relevant = issues.filter(
    (issue) =>
      issue.severity !== "info" && (!issue.field || fields.includes(issue.field)),
  );
  if (relevant.some((issue) => issue.severity === "error")) return "fail";
  if (relevant.some((issue) => issue.severity === "warn")) return "warn";
  return "pass";
}

/** Validate a component before it can be published to the public catalog. */
export function validateComponentForPublish(
  input: PublishValidationInput,
): PublishValidationResult {
  return validateComponent(input);
}

/** Primary validation entry point (alias used by publish pipeline and tests). */
export function validateComponent(input: PublishValidationInput): PublishValidationResult {
  const issues: ValidationIssue[] = [];

  if (!input.name.trim()) {
    issues.push({
      code: "METADATA_NAME_REQUIRED",
      severity: "error",
      field: "name",
      message: "Display name is required.",
    });
  }

  if (!input.slug.trim()) {
    issues.push({
      code: "METADATA_SLUG_REQUIRED",
      severity: "error",
      field: "slug",
      message: "Slug is required.",
    });
  } else if (!/^[a-z0-9]+(?:-[a-z0-9]+)*$/.test(input.slug)) {
    issues.push({
      code: "METADATA_SLUG_FORMAT",
      severity: "error",
      field: "slug",
      message: "Slug must be lowercase letters, numbers, and hyphens only.",
    });
  }

  if (!input.description.trim()) {
    issues.push({
      code: "METADATA_DESCRIPTION_MISSING",
      severity: "warn",
      field: "description",
      message: "Add a short description for discovery.",
    });
  }

  if (!["FREE", "PRO", "ENTERPRISE"].includes(input.tier)) {
    issues.push({
      code: "METADATA_TIER_INVALID",
      severity: "error",
      field: "tier",
      message: "Tier must be FREE, PRO, or ENTERPRISE.",
    });
  }

  const taxonomy = validateTaxonomy({
    layer: input.layer,
    category: input.category,
    problemTags: input.problemTags,
  });
  if (!taxonomy.ok) {
    issues.push({
      code: "TAXONOMY_INVALID",
      severity: "error",
      field: "taxonomy",
      message: taxonomy.error,
    });
  }

  if (!input.html.trim()) {
    issues.push({
      code: "SOURCE_HTML_REQUIRED",
      severity: "error",
      field: "html",
      message: "HTML source is required.",
    });
  } else if (!/\bcl-ui\b/.test(input.html)) {
    issues.push({
      code: "SOURCE_HTML_ROOT_CLASS",
      severity: "error",
      field: "html",
      message: 'Root element must include class "cl-ui" for variant styling.',
    });
  }

  if (!input.css.trim()) {
    issues.push({
      code: "SOURCE_CSS_REQUIRED",
      severity: "error",
      field: "css",
      message: "CSS source is required.",
    });
  }

  const sourceBytes = new TextEncoder().encode(
    `${input.html}\0${input.css}\0${input.js}`,
  ).length;
  if (sourceBytes > MAX_SOURCE_BYTES) {
    issues.push({
      code: "SOURCE_TOO_LARGE",
      severity: "error",
      field: "source",
      message: `Source exceeds ${MAX_SOURCE_BYTES} bytes.`,
    });
  }

  for (const rule of FORBIDDEN_JS_PATTERNS) {
    if (rule.pattern.test(input.js)) {
      issues.push({
        code: rule.code,
        severity: "error",
        field: "js",
        message: rule.message,
      });
    }
  }

  if (input.js.trim() && !input.js.includes("function") && !input.js.includes("=>")) {
    issues.push({
      code: "RUNTIME_SCRIPT_EMPTY",
      severity: "warn",
      field: "js",
      message: "Runtime script looks empty — preview may not mount interactivity.",
    });
  }

  if (input.css.includes("!important") && (input.css.match(/!important/g) ?? []).length > 12) {
    issues.push({
      code: "CSS_IMPORTANT_OVERUSE",
      severity: "warn",
      field: "css",
      message: "Excessive !important usage can break variant theming.",
    });
  }

  if (/<script[\s>]/i.test(input.html)) {
    issues.push({
      code: "HTML_INLINE_SCRIPT",
      severity: "error",
      field: "html",
      message: "Inline <script> tags belong in the JS field, not HTML.",
    });
  }

  const openTags = input.html.match(/<([a-z][a-z0-9-]*)\b[^>]*>/gi) ?? [];
  const closeTags = input.html.match(/<\/([a-z][a-z0-9-]*)\s*>/gi) ?? [];
  if (openTags.length > 0 && closeTags.length === 0 && !input.html.trim().endsWith("/>")) {
    issues.push({
      code: "HTML_UNCLOSED_TAGS",
      severity: "warn",
      field: "html",
      message: "HTML may contain unclosed tags — verify structure before publish.",
    });
  }

  const variants = input.variants ?? [];
  if (variants.length === 0) {
    issues.push({
      code: "VARIANTS_EMPTY",
      severity: "warn",
      field: "variants",
      message: "No variant dimensions — component will use fixed styling only.",
    });
  }

  for (const variant of variants) {
    if (!variant.id.trim() || !variant.label.trim()) {
      issues.push({
        code: "VARIANT_INVALID",
        severity: "error",
        field: "variants",
        message: "Every variant needs a non-empty id and label.",
      });
      break;
    }
  }

  const styles = input.styleFamilies ?? [];
  if (styles.length === 0) {
    issues.push({
      code: "STYLES_DEFAULT_ONLY",
      severity: "info",
      field: "styles",
      message: "Only the default style family will be published.",
    });
  }

  if (!input.html.includes("role=") && /<button\b|<a\b|<input\b/i.test(input.html)) {
    issues.push({
      code: "A11Y_SEMANTIC_HINT",
      severity: "warn",
      field: "accessibility",
      message: "Interactive markup should include accessible roles or labels.",
    });
  }

  const steps: PublishValidationResult["steps"] = {
    metadata: stepStatus(issues, ["name", "slug", "description", "tier"]),
    taxonomy: stepStatus(issues, ["taxonomy"]),
    source: stepStatus(issues, ["html", "css", "js", "source"]),
    variants: stepStatus(issues, ["variants"]),
    styles: styles.length > 0 ? stepStatus(issues, ["styles"]) : "skip",
    frameworks: "pass",
    accessibility: stepStatus(issues, ["accessibility"]),
  };

  return {
    ok: issues.every((issue) => issue.severity !== "error"),
    issues,
    steps,
  };
}

export function layerFromString(value: string): ComponentLayer | null {
  if (
    value === "primitives" ||
    value === "patterns" ||
    value === "sections" ||
    value === "templates"
  ) {
    return value;
  }
  return null;
}
