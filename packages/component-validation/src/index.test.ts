import { describe, expect, it } from "vitest";
import { validateComponent } from "@complib/component-validation";

describe("validateComponent", () => {
  it("rejects missing required metadata", () => {
    const result = validateComponent({
      name: "",
      slug: "",
      description: "",
      tier: "FREE",
      layer: "primitives",
      category: "layout",
      problemTags: [],
      html: "",
      css: "",
      js: "",
    });
    expect(result.ok).toBe(false);
    expect(result.issues.some((issue) => issue.severity === "error")).toBe(true);
  });

  it("passes a valid primitive publish payload", () => {
    const result = validateComponent({
      name: "Metric Card",
      slug: "metric-card",
      description: "Shows a KPI value.",
      tier: "FREE",
      layer: "primitives",
      category: "data-display",
      problemTags: ["build-dashboard"],
      html: '<div class="cl-ui">Hello</div>',
      css: ".cl-ui { color: black; }",
      js: "function mount() {}",
      variants: [{ id: "default", label: "Default" }],
    });
    expect(result.ok).toBe(true);
    expect(result.steps.metadata).toBe("pass");
    expect(result.steps.source).toBe("pass");
  });
});
