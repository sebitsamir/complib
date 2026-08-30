import { def, wrapRoot, type CatalogComponentDef } from "@/lib/catalog/shared";

export const MARKETING: CatalogComponentDef[] = [
  def({
    slug: "template-agency",
    name: "Creative Agency",
    layer: "templates",
    category: "marketing",
    problemTags: ["build-landing-page", "build-ui-sections"],
    description: "Creative agency site with bold hero, service cards, selected work grid, and contact CTA.",
    html: wrapRoot(`
  <div class="cl-page t-agency">
    <header class="cl-page__bar">
      <span class="cl-page__brand">Studio Kinetic</span>
      <nav class="cl-page__nav" aria-label="Agency">
        <a href="#">Work</a>
        <a href="#">Services</a>
        <a href="#">About</a>
        <a href="#">Contact</a>
      </nav>
      <button type="button" class="cl-btn cl-btn--primary">Start a project</button>
    </header>
    <div class="cl-page__body">
      <section class="t-agency__hero">
        <h1 class="t-agency__title">We design brands people remember</h1>
        <p class="t-agency__lead cl-muted">Strategy, identity, and digital experiences for ambitious companies ready to stand out.</p>
      </section>
      <section class="t-agency__services">
        <div class="cl-grid-3">
          <article class="cl-card"><span class="cl-kicker">01</span><h3>Brand strategy</h3><p class="cl-muted">Positioning, naming, and messaging that resonates with your audience.</p></article>
          <article class="cl-card"><span class="cl-kicker">02</span><h3>Visual identity</h3><p class="cl-muted">Logos, typography systems, and guidelines built to scale.</p></article>
          <article class="cl-card"><span class="cl-kicker">03</span><h3>Digital design</h3><p class="cl-muted">Websites, product UI, and campaign assets that convert.</p></article>
        </div>
      </section>
      <section class="t-agency__work">
        <h2 class="cl-section__title">Selected work</h2>
        <div class="t-agency__grid">
          <div class="t-agency__tile"><span>Northwind Rebrand</span></div>
          <div class="t-agency__tile"><span>Lumina App Launch</span></div>
          <div class="t-agency__tile"><span>Pixel Forge Campaign</span></div>
        </div>
      </section>
      <section class="t-agency__cta cl-card">
        <h2 class="cl-section__title" style="font-size:1.2rem;margin:0 0 8px;text-align:left">Let's build something remarkable</h2>
        <p class="cl-muted" style="margin:0 0 16px">Tell us about your project — we respond within one business day.</p>
        <button type="button" class="cl-btn cl-btn--primary">Get in touch</button>
      </section>
    </div>
  </div>`),
    css: `
.t-agency__hero{margin-bottom:36px;max-width:600px}
.t-agency__title{margin:0 0 14px;font-size:clamp(1.7rem,3vw,2.4rem);letter-spacing:-.04em;line-height:1.1}
.t-agency__lead{margin:0;line-height:1.6;font-size:var(--cl-font-md)}
.t-agency__services{margin-bottom:36px}
.t-agency__services h3{margin:8px 0 0;font-size:1.05rem}
.t-agency__grid{display:grid;grid-template-columns:repeat(3,1fr);gap:var(--cl-gap);margin-bottom:32px}
.t-agency__tile{aspect-ratio:4/3;border-radius:var(--cl-radius);background:linear-gradient(135deg,color-mix(in srgb,var(--cl-primary) 20%,#fff),var(--cl-surface-muted));border:1px solid var(--cl-border);display:grid;place-items:end start;padding:16px;font-weight:700;font-size:var(--cl-font-sm)}
@media(max-width:640px){.t-agency__grid{grid-template-columns:1fr}}`,
  }),

  def({
    slug: "template-portfolio",
    name: "Portfolio",
    layer: "templates",
    category: "marketing",
    problemTags: ["build-landing-page", "build-ui-sections"],
    description: "Personal portfolio with intro hero, project showcase grid, skills section, and hire CTA.",
    html: wrapRoot(`
  <div class="cl-page t-portfolio">
    <header class="cl-page__bar">
      <span class="cl-page__brand">Alex Morgan</span>
      <nav class="cl-page__nav" aria-label="Portfolio">
        <a href="#">Work</a>
        <a href="#">About</a>
        <a href="#">Writing</a>
        <a href="#">Contact</a>
      </nav>
    </header>
    <div class="cl-page__body">
      <section class="t-portfolio__intro">
        <div class="cl-avatar" style="width:64px;height:64px;font-size:1.2rem">AM</div>
        <div>
          <h1 class="t-portfolio__title">Product designer crafting thoughtful digital experiences</h1>
          <p class="cl-muted">Previously at Figma and Stripe. I help startups turn complex problems into intuitive interfaces.</p>
        </div>
      </section>
      <section class="t-portfolio__projects">
        <h2 class="cl-section__title">Recent projects</h2>
        <div class="cl-grid-2">
          <article class="cl-card t-portfolio__project">
            <div class="t-portfolio__thumb"></div>
            <h3>HealthTrack mobile app</h3>
            <p class="cl-muted">End-to-end UX for a patient monitoring platform used by 200+ clinics.</p>
          </article>
          <article class="cl-card t-portfolio__project">
            <div class="t-portfolio__thumb"></div>
            <h3>Meridian dashboard redesign</h3>
            <p class="cl-muted">Simplified analytics workflows, increasing daily active usage by 28%.</p>
          </article>
        </div>
      </section>
      <section class="t-portfolio__skills cl-card">
        <h2 class="cl-section__title" style="font-size:1.1rem;margin:0 0 12px;text-align:left">Skills &amp; tools</h2>
        <div class="t-portfolio__tags">
          <span class="cl-badge">Figma</span><span class="cl-badge">Design systems</span><span class="cl-badge">Prototyping</span><span class="cl-badge">User research</span><span class="cl-badge">HTML/CSS</span>
        </div>
        <button type="button" class="cl-btn cl-btn--primary" style="margin-top:16px">Available for hire</button>
      </section>
    </div>
  </div>`),
    css: `
.t-portfolio__intro{display:flex;gap:20px;align-items:flex-start;margin-bottom:36px}
.t-portfolio__title{margin:0 0 10px;font-size:clamp(1.4rem,2.5vw,1.9rem);letter-spacing:-.03em;line-height:1.2}
.t-portfolio__project{display:flex;flex-direction:column;gap:10px}
.t-portfolio__thumb{height:140px;border-radius:calc(var(--cl-radius)*.8);background:var(--cl-surface-muted)}
.t-portfolio__project h3{margin:0;font-size:1.05rem}
.t-portfolio__tags{display:flex;flex-wrap:wrap;gap:8px}`,
  }),

  def({
    slug: "template-developer-portfolio",
    name: "Developer Portfolio",
    layer: "templates",
    category: "marketing",
    problemTags: ["build-landing-page", "build-ui-sections"],
    description: "Developer portfolio with terminal-style hero, open-source projects, and GitHub CTA.",
    html: wrapRoot(`
  <div class="cl-page t-dev">
    <header class="cl-page__bar">
      <span class="cl-page__brand">&lt;dev/&gt;</span>
      <nav class="cl-page__nav" aria-label="Developer">
        <a href="#">Projects</a>
        <a href="#">Stack</a>
        <a href="#">Blog</a>
        <a href="#">Resume</a>
      </nav>
      <button type="button" class="cl-btn cl-btn--secondary">GitHub</button>
    </header>
    <div class="cl-page__body">
      <section class="t-dev__hero">
        <div class="t-dev__terminal cl-card">
          <code>$ whoami</code>
          <p>Jordan Lee — full-stack engineer</p>
          <code>$ cat focus.txt</code>
          <p>React · Node · PostgreSQL · AWS · Developer experience</p>
          <code>$ status</code>
          <p><span class="cl-badge">Open to opportunities</span></p>
        </div>
        <div class="t-dev__copy">
          <h1 class="t-dev__title">I build reliable systems at scale</h1>
          <p class="cl-muted">5 years shipping production APIs, design systems, and infra for high-growth startups.</p>
          <button type="button" class="cl-btn cl-btn--primary">View projects</button>
        </div>
      </section>
      <section class="t-dev__repos">
        <h2 class="cl-section__title">Open source</h2>
        <div class="cl-grid-3">
          <article class="cl-card"><h3>query-kit</h3><p class="cl-muted">Type-safe SQL builder for Node.js · 2.4k stars</p></article>
          <article class="cl-card"><h3>react-forms-lite</h3><p class="cl-muted">Minimal form primitives with zero dependencies</p></article>
          <article class="cl-card"><h3>deploy-hooks</h3><p class="cl-muted">CI/CD webhook toolkit for edge deployments</p></article>
        </div>
      </section>
    </div>
  </div>`),
    css: `
.t-dev__hero{display:grid;grid-template-columns:1fr 1fr;gap:28px;align-items:center;margin-bottom:36px}
.t-dev__terminal{font-family:ui-monospace,monospace;font-size:calc(var(--cl-font-sm)*.95);background:var(--cl-surface-muted)}
.t-dev__terminal code{display:block;color:var(--cl-primary);font-weight:600;margin-bottom:4px}
.t-dev__terminal p{margin:0 0 14px;color:var(--cl-text)}
.t-dev__title{margin:0 0 12px;font-size:clamp(1.4rem,2.5vw,1.9rem);letter-spacing:-.03em}
.t-dev__repos h3{margin:0 0 6px;font-size:1rem}
@media(max-width:640px){.t-dev__hero{grid-template-columns:1fr}}`,
  }),

  def({
    slug: "template-freelancer",
    name: "Freelancer",
    layer: "templates",
    category: "marketing",
    problemTags: ["build-landing-page", "build-ui-sections"],
    description: "Freelancer landing with services, pricing packages, testimonials, and booking CTA.",
    html: wrapRoot(`
  <div class="cl-page t-free">
    <header class="cl-page__bar">
      <span class="cl-page__brand">Maya Chen · Copywriter</span>
      <nav class="cl-page__nav" aria-label="Freelancer">
        <a href="#">Services</a>
        <a href="#">Work</a>
        <a href="#">Testimonials</a>
      </nav>
      <button type="button" class="cl-btn cl-btn--primary">Book a call</button>
    </header>
    <div class="cl-page__body">
      <section class="t-free__hero">
        <h1 class="t-free__title">Words that convert browsers into buyers</h1>
        <p class="cl-muted">I write landing pages, email sequences, and product copy for SaaS and e-commerce brands.</p>
      </section>
      <section class="t-free__packages">
        <h2 class="cl-section__title">Packages</h2>
        <div class="cl-grid-3">
          <article class="cl-card t-free__pkg">
            <h3>Landing page</h3>
            <p class="t-free__price">$1,200</p>
            <p class="cl-muted">Hero, features, social proof, and CTA sections. 5-day turnaround.</p>
            <button type="button" class="cl-btn cl-btn--secondary">Select</button>
          </article>
          <article class="cl-card t-free__pkg t-free__pkg--featured">
            <span class="cl-badge">Popular</span>
            <h3>Launch bundle</h3>
            <p class="t-free__price">$2,800</p>
            <p class="cl-muted">Landing page + 5-email welcome sequence + ad copy variants.</p>
            <button type="button" class="cl-btn cl-btn--primary">Select</button>
          </article>
          <article class="cl-card t-free__pkg">
            <h3>Retainer</h3>
            <p class="t-free__price">$3,500/mo</p>
            <p class="cl-muted">Ongoing copy support, A/B tests, and monthly strategy calls.</p>
            <button type="button" class="cl-btn cl-btn--secondary">Select</button>
          </article>
        </div>
      </section>
      <section class="t-free__quote cl-card">
        <p style="margin:0 0 12px;font-style:italic;line-height:1.6">"Maya increased our trial signups by 34% with a single homepage rewrite. Best investment we made this quarter."</p>
        <div style="display:flex;align-items:center;gap:10px"><div class="cl-avatar">SR</div><div><strong>Sarah Reed</strong><br><span class="cl-muted">CMO, FlowStack</span></div></div>
      </section>
    </div>
  </div>`),
    css: `
.t-free__hero{margin-bottom:32px;max-width:560px}
.t-free__title{margin:0 0 12px;font-size:clamp(1.5rem,2.6vw,2rem);letter-spacing:-.03em;line-height:1.15}
.t-free__packages{margin-bottom:28px}
.t-free__pkg{display:flex;flex-direction:column;gap:8px}
.t-free__pkg--featured{border-color:color-mix(in srgb,var(--cl-primary) 40%,var(--cl-border))}
.t-free__pkg h3{margin:0;font-size:1.05rem}
.t-free__price{margin:0;font-size:1.35rem;font-weight:800;letter-spacing:-.02em}`,
  }),

  def({
    slug: "template-creator",
    name: "Creator",
    layer: "templates",
    category: "marketing",
    problemTags: ["build-landing-page", "build-ui-sections"],
    description: "Creator hub with profile hero, content links, membership tiers, and newsletter signup.",
    html: wrapRoot(`
  <div class="cl-page t-creator">
    <header class="cl-page__bar">
      <span class="cl-page__brand">@RileyCreates</span>
      <nav class="cl-page__nav" aria-label="Creator">
        <a href="#">Videos</a>
        <a href="#">Courses</a>
        <a href="#">Shop</a>
      </nav>
      <button type="button" class="cl-btn cl-btn--primary">Join membership</button>
    </header>
    <div class="cl-page__body">
      <section class="t-creator__profile">
        <div class="cl-avatar" style="width:72px;height:72px;font-size:1.3rem">RC</div>
        <div>
          <h1 class="t-creator__title">Design tips for builders who ship</h1>
          <p class="cl-muted">120K subscribers · Weekly tutorials on Figma, CSS, and indie product design.</p>
          <div class="t-creator__links">
            <button type="button" class="cl-btn cl-btn--secondary">YouTube</button>
            <button type="button" class="cl-btn cl-btn--secondary">Newsletter</button>
            <button type="button" class="cl-btn cl-btn--secondary">Patreon</button>
          </div>
        </div>
      </section>
      <section class="t-creator__content">
        <h2 class="cl-section__title">Latest content</h2>
        <div class="cl-grid-3">
          <article class="cl-card"><div class="t-creator__vid"></div><h3>5 token mistakes to avoid</h3><p class="cl-muted">12 min · Aug 5</p></article>
          <article class="cl-card"><div class="t-creator__vid"></div><h3>Build a landing page in 30 min</h3><p class="cl-muted">28 min · Jul 28</p></article>
          <article class="cl-card"><div class="t-creator__vid"></div><h3>Dark mode done right</h3><p class="cl-muted">18 min · Jul 14</p></article>
        </div>
      </section>
      <section class="t-creator__tiers cl-card">
        <h2 class="cl-section__title" style="font-size:1.1rem;margin:0 0 12px;text-align:left">Membership · $9/mo</h2>
        <p class="cl-muted" style="margin:0 0 16px">Exclusive templates, source files, and monthly live Q&amp;A sessions.</p>
        <button type="button" class="cl-btn cl-btn--primary">Become a member</button>
      </section>
    </div>
  </div>`),
    css: `
.t-creator__profile{display:flex;gap:20px;align-items:flex-start;margin-bottom:36px}
.t-creator__title{margin:0 0 8px;font-size:clamp(1.4rem,2.5vw,1.85rem);letter-spacing:-.03em}
.t-creator__links{display:flex;flex-wrap:wrap;gap:8px;margin-top:14px}
.t-creator__content{margin-bottom:28px}
.t-creator__vid{height:100px;border-radius:calc(var(--cl-radius)*.7);background:var(--cl-surface-muted);margin-bottom:8px}
.t-creator__content h3{margin:0;font-size:1rem}`,
  }),

  def({
    slug: "template-event",
    name: "Event / Conference",
    layer: "templates",
    category: "marketing",
    problemTags: ["build-landing-page", "build-ui-sections"],
    description: "Conference landing with date/location hero, speaker lineup, schedule preview, and ticket CTA.",
    html: wrapRoot(`
  <div class="cl-page t-event">
    <header class="cl-page__bar">
      <span class="cl-page__brand">DesignForward 2026</span>
      <nav class="cl-page__nav" aria-label="Event">
        <a href="#">Speakers</a>
        <a href="#">Schedule</a>
        <a href="#">Venue</a>
        <a href="#">Sponsors</a>
      </nav>
      <button type="button" class="cl-btn cl-btn--primary">Get tickets</button>
    </header>
    <div class="cl-page__body">
      <section class="t-event__hero">
        <span class="cl-kicker">Oct 14–16 · San Francisco</span>
        <h1 class="t-event__title">Three days of design, code, and community</h1>
        <p class="cl-muted">Join 2,000 builders for keynotes, workshops, and networking with industry leaders.</p>
        <div class="t-event__stats">
          <div class="cl-stat"><p class="cl-stat__value">40+</p><p class="cl-stat__label">Speakers</p></div>
          <div class="cl-stat"><p class="cl-stat__value">12</p><p class="cl-stat__label">Workshops</p></div>
          <div class="cl-stat"><p class="cl-stat__value">3</p><p class="cl-stat__label">Tracks</p></div>
        </div>
      </section>
      <section class="t-event__speakers">
        <h2 class="cl-section__title">Featured speakers</h2>
        <div class="cl-grid-3">
          <article class="cl-card t-event__speaker"><div class="cl-avatar">EW</div><h3>Elena Wu</h3><p class="cl-muted">VP Design, Figma</p></article>
          <article class="cl-card t-event__speaker"><div class="cl-avatar">MR</div><h3>Marcus Rivera</h3><p class="cl-muted">Founder, Launchpad</p></article>
          <article class="cl-card t-event__speaker"><div class="cl-avatar">NK</div><h3>Nadia Khan</h3><p class="cl-muted">Engineering Lead, Stripe</p></article>
        </div>
      </section>
      <section class="t-event__cta cl-card">
        <div>
          <h2 class="cl-section__title" style="font-size:1.2rem;margin:0 0 6px;text-align:left">Early bird ends Aug 31</h2>
          <p class="cl-muted" style="margin:0">General admission from $299 · Student discounts available</p>
        </div>
        <button type="button" class="cl-btn cl-btn--primary">Reserve your spot</button>
      </section>
    </div>
  </div>`),
    css: `
.t-event__hero{text-align:center;max-width:640px;margin:0 auto 36px}
.t-event__title{margin:12px 0 14px;font-size:clamp(1.6rem,2.8vw,2.2rem);letter-spacing:-.03em;line-height:1.12}
.t-event__stats{display:grid;grid-template-columns:repeat(3,1fr);gap:var(--cl-gap);margin-top:28px}
.t-event__speaker{display:flex;flex-direction:column;align-items:center;text-align:center;gap:8px}
.t-event__speaker h3{margin:0;font-size:1rem}
.t-event__cta{display:flex;flex-wrap:wrap;align-items:center;justify-content:space-between;gap:16px;background:color-mix(in srgb,var(--cl-primary) 6%,var(--cl-surface))}`,
  }),

  def({
    slug: "template-job-board",
    name: "Job Board",
    layer: "templates",
    category: "marketing",
    problemTags: ["build-landing-page", "build-ui-sections"],
    description: "Job board with search filters, featured listings table, and employer post-job CTA.",
    html: wrapRoot(`
  <div class="cl-page t-jobs">
    <header class="cl-page__bar">
      <span class="cl-page__brand">TechRoles</span>
      <nav class="cl-page__nav" aria-label="Jobs">
        <a href="#">Browse jobs</a>
        <a href="#">Companies</a>
        <a href="#">Salaries</a>
      </nav>
      <button type="button" class="cl-btn cl-btn--primary">Post a job</button>
    </header>
    <div class="cl-page__body">
      <section class="t-jobs__hero">
        <h1 class="t-jobs__title">Find your next role in tech</h1>
        <div class="t-jobs__search">
          <input type="search" class="cl-input" placeholder="Job title or keyword" aria-label="Job search" />
          <input type="text" class="cl-input" placeholder="Location or remote" aria-label="Location" />
          <button type="button" class="cl-btn cl-btn--primary">Search</button>
        </div>
        <div class="t-jobs__filters">
          <span class="cl-badge">Remote</span>
          <span class="cl-badge">Full-time</span>
          <span class="cl-badge">Engineering</span>
          <span class="cl-badge">Design</span>
        </div>
      </section>
      <section class="t-jobs__list">
        <h2 class="cl-section__title">Featured openings</h2>
        <div class="t-jobs__table-wrap">
          <table class="cl-table">
            <thead><tr><th>Role</th><th>Company</th><th>Location</th><th>Salary</th><th></th></tr></thead>
            <tbody>
              <tr>
                <td><strong>Senior Frontend Engineer</strong><br><span class="cl-muted">React · TypeScript</span></td>
                <td>FlowStack</td><td>Remote (US)</td><td>$160–190k</td>
                <td><button type="button" class="cl-btn cl-btn--secondary">Apply</button></td>
              </tr>
              <tr>
                <td><strong>Product Designer</strong><br><span class="cl-muted">Design systems</span></td>
                <td>NeuralForge</td><td>San Francisco</td><td>$140–170k</td>
                <td><button type="button" class="cl-btn cl-btn--secondary">Apply</button></td>
              </tr>
              <tr>
                <td><strong>DevOps Engineer</strong><br><span class="cl-muted">AWS · Kubernetes</span></td>
                <td>TradeHive</td><td>Remote (EU)</td><td>€90–110k</td>
                <td><button type="button" class="cl-btn cl-btn--secondary">Apply</button></td>
              </tr>
            </tbody>
          </table>
        </div>
      </section>
      <section class="t-jobs__employer cl-card">
        <h2 class="cl-section__title" style="font-size:1.1rem;margin:0 0 8px;text-align:left">Hiring? Reach 80k qualified candidates</h2>
        <p class="cl-muted" style="margin:0 0 16px">Post your opening and get applications within 48 hours.</p>
        <button type="button" class="cl-btn cl-btn--primary">Post a job — $299</button>
      </section>
    </div>
  </div>`),
    css: `
.t-jobs__hero{text-align:center;max-width:680px;margin:0 auto 32px}
.t-jobs__title{margin:0 0 20px;font-size:clamp(1.5rem,2.6vw,2rem);letter-spacing:-.03em}
.t-jobs__search{display:flex;flex-wrap:wrap;gap:10px;margin-bottom:14px}
.t-jobs__search .cl-input{flex:1;min-width:140px}
.t-jobs__filters{display:flex;flex-wrap:wrap;gap:8px;justify-content:center}
.t-jobs__table-wrap{overflow-x:auto;background:var(--cl-surface);border:1px solid var(--cl-border);border-radius:var(--cl-radius);margin-bottom:28px}`,
  }),
];
