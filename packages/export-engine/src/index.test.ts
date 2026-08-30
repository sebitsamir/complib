import { describe, expect, it } from "vitest";
import { runExportPipeline } from "./index";

describe("runExportPipeline", () => {
  it("passes valid vanilla export files", () => {
    const result = runExportPipeline({
      framework: "vanilla",
      files: [
        { path: "index.html", contents: "<!DOCTYPE html><html><body></body></html>\n" },
        { path: "styles.css", contents: ".cl-ui { color: red; }\n" },
      ],
    });
    expect(result.ok).toBe(true);
    expect(result.issues).toHaveLength(0);
    expect(result.files).toHaveLength(2);
  });

  it("rejects eval in exported JavaScript", () => {
    const result = runExportPipeline({
      framework: "vanilla",
      files: [{ path: "app.js", contents: "eval('alert(1)');\n" }],
    });
    expect(result.ok).toBe(false);
    expect(result.issues.some((issue) => issue.code === "FORBIDDEN_EVAL")).toBe(true);
  });

  it("formats JSON exports", () => {
    const result = runExportPipeline({
      framework: "react",
      files: [{ path: "package.json", contents: '{"name":"demo"}' }],
    });
    expect(result.files[0]?.contents).toContain('"name": "demo"');
  });
});
