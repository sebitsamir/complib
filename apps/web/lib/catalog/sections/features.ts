import { def, wrapRoot, type CatalogComponentDef } from "@/lib/catalog/shared";

export const FEATURES: CatalogComponentDef[] = [
  def({
    slug: "section-features-grid",
    name: "Features Grid",
    layer: "sections",
    category: "features",
    problemTags: ["build-landing-page"],
    description: "Three-column feature grid with icons, titles, and supporting copy for product capability overviews.",
    html: wrapRoot(`
<section class="s-fgrid">
  <div class="cl-section">
    <div class="cl-section__head">
      <span class="cl-kicker">Platform</span>
      <h2 class="cl-section__title">Everything you need to ship UI</h2>
      <p class="cl-section__lead">From tokens to templates, CompLib covers the full lifecycle of production interface design.</p>
    </div>
    <div class="cl-grid-3">
      <article class="cl-card s-fgrid__item">
        <div class="cl-icon" aria-hidden="true">T</div>
        <h3>Design tokens</h3>
        <p class="cl-muted">Centralize color, spacing, and typography. Changes propagate to every component automatically.</p>
      </article>
      <article class="cl-card s-fgrid__item">
        <div class="cl-icon" aria-hidden="true">C</div>
        <h3>Component catalog</h3>
        <p class="cl-muted">Browse patterns, sections, and templates organized by layer and use case.</p>
      </article>
      <article class="cl-card s-fgrid__item">
        <div class="cl-icon" aria-hidden="true">E</div>
        <h3>One-click export</h3>
        <p class="cl-muted">Copy HTML/CSS or sync to your repo. No manual cleanup required.</p>
      </article>
      <article class="cl-card s-fgrid__item">
        <div class="cl-icon" aria-hidden="true">V</div>
        <h3>Version history</h3>
        <p class="cl-muted">Track changes across sections and roll back when experiments miss the mark.</p>
      </article>
      <article class="cl-card s-fgrid__item">
        <div class="cl-icon" aria-hidden="true">F</div>
        <h3>Figma sync</h3>
        <p class="cl-muted">Push token updates and component specs directly to your design files.</p>
      </article>
      <article class="cl-card s-fgrid__item">
        <div class="cl-icon" aria-hidden="true">A</div>
        <h3>Access control</h3>
        <p class="cl-muted">Role-based permissions for designers, developers, and external collaborators.</p>
      </article>
    </div>
  </div>
</section>`),
    css: `
.s-fgrid{width:100%;background:var(--cl-surface)}
.s-fgrid__item{display:flex;flex-direction:column;gap:10px}
.s-fgrid__item h3{margin:0;font-size:1.05rem;font-weight:700}
.s-fgrid__item p{margin:0;font-size:var(--cl-font-sm);line-height:1.55}`,
  }),

  def({
    slug: "section-features-bento",
    name: "Features Bento",
    layer: "sections",
    category: "features",
    problemTags: ["build-landing-page"],
    description: "Bento-style asymmetric feature layout with varied card sizes for visual hierarchy and depth.",
    html: wrapRoot(`
<section class="s-bento">
  <div class="cl-section">
    <div class="cl-section__head">
      <h2 class="cl-section__title">A workspace that scales with you</h2>
      <p class="cl-section__lead">Mix and match capabilities in a layout that highlights what matters most.</p>
    </div>
    <div class="s-bento__grid">
      <article class="cl-card s-bento__cell s-bento__cell--wide">
        <span class="cl-badge">Most popular</span>
        <h3>Section library</h3>
        <p class="cl-muted">30+ production sections across heroes, features, pricing, and more — all token-aware.</p>
        <div class="s-bento__visual"></div>
      </article>
      <article class="cl-card s-bento__cell">
        <h3>Live preview</h3>
        <p class="cl-muted">See changes in real time as you adjust tokens and content.</p>
      </article>
      <article class="cl-card s-bento__cell">
        <h3>Dark mode</h3>
        <p class="cl-muted">Every section ships with light, dark, and auto theme support.</p>
      </article>
      <article class="cl-card s-bento__cell s-bento__cell--tall">
        <h3>Team workspaces</h3>
        <p class="cl-muted">Shared libraries, comment threads, and approval flows keep everyone aligned.</p>
        <ul class="s-bento__list cl-muted">
          <li>Unlimited viewers</li>
          <li>SSO on Pro</li>
          <li>Audit logs</li>
        </ul>
      </article>
      <article class="cl-card s-bento__cell s-bento__cell--accent">
        <h3>API access</h3>
        <p class="cl-muted">Programmatically fetch components and tokens for CI pipelines.</p>
        <a href="#" class="cl-link">Read API docs &rarr;</a>
      </article>
    </div>
  </div>
</section>`),
    css: `
.s-bento{width:100%;background:var(--cl-surface-muted)}
.s-bento__grid{display:grid;gap:var(--cl-gap);grid-template-columns:repeat(auto-fit,minmax(240px,1fr))}
@media(min-width:768px){.s-bento__grid{grid-template-columns:repeat(3,1fr)}}
.s-bento__cell{display:flex;flex-direction:column;gap:10px}
.s-bento__cell h3{margin:0;font-size:1.05rem;font-weight:700}
.s-bento__cell p{margin:0;font-size:var(--cl-font-sm);line-height:1.55}
.s-bento__cell--wide{grid-column:span 1}
@media(min-width:768px){.s-bento__cell--wide{grid-column:span 2}}
.s-bento__cell--tall{grid-row:span 1}
@media(min-width:768px){.s-bento__cell--tall{grid-row:span 2}}
.s-bento__cell--accent{background:color-mix(in srgb,var(--cl-primary) 6%,var(--cl-surface));border-color:color-mix(in srgb,var(--cl-primary) 25%,var(--cl-border))}
.s-bento__visual{height:100px;margin-top:auto;border-radius:8px;background:linear-gradient(135deg,color-mix(in srgb,var(--cl-primary) 14%,#fff),var(--cl-surface-muted))}
.s-bento__list{margin:8px 0 0;padding:0;list-style:none;font-size:var(--cl-font-sm);display:flex;flex-direction:column;gap:6px}
.s-bento__list li{padding-left:16px;position:relative}
.s-bento__list li::before{content:"";position:absolute;left:0;top:7px;width:6px;height:6px;border-radius:999px;background:var(--cl-primary)}`,
  }),

  def({
    slug: "section-features-timeline",
    name: "Features Timeline",
    layer: "sections",
    category: "features",
    problemTags: ["build-landing-page"],
    description: "Vertical timeline showcasing product milestones or workflow steps with connected nodes.",
    html: wrapRoot(`
<section class="s-timeline">
  <div class="cl-section">
    <div class="cl-section__head">
      <span class="cl-kicker">Workflow</span>
      <h2 class="cl-section__title">From idea to live page in four steps</h2>
      <p class="cl-section__lead">CompLib streamlines the path from exploration to production deployment.</p>
    </div>
    <ol class="s-timeline__list">
      <li class="s-timeline__item">
        <span class="s-timeline__node">1</span>
        <div class="s-timeline__body">
          <h3>Pick a template</h3>
          <p class="cl-muted">Start from a SaaS, startup, or marketing template with pre-built section flows.</p>
        </div>
      </li>
      <li class="s-timeline__item">
        <span class="s-timeline__node">2</span>
        <div class="s-timeline__body">
          <h3>Customize tokens</h3>
          <p class="cl-muted">Set your brand colors, radius, and density once — every section adapts.</p>
        </div>
      </li>
      <li class="s-timeline__item">
        <span class="s-timeline__node">3</span>
        <div class="s-timeline__body">
          <h3>Edit content</h3>
          <p class="cl-muted">Swap headlines, CTAs, and imagery inline without touching code.</p>
        </div>
      </li>
      <li class="s-timeline__item">
        <span class="s-timeline__node">4</span>
        <div class="s-timeline__body">
          <h3>Export and ship</h3>
          <p class="cl-muted">Deploy static HTML or integrate components into your existing stack.</p>
        </div>
      </li>
    </ol>
  </div>
</section>`),
    css: `
.s-timeline{width:100%;background:var(--cl-surface)}
.s-timeline__list{margin:0;padding:0;list-style:none;max-width:640px;margin-inline:auto;display:flex;flex-direction:column;gap:0}
.s-timeline__item{display:grid;grid-template-columns:48px 1fr;gap:20px;padding-bottom:32px;position:relative}
.s-timeline__item:not(:last-child)::after{content:"";position:absolute;left:23px;top:48px;bottom:0;width:2px;background:var(--cl-border)}
.s-timeline__node{width:48px;height:48px;border-radius:999px;display:grid;place-items:center;font-weight:800;font-size:var(--cl-font-sm);background:color-mix(in srgb,var(--cl-primary) 12%,var(--cl-surface));color:var(--cl-primary);border:2px solid var(--cl-primary);position:relative;z-index:1}
.s-timeline__body h3{margin:0 0 6px;font-size:1.05rem;font-weight:700}
.s-timeline__body p{margin:0;font-size:var(--cl-font-sm);line-height:1.55}`,
  }),

  def({
    slug: "section-features-comparison",
    name: "Features Comparison",
    layer: "sections",
    category: "features",
    problemTags: ["build-landing-page"],
    description: "Side-by-side feature comparison table highlighting CompLib advantages over alternatives.",
    html: wrapRoot(`
<section class="s-compare">
  <div class="cl-section">
    <div class="cl-section__head">
      <h2 class="cl-section__title">Why teams choose CompLib</h2>
      <p class="cl-section__lead">See how a dedicated component catalog compares to generic page builders and hand-coded sections.</p>
    </div>
    <div class="s-compare__wrap">
      <table class="cl-table s-compare__table">
        <thead>
          <tr>
            <th>Capability</th>
            <th>CompLib</th>
            <th>Page builders</th>
            <th>Hand-coded</th>
          </tr>
        </thead>
        <tbody>
          <tr><td>Design token sync</td><td><span class="s-compare__yes">Yes</span></td><td><span class="s-compare__partial">Limited</span></td><td><span class="s-compare__no">Manual</span></td></tr>
          <tr><td>Clean HTML/CSS export</td><td><span class="s-compare__yes">Yes</span></td><td><span class="s-compare__no">No</span></td><td><span class="s-compare__yes">Yes</span></td></tr>
          <tr><td>Production section library</td><td><span class="s-compare__yes">200+</span></td><td><span class="s-compare__partial">Templates</span></td><td><span class="s-compare__no">Build each</span></td></tr>
          <tr><td>Version control</td><td><span class="s-compare__yes">Built-in</span></td><td><span class="s-compare__partial">Basic</span></td><td><span class="s-compare__yes">Git</span></td></tr>
          <tr><td>Time to first page</td><td><span class="s-compare__yes">Hours</span></td><td><span class="s-compare__partial">Days</span></td><td><span class="s-compare__no">Weeks</span></td></tr>
        </tbody>
      </table>
    </div>
  </div>
</section>`),
    css: `
.s-compare{width:100%;background:var(--cl-surface-muted)}
.s-compare__wrap{overflow-x:auto;border:1px solid var(--cl-border);border-radius:var(--cl-radius);background:var(--cl-surface)}
.s-compare__table{margin:0}
.s-compare__table td:first-child{font-weight:600}
.s-compare__yes{color:var(--cl-primary);font-weight:700}
.s-compare__partial{color:var(--cl-text-muted);font-weight:600}
.s-compare__no{color:var(--cl-text-muted);opacity:.7}`,
  }),

  def({
    slug: "section-features-interactive",
    name: "Interactive Features",
    layer: "sections",
    category: "features",
    problemTags: ["build-landing-page"],
    description: "Tabbed feature section with toggleable content panels for deep-dive product capabilities.",
    html: wrapRoot(`
<section class="s-finteractive" data-feature-tabs>
  <div class="cl-section">
    <div class="cl-section__head">
      <h2 class="cl-section__title">Deep dive into the platform</h2>
      <p class="cl-section__lead">Explore the capabilities that make CompLib the go-to catalog for SaaS teams.</p>
    </div>
    <div class="s-finteractive__layout">
      <div class="s-finteractive__nav" role="tablist">
        <button type="button" class="s-finteractive__btn is-active" role="tab" data-ftab="tokens">Token engine</button>
        <button type="button" class="s-finteractive__btn" role="tab" data-ftab="catalog">Catalog browser</button>
        <button type="button" class="s-finteractive__btn" role="tab" data-ftab="export">Export pipeline</button>
      </div>
      <div class="s-finteractive__content">
        <div class="s-finteractive__pane is-active" data-fpanel="tokens">
          <h3>Centralized design tokens</h3>
          <p class="cl-muted">Define colors, spacing, typography, and radius once. Every pattern and section reads from the same source, ensuring brand consistency across your entire product surface.</p>
          <ul class="s-finteractive__bullets cl-muted">
            <li>CSS custom properties output</li>
            <li>Light, dark, and auto themes</li>
            <li>Size and density multipliers</li>
          </ul>
        </div>
        <div class="s-finteractive__pane" data-fpanel="catalog" hidden>
          <h3>Organized by layer and category</h3>
          <p class="cl-muted">Browse primitives, patterns, sections, and full templates. Filter by problem tag, tier, or style variant to find exactly what your page needs.</p>
          <ul class="s-finteractive__bullets cl-muted">
            <li>200+ production components</li>
            <li>Glass and minimal style variants</li>
            <li>Live preview with token overrides</li>
          </ul>
        </div>
        <div class="s-finteractive__pane" data-fpanel="export" hidden>
          <h3>Export that developers trust</h3>
          <p class="cl-muted">Copy semantic HTML with scoped CSS classes, or integrate via API. No proprietary runtime, no vendor lock-in — just clean, portable code.</p>
          <ul class="s-finteractive__bullets cl-muted">
            <li>HTML/CSS/JS bundles</li>
            <li>GitHub sync on Pro</li>
            <li>CI-friendly API endpoints</li>
          </ul>
        </div>
      </div>
    </div>
  </div>
</section>`),
    css: `
.s-finteractive{width:100%;background:var(--cl-surface)}
.s-finteractive__layout{display:grid;gap:calc(var(--cl-gap)*1.5)}
@media(min-width:768px){.s-finteractive__layout{grid-template-columns:220px 1fr;align-items:start}}
.s-finteractive__nav{display:flex;flex-direction:column;gap:6px}
@media(max-width:767px){.s-finteractive__nav{flex-direction:row;flex-wrap:wrap}}
.s-finteractive__btn{text-align:left;padding:12px 16px;border-radius:var(--cl-radius);border:1px solid transparent;background:transparent;font:inherit;font-size:var(--cl-font-sm);font-weight:600;cursor:pointer;color:var(--cl-text-muted);transition:background .2s,border-color .2s,color .2s}
.s-finteractive__btn.is-active,.s-finteractive__btn:hover{background:color-mix(in srgb,var(--cl-primary) 8%,var(--cl-surface));border-color:color-mix(in srgb,var(--cl-primary) 30%,var(--cl-border));color:var(--cl-primary)}
.s-finteractive__content{padding:24px;background:var(--cl-surface-muted);border:1px solid var(--cl-border);border-radius:var(--cl-radius);min-height:200px}
.s-finteractive__pane{display:none}
.s-finteractive__pane.is-active{display:block}
.s-finteractive__pane h3{margin:0 0 10px;font-size:1.15rem;font-weight:700}
.s-finteractive__pane p{margin:0 0 16px;line-height:1.6;font-size:var(--cl-font-sm)}
.s-finteractive__bullets{margin:0;padding:0;list-style:none;display:flex;flex-direction:column;gap:8px;font-size:var(--cl-font-sm)}
.s-finteractive__bullets li{padding-left:18px;position:relative}
.s-finteractive__bullets li::before{content:"";position:absolute;left:0;top:8px;width:6px;height:6px;border-radius:999px;background:var(--cl-primary)}`,
    js: `
(function(){
  var root=document.querySelector('[data-feature-tabs]');
  if(!root)return;
  var btns=root.querySelectorAll('[data-ftab]');
  var panes=root.querySelectorAll('[data-fpanel]');
  btns.forEach(function(btn){
    btn.addEventListener('click',function(){
      var id=btn.getAttribute('data-ftab');
      btns.forEach(function(b){b.classList.remove('is-active');});
      panes.forEach(function(p){
        var active=p.getAttribute('data-fpanel')===id;
        p.classList.toggle('is-active',active);
        p.hidden=!active;
      });
      btn.classList.add('is-active');
    });
  });
})();`,
  }),
];
