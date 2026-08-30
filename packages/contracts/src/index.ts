/** Shared CompLib domain types — one contract for web and API. */

export type Plan = "FREE" | "PRO" | "ENTERPRISE";
export type ComponentTier = Plan;
export type ComponentLayer = "primitives" | "patterns" | "sections" | "templates";
export type UserRole = "USER" | "ADMIN" | "SUPER_ADMIN";
export type ThemeName = "light" | "dark" | "auto";

export type ComponentVariant = {
  id: string;
  label: string;
  props?: Record<string, string>;
};

export type ApiErrorBody = {
  error: {
    code: string;
    message: string;
    requestId?: string;
  };
};

export function apiError(
  code: string,
  message: string,
  requestId?: string,
): ApiErrorBody {
  return { error: { code, message, requestId } };
}
