import { mergePlaygroundToDocument } from "@/lib/playground-merge";
import { PLAYGROUND_EDITOR_SCRIPT } from "@/lib/playground-editor-script";
import type { PlaygroundInstance } from "@/lib/playground-merge";

const SELECTION_CSS =
  ".complib-section.complib-selected{outline:2px solid rgba(59,130,246,0.8);outline-offset:3px;box-shadow:0 0 0 4px rgba(59,130,246,0.2)}";

/** Builds preview HTML with the canvas editor script (multi-select, patch API). */
export async function buildPlaygroundPreviewHtml(
  instances: PlaygroundInstance[],
): Promise<string> {
  let html = await mergePlaygroundToDocument(instances);

  html = html.replace(
    ".complib-selected{outline:0}",
    SELECTION_CSS,
  );

  html = html.replace(
    "</body>",
    `<script>${PLAYGROUND_EDITOR_SCRIPT}</script></body>`,
  );

  return html;
}
