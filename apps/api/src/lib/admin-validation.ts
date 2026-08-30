import type { AdminFormState } from "@/components/admin/admin-studio";
import { getCategoryDef } from "./taxonomy-defaults";

export type AdminValidationIssue = {
  level: "error" | "warn";
  field?: string;
  message: string;
};

export function validateAdminForm(form: AdminFormState): AdminValidationIssue[] {
  const issues: AdminValidationIssue[] = [];

  if (!form.name.trim()) {
    issues.push({ level: "error", field: "name", message: "Display name is required." });
  }

  if (!form.slug.trim()) {
    issues.push({ level: "error", field: "slug", message: "Slug is required." });
  } else if (!/^[a-z0-9]+(?:-[a-z0-9]+)*$/.test(form.slug)) {
    issues.push({
      level: "error",
      field: "slug",
      message: "Slug must be lowercase letters, numbers, and hyphens only.",
    });
  }

  if (!form.description.trim()) {
    issues.push({ level: "warn", field: "description", message: "Add a short description for the library." });
  }

  if (!getCategoryDef(form.layer, form.categorySlug)) {
    issues.push({ level: "error", field: "category", message: "Pick a valid category for the selected layer." });
  }

  if (form.problemTags.length === 0) {
    issues.push({ level: "error", field: "problemTags", message: "Select at least one problem tag." });
  }

  if (!form.html.trim()) {
    issues.push({ level: "error", field: "html", message: "HTML source is required." });
  } else if (!/\bcl-ui\b/.test(form.html)) {
    issues.push({
      level: "error",
      field: "html",
      message: 'Root element must include class "cl-ui" so variants apply correctly.',
    });
  }

  if (!form.css.trim()) {
    issues.push({ level: "error", field: "css", message: "CSS source is required." });
  }

  if (form.variants.length === 0) {
    issues.push({
      level: "warn",
      field: "variants",
      message: "No variants — component will use fixed styling only.",
    });
  }

  const invalidVariant = form.variants.find((v) => !v.id.trim() || !v.label.trim());
  if (invalidVariant) {
    issues.push({
      level: "error",
      field: "variants",
      message: "Every variant needs a non-empty id and label.",
    });
  }

  return issues;
}

export function adminFormCanPublish(form: AdminFormState): boolean {
  return validateAdminForm(form).every((issue) => issue.level !== "error");
}
