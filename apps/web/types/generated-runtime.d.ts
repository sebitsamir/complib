/**
 * Type declarations for generated component runtimes (JS bundles).
 * Keeps `npm run build` passing without stripping generated source files.
 */
declare module "**/runtime" {
  export function mount(
    root: HTMLElement | null,
    props?: Record<string, unknown>,
  ): { unmount?: () => void };
}

declare module "**/runtime.js" {
  export function mount(
    root: HTMLElement | null,
    props?: Record<string, unknown>,
  ): { unmount?: () => void };
}
