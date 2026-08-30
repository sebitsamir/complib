import { z } from "zod";

export const componentLayerSchema = z.enum([
  "primitives",
  "patterns",
  "sections",
  "templates",
]);

export const componentTierSchema = z.enum(["FREE", "PRO", "ENTERPRISE"]);

export const themeNameSchema = z.enum(["light", "dark", "auto"]);

export const componentVariantSchema = z.object({
  id: z.string().min(1),
  label: z.string().min(1),
  props: z.record(z.string()).optional(),
});

/** Constitution of a CompLib component (on-disk + API publish). */
export const componentSpecSchema = z.object({
  schemaVersion: z.literal(1).default(1),
  id: z.string().min(1),
  name: z.string().min(1),
  slug: z.string().regex(/^[a-z0-9]+(?:-[a-z0-9]+)*$/),
  description: z.string().min(1),
  taxonomy: z.object({
    layer: componentLayerSchema,
    category: z.string().min(1),
    problemTags: z.array(z.string().min(1)).min(1),
  }),
  access: z.object({
    tier: componentTierSchema,
  }),
  frameworks: z.array(z.enum(["vanilla", "react", "vue"])).default(["vanilla"]),
  themes: z.array(themeNameSchema).default(["light", "dark", "auto"]),
  variants: z.array(componentVariantSchema).default([]),
  tags: z.array(z.string()).default([]),
  dependencies: z.array(z.string()).default([]),
  documentation: z
    .object({
      usage: z.string().default(""),
      accessibility: z.string().default(""),
      installation: z.string().default(""),
    })
    .optional(),
  examples: z
    .array(
      z.object({
        title: z.string().min(1),
        html: z.string().default(""),
        description: z.string().optional(),
      }),
    )
    .optional(),
});

export type ComponentSpec = z.infer<typeof componentSpecSchema>;

export const createComponentBodySchema = z.object({
  name: z.string().min(1),
  slug: z.string().min(1).optional(),
  description: z.string().min(1),
  html: z.string().default(""),
  css: z.string().default(""),
  js: z.string().default(""),
  tier: componentTierSchema.default("FREE"),
  layer: componentLayerSchema,
  category: z.string().min(1),
  problemTags: z.array(z.string()).min(1),
  tags: z.array(z.string()).optional(),
  themes: z.array(themeNameSchema).optional(),
  variants: z.array(componentVariantSchema).optional(),
  styleFamilies: z.array(z.string()).optional(),
  activeStyleId: z.string().optional(),
});

export const collectionCreateSchema = z.object({
  name: z.string().min(1).max(80),
  description: z.string().max(500).optional(),
});

export const checkoutSchema = z.object({
  plan: z.enum(["PRO", "ENTERPRISE"]),
  cycle: z.enum(["monthly", "annual"]).default("annual"),
});

export const playgroundDocumentSchema = z.object({
  nodes: z.array(z.record(z.unknown())).default([]),
  layout: z.record(z.unknown()).default({}),
  settings: z.record(z.unknown()).default({}),
});
