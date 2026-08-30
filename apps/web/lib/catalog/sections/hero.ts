import { def, wrapRoot, type CatalogComponentDef } from "@/lib/catalog/shared";

export const HERO: CatalogComponentDef[] = [
  def({
    slug: "section-hero-saas",
    name: "SaaS Hero",
    layer: "sections",
    category: "hero",
    problemTags: ["build-landing-page"],
    description: "Classic SaaS hero with headline, dual CTAs, product preview panel, and trust strip for conversion-focused landing pages.",
    html: wrapRoot(`
<section class="s-saas">
  <div class="cl-section s-saas__inner">
    <div class="s-saas__content">
      <span class="cl-badge">Now in public beta</span>
      <h1 class="s-saas__title">Ship production UI without the design debt</h1>
      <p class="s-saas__lead cl-muted">CompLib gives your team a living catalog of patterns, tokens, and sections — synced to code and ready to drop into any landing page.</p>
      <div class="s-saas__actions">
        <button type="button" class="cl-btn cl-btn--primary">Start free trial</button>
        <button type="button" class="cl-btn cl-btn--secondary">Browse catalog</button>
      </div>
      <div class="s-saas__trust">
        <span class="cl-muted">Trusted by product teams at</span>
        <div class="s-saas__logos">
          <span>Northwind</span><span>Vertex</span><span>Helix</span><span>Orbit</span>
        </div>
      </div>
    </div>
    <div class="s-saas__preview" aria-hidden="true">
      <div class="s-saas__preview-bar"><span></span><span></span><span></span></div>
      <div class="s-saas__preview-body">
        <div class="s-saas__preview-sidebar"></div>
        <div class="s-saas__preview-main">
          <div class="s-saas__preview-card"></div>
          <div class="s-saas__preview-card s-saas__preview-card--sm"></div>
        </div>
      </div>
    </div>
  </div>
</section>`),
    css: `
.s-saas{width:100%;background:linear-gradient(180deg,color-mix(in srgb,var(--cl-primary) 6%,var(--cl-surface-muted)) 0%,var(--cl-surface-muted) 100%)}
.s-saas__inner{display:grid;gap:calc(var(--cl-gap) * 2);align-items:center}
@media(min-width:768px){.s-saas__inner{grid-template-columns:1fr 1fr}}
.s-saas__title{margin:16px 0 12px;font-size:clamp(2rem,4vw,2.75rem);font-weight:800;letter-spacing:-.04em;line-height:1.08}
.s-saas__lead{margin:0 0 24px;font-size:var(--cl-font-md);line-height:1.65;max-width:520px}
.s-saas__actions{display:flex;flex-wrap:wrap;gap:12px;margin-bottom:28px}
.s-saas__trust{display:flex;flex-direction:column;gap:10px}
.s-saas__logos{display:flex;flex-wrap:wrap;gap:16px;font-size:var(--cl-font-sm);font-weight:700;color:var(--cl-text-muted);opacity:.7}
.s-saas__preview{background:var(--cl-surface);border:1px solid var(--cl-border);border-radius:calc(var(--cl-radius) * 1.2);box-shadow:0 24px 48px color-mix(in srgb,var(--cl-primary) 12%,transparent);overflow:hidden}
.s-saas__preview-bar{display:flex;gap:6px;padding:12px 16px;background:var(--cl-surface-muted);border-bottom:1px solid var(--cl-border)}
.s-saas__preview-bar span{width:10px;height:10px;border-radius:999px;background:var(--cl-border)}
.s-saas__preview-body{display:flex;gap:12px;padding:16px;min-height:220px}
.s-saas__preview-sidebar{width:72px;border-radius:8px;background:color-mix(in srgb,var(--cl-primary) 10%,var(--cl-surface-muted))}
.s-saas__preview-main{flex:1;display:flex;flex-direction:column;gap:10px}
.s-saas__preview-card{height:80px;border-radius:8px;background:linear-gradient(135deg,color-mix(in srgb,var(--cl-primary) 14%,#fff),var(--cl-surface-muted))}
.s-saas__preview-card--sm{height:48px;width:70%}`,
  }),

  def({
    slug: "section-hero-startup",
    name: "Startup Hero",
    layer: "sections",
    category: "hero",
    problemTags: ["build-landing-page"],
    description: "Bold startup hero with kicker, stat strip, and energetic copy for early-stage product launches.",
    html: wrapRoot(`
<section class="s-startup">
  <div class="cl-section s-startup__inner">
    <span class="cl-kicker">CompLib for startups</span>
    <h1 class="s-startup__title">Launch your MVP UI in days, not sprints</h1>
    <p class="s-startup__lead cl-muted">Skip the blank canvas. Pick from 200+ production sections, customize tokens once, and ship a credible landing page before your next investor call.</p>
    <div class="s-startup__actions">
      <button type="button" class="cl-btn cl-btn--primary">Get started free</button>
      <button type="button" class="cl-btn cl-btn--ghost">See pricing</button>
    </div>
    <div class="s-startup__stats">
      <div class="cl-stat"><p class="cl-stat__value">200+</p><p class="cl-stat__label">Ready sections</p></div>
      <div class="cl-stat"><p class="cl-stat__value">48h</p><p class="cl-stat__label">Avg. time to launch</p></div>
      <div class="cl-stat"><p class="cl-stat__value">4.9</p><p class="cl-stat__label">Founder rating</p></div>
    </div>
  </div>
</section>`),
    css: `
.s-startup{width:100%;text-align:center;background:var(--cl-surface-muted)}
.s-startup__inner{max-width:720px}
.s-startup__title{margin:12px 0 16px;font-size:clamp(2.1rem,5vw,3rem);font-weight:800;letter-spacing:-.04em;line-height:1.06}
.s-startup__lead{margin:0 auto 28px;max-width:580px;font-size:var(--cl-font-md);line-height:1.65}
.s-startup__actions{display:flex;flex-wrap:wrap;gap:12px;justify-content:center;margin-bottom:40px}
.s-startup__stats{display:grid;gap:var(--cl-gap);grid-template-columns:repeat(auto-fit,minmax(140px,1fr))}`,
  }),

  def({
    slug: "section-hero-ai",
    name: "AI Product Hero",
    layer: "sections",
    category: "hero",
    problemTags: ["build-landing-page"],
    description: "AI-focused hero with capability badges, prompt-style preview, and dual CTAs for intelligent product positioning.",
    html: wrapRoot(`
<section class="s-ai">
  <div class="cl-section s-ai__inner">
    <div class="s-ai__content">
      <span class="cl-badge">AI-assisted workflows</span>
      <h1 class="s-ai__title">Design systems that learn with your product</h1>
      <p class="s-ai__lead cl-muted">CompLib AI suggests section layouts, rewrites copy in your brand voice, and keeps tokens consistent across every page you publish.</p>
      <div class="s-ai__tags">
        <span class="s-ai__tag">Smart layout</span>
        <span class="s-ai__tag">Token sync</span>
        <span class="s-ai__tag">Copy assist</span>
      </div>
      <div class="s-ai__actions">
        <button type="button" class="cl-btn cl-btn--primary">Try AI builder</button>
        <button type="button" class="cl-btn cl-btn--secondary">Watch demo</button>
      </div>
    </div>
    <div class="s-ai__panel">
      <div class="s-ai__prompt">
        <span class="s-ai__prompt-label">Prompt</span>
        <p>Build a pricing section with three tiers, highlight Pro, use teal accent.</p>
      </div>
      <div class="s-ai__output">
        <span class="s-ai__prompt-label">Output</span>
        <div class="s-ai__output-bar"></div>
        <div class="s-ai__output-grid">
          <div></div><div class="s-ai__output-highlight"></div><div></div>
        </div>
      </div>
    </div>
  </div>
</section>`),
    css: `
.s-ai{width:100%;background:radial-gradient(ellipse at 70% 20%,color-mix(in srgb,var(--cl-primary) 12%,transparent),transparent 60%),var(--cl-surface-muted)}
.s-ai__inner{display:grid;gap:calc(var(--cl-gap) * 2);align-items:center}
@media(min-width:768px){.s-ai__inner{grid-template-columns:1fr 1fr}}
.s-ai__title{margin:14px 0 12px;font-size:clamp(1.85rem,3.5vw,2.5rem);font-weight:800;letter-spacing:-.03em;line-height:1.1}
.s-ai__lead{margin:0 0 18px;line-height:1.65;max-width:480px}
.s-ai__tags{display:flex;flex-wrap:wrap;gap:8px;margin-bottom:24px}
.s-ai__tag{padding:6px 12px;border-radius:999px;font-size:calc(var(--cl-font-sm)*.92);font-weight:600;background:var(--cl-surface);border:1px solid var(--cl-border);color:var(--cl-text-muted)}
.s-ai__actions{display:flex;flex-wrap:wrap;gap:12px}
.s-ai__panel{background:var(--cl-surface);border:1px solid var(--cl-border);border-radius:var(--cl-radius);padding:20px;box-shadow:var(--cl-shadow);display:flex;flex-direction:column;gap:16px}
.s-ai__prompt-label{display:block;font-size:calc(var(--cl-font-sm)*.85);font-weight:700;text-transform:uppercase;letter-spacing:.04em;color:var(--cl-primary);margin-bottom:8px}
.s-ai__prompt p,.s-ai__output{font-size:var(--cl-font-sm);line-height:1.55;margin:0;color:var(--cl-text-muted)}
.s-ai__output-bar{height:8px;width:60%;border-radius:4px;background:var(--cl-border);margin-bottom:12px}
.s-ai__output-grid{display:grid;grid-template-columns:repeat(3,1fr);gap:8px}
.s-ai__output-grid div{height:64px;border-radius:8px;background:var(--cl-surface-muted);border:1px solid var(--cl-border)}
.s-ai__output-highlight{background:color-mix(in srgb,var(--cl-primary) 10%,var(--cl-surface))!important;border-color:var(--cl-primary)!important}`,
  }),

  def({
    slug: "section-hero-agency",
    name: "Agency Hero",
    layer: "sections",
    category: "hero",
    problemTags: ["build-landing-page"],
    description: "Agency hero emphasizing client delivery speed, portfolio credibility, and partnership CTAs.",
    html: wrapRoot(`
<section class="s-agency">
  <div class="cl-section s-agency__inner">
    <div class="s-agency__copy">
      <span class="cl-kicker">For agencies</span>
      <h1 class="s-agency__title">Deliver client landing pages 3x faster</h1>
      <p class="s-agency__lead cl-muted">White-label CompLib across projects. Reuse battle-tested sections, export clean HTML/CSS, and keep every client on-brand without rebuilding from scratch.</p>
      <div class="s-agency__actions">
        <button type="button" class="cl-btn cl-btn--primary">Partner program</button>
        <button type="button" class="cl-btn cl-btn--secondary">View case studies</button>
      </div>
      <p class="s-agency__note cl-muted">Used by 120+ studios worldwide</p>
    </div>
    <div class="s-agency__grid">
      <div class="s-agency__card"><span class="s-agency__metric">3x</span><span class="cl-muted">Faster delivery</span></div>
      <div class="s-agency__card"><span class="s-agency__metric">40+</span><span class="cl-muted">Client verticals</span></div>
      <div class="s-agency__card"><span class="s-agency__metric">99%</span><span class="cl-muted">On-time launches</span></div>
      <div class="s-agency__card s-agency__card--accent"><span class="s-agency__metric">Pro</span><span class="cl-muted">White-label tier</span></div>
    </div>
  </div>
</section>`),
    css: `
.s-agency{width:100%;background:var(--cl-surface)}
.s-agency__inner{display:grid;gap:calc(var(--cl-gap) * 2);align-items:center}
@media(min-width:768px){.s-agency__inner{grid-template-columns:1.1fr .9fr}}
.s-agency__title{margin:10px 0 14px;font-size:clamp(1.9rem,3.5vw,2.45rem);font-weight:800;letter-spacing:-.03em;line-height:1.1}
.s-agency__lead{margin:0 0 22px;line-height:1.65;max-width:500px}
.s-agency__actions{display:flex;flex-wrap:wrap;gap:12px;margin-bottom:16px}
.s-agency__note{margin:0;font-size:var(--cl-font-sm)}
.s-agency__grid{display:grid;grid-template-columns:repeat(2,1fr);gap:var(--cl-gap)}
.s-agency__card{padding:20px;background:var(--cl-surface-muted);border:1px solid var(--cl-border);border-radius:var(--cl-radius);display:flex;flex-direction:column;gap:4px}
.s-agency__card--accent{background:color-mix(in srgb,var(--cl-primary) 8%,var(--cl-surface));border-color:color-mix(in srgb,var(--cl-primary) 30%,var(--cl-border))}
.s-agency__metric{font-size:1.5rem;font-weight:800;letter-spacing:-.02em;color:var(--cl-primary)}`,
  }),

  def({
    slug: "section-hero-portfolio",
    name: "Portfolio Hero",
    layer: "sections",
    category: "hero",
    problemTags: ["build-landing-page"],
    description: "Personal portfolio hero with name, role, project highlights, and contact CTAs for creative professionals.",
    html: wrapRoot(`
<section class="s-portfolio">
  <div class="cl-section s-portfolio__inner">
    <div class="s-portfolio__intro">
      <div class="cl-avatar s-portfolio__avatar">JL</div>
      <div>
        <span class="cl-kicker">Design engineer</span>
        <h1 class="s-portfolio__title">Jordan Lee</h1>
        <p class="s-portfolio__role cl-muted">I build design systems and landing pages with CompLib — turning Figma explorations into shippable UI in hours.</p>
      </div>
    </div>
    <div class="s-portfolio__actions">
      <button type="button" class="cl-btn cl-btn--primary">View selected work</button>
      <button type="button" class="cl-btn cl-btn--secondary">Download resume</button>
    </div>
    <div class="s-portfolio__work">
      <article class="s-portfolio__item"><div class="s-portfolio__thumb"></div><h3>Northwind rebrand</h3><p class="cl-muted">Full landing system, 12 sections</p></article>
      <article class="s-portfolio__item"><div class="s-portfolio__thumb"></div><h3>Helix dashboard</h3><p class="cl-muted">Pattern library + tokens</p></article>
      <article class="s-portfolio__item"><div class="s-portfolio__thumb"></div><h3>Orbit launch page</h3><p class="cl-muted">Hero to pricing in one day</p></article>
    </div>
  </div>
</section>`),
    css: `
.s-portfolio{width:100%;background:var(--cl-surface-muted)}
.s-portfolio__intro{display:flex;align-items:flex-start;gap:20px;margin-bottom:24px}
.s-portfolio__avatar{width:64px;height:64px;font-size:1.1rem}
.s-portfolio__title{margin:6px 0 8px;font-size:clamp(1.8rem,3vw,2.3rem);font-weight:800;letter-spacing:-.03em}
.s-portfolio__role{margin:0;line-height:1.6;max-width:520px}
.s-portfolio__actions{display:flex;flex-wrap:wrap;gap:12px;margin-bottom:36px}
.s-portfolio__work{display:grid;gap:var(--cl-gap);grid-template-columns:repeat(auto-fit,minmax(200px,1fr))}
.s-portfolio__item h3{margin:10px 0 4px;font-size:1rem;font-weight:700}
.s-portfolio__item p{margin:0;font-size:var(--cl-font-sm)}
.s-portfolio__thumb{height:120px;border-radius:var(--cl-radius);background:linear-gradient(145deg,color-mix(in srgb,var(--cl-primary) 16%,#fff),var(--cl-surface));border:1px solid var(--cl-border)}`,
  }),

  def({
    slug: "section-hero-product",
    name: "Product Hero",
    layer: "sections",
    category: "hero",
    problemTags: ["build-landing-page"],
    description: "Product-centric hero with feature callouts, screenshot frame, and conversion-focused messaging.",
    html: wrapRoot(`
<section class="s-product">
  <div class="cl-section s-product__inner">
    <div class="cl-section__head">
      <span class="cl-badge">CompLib Catalog</span>
      <h1 class="cl-section__title">Every section your landing page needs</h1>
      <p class="cl-section__lead">Browse heroes, features, pricing, and footers — all token-aware, responsive, and export-ready.</p>
    </div>
    <div class="s-product__frame">
      <div class="s-product__toolbar">
        <span>catalog.complib.dev</span>
        <div class="s-product__toolbar-actions"><span></span><span></span></div>
      </div>
      <div class="s-product__screenshot">
        <aside class="s-product__nav">
          <div></div><div></div><div></div><div></div>
        </aside>
        <main class="s-product__canvas">
          <div class="s-product__hero-block"></div>
          <div class="s-product__grid-block">
            <div></div><div></div><div></div>
          </div>
        </main>
      </div>
    </div>
    <div class="s-product__actions">
      <button type="button" class="cl-btn cl-btn--primary">Explore catalog</button>
      <button type="button" class="cl-btn cl-btn--secondary">Open in editor</button>
    </div>
  </div>
</section>`),
    css: `
.s-product{width:100%;background:var(--cl-surface)}
.s-product__frame{border:1px solid var(--cl-border);border-radius:calc(var(--cl-radius)*1.2);overflow:hidden;box-shadow:0 20px 40px color-mix(in srgb,var(--cl-primary) 10%,transparent);margin-bottom:28px}
.s-product__toolbar{display:flex;align-items:center;justify-content:space-between;padding:10px 16px;background:var(--cl-surface-muted);border-bottom:1px solid var(--cl-border);font-size:calc(var(--cl-font-sm)*.92);color:var(--cl-text-muted)}
.s-product__toolbar-actions{display:flex;gap:6px}
.s-product__toolbar-actions span{width:10px;height:10px;border-radius:999px;background:var(--cl-border)}
.s-product__screenshot{display:flex;min-height:260px}
.s-product__nav{width:160px;padding:16px 12px;background:var(--cl-surface-muted);border-right:1px solid var(--cl-border);display:flex;flex-direction:column;gap:8px}
.s-product__nav div{height:10px;border-radius:4px;background:var(--cl-border)}
.s-product__nav div:first-child{width:80%;background:color-mix(in srgb,var(--cl-primary) 40%,var(--cl-border))}
.s-product__canvas{flex:1;padding:20px;display:flex;flex-direction:column;gap:14px}
.s-product__hero-block{height:72px;border-radius:8px;background:linear-gradient(90deg,color-mix(in srgb,var(--cl-primary) 20%,#fff),var(--cl-surface-muted))}
.s-product__grid-block{display:grid;grid-template-columns:repeat(3,1fr);gap:10px}
.s-product__grid-block div{height:56px;border-radius:8px;background:var(--cl-surface-muted);border:1px solid var(--cl-border)}
.s-product__actions{display:flex;flex-wrap:wrap;gap:12px;justify-content:center}`,
  }),

  def({
    slug: "section-hero-split",
    name: "Split Hero",
    layer: "sections",
    category: "hero",
    problemTags: ["build-landing-page"],
    description: "Two-column split hero balancing copy and visual panel for balanced above-the-fold layouts.",
    html: wrapRoot(`
<section class="s-split">
  <div class="cl-section s-split__inner">
    <div class="s-split__copy">
      <h1 class="s-split__title">One source of truth for your UI</h1>
      <p class="s-split__lead cl-muted">Designers edit tokens. Developers pull components. Marketing ships pages — all from the same CompLib workspace.</p>
      <ul class="s-split__list">
        <li>Token-driven theming across light and dark</li>
        <li>Export HTML, CSS, or React in one click</li>
        <li>Version history for every section</li>
      </ul>
      <div class="s-split__actions">
        <button type="button" class="cl-btn cl-btn--primary">Create workspace</button>
        <button type="button" class="cl-btn cl-btn--ghost">Book a demo</button>
      </div>
    </div>
    <div class="s-split__visual">
      <div class="s-split__card cl-card">
        <span class="cl-kicker">Live sync</span>
        <p class="s-split__stat">847</p>
        <p class="cl-muted">Components synced this week</p>
        <div class="s-split__bar"><span style="width:78%"></span></div>
      </div>
    </div>
  </div>
</section>`),
    css: `
.s-split{width:100%;background:linear-gradient(135deg,var(--cl-surface-muted) 50%,color-mix(in srgb,var(--cl-primary) 5%,var(--cl-surface)) 50%)}
.s-split__inner{display:grid;gap:calc(var(--cl-gap)*2);align-items:center}
@media(min-width:768px){.s-split__inner{grid-template-columns:1fr 1fr}}
.s-split__title{margin:0 0 14px;font-size:clamp(1.85rem,3.2vw,2.4rem);font-weight:800;letter-spacing:-.03em;line-height:1.12}
.s-split__lead{margin:0 0 20px;line-height:1.65}
.s-split__list{margin:0 0 24px;padding:0;list-style:none;display:flex;flex-direction:column;gap:10px;font-size:var(--cl-font-sm)}
.s-split__list li{padding-left:22px;position:relative}
.s-split__list li::before{content:"";position:absolute;left:0;top:8px;width:8px;height:8px;border-radius:999px;background:var(--cl-primary)}
.s-split__actions{display:flex;flex-wrap:wrap;gap:12px}
.s-split__visual{display:flex;justify-content:center}
.s-split__card{max-width:320px;width:100%}
.s-split__stat{margin:8px 0 4px;font-size:2.5rem;font-weight:800;letter-spacing:-.03em;color:var(--cl-primary)}
.s-split__bar{height:8px;border-radius:999px;background:var(--cl-surface-muted);margin-top:16px;overflow:hidden}
.s-split__bar span{display:block;height:100%;border-radius:999px;background:var(--cl-primary)}`,
  }),

  def({
    slug: "section-hero-video",
    name: "Video Hero",
    layer: "sections",
    category: "hero",
    problemTags: ["build-landing-page"],
    description: "Video-forward hero with play button overlay, supporting copy, and secondary CTA for demo-driven products.",
    html: wrapRoot(`
<section class="s-video">
  <div class="cl-section s-video__inner">
    <div class="cl-section__head">
      <h1 class="cl-section__title">See CompLib in action</h1>
      <p class="cl-section__lead">Watch how teams go from blank page to production landing in under ten minutes.</p>
    </div>
    <div class="s-video__player">
      <div class="s-video__poster" role="img" aria-label="Product demo thumbnail">
        <button type="button" class="s-video__play" aria-label="Play demo video">
          <span class="s-video__play-icon"></span>
        </button>
      </div>
      <p class="s-video__caption cl-muted">2 min overview · No signup required</p>
    </div>
    <div class="s-video__actions">
      <button type="button" class="cl-btn cl-btn--primary">Start building</button>
      <button type="button" class="cl-btn cl-btn--secondary">Read docs</button>
    </div>
  </div>
</section>`),
    css: `
.s-video{width:100%;background:var(--cl-surface-muted);text-align:center}
.s-video__player{max-width:720px;margin:0 auto 24px}
.s-video__poster{position:relative;aspect-ratio:16/9;border-radius:calc(var(--cl-radius)*1.1);overflow:hidden;background:linear-gradient(145deg,#0f766e 0%,#134e4a 50%,#0f172a 100%);border:1px solid var(--cl-border);box-shadow:0 20px 48px rgba(15,23,42,.2)}
.s-video__play{position:absolute;inset:0;margin:auto;width:72px;height:72px;border-radius:999px;border:none;background:rgba(255,255,255,.95);cursor:pointer;display:grid;place-items:center;box-shadow:0 8px 24px rgba(0,0,0,.2);transition:transform .2s,box-shadow .2s}
.s-video__play:hover{transform:scale(1.06);box-shadow:0 12px 32px rgba(0,0,0,.25)}
.s-video__play-icon{width:0;height:0;border-style:solid;border-width:10px 0 10px 18px;border-color:transparent transparent transparent var(--cl-primary);margin-left:4px}
.s-video__caption{margin:12px 0 0;font-size:var(--cl-font-sm)}
.s-video__actions{display:flex;flex-wrap:wrap;gap:12px;justify-content:center}`,
  }),

  def({
    slug: "section-hero-minimal",
    name: "Minimal Hero",
    layer: "sections",
    category: "hero",
    problemTags: ["build-landing-page"],
    description: "Clean minimal hero with restrained typography, single focus message, and understated CTAs.",
    html: wrapRoot(`
<section class="s-minimal">
  <div class="cl-section s-minimal__inner">
    <h1 class="s-minimal__title">Better UI, less overhead.</h1>
    <p class="s-minimal__lead cl-muted">CompLib is the component catalog built for teams who ship.</p>
    <div class="s-minimal__actions">
      <button type="button" class="cl-btn cl-btn--primary">Get started</button>
      <a href="#" class="cl-link">Learn more</a>
    </div>
  </div>
</section>`),
    css: `
.s-minimal{width:100%;background:var(--cl-surface);border-top:1px solid var(--cl-border);border-bottom:1px solid var(--cl-border)}
.s-minimal__inner{text-align:center;max-width:560px;padding-top:calc(64px * var(--cl-size-mult));padding-bottom:calc(64px * var(--cl-size-mult))}
.s-minimal__title{margin:0 0 16px;font-size:clamp(2rem,4.5vw,2.8rem);font-weight:700;letter-spacing:-.04em;line-height:1.08}
.s-minimal__lead{margin:0 0 28px;font-size:var(--cl-font-md);line-height:1.6}
.s-minimal__actions{display:flex;flex-wrap:wrap;gap:16px;align-items:center;justify-content:center}`,
  }),

  def({
    slug: "section-hero-interactive",
    name: "Interactive Hero",
    layer: "sections",
    category: "hero",
    problemTags: ["build-landing-page"],
    description: "Tabbed interactive hero switching between audience personas with dynamic preview panels.",
    html: wrapRoot(`
<section class="s-interactive" data-hero-tabs>
  <div class="cl-section s-interactive__inner">
    <div class="cl-section__head">
      <h1 class="cl-section__title">Built for every role on your team</h1>
      <p class="cl-section__lead">Switch perspectives to see how CompLib fits designers, developers, and marketers.</p>
    </div>
    <div class="s-interactive__tabs" role="tablist">
      <button type="button" class="s-interactive__tab is-active" role="tab" data-tab="designers" aria-selected="true">Designers</button>
      <button type="button" class="s-interactive__tab" role="tab" data-tab="developers" aria-selected="false">Developers</button>
      <button type="button" class="s-interactive__tab" role="tab" data-tab="marketers" aria-selected="false">Marketers</button>
    </div>
    <div class="s-interactive__panels">
      <div class="s-interactive__panel is-active" data-panel="designers">
        <div class="s-interactive__copy">
          <h2>Design with live tokens</h2>
          <p class="cl-muted">Adjust color, radius, and density — every section updates instantly in the preview canvas.</p>
          <button type="button" class="cl-btn cl-btn--primary">Open design mode</button>
        </div>
        <div class="s-interactive__preview s-interactive__preview--design"></div>
      </div>
      <div class="s-interactive__panel" data-panel="developers" hidden>
        <div class="s-interactive__copy">
          <h2>Export clean code</h2>
          <p class="cl-muted">Copy HTML/CSS or pull components into your repo with token variables intact.</p>
          <button type="button" class="cl-btn cl-btn--primary">View export docs</button>
        </div>
        <div class="s-interactive__preview s-interactive__preview--code"><code>&lt;section class="cl-section"&gt;...&lt;/section&gt;</code></div>
      </div>
      <div class="s-interactive__panel" data-panel="marketers" hidden>
        <div class="s-interactive__copy">
          <h2>Ship pages fast</h2>
          <p class="cl-muted">Pick sections, swap copy, publish — no engineering ticket required.</p>
          <button type="button" class="cl-btn cl-btn--primary">Launch page builder</button>
        </div>
        <div class="s-interactive__preview s-interactive__preview--market"></div>
      </div>
    </div>
  </div>
</section>`),
    css: `
.s-interactive{width:100%;background:var(--cl-surface-muted)}
.s-interactive__tabs{display:flex;flex-wrap:wrap;gap:8px;justify-content:center;margin-bottom:28px}
.s-interactive__tab{padding:10px 18px;border-radius:999px;border:1px solid var(--cl-border);background:var(--cl-surface);font:inherit;font-size:var(--cl-font-sm);font-weight:600;cursor:pointer;color:var(--cl-text-muted);transition:background .2s,border-color .2s,color .2s}
.s-interactive__tab.is-active,.s-interactive__tab:hover{background:color-mix(in srgb,var(--cl-primary) 10%,var(--cl-surface));border-color:var(--cl-primary);color:var(--cl-primary)}
.s-interactive__panel{display:none;grid;gap:var(--cl-gap);align-items:center}
.s-interactive__panel.is-active{display:grid}
@media(min-width:768px){.s-interactive__panel.is-active{grid-template-columns:1fr 1fr}}
.s-interactive__copy h2{margin:0 0 10px;font-size:1.35rem;font-weight:700}
.s-interactive__copy p{margin:0 0 18px;line-height:1.6;font-size:var(--cl-font-sm)}
.s-interactive__preview{min-height:180px;border-radius:var(--cl-radius);border:1px solid var(--cl-border);background:var(--cl-surface)}
.s-interactive__preview--design{background:linear-gradient(135deg,color-mix(in srgb,var(--cl-primary) 12%,#fff),var(--cl-surface))}
.s-interactive__preview--code{display:flex;align-items:center;padding:24px;font-family:ui-monospace,monospace;font-size:var(--cl-font-sm);color:var(--cl-text-muted);background:#0f172a;color:#94a3b8}
.s-interactive__preview--market{background:repeating-linear-gradient(0deg,transparent,transparent 28px,var(--cl-border) 28px,var(--cl-border) 29px),var(--cl-surface)}`,
    js: `
(function(){
  var root=document.querySelector('[data-hero-tabs]');
  if(!root)return;
  var tabs=root.querySelectorAll('[data-tab]');
  var panels=root.querySelectorAll('[data-panel]');
  tabs.forEach(function(tab){
    tab.addEventListener('click',function(){
      var id=tab.getAttribute('data-tab');
      tabs.forEach(function(t){t.classList.remove('is-active');t.setAttribute('aria-selected','false');});
      panels.forEach(function(p){
        var active=p.getAttribute('data-panel')===id;
        p.classList.toggle('is-active',active);
        p.hidden=!active;
      });
      tab.classList.add('is-active');
      tab.setAttribute('aria-selected','true');
    });
  });
})();`,
  }),
];
