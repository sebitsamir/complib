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

export type ExportValidationIssue = {
  code: string;
  message: string;
  path?: string;
};

export type ExportPipelineInput = {
  framework: ExportFramework;
  files: ExportFile[];
};

export type ExportPipelineResult = {
  ok: boolean;
  files: ExportFile[];
  issues: ExportValidationIssue[];
};

export function isExportFramework(value: string): value is ExportFramework {
  return (EXPORT_FRAMEWORKS as readonly string[]).includes(value);
}

export function isScaffoldTarget(value: string): value is ScaffoldTarget {
  return (SCAFFOLD_TARGETS as readonly string[]).includes(value);
}

const FORBIDDEN_PATTERNS: Array<{ code: string; pattern: RegExp; message: string }> = [
  { code: "FORBIDDEN_EVAL", pattern: /\beval\s*\(/, message: "eval() is not allowed in exported code." },
  {
    code: "FORBIDDEN_PARENT_ACCESS",
    pattern: /parent\.(window|document|location)/,
    message: "Parent window access is not allowed in exported code.",
  },
];

/** Validate → format exported files before delivery. */
export function runExportPipeline(input: ExportPipelineInput): ExportPipelineResult {
  const issues: ExportValidationIssue[] = [];
  const files: ExportFile[] = [];

  for (const file of input.files) {
    if (!file.path.trim()) {
      issues.push({ code: "EMPTY_PATH", message: "Export file path is required." });
      continue;
    }

    let contents = file.contents ?? "";
    if (!contents.trim()) {
      issues.push({
        code: "EMPTY_FILE",
        message: "Export file is empty.",
        path: file.path,
      });
    }

    for (const rule of FORBIDDEN_PATTERNS) {
      if (rule.pattern.test(contents)) {
        issues.push({
          code: rule.code,
          message: rule.message,
          path: file.path,
        });
      }
    }

    if (file.path.endsWith(".json")) {
      try {
        JSON.parse(contents);
      } catch {
        issues.push({
          code: "INVALID_JSON",
          message: "JSON file is not valid.",
          path: file.path,
        });
      }
    }

    if (input.framework === "react" && file.path.endsWith(".tsx")) {
      if (!contents.includes("export")) {
        issues.push({
          code: "REACT_NO_EXPORT",
          message: "React component files should export a component.",
          path: file.path,
        });
      }
    }

    contents = formatExportContents(contents, file.path);
    files.push({ path: file.path, contents });
  }

  return {
    ok: issues.length === 0,
    files,
    issues,
  };
}

function formatExportContents(contents: string, path: string): string {
  const normalized = contents.replace(/\r\n/g, "\n");
  if (path.endsWith(".json")) {
    try {
      return `${JSON.stringify(JSON.parse(normalized), null, 2)}\n`;
    } catch {
      return normalized;
    }
  }
  return normalized.endsWith("\n") ? normalized : `${normalized}\n`;
}
