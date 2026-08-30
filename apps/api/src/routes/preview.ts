import { Router } from "express";
import { getComponentBySlug } from "../lib/component-store";
import { assertSafeComponentSlug } from "../lib/path-safe";
import { renderComponentHtml, resolveVariantProps } from "../lib/variant-props";
import { recordComponentView } from "../lib/catalog-sync";
import { resolveDbUserId } from "../lib/user-resolve";

const router = Router();

/** Public render-only HTML document (matches Next /api/preview/[slug]). */
router.get("/:slug", async (req, res) => {
  const slugParam = req.params.slug;
  const decoded = assertSafeComponentSlug(
    Array.isArray(slugParam) ? slugParam[0] : slugParam,
  );
  if (!decoded) {
    res.status(400).send("Invalid slug");
    return;
  }

  const queryOptions: Record<string, string | undefined> = {};
  for (const [key, value] of Object.entries(req.query)) {
    if (typeof value === "string") queryOptions[key] = value;
    else if (Array.isArray(value) && typeof value[0] === "string") {
      queryOptions[key] = value[0];
    }
  }

  const styleParam =
    typeof queryOptions.style === "string" ? queryOptions.style : undefined;

  const c = await getComponentBySlug(decoded, styleParam ? { styleId: styleParam } : undefined);
  if (!c) {
    res.status(404).send("Not found");
    return;
  }

  const variantProps = resolveVariantProps(c.variants, queryOptions);
  const componentHtml = renderComponentHtml(c.html, c.variants, undefined, variantProps);
  const script = c.runtime || c.js || "";

  try {
    const dbUserId = await resolveDbUserId(req.userId);
    await recordComponentView({
      slug: decoded,
      styleId: styleParam,
      userId: dbUserId ?? undefined,
    });
  } catch {
    // Analytics must not block previews.
  }

  const html = `<!DOCTYPE html>
<html lang="en">
<head>
<meta charset="UTF-8">
<meta name="viewport" content="width=device-width, initial-scale=1">
<style>
*{box-sizing:border-box;margin:0;padding:0}
body{
  display:flex;
  align-items:center;
  justify-content:center;
  min-height:100vh;
  padding:16px;
  background:#06060b;
}
${c.css}
</style>
</head>
<body><div id="complib-root">${componentHtml}</div><script>${script}<\/script></body>
</html>`;

  res
    .status(200)
    .set({
      "Content-Type": "text/html; charset=utf-8",
      "Cache-Control": "private, max-age=120",
    })
    .send(html);
});

export default router;
