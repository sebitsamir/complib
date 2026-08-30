import { def, wrapRoot, type CatalogComponentDef } from "@/lib/catalog/shared";

export const CONTENT: CatalogComponentDef[] = [
  def({
    slug: "template-blog",
    name: "Blog",
    layer: "templates",
    category: "content",
    problemTags: ["build-ui-sections", "build-landing-page"],
    description: "Blog homepage with featured post hero, recent article grid, categories, and subscribe CTA.",
    html: wrapRoot(`
  <div class="cl-page t-blog">
    <header class="cl-page__bar">
      <span class="cl-page__brand">The Builder's Notes</span>
      <nav class="cl-page__nav" aria-label="Blog">
        <a href="#">Articles</a>
        <a href="#">Guides</a>
        <a href="#">About</a>
      </nav>
      <button type="button" class="cl-btn cl-btn--secondary">Subscribe</button>
    </header>
    <div class="cl-page__body">
      <section class="t-blog__featured cl-card">
        <span class="cl-kicker">Featured</span>
        <h1 class="t-blog__title">Why design tokens belong in your repo, not just Figma</h1>
        <p class="cl-muted">A practical guide to syncing tokens across design and code — with real examples from production teams.</p>
        <div class="t-blog__meta">
          <span>By Alex Morgan</span><span class="cl-muted">·</span><span class="cl-muted">Aug 7, 2026 · 8 min read</span>
        </div>
        <button type="button" class="cl-btn cl-btn--primary">Read article</button>
      </section>
      <section class="t-blog__recent">
        <h2 class="cl-section__title">Recent posts</h2>
        <div class="cl-grid-3">
          <article class="cl-card t-blog__post">
            <span class="cl-badge">Engineering</span>
            <h3>Component libraries that scale</h3>
            <p class="cl-muted">Patterns for versioning, theming, and adoption across large orgs.</p>
            <span class="cl-muted" style="font-size:calc(var(--cl-font-sm)*.92)">Aug 3 · 6 min</span>
          </article>
          <article class="cl-card t-blog__post">
            <span class="cl-badge">Design</span>
            <h3>Accessibility beyond checklists</h3>
            <p class="cl-muted">How to bake inclusive design into your workflow from day one.</p>
            <span class="cl-muted" style="font-size:calc(var(--cl-font-sm)*.92)">Jul 29 · 5 min</span>
          </article>
          <article class="cl-card t-blog__post">
            <span class="cl-badge">Product</span>
            <h3>Shipping faster with templates</h3>
            <p class="cl-muted">When to use page templates vs. building from scratch every time.</p>
            <span class="cl-muted" style="font-size:calc(var(--cl-font-sm)*.92)">Jul 22 · 4 min</span>
          </article>
        </div>
      </section>
      <section class="t-blog__subscribe cl-card">
        <h2 class="cl-section__title" style="font-size:1.1rem;margin:0 0 8px;text-align:left">Weekly notes for builders</h2>
        <form class="t-blog__form" onsubmit="return false">
          <input type="email" class="cl-input" placeholder="you@company.com" aria-label="Email" />
          <button type="submit" class="cl-btn cl-btn--primary">Subscribe</button>
        </form>
      </section>
    </div>
  </div>`),
    css: `
.t-blog__featured{margin-bottom:36px;background:color-mix(in srgb,var(--cl-primary) 5%,var(--cl-surface))}
.t-blog__title{margin:10px 0 12px;font-size:clamp(1.4rem,2.5vw,1.85rem);letter-spacing:-.03em;line-height:1.2}
.t-blog__meta{display:flex;flex-wrap:wrap;gap:8px;font-size:var(--cl-font-sm);margin-bottom:16px}
.t-blog__recent{margin-bottom:28px}
.t-blog__post{display:flex;flex-direction:column;gap:8px}
.t-blog__post h3{margin:0;font-size:1.05rem}
.t-blog__form{display:flex;gap:10px}
.t-blog__form .cl-input{flex:1}`,
  }),

  def({
    slug: "template-documentation",
    name: "Documentation",
    layer: "templates",
    category: "content",
    problemTags: ["build-ui-sections", "build-landing-page"],
    description: "Docs site with sidebar navigation, article content area, and search bar in header.",
    html: wrapRoot(`
  <div class="cl-page t-docs">
    <header class="cl-page__bar">
      <span class="cl-page__brand">FlowStack Docs</span>
      <input type="search" class="cl-input t-docs__search" placeholder="Search documentation…" aria-label="Search docs" />
      <nav class="cl-page__nav" aria-label="Docs">
        <a href="#">API</a>
        <a href="#">Guides</a>
        <a href="#">Changelog</a>
      </nav>
    </header>
    <div class="t-docs__layout">
      <aside class="t-docs__sidebar">
        <nav aria-label="Documentation sections">
          <a href="#" class="is-active">Getting started</a>
          <a href="#">Installation</a>
          <a href="#">Quick start</a>
          <a href="#">Authentication</a>
          <a href="#">Webhooks</a>
          <a href="#">Rate limits</a>
        </nav>
      </aside>
      <main class="t-docs__main">
        <span class="cl-kicker">Getting started</span>
        <h1 class="t-docs__title">Introduction to FlowStack</h1>
        <p class="cl-muted">FlowStack helps teams automate workflows across CRM, billing, and support tools. This guide walks you through setup in under 10 minutes.</p>
        <h2 class="t-docs__h2">Prerequisites</h2>
        <ul class="t-docs__list cl-muted">
          <li>A FlowStack account (free tier works)</li>
          <li>Admin access to your CRM or data source</li>
          <li>Node.js 18+ for the CLI (optional)</li>
        </ul>
        <h2 class="t-docs__h2">Install the CLI</h2>
        <pre class="t-docs__code"><code>npm install -g @flowstack/cli
flowstack login
flowstack init my-workspace</code></pre>
        <div class="t-docs__next cl-card">
          <strong>Next:</strong> <a href="#" class="cl-link">Connect your first integration &rarr;</a>
        </div>
      </main>
    </div>
  </div>`),
    css: `
.t-docs__search{max-width:240px;flex:1}
.t-docs__layout{display:grid;grid-template-columns:200px 1fr;min-height:420px}
.t-docs__sidebar{padding:20px 14px;background:var(--cl-surface);border-right:1px solid var(--cl-border)}
.t-docs__sidebar nav{display:flex;flex-direction:column;gap:2px}
.t-docs__sidebar a{display:block;padding:8px 10px;border-radius:calc(var(--cl-radius)*.7);font-size:var(--cl-font-sm);color:var(--cl-text-muted);text-decoration:none}
.t-docs__sidebar a:hover,.t-docs__sidebar a.is-active{background:var(--cl-surface-muted);color:var(--cl-text);font-weight:600}
.t-docs__main{padding:28px 24px}
.t-docs__title{margin:10px 0 14px;font-size:1.5rem;letter-spacing:-.02em}
.t-docs__h2{margin:24px 0 10px;font-size:1.1rem}
.t-docs__list{margin:0;padding-left:20px;line-height:1.8}
.t-docs__code{padding:16px;background:var(--cl-surface-muted);border:1px solid var(--cl-border);border-radius:var(--cl-radius);font-family:ui-monospace,monospace;font-size:calc(var(--cl-font-sm)*.92);overflow-x:auto;margin:0}
.t-docs__next{margin-top:28px;display:inline-flex;align-items:center;gap:8px}
@media(max-width:640px){.t-docs__layout{grid-template-columns:1fr}.t-docs__sidebar{display:none}}`,
  }),

  def({
    slug: "template-community",
    name: "Community Forum",
    layer: "templates",
    category: "content",
    problemTags: ["build-ui-sections", "build-landing-page"],
    description: "Community hub with category nav, trending discussions list, and new post CTA.",
    html: wrapRoot(`
  <div class="cl-page t-community">
    <header class="cl-page__bar">
      <span class="cl-page__brand">BuilderHub</span>
      <nav class="cl-page__nav" aria-label="Community">
        <a href="#">Discussions</a>
        <a href="#">Showcase</a>
        <a href="#">Events</a>
        <a href="#">Members</a>
      </nav>
      <button type="button" class="cl-btn cl-btn--primary">New post</button>
    </header>
    <div class="cl-page__body">
      <section class="t-community__hero">
        <h1 class="t-community__title">Where builders share, learn, and ship together</h1>
        <p class="cl-muted">12,400 members · 340 discussions this week</p>
      </section>
      <section class="t-community__cats">
        <span class="cl-badge">Design systems</span>
        <span class="cl-badge">React</span>
        <span class="cl-badge">Career</span>
        <span class="cl-badge">Show &amp; tell</span>
        <span class="cl-badge">Help wanted</span>
      </section>
      <section class="t-community__threads">
        <h2 class="cl-section__title">Trending discussions</h2>
        <div class="t-community__list">
          <article class="cl-card t-community__thread">
            <div class="cl-avatar">JL</div>
            <div class="t-community__thread-body">
              <h3>Best approach for token migration at scale?</h3>
              <p class="cl-muted">We're moving 200+ components to CSS variables — looking for war stories and pitfalls.</p>
              <div class="t-community__thread-meta">
                <span class="cl-muted">Jordan Lee · Design systems</span>
                <span class="cl-badge">42 replies</span>
              </div>
            </div>
          </article>
          <article class="cl-card t-community__thread">
            <div class="cl-avatar">AM</div>
            <div class="t-community__thread-body">
              <h3>Ship log: Launched my SaaS in 30 days</h3>
              <p class="cl-muted">Stack, metrics, and lessons from going from idea to first paying customer.</p>
              <div class="t-community__thread-meta">
                <span class="cl-muted">Alex Morgan · Showcase</span>
                <span class="cl-badge">89 replies</span>
              </div>
            </div>
          </article>
          <article class="cl-card t-community__thread">
            <div class="cl-avatar">NK</div>
            <div class="t-community__thread-body">
              <h3>Hiring: Senior frontend engineer (remote)</h3>
              <p class="cl-muted">NeuralForge is growing the platform team — React, TypeScript, design systems experience.</p>
              <div class="t-community__thread-meta">
                <span class="cl-muted">Nadia Khan · Career</span>
                <span class="cl-badge">12 replies</span>
              </div>
            </div>
          </article>
        </div>
      </section>
    </div>
  </div>`),
    css: `
.t-community__hero{margin-bottom:16px}
.t-community__title{margin:0 0 8px;font-size:clamp(1.4rem,2.5vw,1.85rem);letter-spacing:-.03em}
.t-community__cats{display:flex;flex-wrap:wrap;gap:8px;margin-bottom:28px}
.t-community__list{display:flex;flex-direction:column;gap:12px}
.t-community__thread{display:flex;gap:14px;align-items:flex-start}
.t-community__thread-body{flex:1;min-width:0}
.t-community__thread h3{margin:0 0 6px;font-size:1.05rem}
.t-community__thread-meta{display:flex;flex-wrap:wrap;align-items:center;gap:10px;margin-top:10px;font-size:var(--cl-font-sm)}`,
  }),

  def({
    slug: "template-lms",
    name: "Learning Platform",
    layer: "templates",
    category: "content",
    problemTags: ["build-ui-sections", "build-dashboard"],
    description: "LMS dashboard with course progress, lesson list, instructor sidebar, and continue-learning CTA.",
    html: wrapRoot(`
  <div class="cl-page t-lms">
    <header class="cl-page__bar">
      <span class="cl-page__brand">LearnCraft</span>
      <nav class="cl-page__nav" aria-label="Learning">
        <a href="#">My courses</a>
        <a href="#">Catalog</a>
        <a href="#">Certificates</a>
      </nav>
      <div class="cl-avatar">SC</div>
    </header>
    <div class="cl-page__body">
      <section class="t-lms__welcome">
        <h1 class="t-lms__title">Welcome back, Sam</h1>
        <p class="cl-muted">You're 68% through Design Systems Fundamentals — keep going!</p>
      </section>
      <div class="t-lms__layout">
        <main class="t-lms__main">
          <div class="cl-stat t-lms__progress">
            <p class="cl-stat__value">68%</p>
            <p class="cl-stat__label">Course progress</p>
            <div class="t-lms__bar"><div class="t-lms__bar-fill" style="width:68%"></div></div>
          </div>
          <h2 class="cl-section__title" style="font-size:1.15rem;text-align:left;margin:24px 0 16px">Lessons</h2>
          <div class="t-lms__lessons">
            <article class="cl-card t-lms__lesson t-lms__lesson--done"><span class="cl-badge">Done</span><h3>1. Introduction to design tokens</h3><span class="cl-muted">12 min</span></article>
            <article class="cl-card t-lms__lesson t-lms__lesson--done"><span class="cl-badge">Done</span><h3>2. Building a token architecture</h3><span class="cl-muted">18 min</span></article>
            <article class="cl-card t-lms__lesson t-lms__lesson--active"><span class="cl-badge">In progress</span><h3>3. Component API patterns</h3><span class="cl-muted">22 min</span></article>
            <article class="cl-card t-lms__lesson"><h3>4. Testing and documentation</h3><span class="cl-muted">15 min</span></article>
          </div>
          <button type="button" class="cl-btn cl-btn--primary" style="margin-top:20px">Continue lesson 3</button>
        </main>
        <aside class="t-lms__aside cl-card">
          <h3 style="margin:0 0 12px;font-size:1rem">Your instructor</h3>
          <div style="display:flex;align-items:center;gap:10px;margin-bottom:12px">
            <div class="cl-avatar">AM</div>
            <div><strong>Alex Morgan</strong><br><span class="cl-muted">Design systems lead</span></div>
          </div>
          <p class="cl-muted" style="margin:0 0 16px;font-size:var(--cl-font-sm);line-height:1.5">15 years building scalable UI at Figma and Stripe. Passionate about teaching practical design engineering.</p>
          <button type="button" class="cl-btn cl-btn--secondary" style="width:100%">View profile</button>
        </aside>
      </div>
    </div>
  </div>`),
    css: `
.t-lms__welcome{margin-bottom:24px}
.t-lms__title{margin:0 0 6px;font-size:1.35rem;letter-spacing:-.02em}
.t-lms__layout{display:grid;grid-template-columns:1fr 260px;gap:24px;align-items:start}
.t-lms__progress{position:relative}
.t-lms__bar{height:6px;background:var(--cl-surface-muted);border-radius:999px;margin-top:12px;overflow:hidden}
.t-lms__bar-fill{height:100%;background:var(--cl-primary);border-radius:999px}
.t-lms__lessons{display:flex;flex-direction:column;gap:10px}
.t-lms__lesson{display:flex;flex-wrap:wrap;align-items:center;gap:8px 12px;padding:14px 16px}
.t-lms__lesson h3{margin:0;flex:1;font-size:var(--cl-font-sm);font-weight:600}
.t-lms__lesson--active{border-color:color-mix(in srgb,var(--cl-primary) 35%,var(--cl-border))}
.t-lms__lesson--done{opacity:.75}
@media(max-width:640px){.t-lms__layout{grid-template-columns:1fr}}`,
  }),
];
