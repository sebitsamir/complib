import type { PlaygroundInstance } from "@/lib/playground-merge";
import { mergePlaygroundToFiles } from "@/lib/playground-merge";
import type { ComponentFramework } from "@/lib/framework-output";
import type { PlaygroundExportStack } from "@/lib/playground-request";

type FileMap = Record<string, string>;

function needsTailwind(files: FileMap): boolean {
  return Object.keys(files).some((p) => p.endsWith("/tailwind.ts") || p.endsWith("\\tailwind.ts"));
}

function indent(code: string, spaces: number) {
  const pad = " ".repeat(spaces);
  return code
    .split("\n")
    .map((l) => (l.length ? pad + l : l))
    .join("\n");
}

function viteReactScaffold(appFiles: FileMap, useTailwind: boolean): FileMap {
  // Ensure Vite entry imports global CSS (Tailwind directives if enabled).
  const main = `import "./index.css";\n${appFiles["src/main.tsx"] ?? ""}`.trim() + "\n";

  return {
    ...appFiles,
    "package.json": JSON.stringify(
      {
        name: "complib-playground-vite-react",
        private: true,
        version: "0.0.0",
        type: "module",
        scripts: {
          dev: "vite",
          build: "tsc -b && vite build",
          preview: "vite preview",
        },
        dependencies: {
          react: "^19.2.5",
          "react-dom": "^19.2.5",
        },
        devDependencies: {
          typescript: "^6.0.3",
          vite: "^7.0.0",
          "@vitejs/plugin-react": "^5.0.0",
          ...(useTailwind
            ? {
                tailwindcss: "^4.0.0",
                postcss: "^8.5.10",
                autoprefixer: "^10.5.0",
              }
            : {}),
        },
      },
      null,
      2,
    ),
    "vite.config.ts": `import { defineConfig } from "vite";
import react from "@vitejs/plugin-react";

export default defineConfig({
  plugins: [react()],
});
`,
    "tsconfig.json": JSON.stringify(
      {
        compilerOptions: {
          target: "ES2022",
          lib: ["ES2022", "DOM", "DOM.Iterable"],
          module: "ESNext",
          moduleResolution: "Bundler",
          jsx: "react-jsx",
          strict: true,
          skipLibCheck: true,
          noEmit: true,
          types: ["vite/client"],
          baseUrl: ".",
        },
        include: ["src"],
      },
      null,
      2,
    ),
    ...(useTailwind
      ? {
          "postcss.config.cjs": `module.exports = {
  plugins: {
    tailwindcss: {},
    autoprefixer: {},
  },
};
`,
          "tailwind.config.ts": `import type { Config } from "tailwindcss";

export default {
  content: ["./index.html", "./src/**/*.{ts,tsx}"],
  theme: { extend: {} },
  plugins: [],
} satisfies Config;
`,
        }
      : {}),
    "src/index.css": useTailwind ? `@import "tailwindcss";\n` : "",
    "README.md": `# CompLib playground (Vite + React)

This project was generated from CompLib Playground.

## Run

\`\`\`bash
npm install
npm run dev
\`\`\`

## Notes

- \`node_modules\` is intentionally not included in downloads.
- Generated components live under \`src/components/\`.
${useTailwind ? "- Tailwind is enabled because at least one component uses Tailwind classes.\n" : ""}`,
    "src/main.tsx": main,
  };
}

function viteVueScaffold(appFiles: FileMap, useTailwind: boolean): FileMap {
  const main = `import "./index.css";\n${appFiles["src/main.ts"] ?? ""}`.trim() + "\n";
  return {
    ...appFiles,
    "package.json": JSON.stringify(
      {
        name: "complib-playground-vite-vue",
        private: true,
        version: "0.0.0",
        type: "module",
        scripts: {
          dev: "vite",
          build: "vue-tsc -p tsconfig.json --noEmit && vite build",
          preview: "vite preview",
        },
        dependencies: {
          vue: "^3.5.0",
        },
        devDependencies: {
          typescript: "^6.0.3",
          vite: "^7.0.0",
          "@vitejs/plugin-vue": "^6.0.0",
          "vue-tsc": "^3.0.0",
          ...(useTailwind
            ? {
                tailwindcss: "^4.0.0",
                postcss: "^8.5.10",
                autoprefixer: "^10.5.0",
              }
            : {}),
        },
      },
      null,
      2,
    ),
    "vite.config.ts": `import { defineConfig } from "vite";
import vue from "@vitejs/plugin-vue";

export default defineConfig({
  plugins: [vue()],
});
`,
    "tsconfig.json": JSON.stringify(
      {
        compilerOptions: {
          target: "ES2022",
          useDefineForClassFields: true,
          module: "ESNext",
          lib: ["ES2022", "DOM", "DOM.Iterable"],
          skipLibCheck: true,
          moduleResolution: "Bundler",
          resolveJsonModule: true,
          isolatedModules: true,
          noEmit: true,
          jsx: "preserve",
          strict: true,
          types: ["vite/client"],
        },
        include: ["src/**/*.ts", "src/**/*.d.ts", "src/**/*.tsx", "src/**/*.vue"],
      },
      null,
      2,
    ),
    ...(useTailwind
      ? {
          "postcss.config.cjs": `module.exports = {
  plugins: {
    tailwindcss: {},
    autoprefixer: {},
  },
};
`,
          "tailwind.config.ts": `import type { Config } from "tailwindcss";

export default {
  content: ["./index.html", "./src/**/*.{ts,tsx,vue}"],
  theme: { extend: {} },
  plugins: [],
} satisfies Config;
`,
        }
      : {}),
    "src/index.css": useTailwind ? `@import "tailwindcss";\n` : "",
    "README.md": `# CompLib playground (Vite + Vue)

This project was generated from CompLib Playground.

## Run

\`\`\`bash
npm install
npm run dev
\`\`\`

## Notes

- \`node_modules\` is intentionally not included in downloads.
- Generated components live under \`src/components/\`.
${useTailwind ? "- Tailwind is enabled because at least one component uses Tailwind classes.\n" : ""}`,
    "src/main.ts": main,
  };
}

function nextAppScaffold(appFiles: FileMap, useTailwind: boolean): FileMap {
  // Convert Vite-style src/App.tsx into a Next app/page.tsx.
  const appTsx = appFiles["src/App.tsx"] ?? "";
  const appBody = appTsx.replace(/^\s*export\s+default\s+function\s+App\(\)\s*\{\s*/m, "");
  const pageInner = appBody.replace(/\s*\}\s*$/m, "").trim();

  // Extract the imports from App.tsx.
  const importLines = appTsx
    .split("\n")
    .filter((l) => l.trim().startsWith("import "))
    .join("\n");

  const page = `${importLines}

export default function Page() {
${indent(pageInner, 2)}
}
`;

  const files: FileMap = {};
  for (const [k, v] of Object.entries(appFiles)) {
    if (k === "src/main.tsx") continue;
    if (k === "src/App.tsx") continue;
    // Move src/components -> components/complib
    if (k.startsWith("src/components/")) {
      files[`components/complib/${k.slice("src/components/".length)}`] = v;
      continue;
    }
    // Keep any other src/* files for now under src/ (rare), but Next won't use them.
    files[k] = v;
  }

  // Adjust imports inside the generated page to point at Next location.
  const fixedPage = page.replace(/from "\.\/components\//g, 'from "@/components/complib/');

  return {
    ...files,
    "package.json": JSON.stringify(
      {
        name: "complib-playground-next",
        private: true,
        version: "0.0.0",
        scripts: {
          dev: "next dev",
          build: "next build",
          start: "next start",
        },
        dependencies: {
          next: "^16.2.4",
          react: "^19.2.5",
          "react-dom": "^19.2.5",
        },
        devDependencies: {
          typescript: "^6.0.3",
          "@types/node": "^25.6.0",
          "@types/react": "^19.2.14",
          "@types/react-dom": "^19.2.3",
          ...(useTailwind
            ? {
                tailwindcss: "^4.0.0",
                postcss: "^8.5.10",
                autoprefixer: "^10.5.0",
              }
            : {}),
        },
      },
      null,
      2,
    ),
    "next.config.ts": `import type { NextConfig } from "next";

const nextConfig: NextConfig = {};
export default nextConfig;
`,
    "tsconfig.json": JSON.stringify(
      {
        compilerOptions: {
          target: "ES2022",
          lib: ["DOM", "DOM.Iterable", "ES2022"],
          allowJs: true,
          skipLibCheck: true,
          strict: true,
          noEmit: true,
          module: "ESNext",
          moduleResolution: "Bundler",
          resolveJsonModule: true,
          isolatedModules: true,
          jsx: "preserve",
          incremental: true,
          baseUrl: ".",
          paths: { "@/*": ["./*"] },
        },
        include: ["next-env.d.ts", "**/*.ts", "**/*.tsx", ".next/types/**/*.ts"],
        exclude: ["node_modules"],
      },
      null,
      2,
    ),
    "next-env.d.ts": `/// <reference types="next" />
/// <reference types="next/image-types/global" />
`,
    ...(useTailwind
      ? {
          "postcss.config.cjs": `module.exports = {
  plugins: {
    tailwindcss: {},
    autoprefixer: {},
  },
};
`,
          "tailwind.config.ts": `import type { Config } from "tailwindcss";

export default {
  content: ["./app/**/*.{ts,tsx}", "./components/**/*.{ts,tsx}"],
  theme: { extend: {} },
  plugins: [],
} satisfies Config;
`,
        }
      : {}),
    "app/layout.tsx": `import "./globals.css";

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="en">
      <body>{children}</body>
    </html>
  );
}
`,
    "app/page.tsx": fixedPage,
    "app/globals.css": useTailwind ? `@import "tailwindcss";\n` : "",
    "README.md": `# CompLib playground (Next.js App Router)

This project was generated from CompLib Playground.

## Run

\`\`\`bash
npm install
npm run dev
\`\`\`

## Notes

- \`node_modules\` is intentionally not included in downloads.
- Generated components live under \`components/complib/\`.
${useTailwind ? "- Tailwind is enabled because at least one component uses Tailwind classes.\n" : ""}`,
  };
}

export async function buildPlaygroundScaffoldFiles(
  instances: PlaygroundInstance[],
  framework: ComponentFramework,
  stack: PlaygroundExportStack,
): Promise<FileMap> {
  // Start from existing “source bundle” generator.
  const appFiles = await mergePlaygroundToFiles(instances, framework);
  const useTailwind = needsTailwind(appFiles);

  if (stack === "vite-react") return viteReactScaffold(appFiles, useTailwind);
  if (stack === "vite-vue") return viteVueScaffold(appFiles, useTailwind);
  return nextAppScaffold(appFiles, useTailwind);
}

