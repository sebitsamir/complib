# CompLib product vision

CompLib is an **interface construction platform**, not merely a component library.

> Find the interface you need, compose it, customize it, and get production-ready code.

## Primary user journey

```text
DISCOVER → UNDERSTAND → PREVIEW → COMPOSE → CUSTOMIZE → VALIDATE → EXPORT → SAVE → REUSE
```

## Seven product systems

| System | Purpose |
|--------|---------|
| **Component Intelligence** | Structured metadata: identity, purpose, variants, dependencies, docs, revisions |
| **Discovery Engine** | Intent-based browse: what you're building → what you need → what style |
| **Composition Engine** | Playground as page builder from CompLib building blocks |
| **Design System Engine** | Tokens, typography, spacing, motion applied consistently |
| **Export Engine** | Validate → resolve deps → generate → format → export (framework builds verified) |
| **Cloud** | Accounts, projects, collections, teams, billing (SaaS layer) |
| **Ecosystem** | Community components, themes, recipes, marketplace |

## Definition of done

CompLib is finished when a user can complete the full journey above **without encountering a broken contract** — not when `npm run build` passes alone.

## Architecture principle

This repository is a **monorepo** (multiple apps + shared packages), not a single monolithic application:

```text
                 COMPLIB MONOREPO
                       │
          ┌────────────┼────────────┐
          │            │            │
       Web App      API App      Packages
          │            │            │
       Next.js      Express       Engines
          │            │            │
          └────────────┼────────────┘
                       │
                    Storage
```

## Execution phases

1. **Baseline** — build, typecheck, tests, DB, catalog sync, artifact storage
2. **Core correctness** — fix broken, dangerous, or inconsistent implementation
3. **Registry** — authoritative component identity and metadata
4. **Component model** — final schema and validation
5. **Explorer** — discovery by components, problems, patterns, solutions
6. **Playground** — composition and customization
7. **Export** — production-grade generated code
8. **User system** — projects, collections, history, saved compositions
9. **Design system engine** — themes and tokens
10. **AI** — compose real CompLib components from the registry
11. **Cloud** — teams, private registries, collaboration
12. **Ecosystem** — community registry and marketplace
13. **Production** — security, performance, a11y, SEO, observability, CI/CD

See [ARCHITECTURE.md](./ARCHITECTURE.md) for engineering law and ownership boundaries.
