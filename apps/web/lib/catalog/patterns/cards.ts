import { def, wrapRoot, type CatalogComponentDef } from "@/lib/catalog/shared";

export const CARDS: CatalogComponentDef[] = [
  def({
    slug: "card-basic",
    name: "Basic Card",
    layer: "patterns",
    category: "cards",
    problemTags: ["build-ui-sections", "build-dashboard"],
    description: "Versatile content card with title, summary, and primary action for dashboards and detail panels.",
    html: wrapRoot(`
<article class="c-basic">
  <header class="c-basic__head">
    <span class="cl-kicker">Workspace</span>
    <h3 class="c-basic__title">Q3 pipeline review</h3>
  </header>
  <p class="c-basic__body cl-muted">Consolidate deal stages, forecast accuracy, and team capacity before the board sync on Thursday.</p>
  <footer class="c-basic__foot">
    <button type="button" class="cl-btn cl-btn--primary">Open report</button>
    <button type="button" class="cl-btn cl-btn--ghost">Share</button>
  </footer>
</article>`),
    css: `
.c-basic{max-width:420px;display:flex;flex-direction:column;gap:16px;padding:24px;background:var(--cl-surface);border:1px solid var(--cl-border);border-radius:var(--cl-radius);box-shadow:var(--cl-shadow)}
.c-basic__title{margin:8px 0 0;font-size:1.15rem;font-weight:700;letter-spacing:-.02em}
.c-basic__body{margin:0;line-height:1.6;font-size:var(--cl-font-sm)}
.c-basic__foot{display:flex;flex-wrap:wrap;gap:10px;margin-top:4px}`,
  }),

  def({
    slug: "card-feature",
    name: "Feature Card",
    layer: "patterns",
    category: "cards",
    problemTags: ["build-landing-page", "build-ui-sections"],
    description: "Icon-led feature highlight for marketing pages and product overview grids.",
    html: wrapRoot(`
<article class="c-feature">
  <div class="cl-icon" aria-hidden="true">&#9889;</div>
  <h3 class="c-feature__title">Real-time sync</h3>
  <p class="c-feature__body cl-muted">Push design tokens and component updates to every workspace without redeploying your app.</p>
  <a href="#" class="cl-link">Explore sync docs &rarr;</a>
</article>`),
    css: `
.c-feature{max-width:320px;display:flex;flex-direction:column;gap:12px;padding:24px;background:var(--cl-surface);border:1px solid var(--cl-border);border-radius:var(--cl-radius);transition:border-color .2s,box-shadow .2s}
.c-feature:hover{border-color:color-mix(in srgb,var(--cl-primary) 35%,var(--cl-border));box-shadow:0 8px 24px color-mix(in srgb,var(--cl-primary) 8%,transparent)}
.c-feature__title{margin:0;font-size:1.05rem;font-weight:700}
.c-feature__body{margin:0;line-height:1.55;font-size:var(--cl-font-sm)}`,
  }),

  def({
    slug: "card-product",
    name: "Product Card",
    layer: "patterns",
    category: "cards",
    problemTags: ["build-landing-page", "build-ui-sections"],
    description: "Commerce-ready product tile with image, pricing, and add-to-cart action.",
    html: wrapRoot(`
<article class="c-product">
  <div class="c-product__media" role="img" aria-label="CompLib Pro kit preview"></div>
  <div class="c-product__body">
    <span class="cl-badge">Bestseller</span>
    <h3 class="c-product__title">CompLib Pro Kit</h3>
    <p class="c-product__desc cl-muted">120+ production patterns, token packs, and Figma sync for SaaS teams.</p>
    <div class="c-product__row">
      <span class="c-product__price">$89<span class="c-product__period">/mo</span></span>
      <button type="button" class="cl-btn cl-btn--primary">Add to cart</button>
    </div>
  </div>
</article>`),
    css: `
.c-product{max-width:300px;background:var(--cl-surface);border:1px solid var(--cl-border);border-radius:var(--cl-radius);overflow:hidden;box-shadow:var(--cl-shadow);transition:transform .2s,box-shadow .2s}
.c-product:hover{transform:translateY(-2px);box-shadow:0 12px 32px color-mix(in srgb,var(--cl-primary) 10%,transparent)}
.c-product__media{height:160px;background:linear-gradient(135deg,color-mix(in srgb,var(--cl-primary) 18%,#fff),color-mix(in srgb,var(--cl-primary) 6%,#fff))}
.c-product__body{padding:18px;display:flex;flex-direction:column;gap:8px}
.c-product__title{margin:0;font-size:1.05rem;font-weight:700}
.c-product__desc{margin:0;font-size:var(--cl-font-sm);line-height:1.5}
.c-product__row{display:flex;align-items:center;justify-content:space-between;gap:12px;margin-top:8px}
.c-product__price{font-size:1.25rem;font-weight:800;letter-spacing:-.02em}
.c-product__period{font-size:var(--cl-font-sm);font-weight:500;color:var(--cl-text-muted)}`,
  }),

  def({
    slug: "card-profile",
    name: "Profile Card",
    layer: "patterns",
    category: "cards",
    problemTags: ["build-dashboard", "build-ui-sections"],
    description: "User identity card with avatar, role, and quick actions for team directories.",
    html: wrapRoot(`
<article class="c-profile">
  <div class="c-profile__top">
    <div class="cl-avatar">MR</div>
    <div>
      <h3 class="c-profile__name">Maya Rodriguez</h3>
      <p class="c-profile__role cl-muted">Head of Product Design</p>
    </div>
  </div>
  <p class="c-profile__bio cl-muted">Leads design systems at Northwind Analytics. CompLib power user since v1.</p>
  <div class="c-profile__meta">
    <span class="cl-badge">San Francisco</span>
    <span class="cl-badge">Pro plan</span>
  </div>
  <div class="c-profile__actions">
    <button type="button" class="cl-btn cl-btn--primary">Message</button>
    <button type="button" class="cl-btn cl-btn--secondary">View profile</button>
  </div>
</article>`),
    css: `
.c-profile{max-width:360px;padding:24px;background:var(--cl-surface);border:1px solid var(--cl-border);border-radius:var(--cl-radius);display:flex;flex-direction:column;gap:14px}
.c-profile__top{display:flex;align-items:center;gap:14px}
.c-profile__name{margin:0;font-size:1.05rem;font-weight:700}
.c-profile__role{margin:2px 0 0;font-size:var(--cl-font-sm)}
.c-profile__bio{margin:0;font-size:var(--cl-font-sm);line-height:1.55}
.c-profile__meta{display:flex;flex-wrap:wrap;gap:8px}
.c-profile__actions{display:flex;flex-wrap:wrap;gap:10px}`,
  }),

  def({
    slug: "card-blog",
    name: "Blog Card",
    layer: "patterns",
    category: "cards",
    problemTags: ["build-landing-page", "build-ui-sections"],
    description: "Editorial preview card with category, headline, excerpt, and read link.",
    html: wrapRoot(`
<article class="c-blog">
  <div class="c-blog__media" role="img" aria-label="Article cover"></div>
  <div class="c-blog__body">
    <span class="cl-kicker">Design systems</span>
    <h3 class="c-blog__title">Scaling tokens across 12 product squads</h3>
    <p class="c-blog__excerpt cl-muted">How Contoso shipped a unified component library in six weeks without blocking feature teams.</p>
    <div class="c-blog__foot">
      <time class="cl-muted" datetime="2026-03-14">Mar 14, 2026</time>
      <a href="#" class="cl-link">Read article &rarr;</a>
    </div>
  </div>
</article>`),
    css: `
.c-blog{max-width:340px;background:var(--cl-surface);border:1px solid var(--cl-border);border-radius:var(--cl-radius);overflow:hidden;display:flex;flex-direction:column}
.c-blog__media{height:140px;background:linear-gradient(160deg,#0f766e,var(--cl-primary))}
.c-blog__body{padding:20px;display:flex;flex-direction:column;gap:8px;flex:1}
.c-blog__title{margin:0;font-size:1.05rem;font-weight:700;line-height:1.35}
.c-blog__excerpt{margin:0;font-size:var(--cl-font-sm);line-height:1.55}
.c-blog__foot{display:flex;align-items:center;justify-content:space-between;gap:12px;margin-top:auto;padding-top:8px;font-size:var(--cl-font-sm)}`,
  }),

  def({
    slug: "card-pricing",
    name: "Pricing Card",
    layer: "patterns",
    category: "cards",
    problemTags: ["build-landing-page", "build-ui-sections"],
    description: "SaaS pricing tier with feature checklist and conversion-focused CTA.",
    html: wrapRoot(`
<article class="c-pricing c-pricing--featured">
  <span class="c-pricing__badge">Most popular</span>
  <h3 class="c-pricing__plan">Growth</h3>
  <p class="c-pricing__tagline cl-muted">For teams shipping production UI weekly.</p>
  <div class="c-pricing__price">$49<span>/seat/mo</span></div>
  <ul class="c-pricing__features">
    <li>Unlimited pattern exports</li>
    <li>Figma &amp; GitHub sync</li>
    <li>Priority support</li>
    <li>Custom brand tokens</li>
    <li>Team analytics dashboard</li>
  </ul>
  <button type="button" class="cl-btn cl-btn--primary c-pricing__cta">Start 14-day trial</button>
  <p class="c-pricing__note cl-muted">No credit card required</p>
</article>`),
    css: `
.c-pricing{max-width:320px;padding:28px 24px;background:var(--cl-surface);border:1px solid var(--cl-border);border-radius:var(--cl-radius);display:flex;flex-direction:column;gap:12px;position:relative}
.c-pricing--featured{border-color:var(--cl-primary);box-shadow:0 0 0 1px var(--cl-primary),var(--cl-shadow)}
.c-pricing__badge{align-self:flex-start;padding:4px 10px;border-radius:999px;font-size:calc(var(--cl-font-sm)*.85);font-weight:700;background:var(--cl-primary);color:#fff;text-transform:uppercase;letter-spacing:.04em}
.c-pricing__plan{margin:0;font-size:1.25rem;font-weight:800;letter-spacing:-.02em}
.c-pricing__tagline{margin:0;font-size:var(--cl-font-sm)}
.c-pricing__price{font-size:2rem;font-weight:800;letter-spacing:-.03em}
.c-pricing__price span{font-size:var(--cl-font-sm);font-weight:500;color:var(--cl-text-muted)}
.c-pricing__features{margin:8px 0 0;padding:0;list-style:none;display:flex;flex-direction:column;gap:10px;font-size:var(--cl-font-sm)}
.c-pricing__features li{display:flex;align-items:flex-start;gap:10px}
.c-pricing__features li::before{content:"";flex-shrink:0;width:18px;height:18px;margin-top:1px;border-radius:999px;background:color-mix(in srgb,var(--cl-primary) 15%,transparent);background-image:url("data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' viewBox='0 0 16 16' fill='%230d9488'%3E%3Cpath d='M6.5 11.5 3.5 8.5l1-1 2 2 4.5-4.5 1 1z'/%3E%3C/svg%3E");background-size:14px;background-repeat:no-repeat;background-position:center}
.c-pricing__cta{width:100%;margin-top:8px}
.c-pricing__note{margin:0;text-align:center;font-size:calc(var(--cl-font-sm)*.92)}`,
  }),

  def({
    slug: "card-stats",
    name: "Stats Card",
    layer: "patterns",
    category: "cards",
    problemTags: ["build-dashboard", "build-ui-sections"],
    description: "Metric summary card with trend indicator for analytics dashboards.",
    html: wrapRoot(`
<div class="c-stats">
  <div class="c-stats__head">
    <span class="cl-muted">Monthly active teams</span>
    <span class="c-stats__trend c-stats__trend--up">+12.4%</span>
  </div>
  <p class="cl-stat__value">2,847</p>
  <p class="cl-stat__label">vs 2,533 last month</p>
  <div class="c-stats__bar" aria-hidden="true"><span style="width:72%"></span></div>
</div>`),
    css: `
.c-stats{max-width:280px;padding:20px;background:var(--cl-surface);border:1px solid var(--cl-border);border-radius:var(--cl-radius)}
.c-stats__head{display:flex;align-items:center;justify-content:space-between;gap:12px;font-size:var(--cl-font-sm);margin-bottom:8px}
.c-stats__trend{font-weight:700;font-size:calc(var(--cl-font-sm)*.92);padding:3px 8px;border-radius:999px}
.c-stats__trend--up{background:color-mix(in srgb,#16a34a 12%,transparent);color:#15803d}
.c-stats__bar{height:6px;margin-top:16px;background:var(--cl-surface-muted);border-radius:999px;overflow:hidden}
.c-stats__bar span{display:block;height:100%;background:linear-gradient(90deg,var(--cl-primary),#14b8a6);border-radius:999px}`,
  }),

  def({
    slug: "card-team",
    name: "Team Card",
    layer: "patterns",
    category: "cards",
    problemTags: ["build-landing-page", "build-ui-sections"],
    description: "Team member spotlight with photo placeholder, title, and social links.",
    html: wrapRoot(`
<article class="c-team">
  <div class="c-team__photo" aria-hidden="true">JK</div>
  <h3 class="c-team__name">James Kim</h3>
  <p class="c-team__title cl-muted">Co-founder &amp; CTO</p>
  <p class="c-team__bio cl-muted">Previously led platform at Stripe. Builds the CompLib rendering engine.</p>
  <div class="c-team__links">
    <a href="#" class="cl-link">LinkedIn</a>
    <a href="#" class="cl-link">GitHub</a>
  </div>
</article>`),
    css: `
.c-team{max-width:260px;padding:24px;text-align:center;background:var(--cl-surface);border:1px solid var(--cl-border);border-radius:var(--cl-radius);display:flex;flex-direction:column;align-items:center;gap:8px}
.c-team__photo{width:72px;height:72px;border-radius:999px;display:grid;place-items:center;font-weight:800;font-size:1.1rem;color:#fff;background:linear-gradient(135deg,#115e59,var(--cl-primary))}
.c-team__name{margin:4px 0 0;font-size:1.05rem;font-weight:700}
.c-team__title{margin:0;font-size:var(--cl-font-sm)}
.c-team__bio{margin:0;font-size:var(--cl-font-sm);line-height:1.55}
.c-team__links{display:flex;gap:16px;margin-top:8px;font-size:var(--cl-font-sm)}`,
  }),

  def({
    slug: "card-testimonial",
    name: "Testimonial Card",
    layer: "patterns",
    category: "cards",
    problemTags: ["build-landing-page", "build-ui-sections"],
    description: "Customer quote card with attribution for social proof sections.",
    html: wrapRoot(`
<blockquote class="c-testimonial">
  <p class="c-testimonial__quote">&ldquo;CompLib cut our design-to-code cycle from two weeks to two days. The pattern catalog alone paid for itself in the first sprint.&rdquo;</p>
  <footer class="c-testimonial__author">
    <div class="cl-avatar">SL</div>
    <div>
      <cite class="c-testimonial__name">Sarah Lin</cite>
      <span class="c-testimonial__org cl-muted">VP Engineering, Lumina Health</span>
    </div>
  </footer>
  <div class="c-testimonial__stars" aria-label="5 out of 5 stars">&#9733;&#9733;&#9733;&#9733;&#9733;</div>
</blockquote>`),
    css: `
.c-testimonial{max-width:400px;margin:0;padding:28px;background:var(--cl-surface);border:1px solid var(--cl-border);border-radius:var(--cl-radius);display:flex;flex-direction:column;gap:20px}
.c-testimonial__quote{margin:0;font-size:1.05rem;line-height:1.6;font-style:italic;color:var(--cl-text)}
.c-testimonial__author{display:flex;align-items:center;gap:12px;font-style:normal}
.c-testimonial__name{display:block;font-style:normal;font-weight:700;font-size:var(--cl-font-sm)}
.c-testimonial__org{display:block;font-size:var(--cl-font-sm)}
.c-testimonial__stars{color:var(--cl-primary);letter-spacing:2px;font-size:.9rem}`,
  }),

  def({
    slug: "card-media",
    name: "Media Card",
    layer: "patterns",
    category: "cards",
    problemTags: ["build-ui-sections", "build-dashboard"],
    description: "Rich media card with thumbnail, duration badge, and play action for video or audio content.",
    html: wrapRoot(`
<article class="c-media">
  <div class="c-media__thumb">
    <span class="c-media__duration">12:34</span>
    <button type="button" class="c-media__play" aria-label="Play video">&#9654;</button>
  </div>
  <div class="c-media__body">
    <span class="cl-kicker">Webinar</span>
    <h3 class="c-media__title">Building a token-first design system</h3>
    <p class="c-media__meta cl-muted">Recorded Mar 8, 2026 &middot; 1.2k views</p>
  </div>
</article>`),
    css: `
.c-media{max-width:360px;background:var(--cl-surface);border:1px solid var(--cl-border);border-radius:var(--cl-radius);overflow:hidden;transition:box-shadow .2s}
.c-media:hover{box-shadow:0 10px 28px color-mix(in srgb,var(--cl-primary) 10%,transparent)}
.c-media__thumb{position:relative;height:180px;background:linear-gradient(180deg,rgba(15,23,42,.1),rgba(15,23,42,.55)),linear-gradient(135deg,#134e4a,var(--cl-primary));display:grid;place-items:center}
.c-media__duration{position:absolute;bottom:10px;right:10px;padding:3px 8px;border-radius:6px;font-size:calc(var(--cl-font-sm)*.85);font-weight:700;background:rgba(0,0,0,.65);color:#fff}
.c-media__play{width:52px;height:52px;border-radius:999px;border:none;background:rgba(255,255,255,.92);color:var(--cl-primary);font-size:1.1rem;cursor:pointer;display:grid;place-items:center;padding-left:4px;transition:transform .2s,background .2s}
.c-media__play:hover{transform:scale(1.06);background:#fff}
.c-media__body{padding:18px;display:flex;flex-direction:column;gap:6px}
.c-media__title{margin:0;font-size:1rem;font-weight:700;line-height:1.35}
.c-media__meta{margin:0;font-size:var(--cl-font-sm)}`,
  }),
];
