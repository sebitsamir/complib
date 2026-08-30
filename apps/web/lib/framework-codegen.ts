/**
 * CompLib framework codegen — turns vanilla HTML/CSS/JS into idiomatic React & Vue
 * bundles that drop into Next.js, Vite, or Vue 3 projects without innerHTML wrappers.
 */

import type { ComponentDiskBundle } from "@/lib/component-fs";

export type GeneratedFileMap = Record<string, string>;

const VOID_TAGS = new Set([
  "area",
  "base",
  "br",
  "col",
  "embed",
  "hr",
  "img",
  "input",
  "link",
  "meta",
  "param",
  "source",
  "track",
  "wbr",
]);

const REACT_ATTR_MAP: Record<string, string> = {
  class: "className",
  for: "htmlFor",
  tabindex: "tabIndex",
  readonly: "readOnly",
  colspan: "colSpan",
  rowspan: "rowSpan",
  maxlength: "maxLength",
  minlength: "minLength",
  autocomplete: "autoComplete",
  autofocus: "autoFocus",
  contenteditable: "contentEditable",
  crossorigin: "crossOrigin",
  enctype: "encType",
  formaction: "formAction",
  formenctype: "formEncType",
  formmethod: "formMethod",
  formnovalidate: "formNoValidate",
  formtarget: "formTarget",
  frameborder: "frameBorder",
  hreflang: "hrefLang",
  inputmode: "inputMode",
  novalidate: "noValidate",
  playsinline: "playsInline",
  srcset: "srcSet",
  usemap: "useMap",
  datetime: "dateTime",
};

const EVENT_ATTRS = new Set([
  "onclick",
  "ondblclick",
  "onmousedown",
  "onmouseup",
  "onmouseover",
  "onmouseout",
  "onkeydown",
  "onkeyup",
  "onchange",
  "onsubmit",
  "onfocus",
  "onblur",
]);

type HtmlNode =
  | { type: "text"; value: string }
  | { type: "element"; tag: string; attrs: Record<string, string>; children: HtmlNode[] };

function pascalCase(input: string) {
  return String(input)
    .replace(/(^|[-_ ])([a-zA-Z0-9])/g, (_m, _g, c) => c.toUpperCase())
    .replace(/[^a-zA-Z0-9]/g, "");
}

function decodeHtmlEntities(text: string) {
  return text
    .replace(/&nbsp;/g, " ")
    .replace(/&amp;/g, "&")
    .replace(/&lt;/g, "<")
    .replace(/&gt;/g, ">")
    .replace(/&quot;/g, '"')
    .replace(/&#39;/g, "'")
    .replace(/&#x27;/g, "'")
    .replace(/&#(\d+);/g, (_, code) => String.fromCharCode(Number(code)));
}

function escapeJsxText(text: string) {
  const decoded = decodeHtmlEntities(text);
  if (!decoded.trim()) return "";
  return decoded
    .replace(/\\/g, "\\\\")
    .replace(/`/g, "\\`")
    .replace(/\$/g, "\\$")
    .replace(/\{/g, "{'{'}")
    .replace(/\}/g, "{'}'}");
}

function parseStyleToJsx(style: string) {
  const entries = style
    .split(";")
    .map((s) => s.trim())
    .filter(Boolean);
  const props: string[] = [];
  for (const entry of entries) {
    const colon = entry.indexOf(":");
    if (colon === -1) continue;
    const key = entry.slice(0, colon).trim();
    const value = entry.slice(colon + 1).trim();
    const camel = key.replace(/-([a-z])/g, (_, c) => c.toUpperCase());
    props.push(`${camel}: ${JSON.stringify(value)}`);
  }
  if (props.length === 0) return null;
  return `{{ ${props.join(", ")} }}`;
}

function camelCaseAttr(name: string) {
  const lower = name.toLowerCase();
  if (REACT_ATTR_MAP[lower]) return REACT_ATTR_MAP[lower];
  if (name.includes("-")) {
    return name.replace(/-([a-z])/g, (_, c) => c.toUpperCase());
  }
  return name;
}

function parseHtml(html: string): HtmlNode[] {
  const input = html.trim();
  if (!input) return [];

  const nodes: HtmlNode[] = [];
  let i = 0;

  const skipWhitespace = () => {
    while (i < input.length && /\s/.test(input[i]!)) i += 1;
  };

  const parseText = (): string => {
    const start = i;
    while (i < input.length && input[i] !== "<") i += 1;
    return input.slice(start, i);
  };

  const parseTagName = (): string => {
    let name = "";
    while (i < input.length && /[a-zA-Z0-9]/.test(input[i]!)) {
      name += input[i];
      i += 1;
    }
    return name.toLowerCase();
  };

  const parseAttributes = (): Record<string, string> => {
    const attrs: Record<string, string> = {};
    while (i < input.length) {
      skipWhitespace();
      if (input[i] === ">" || input.startsWith("/>", i)) break;
      let name = "";
      while (i < input.length && /[^\s=/>]/.test(input[i]!)) {
        name += input[i];
        i += 1;
      }
      if (!name) break;
      skipWhitespace();
      let value = "";
      if (input[i] === "=") {
        i += 1;
        skipWhitespace();
        const quote = input[i];
        if (quote === '"' || quote === "'") {
          i += 1;
          const start = i;
          while (i < input.length && input[i] !== quote) i += 1;
          value = input.slice(start, i);
          i += 1;
        } else {
          const start = i;
          while (i < input.length && !/\s/.test(input[i]!) && input[i] !== ">") i += 1;
          value = input.slice(start, i);
        }
      } else {
        value = "";
      }
      attrs[name.toLowerCase()] = value;
    }
    return attrs;
  };

  const parseElement = (): HtmlNode | null => {
    if (input[i] !== "<") return null;
    const isClose = input[i + 1] === "/";
    if (isClose) return null;
    i += 1;
    const tag = parseTagName();
    if (!tag) return null;
    const attrs = parseAttributes();
    const selfClosing = input[i] === "/" || VOID_TAGS.has(tag);
    if (input[i] === "/") i += 1;
    if (input[i] === ">") i += 1;

    const children: HtmlNode[] = [];
    if (!selfClosing) {
      while (i < input.length) {
        skipWhitespace();
        if (input.startsWith(`</${tag}`, i)) {
          i += 2 + tag.length;
          skipWhitespace();
          if (input[i] === ">") i += 1;
          break;
        }
        if (input[i] === "<") {
          const child = parseElement();
          if (child) children.push(child);
          else break;
        } else {
          const text = parseText();
          if (text) children.push({ type: "text", value: text });
        }
      }
    }
    return { type: "element", tag, attrs, children };
  };

  while (i < input.length) {
    skipWhitespace();
    if (i >= input.length) break;
    if (input[i] === "<") {
      const el = parseElement();
      if (el) nodes.push(el);
      else i += 1;
    } else {
      const text = parseText();
      if (text.trim()) nodes.push({ type: "text", value: text });
    }
  }
  return nodes;
}

function inferRootTag(nodes: HtmlNode[]): string {
  const first = nodes.find((n) => n.type === "element");
  return first?.type === "element" ? first.tag : "div";
}

function injectRefIntoJsx(jsx: string, tag: string): string {
  const pattern = new RegExp(`^(\\s*)<${tag}(?=\\s|>)`, "m");
  return jsx.replace(pattern, `$1<${tag}\n$1  ref={rootRef}`);
}

function getPrimaryText(nodes: HtmlNode[]): string | null {
  for (const node of nodes) {
    if (node.type === "text" && node.value.trim()) return decodeHtmlEntities(node.value).trim();
    if (node.type === "element") {
      const nested = getPrimaryText(node.children);
      if (nested) return nested;
    }
  }
  return null;
}

function isTrivialRuntime(runtime: string) {
  const trimmed = runtime.trim();
  if (!trimmed) return true;
  const withoutComments = trimmed
    .replace(/\/\*[\s\S]*?\*\//g, "")
    .replace(/\/\/.*$/gm, "")
    .trim();
  if (!withoutComments) return true;

  const hasDomBehavior =
    /addEventListener|removeEventListener|querySelector|getElementById|createElement|innerHTML|insertAdjacent|setTimeout|setInterval|fetch\s*\(|axios/.test(
      withoutComments,
    );
  if (/export\s+function\s+mount/.test(withoutComments) && !hasDomBehavior) {
    return true;
  }

  if (/^export\s+function\s+mount/.test(withoutComments)) {
    const stripped = withoutComments
      .replace(/export\s+function\s+mount\s*\([^)]*\)\s*\{/, "")
      .replace(/\}\s*;?\s*$/, "")
      .replace(/if\s*\(\s*!root\s*\)\s*return\s*\{\s*\}\s*;?/g, "")
      .replace(/const\s+instanceId\s*=[^;]+;/g, "")
      .replace(/try\s*\{[\s\S]*?\}\s*catch\s*\([^)]*\)\s*\{[\s\S]*?\}/g, "")
      .replace(/return\s*\{[\s\S]*?unmount[\s\S]*?\}\s*;?/g, "")
      .replace(/void\s+instanceId\s*;?/g, "")
      .replace(/console\.error\([^)]*\)\s*;?/g, "")
      .trim();
    if (!stripped) return true;
  }

  return false;
}

type RuntimePlan =
  | { kind: "none" }
  | {
      kind: "listeners";
      propName: string;
      propType: string;
      selector: string;
      eventName: string;
      effectBody: string;
    }
  | {
      kind: "mount";
      scopedRuntime: string;
    };

function analyzeRuntime(runtime: string, rootTag: string): RuntimePlan {
  if (isTrivialRuntime(runtime)) return { kind: "none" };

  const listenerMatch = runtime.match(
    /document\.querySelectorAll\(\s*['"`]([^'"`]+)['"`]\s*\)[\s\S]*?addEventListener\(\s*['"`](\w+)['"`]/,
  );
  if (listenerMatch) {
    const selector = listenerMatch[1]!;
    const eventName = listenerMatch[2]!;
    const propName =
      eventName === "click"
        ? selector.includes("tr")
          ? "onRowClick"
          : "onClick"
        : `on${eventName.charAt(0).toUpperCase()}${eventName.slice(1)}`;
    return {
      kind: "listeners",
      propName,
      propType: `(value: string, event: Event) => void`,
      selector,
      eventName,
      effectBody: `  const root = rootRef.current;
  if (!root) return;
  const targets = root.querySelectorAll(${JSON.stringify(selector)});
  const disposers: Array<() => void> = [];
  targets.forEach((target) => {
    const handler = (event: Event) => {
      const value = target.textContent?.trim() ?? "";
      props.${propName}?.(value, event);
    };
    target.addEventListener(${JSON.stringify(eventName)}, handler);
    disposers.push(() => target.removeEventListener(${JSON.stringify(eventName)}, handler));
  });
  return () => disposers.forEach((dispose) => dispose());`,
    };
  }

  if (/export\s+function\s+mount/.test(runtime)) {
    const scoped = transformRuntimeToScoped(runtime);
    return { kind: "mount", scopedRuntime: scoped };
  }

  const scoped = wrapRawRuntime(runtime);
  return { kind: "mount", scopedRuntime: scoped };
}

function transformRuntimeToScoped(runtime: string) {
  let body = runtime.trim();
  if (!body.includes("export function mount")) {
    return wrapRawRuntime(runtime);
  }
  body = body
    .replace(/\bdocument\.querySelectorAll\b/g, "root.querySelectorAll")
    .replace(/\bdocument\.querySelector\b/g, "root.querySelector")
    .replace(/\bdocument\.getElementById\(\s*['"`]([^'"`]+)['"`]\s*\)/g, "root.querySelector(`#$1`)");

  return `/**
 * Scoped runtime for React/Vue — queries and listeners are limited to the component root.
 */
export type RuntimeHandle = { unmount?: () => void };

${body}
`;
}

function wrapRawRuntime(runtime: string) {
  const sanitized = runtime
    .replace(/\bdocument\.querySelectorAll\b/g, "root.querySelectorAll")
    .replace(/\bdocument\.querySelector\b/g, "root.querySelector")
    .replace(/\bdocument\.getElementById\(\s*['"`]([^'"`]+)['"`]\s*\)/g, "root.querySelector(`#$1`)");

  return `/**
 * Scoped runtime for React/Vue — queries and listeners are limited to the component root.
 */
export type RuntimeHandle = { unmount?: () => void };

export function mount(root: HTMLElement, props: Record<string, unknown> = {}): RuntimeHandle {
  if (!root) return {};

  const run = () => {
${sanitized
  .split("\n")
  .map((line) => `    ${line}`)
  .join("\n")}
  };

  try {
    run();
  } catch (error) {
    console.error("[CompLib] runtime error:", error);
  }

  return {
    unmount() {
      // Add teardown here when you extend the vanilla runtime with listeners or observers.
      void props;
    },
  };
}
`;
}

function jsxFromNodes(nodes: HtmlNode[], indent = 2, options?: { stripEvents?: boolean }): string {
  const pad = " ".repeat(indent);
  const parts: string[] = [];

  for (const node of nodes) {
    if (node.type === "text") {
      const text = escapeJsxText(node.value);
      if (text.trim()) parts.push(`${pad}${text.trim()}`);
      continue;
    }

    const { tag, attrs, children } = node;
    const attrParts: string[] = [];

    for (const [rawKey, value] of Object.entries(attrs)) {
      const key = rawKey.toLowerCase();
      if (options?.stripEvents && EVENT_ATTRS.has(key)) continue;
      if (key === "class") {
        attrParts.push(`className={["${value}", className].filter(Boolean).join(" ")}`);
        continue;
      }
      if (key === "style") {
        const styleObj = parseStyleToJsx(value);
        if (styleObj) attrParts.push(`style={${styleObj}}`);
        continue;
      }
      if (EVENT_ATTRS.has(key)) continue;
      const reactKey = camelCaseAttr(rawKey);
      if (value === "") {
        attrParts.push(reactKey);
      } else {
        attrParts.push(`${reactKey}={${JSON.stringify(decodeHtmlEntities(value))}}`);
      }
    }

    const childJsx = jsxFromNodes(children, indent + 2, options);
    const voidEl = VOID_TAGS.has(tag);
    const attrStr = attrParts.length ? ` ${attrParts.join(" ")}` : "";

    if (voidEl) {
      parts.push(`${pad}<${tag}${attrStr} />`);
    } else if (childJsx) {
      parts.push(`${pad}<${tag}${attrStr}>\n${childJsx}\n${pad}</${tag}>`);
    } else {
      parts.push(`${pad}<${tag}${attrStr} />`);
    }
  }

  return parts.join("\n");
}

function vueTemplateFromNodes(nodes: HtmlNode[], indent = 2): string {
  const pad = " ".repeat(indent);
  const parts: string[] = [];

  for (const node of nodes) {
    if (node.type === "text") {
      const text = decodeHtmlEntities(node.value).trim();
      if (text) parts.push(`${pad}${text}`);
      continue;
    }

    const { tag, attrs, children } = node;
    const attrParts: string[] = [];
    for (const [key, value] of Object.entries(attrs)) {
      const lower = key.toLowerCase();
      if (EVENT_ATTRS.has(lower)) continue;
      if (value === "") attrParts.push(key);
      else attrParts.push(`${key}="${decodeHtmlEntities(value).replace(/"/g, "&quot;")}"`);
    }
    const attrStr = attrParts.length ? ` ${attrParts.join(" ")}` : "";
    const childTpl = vueTemplateFromNodes(children, indent + 2);
    if (VOID_TAGS.has(tag)) {
      parts.push(`${pad}<${tag}${attrStr} />`);
    } else if (childTpl) {
      parts.push(`${pad}<${tag}${attrStr}>\n${childTpl}\n${pad}</${tag}>`);
    } else {
      parts.push(`${pad}<${tag}${attrStr}></${tag}>`);
    }
  }
  return parts.join("\n");
}

function buildReadme(name: string, slug: string, framework: "react" | "vue", needsClient: boolean) {
  if (framework === "react") {
    return `# ${name}

Production-ready React component generated from CompLib (\`${slug}\`).

## Next.js (App Router)

1. Copy this folder into your project, e.g. \`components/complib/${slug}/\`.
2. Import and use:

\`\`\`tsx
import ${name} from "@/components/complib/${slug}";

export default function Page() {
  return <${name} />;
}
\`\`\`

${needsClient ? "> This file includes `\"use client\"` because it attaches DOM listeners or runtime behavior.\n" : "> Safe to import from Server Components when you do not pass event-handler props.\n"}

## Vite + React

1. Copy into \`src/components/${slug}/\`.
2. Import with a relative path:

\`\`\`tsx
import ${name} from "./components/${slug}";

export function Demo() {
  return <${name} className="my-4" />;
}
\`\`\`

## Files

| File | Purpose |
|------|---------|
| \`Component.tsx\` | React component (JSX — not an innerHTML wrapper) |
| \`types.ts\` | TypeScript props |
| \`styles.css\` | Component styles (imported by the component) |
| \`runtime.ts\` | Optional scoped DOM runtime (only when vanilla JS had behavior) |
| \`index.ts\` | Barrel export |

## Styling

Styles ship in \`styles.css\` and are imported automatically. No extra CSS Modules config required for Next.js or Vite defaults.

## Customization

- Pass \`className\` and standard HTML attributes supported on the root element.
- Override visible text with the \`children\` prop when the markup is a single text container.
`;
  }

  return `# ${name}

Production-ready Vue 3 component generated from CompLib (\`${slug}\`).

## Vite + Vue 3

1. Copy this folder to \`src/components/${slug}/\`.
2. Register or import directly:

\`\`\`vue
<script setup lang="ts">
import ${name} from "./components/${slug}/Component.vue";
</script>

<template>
  <${name} />
</template>
\`\`\`

## Nuxt 3

Place under \`components/complib/${slug}/\` and use \`<Complib${name} />\` or import explicitly.

## Files

| File | Purpose |
|------|---------|
| \`Component.vue\` | Single-file component with real template markup |
| \`types.ts\` | Props interface |
| \`styles.css\` | Imported styles |
| \`runtime.ts\` | Optional scoped runtime |
| \`index.ts\` | Barrel export |
`;
}

function buildTypes(
  name: string,
  rootTag: string,
  plan: RuntimePlan,
  hasChildrenText: boolean,
) {
  const attrsImport =
    rootTag === "button"
      ? "ButtonHTMLAttributes"
      : rootTag === "table"
        ? "TableHTMLAttributes"
        : rootTag === "input"
          ? "InputHTMLAttributes"
          : "HTMLAttributes";
  const elementType =
    rootTag === "button"
      ? "HTMLButtonElement"
      : rootTag === "table"
        ? "HTMLTableElement"
        : rootTag === "input"
          ? "HTMLInputElement"
          : "HTMLElement";

  const extraProps: string[] = [];
  if (plan.kind === "listeners") {
    extraProps.push(`  ${plan.propName}?: ${plan.propType};`);
  }
  if (hasChildrenText) {
    extraProps.push("  children?: ReactNode;");
  }

  return `import type { CSSProperties, ReactNode, ${attrsImport} } from "react";

export type ${name}Props = ${attrsImport}<${elementType}> & {
  className?: string;
  style?: CSSProperties;
${extraProps.join("\n")}
};
`;
}

function buildVueTypes(name: string, plan: RuntimePlan, hasChildrenText: boolean) {
  const extraProps: string[] = [];
  if (plan.kind === "listeners") {
    extraProps.push(`  ${plan.propName}?: ${plan.propType};`);
  }
  if (hasChildrenText) extraProps.push("  children?: string;");

  return `export interface ${name}Props {
  className?: string;
${extraProps.join("\n")}
}
`;
}

function hasTextChildren(nodes: HtmlNode[]): boolean {
  return nodes.some(
    (n) =>
      (n.type === "text" && n.value.trim().length > 0) ||
      (n.type === "element" && hasTextChildren(n.children)),
  );
}

/** Only leaf controls (button, link, heading) should expose a \`children\` label override. */
function supportsChildrenProp(nodes: HtmlNode[], rootTag: string) {
  if (!hasTextChildren(nodes)) return false;
  if (nodes.length !== 1 || nodes[0]?.type !== "element") return false;
  return ["button", "a", "span", "label", "p", "h1", "h2", "h3", "h4", "h5", "h6"].includes(
    rootTag,
  );
}

function buildReactComponent(bundle: ComponentDiskBundle) {
  const name = pascalCase(bundle.json.name || bundle.slug) || "Component";
  const nodes = parseHtml(bundle.html);
  const rootTag = inferRootTag(nodes);
  const plan = analyzeRuntime(bundle.runtime || bundle.js, rootTag);
  const needsClient = plan.kind !== "none";
  const hasChildren = supportsChildrenProp(nodes, rootTag);
  const primaryText = hasChildren ? getPrimaryText(nodes) : null;
  let jsxBody = jsxFromNodes(nodes, 4, { stripEvents: true });

  if (hasChildren && primaryText) {
    jsxBody = jsxBody.replace(
      primaryText.replace(/[.*+?^${}()|[\]\\]/g, "\\$&"),
      `{children ?? ${JSON.stringify(primaryText)}}`,
    );
  }

  const types = buildTypes(name, rootTag, plan, hasChildren);

  let runtimeFile: string | null = null;
  let hookBlock = "";

  if (plan.kind === "mount") {
    runtimeFile = plan.scopedRuntime;
    hookBlock = `
  const rootRef = useRef<HTMLElement>(null);

  useEffect(() => {
    const root = rootRef.current;
    if (!root) return;
    const api = mount(root, props as Record<string, unknown>);
    return () => api?.unmount?.();
  }, [props]);
`;
  } else if (plan.kind === "listeners") {
    hookBlock = `
  const rootRef = useRef<${rootTag === "table" ? "HTMLTableElement" : "HTMLElement"}>(null);

  useEffect(() => {
${plan.effectBody}
  }, [props.${plan.propName}]);
`;
  }

  const clientDirective = needsClient ? `"use client";\n\n` : "";
  const imports = [
    needsClient ? `import { useEffect, useRef } from "react";` : "",
    plan.kind === "mount" ? `import { mount } from "./runtime";` : "",
    `import type { ${name}Props } from "./types";`,
    `import "./styles.css";`,
  ]
    .filter(Boolean)
    .join("\n");

  const propsDestructure = hasChildren
    ? `{ className, style, children, ...props }`
    : `{ className, style, ...props }`;

  let markup = jsxBody;
  if (nodes.length === 1 && nodes[0]?.type === "element") {
    const tag = nodes[0].tag;
    if (!markup.includes("{...props}")) {
      markup = markup.replace(
        new RegExp(`(<${tag}(?:\\s[^>]*)?)(\\s*\\/?>)`),
        `$1 style={style} {...props}$2`,
      );
    }
    if (nodes[0].tag === "button" && !markup.includes("type=")) {
      markup = markup.replace(`<${tag}`, `<${tag}\n      type="button"`);
    }
  }
  if (needsClient && nodes.length === 1 && nodes[0]?.type === "element") {
    markup = injectRefIntoJsx(markup, nodes[0].tag);
  } else if (needsClient) {
    markup = `    <div className={className} style={style} ref={rootRef} {...props}>\n${jsxBody}\n    </div>`;
  }

  const returnBlock = `  return (\n${markup}\n  );`;

  const component = `${clientDirective}/**
 * ${bundle.json.name || bundle.slug} — CompLib React export
 * @generated
 */

${imports}

export default function ${name}(${propsDestructure}: ${name}Props) {${hookBlock}
${returnBlock}
}
`;

  return { name, component, types, runtimeFile, needsClient };
}

function buildVueComponent(
  bundle: ComponentDiskBundle,
  reactName: string,
  rootTag: string,
  plan: RuntimePlan,
) {
  const name = reactName;
  const nodes = parseHtml(bundle.html);
  const needsRuntime = plan.kind !== "none";
  const template = vueTemplateFromNodes(nodes, 2);
  const types = buildVueTypes(name, plan, supportsChildrenProp(nodes, rootTag));

  let runtimeImport = "";
  let scriptHooks = "";

  if (plan.kind === "mount") {
    runtimeImport = `import { mount } from "./runtime";\n`;
    scriptHooks = `
const root = ref<HTMLElement | null>(null);
let runtimeHandle: { unmount?: () => void } | undefined;

onMounted(() => {
  if (!root.value) return;
  runtimeHandle = mount(root.value, props as Record<string, unknown>);
});

onBeforeUnmount(() => {
  runtimeHandle?.unmount?.();
});
`;
  } else if (plan.kind === "listeners") {
    scriptHooks = `
const root = ref<HTMLElement | null>(null);
const disposers: Array<() => void> = [];

onMounted(() => {
  if (!root.value) return;
  const targets = root.value.querySelectorAll(${JSON.stringify(plan.selector)});
  targets.forEach((target) => {
    const handler = (event: Event) => {
      const value = target.textContent?.trim() ?? "";
      props.${plan.propName}?.(value, event);
    };
    target.addEventListener(${JSON.stringify(plan.eventName)}, handler);
    disposers.push(() => target.removeEventListener(${JSON.stringify(plan.eventName)}, handler));
  });
});

onBeforeUnmount(() => {
  disposers.forEach((dispose) => dispose());
  disposers.length = 0;
});
`;
  }

  const templateWrapped =
    nodes.length > 1
      ? `<div ref="root" :class="props.className">\n${template}\n</div>`
      : needsRuntime
        ? template.replace(/^(\s*<)([a-z][\w-]*)/i, `$1$2 ref="root"`)
        : template;

  const vue = `<script setup lang="ts">
import { onMounted, onBeforeUnmount, ref } from "vue";
import type { ${name}Props } from "./types";
import "./styles.css";
${runtimeImport}
const props = defineProps<${name}Props>();
${scriptHooks}
</script>

<template>
${templateWrapped}
</template>
`;

  return { component: vue, types };
}

function buildTailwindReact(bundle: ComponentDiskBundle) {
  const name = pascalCase(bundle.json.name || bundle.slug) || "Component";
  return {
    name,
    component: `"use client";

import { useMemo } from "react";
import { renderTailwind } from "./tailwind";
import type { ${name}Props } from "./types";

/**
 * Tailwind variant — calls renderTailwind(props) for class strings.
 * Prefer editing tailwind.ts to adjust utility classes.
 */
export default function ${name}({ className, ...props }: ${name}Props) {
  const markup = useMemo(() => renderTailwind(props as Record<string, unknown>), [props]);
  return (
    <div
      className={className}
      data-complib-slug="${bundle.slug}"
      dangerouslySetInnerHTML={{ __html: markup }}
    />
  );
}
`,
    types: `import type { HTMLAttributes } from "react";

export type ${name}Props = HTMLAttributes<HTMLDivElement> & Record<string, unknown>;
`,
    runtimeFile: null as string | null,
    needsClient: true,
  };
}

export function generateFrameworkBundles(
  bundle: ComponentDiskBundle,
): { react: GeneratedFileMap; vue: GeneratedFileMap } {
  const nodes = parseHtml(bundle.html);
  const rootTag = inferRootTag(nodes);
  const plan = analyzeRuntime(bundle.runtime || bundle.js, rootTag);

  const reactResult = bundle.tailwind
    ? buildTailwindReact(bundle)
    : buildReactComponent(bundle);

  const { name, component, types, runtimeFile, needsClient } = reactResult;
  const vueBuilt = buildVueComponent(bundle, name, rootTag, plan);

  const reactFiles: GeneratedFileMap = {
    "Component.tsx": component,
    "types.ts": types,
    "index.ts": `export { default } from "./Component";\nexport type { ${name}Props } from "./types";\n`,
    "styles.css": bundle.css,
    "README.md": buildReadme(name, bundle.slug, "react", needsClient),
  };
  if (runtimeFile) reactFiles["runtime.ts"] = runtimeFile;
  if (bundle.tailwind) reactFiles["tailwind.ts"] = bundle.tailwind;

  const vueFiles: GeneratedFileMap = {
    "Component.vue": vueBuilt.component,
    "types.ts": vueBuilt.types,
    "index.ts": `export { default } from "./Component.vue";\nexport type { ${name}Props } from "./types";\n`,
    "styles.css": bundle.css,
    "README.md": buildReadme(name, bundle.slug, "vue", needsClient),
  };
  if (runtimeFile) vueFiles["runtime.ts"] = runtimeFile;
  if (bundle.tailwind) vueFiles["tailwind.ts"] = bundle.tailwind;

  return { react: reactFiles, vue: vueFiles };
}
