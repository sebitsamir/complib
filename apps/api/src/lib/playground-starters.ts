/** Starter compositions for the playground empty state — Phase-1 primitives. */
export type PlaygroundStarter = {
  id: string;
  name: string;
  description: string;
  slugs: string[];
};

export const PLAYGROUND_STARTERS: PlaygroundStarter[] = [
  {
    id: "login-form",
    name: "Login form",
    description: "Heading, inputs, switch, and primary button",
    slugs: ["heading", "input", "input", "switch", "button"],
  },
  {
    id: "toolbar",
    name: "Toolbar strip",
    description: "Search, chips, and icon actions",
    slugs: ["search-input", "chip", "icon-button", "badge"],
  },
  {
    id: "content-stack",
    name: "Content stack",
    description: "Section, heading, paragraph, and divider",
    slugs: ["section", "heading", "paragraph", "divider", "button"],
  },
  {
    id: "dashboard-bits",
    name: "Dashboard bits",
    description: "Grid of surfaces with badge and skeleton",
    slugs: ["grid", "surface", "badge", "skeleton", "avatar"],
  },
];
