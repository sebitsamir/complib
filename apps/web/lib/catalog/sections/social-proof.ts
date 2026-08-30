import { def, wrapRoot, type CatalogComponentDef } from "@/lib/catalog/shared";

export const SOCIAL_PROOF: CatalogComponentDef[] = [
  def({
    slug: "section-testimonials",
    name: "Testimonials",
    layer: "sections",
    category: "social-proof",
    problemTags: ["build-landing-page"],
    description: "Customer testimonial grid with avatars, quotes, and attribution for trust-building on landing pages.",
    html: wrapRoot(`
<section class="s-testimonials">
  <div class="cl-section">
    <div class="cl-section__head">
      <span class="cl-kicker">Testimonials</span>
      <h2 class="cl-section__title">Loved by product teams everywhere</h2>
      <p class="cl-section__lead">See why designers and developers rely on CompLib to ship faster.</p>
    </div>
    <div class="cl-grid-3">
      <blockquote class="cl-card s-testimonials__quote">
        <p>&ldquo;CompLib cut our landing page build time from two weeks to two days. The section library is genuinely production-ready.&rdquo;</p>
        <footer><div class="cl-avatar">SK</div><div><strong>Sarah Kim</strong><span class="cl-muted">VP Product, Northwind</span></div></footer>
      </blockquote>
      <blockquote class="cl-card s-testimonials__quote">
        <p>&ldquo;We replaced three internal tools with CompLib. Token sync alone saved our design system team dozens of hours.&rdquo;</p>
        <footer><div class="cl-avatar">MR</div><div><strong>Marcus Reed</strong><span class="cl-muted">Eng Lead, Vertex Labs</span></div></footer>
      </blockquote>
      <blockquote class="cl-card s-testimonials__quote">
        <p>&ldquo;Our agency ships client pages 3x faster. Clients love the polish, and we love not rebuilding heroes from scratch.&rdquo;</p>
        <footer><div class="cl-avatar">AL</div><div><strong>Ava Lindstrom</strong><span class="cl-muted">Director, Studio Helix</span></div></footer>
      </blockquote>
    </div>
  </div>
</section>`),
    css: `
.s-testimonials{width:100%;background:var(--cl-surface-muted)}
.s-testimonials__quote{display:flex;flex-direction:column;gap:16px;margin:0}
.s-testimonials__quote p{margin:0;font-size:var(--cl-font-sm);line-height:1.65;font-style:italic}
.s-testimonials__quote footer{display:flex;align-items:center;gap:12px;margin-top:auto}
.s-testimonials__quote footer strong{display:block;font-size:var(--cl-font-sm);font-weight:700}
.s-testimonials__quote footer span{display:block;font-size:calc(var(--cl-font-sm)*.92)}`,
  }),

  def({
    slug: "section-logo-cloud",
    name: "Logo Cloud",
    layer: "sections",
    category: "social-proof",
    problemTags: ["build-landing-page"],
    description: "Grayscale company name pill strip for displaying trusted-by logos without image assets.",
    html: wrapRoot(`
<section class="s-logos">
  <div class="cl-section s-logos__inner">
    <p class="s-logos__label cl-muted">Trusted by teams at</p>
    <div class="s-logos__row">
      <span class="s-logos__pill">Northwind</span>
      <span class="s-logos__pill">Vertex Labs</span>
      <span class="s-logos__pill">Helix Studio</span>
      <span class="s-logos__pill">Orbit Health</span>
      <span class="s-logos__pill">Cascade AI</span>
      <span class="s-logos__pill">Pinnacle</span>
      <span class="s-logos__pill">Meridian</span>
      <span class="s-logos__pill">Summit Co</span>
    </div>
  </div>
</section>`),
    css: `
.s-logos{width:100%;background:var(--cl-surface);border-top:1px solid var(--cl-border);border-bottom:1px solid var(--cl-border)}
.s-logos__inner{text-align:center;padding-top:calc(32px * var(--cl-size-mult));padding-bottom:calc(32px * var(--cl-size-mult))}
.s-logos__label{margin:0 0 20px;font-size:var(--cl-font-sm);font-weight:600;text-transform:uppercase;letter-spacing:.06em}
.s-logos__row{display:flex;flex-wrap:wrap;gap:12px;justify-content:center;align-items:center}
.s-logos__pill{padding:10px 20px;border-radius:999px;font-size:var(--cl-font-sm);font-weight:700;color:var(--cl-text-muted);background:var(--cl-surface-muted);border:1px solid var(--cl-border);filter:grayscale(1);opacity:.75;transition:opacity .2s,filter .2s}
.s-logos__pill:hover{opacity:1;filter:grayscale(.5)}`,
  }),

  def({
    slug: "section-reviews",
    name: "Reviews",
    layer: "sections",
    category: "social-proof",
    problemTags: ["build-landing-page"],
    description: "Star-rated review cards with aggregate score header for app store or G2-style social proof.",
    html: wrapRoot(`
<section class="s-reviews">
  <div class="cl-section">
    <div class="s-reviews__header">
      <div class="s-reviews__score">
        <span class="s-reviews__number">4.9</span>
        <div class="s-reviews__stars" aria-label="4.9 out of 5 stars">&#9733;&#9733;&#9733;&#9733;&#9733;</div>
        <p class="cl-muted">Based on 340+ reviews</p>
      </div>
      <div class="cl-section__head" style="margin:0;text-align:left">
        <h2 class="cl-section__title">Rated excellent by users</h2>
        <p class="cl-section__lead">Product teams consistently praise CompLib for quality, speed, and developer experience.</p>
      </div>
    </div>
    <div class="cl-grid-2">
      <article class="cl-card s-reviews__card">
        <div class="s-reviews__stars s-reviews__stars--sm">&#9733;&#9733;&#9733;&#9733;&#9733;</div>
        <p class="cl-muted">&ldquo;Best component catalog I've used. Export quality is unmatched.&rdquo;</p>
        <span class="s-reviews__author">— James T., Startup founder</span>
      </article>
      <article class="cl-card s-reviews__card">
        <div class="s-reviews__stars s-reviews__stars--sm">&#9733;&#9733;&#9733;&#9733;&#9733;</div>
        <p class="cl-muted">&ldquo;Saved our team from rebuilding the same hero section for every launch.&rdquo;</p>
        <span class="s-reviews__author">— Priya M., Design lead</span>
      </article>
      <article class="cl-card s-reviews__card">
        <div class="s-reviews__stars s-reviews__stars--sm">&#9733;&#9733;&#9733;&#9733;&#9734;</div>
        <p class="cl-muted">&ldquo;Token system is thoughtful. Dark mode just works out of the box.&rdquo;</p>
        <span class="s-reviews__author">— Daniel K., Frontend engineer</span>
      </article>
      <article class="cl-card s-reviews__card">
        <div class="s-reviews__stars s-reviews__stars--sm">&#9733;&#9733;&#9733;&#9733;&#9733;</div>
        <p class="cl-muted">&ldquo;We onboard new designers in hours instead of weeks thanks to the catalog.&rdquo;</p>
        <span class="s-reviews__author">— Elena R., Design ops</span>
      </article>
    </div>
  </div>
</section>`),
    css: `
.s-reviews{width:100%;background:var(--cl-surface)}
.s-reviews__header{display:grid;gap:var(--cl-gap);align-items:center;margin-bottom:calc(32px * var(--cl-size-mult))}
@media(min-width:768px){.s-reviews__header{grid-template-columns:auto 1fr;gap:40px}}
.s-reviews__score{text-align:center;padding:24px;background:var(--cl-surface-muted);border-radius:var(--cl-radius);border:1px solid var(--cl-border)}
.s-reviews__number{display:block;font-size:3rem;font-weight:800;letter-spacing:-.03em;color:var(--cl-primary);line-height:1}
.s-reviews__stars{color:#f59e0b;font-size:1.25rem;letter-spacing:2px;margin:8px 0}
.s-reviews__stars--sm{font-size:.9rem;margin:0 0 10px}
.s-reviews__score p{margin:8px 0 0;font-size:var(--cl-font-sm)}
.s-reviews__card{display:flex;flex-direction:column;gap:8px}
.s-reviews__card p{margin:0;font-size:var(--cl-font-sm);line-height:1.55}
.s-reviews__author{font-size:calc(var(--cl-font-sm)*.92);font-weight:600;color:var(--cl-text-muted)}`,
  }),

  def({
    slug: "section-statistics",
    name: "Statistics",
    layer: "sections",
    category: "social-proof",
    problemTags: ["build-landing-page"],
    description: "Bold statistics row with large numbers and labels for quantified social proof and impact metrics.",
    html: wrapRoot(`
<section class="s-stats">
  <div class="cl-section">
    <div class="cl-section__head">
      <h2 class="cl-section__title">Numbers that speak for themselves</h2>
      <p class="cl-section__lead">CompLib powers UI delivery for thousands of teams across every industry.</p>
    </div>
    <div class="s-stats__grid">
      <div class="cl-stat s-stats__item"><p class="cl-stat__value">12k+</p><p class="cl-stat__label">Active workspaces</p></div>
      <div class="cl-stat s-stats__item"><p class="cl-stat__value">200+</p><p class="cl-stat__label">Production components</p></div>
      <div class="cl-stat s-stats__item"><p class="cl-stat__value">48h</p><p class="cl-stat__label">Avg. time to launch</p></div>
      <div class="cl-stat s-stats__item"><p class="cl-stat__value">99.9%</p><p class="cl-stat__label">Platform uptime</p></div>
    </div>
  </div>
</section>`),
    css: `
.s-stats{width:100%;background:linear-gradient(180deg,color-mix(in srgb,var(--cl-primary) 8%,var(--cl-surface-muted)),var(--cl-surface-muted))}
.s-stats__grid{display:grid;gap:var(--cl-gap);grid-template-columns:repeat(auto-fit,minmax(160px,1fr))}
.s-stats__item{text-align:center;padding:calc(var(--cl-pad)*1.25)}
.s-stats__item .cl-stat__value{color:var(--cl-primary)}`,
  }),

  def({
    slug: "section-case-studies",
    name: "Case Studies",
    layer: "sections",
    category: "social-proof",
    problemTags: ["build-landing-page"],
    description: "Case study cards with company context, results metrics, and read-more links for deep social proof.",
    html: wrapRoot(`
<section class="s-cases">
  <div class="cl-section">
    <div class="cl-section__head">
      <span class="cl-kicker">Case studies</span>
      <h2 class="cl-section__title">Real results from real teams</h2>
      <p class="cl-section__lead">Discover how companies use CompLib to accelerate UI delivery and maintain brand consistency.</p>
    </div>
    <div class="cl-grid-3">
      <article class="cl-card s-cases__card">
        <span class="cl-badge">SaaS</span>
        <h3>Northwind Analytics</h3>
        <p class="cl-muted">Rebuilt their marketing site in one sprint using CompLib sections and token sync.</p>
        <div class="s-cases__metrics">
          <div><strong>67%</strong><span class="cl-muted">Faster launches</span></div>
          <div><strong>12</strong><span class="cl-muted">Pages shipped</span></div>
        </div>
        <a href="#" class="cl-link">Read case study &rarr;</a>
      </article>
      <article class="cl-card s-cases__card">
        <span class="cl-badge">Agency</span>
        <h3>Studio Helix</h3>
        <p class="cl-muted">Standardized client deliverables with a shared CompLib workspace across 40+ projects.</p>
        <div class="s-cases__metrics">
          <div><strong>3x</strong><span class="cl-muted">Delivery speed</span></div>
          <div><strong>40+</strong><span class="cl-muted">Client sites</span></div>
        </div>
        <a href="#" class="cl-link">Read case study &rarr;</a>
      </article>
      <article class="cl-card s-cases__card">
        <span class="cl-badge">Startup</span>
        <h3>Orbit Health</h3>
        <p class="cl-muted">Launched their Series A landing page in 48 hours with zero custom CSS.</p>
        <div class="s-cases__metrics">
          <div><strong>48h</strong><span class="cl-muted">Time to live</span></div>
          <div><strong>$0</strong><span class="cl-muted">Custom dev cost</span></div>
        </div>
        <a href="#" class="cl-link">Read case study &rarr;</a>
      </article>
    </div>
  </div>
</section>`),
    css: `
.s-cases{width:100%;background:var(--cl-surface-muted)}
.s-cases__card{display:flex;flex-direction:column;gap:10px}
.s-cases__card h3{margin:0;font-size:1.05rem;font-weight:700}
.s-cases__card p{margin:0;font-size:var(--cl-font-sm);line-height:1.55;flex:1}
.s-cases__metrics{display:flex;gap:24px;margin:8px 0}
.s-cases__metrics strong{display:block;font-size:1.25rem;font-weight:800;color:var(--cl-primary);letter-spacing:-.02em}
.s-cases__metrics span{display:block;font-size:calc(var(--cl-font-sm)*.9)}`,
  }),
];
