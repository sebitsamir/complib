import { def, wrapRoot, type CatalogComponentDef } from "@/lib/catalog/shared";

export const SAAS: CatalogComponentDef[] = [
  def({
    slug: "template-saas",
    name: "SaaS Landing",
    layer: "templates",
    category: "saas",
    problemTags: ["build-landing-page", "build-ui-sections"],
    description: "Full SaaS product landing with nav, hero, feature grid, pricing teaser, and footer CTA.",
    html: wrapRoot(`
  <div class="cl-page t-saas">
    <header class="cl-page__bar">
      <span class="cl-page__brand">FlowStack</span>
      <nav class="cl-page__nav" aria-label="Primary">
        <a href="#">Product</a>
        <a href="#">Pricing</a>
        <a href="#">Customers</a>
        <a href="#">Docs</a>
      </nav>
      <div class="t-saas__actions">
        <button type="button" class="cl-btn cl-btn--ghost">Sign in</button>
        <button type="button" class="cl-btn cl-btn--primary">Start free trial</button>
      </div>
    </header>
    <div class="cl-page__body">
      <section class="t-saas__hero">
        <span class="cl-kicker">Workflow automation</span>
        <h1 class="t-saas__title">Ship faster with connected ops</h1>
        <p class="t-saas__lead cl-muted">Unify approvals, billing, and customer data in one workspace. Teams on FlowStack launch features 40% faster.</p>
        <div class="t-saas__cta">
          <button type="button" class="cl-btn cl-btn--primary">Get started free</button>
          <button type="button" class="cl-btn cl-btn--secondary">Book a demo</button>
        </div>
        <div class="t-saas__preview" role="img" aria-label="Product dashboard preview"></div>
      </section>
      <section class="t-saas__section">
        <h2 class="cl-section__title">Everything your GTM team needs</h2>
        <div class="cl-grid-3">
          <article class="cl-card">
            <div class="cl-icon" aria-hidden="true">&#9889;</div>
            <h3>Automations</h3>
            <p class="cl-muted">Trigger workflows from CRM events, webhooks, or schedules without writing code.</p>
          </article>
          <article class="cl-card">
            <div class="cl-icon" aria-hidden="true">&#128202;</div>
            <h3>Live analytics</h3>
            <p class="cl-muted">Track funnel conversion, activation, and expansion revenue in real time.</p>
          </article>
          <article class="cl-card">
            <div class="cl-icon" aria-hidden="true">&#128274;</div>
            <h3>Enterprise security</h3>
            <p class="cl-muted">SOC 2 Type II, SSO, audit logs, and granular role-based access controls.</p>
          </article>
        </div>
      </section>
      <section class="t-saas__cta-band">
        <div>
          <h2 class="cl-section__title">Ready to streamline your stack?</h2>
          <p class="cl-muted">14-day trial · No credit card · Cancel anytime</p>
        </div>
        <button type="button" class="cl-btn cl-btn--primary">Start your trial</button>
      </section>
    </div>
  </div>`),
    css: `
.t-saas__actions{display:flex;gap:8px;flex-shrink:0}
.t-saas__hero{text-align:center;max-width:720px;margin:0 auto 48px}
.t-saas__title{margin:12px 0 16px;font-size:clamp(1.75rem,3vw,2.5rem);letter-spacing:-.04em;line-height:1.1}
.t-saas__lead{margin:0 0 24px;font-size:var(--cl-font-md);line-height:1.6}
.t-saas__cta{display:flex;flex-wrap:wrap;gap:12px;justify-content:center;margin-bottom:32px}
.t-saas__preview{height:220px;border-radius:var(--cl-radius);background:linear-gradient(180deg,var(--cl-surface),color-mix(in srgb,var(--cl-primary) 8%,var(--cl-surface)));border:1px solid var(--cl-border);box-shadow:0 24px 48px color-mix(in srgb,var(--cl-primary) 12%,transparent)}
.t-saas__section{margin-bottom:40px}
.t-saas__section .cl-card{display:flex;flex-direction:column;gap:10px}
.t-saas__section h3{margin:0;font-size:1.05rem}
.t-saas__cta-band{display:flex;flex-wrap:wrap;align-items:center;justify-content:space-between;gap:20px;padding:28px;background:var(--cl-surface);border:1px solid var(--cl-border);border-radius:var(--cl-radius)}
.t-saas__cta-band .cl-section__title{margin:0 0 6px;text-align:left;font-size:1.35rem}`,
  }),

  def({
    slug: "template-ai-startup",
    name: "AI Startup",
    layer: "templates",
    category: "saas",
    problemTags: ["build-landing-page", "build-ui-sections"],
    description: "AI-native startup landing with model showcase, use-case cards, and waitlist CTA.",
    html: wrapRoot(`
  <div class="cl-page t-ai">
    <header class="cl-page__bar">
      <span class="cl-page__brand">NeuralForge</span>
      <nav class="cl-page__nav" aria-label="Primary">
        <a href="#">Models</a>
        <a href="#">API</a>
        <a href="#">Research</a>
        <a href="#">Pricing</a>
      </nav>
      <button type="button" class="cl-btn cl-btn--primary">Get API key</button>
    </header>
    <div class="cl-page__body">
      <section class="t-ai__hero">
        <span class="cl-badge">New · Forge-3 reasoning model</span>
        <h1 class="t-ai__title">Build AI products that actually ship</h1>
        <p class="t-ai__lead cl-muted">Fine-tuned models, eval pipelines, and guardrails in one platform. From prototype to production in days, not months.</p>
        <div class="t-ai__prompt">
          <input type="text" class="cl-input" placeholder="Describe your use case…" aria-label="Use case prompt" />
          <button type="button" class="cl-btn cl-btn--primary">Generate plan</button>
        </div>
      </section>
      <section class="t-ai__metrics">
        <div class="cl-stat"><p class="cl-stat__value">99.2%</p><p class="cl-stat__label">Eval pass rate</p></div>
        <div class="cl-stat"><p class="cl-stat__value">&lt;120ms</p><p class="cl-stat__label">P95 latency</p></div>
        <div class="cl-stat"><p class="cl-stat__value">40+</p><p class="cl-stat__label">Enterprise customers</p></div>
      </section>
      <section class="t-ai__cases">
        <h2 class="cl-section__title">Built for real workloads</h2>
        <div class="cl-grid-3">
          <article class="cl-card t-ai__case">
            <span class="cl-kicker">Support</span>
            <h3>Agent copilots</h3>
            <p class="cl-muted">Resolve tickets with grounded answers and human handoff when confidence drops.</p>
          </article>
          <article class="cl-card t-ai__case">
            <span class="cl-kicker">Legal</span>
            <h3>Contract review</h3>
            <p class="cl-muted">Extract clauses, flag risk, and summarize redlines across thousands of pages.</p>
          </article>
          <article class="cl-card t-ai__case">
            <span class="cl-kicker">DevTools</span>
            <h3>Code assistants</h3>
            <p class="cl-muted">Context-aware completions trained on your repos with privacy-first isolation.</p>
          </article>
        </div>
      </section>
    </div>
  </div>`),
    css: `
.t-ai__hero{max-width:680px;margin:0 auto 36px;text-align:center}
.t-ai__title{margin:16px 0 14px;font-size:clamp(1.7rem,3vw,2.4rem);letter-spacing:-.04em;line-height:1.12}
.t-ai__lead{margin:0 0 24px;line-height:1.6;font-size:var(--cl-font-md)}
.t-ai__prompt{display:flex;gap:10px;max-width:520px;margin:0 auto}
.t-ai__prompt .cl-input{flex:1}
.t-ai__metrics{display:grid;grid-template-columns:repeat(3,1fr);gap:var(--cl-gap);margin-bottom:40px}
.t-ai__cases h3{margin:8px 0 0;font-size:1.05rem}
.t-ai__case{display:flex;flex-direction:column;gap:6px}`,
  }),

  def({
    slug: "template-startup",
    name: "Startup Launch",
    layer: "templates",
    category: "saas",
    problemTags: ["build-landing-page", "build-ui-sections"],
    description: "Early-stage startup page with bold hero, social proof logos, and founder story section.",
    html: wrapRoot(`
  <div class="cl-page t-startup">
    <header class="cl-page__bar">
      <span class="cl-page__brand">Launchpad</span>
      <nav class="cl-page__nav" aria-label="Primary">
        <a href="#">Story</a>
        <a href="#">Roadmap</a>
        <a href="#">Community</a>
      </nav>
      <button type="button" class="cl-btn cl-btn--primary">Join waitlist</button>
    </header>
    <div class="cl-page__body">
      <section class="t-startup__hero">
        <div class="t-startup__copy">
          <span class="cl-kicker">Now in public beta</span>
          <h1 class="t-startup__title">The founder OS for solo builders</h1>
          <p class="cl-muted">Track runway, ship milestones, and share updates with investors — all from one calm dashboard.</p>
          <form class="t-startup__form" onsubmit="return false">
            <input type="email" class="cl-input" placeholder="you@startup.com" aria-label="Email" />
            <button type="submit" class="cl-btn cl-btn--primary">Get early access</button>
          </form>
          <p class="t-startup__note cl-muted">2,400+ founders on the waitlist · Backed by Northstar Ventures</p>
        </div>
        <div class="t-startup__visual">
          <div class="t-startup__card cl-card">
            <span class="cl-badge">Runway</span>
            <p class="cl-stat__value">18 mo</p>
            <p class="cl-muted">Burn $12.4k/mo · 3 milestones due</p>
          </div>
        </div>
      </section>
      <section class="t-startup__logos">
        <p class="cl-muted">Trusted by teams from</p>
        <div class="t-startup__logo-row">
          <span>Stripe</span><span>Linear</span><span>Notion</span><span>Vercel</span><span>Figma</span>
        </div>
      </section>
      <section class="t-startup__story cl-card">
        <div class="cl-avatar">AK</div>
        <div>
          <h2 class="cl-section__title" style="text-align:left;font-size:1.2rem;margin:0 0 8px">Built by founders, for founders</h2>
          <p class="cl-muted" style="margin:0;line-height:1.6">We spent two years juggling spreadsheets before building Launchpad. Now our community shares templates, investor updates, and weekly ship logs — so you never build alone.</p>
        </div>
      </section>
    </div>
  </div>`),
    css: `
.t-startup__hero{display:grid;grid-template-columns:1fr 1fr;gap:32px;align-items:center;margin-bottom:36px}
.t-startup__title{margin:10px 0 14px;font-size:clamp(1.6rem,2.8vw,2.2rem);letter-spacing:-.03em;line-height:1.15}
.t-startup__form{display:flex;gap:10px;margin:20px 0 10px}
.t-startup__form .cl-input{flex:1}
.t-startup__note{margin:0;font-size:calc(var(--cl-font-sm)*.95)}
.t-startup__visual{display:grid;place-items:center}
.t-startup__card{max-width:260px;width:100%}
.t-startup__logos{text-align:center;margin-bottom:32px}
.t-startup__logo-row{display:flex;flex-wrap:wrap;justify-content:center;gap:24px;margin-top:12px;font-weight:700;color:var(--cl-text-muted);font-size:var(--cl-font-sm);letter-spacing:.02em}
.t-startup__story{display:flex;gap:16px;align-items:flex-start}
@media(max-width:640px){.t-startup__hero{grid-template-columns:1fr}}`,
  }),

  def({
    slug: "template-corporate",
    name: "Corporate Enterprise",
    layer: "templates",
    category: "saas",
    problemTags: ["build-landing-page", "build-ui-sections"],
    description: "Enterprise corporate site with solutions grid, case study highlight, and contact CTA.",
    html: wrapRoot(`
  <div class="cl-page t-corp">
    <header class="cl-page__bar">
      <span class="cl-page__brand">Meridian Group</span>
      <nav class="cl-page__nav" aria-label="Primary">
        <a href="#">Solutions</a>
        <a href="#">Industries</a>
        <a href="#">Insights</a>
        <a href="#">About</a>
        <a href="#">Careers</a>
      </nav>
      <button type="button" class="cl-btn cl-btn--secondary">Contact sales</button>
    </header>
    <div class="cl-page__body">
      <section class="t-corp__hero">
        <h1 class="t-corp__title">Transform operations at global scale</h1>
        <p class="t-corp__lead cl-muted">Meridian helps Fortune 500 teams modernize supply chains, compliance, and customer experience with proven playbooks and dedicated implementation partners.</p>
        <button type="button" class="cl-btn cl-btn--primary">Explore solutions</button>
      </section>
      <section class="t-corp__solutions">
        <h2 class="cl-section__title">Solutions that drive measurable outcomes</h2>
        <div class="cl-grid-3">
          <article class="cl-card">
            <h3>Supply chain</h3>
            <p class="cl-muted">End-to-end visibility across 40+ countries with predictive demand planning.</p>
            <a href="#" class="cl-link">Learn more &rarr;</a>
          </article>
          <article class="cl-card">
            <h3>Risk &amp; compliance</h3>
            <p class="cl-muted">Automated audit trails and regulatory reporting for financial services.</p>
            <a href="#" class="cl-link">Learn more &rarr;</a>
          </article>
          <article class="cl-card">
            <h3>Customer 360</h3>
            <p class="cl-muted">Unified profiles and journey orchestration across every touchpoint.</p>
            <a href="#" class="cl-link">Learn more &rarr;</a>
          </article>
        </div>
      </section>
      <section class="t-corp__case cl-card">
        <div class="t-corp__case-copy">
          <span class="cl-kicker">Case study</span>
          <h3>Global retailer cut fulfillment time by 34%</h3>
          <p class="cl-muted">Meridian deployed a phased rollout across 12 distribution centers in 9 months, saving $18M annually.</p>
        </div>
        <button type="button" class="cl-btn cl-btn--secondary">Read case study</button>
      </section>
    </div>
  </div>`),
    css: `
.t-corp__hero{max-width:640px;margin-bottom:40px}
.t-corp__title{margin:0 0 16px;font-size:clamp(1.6rem,2.8vw,2.3rem);letter-spacing:-.03em;line-height:1.15}
.t-corp__lead{margin:0 0 24px;line-height:1.65;font-size:var(--cl-font-md)}
.t-corp__solutions{margin-bottom:32px}
.t-corp__solutions h3{margin:0 0 8px;font-size:1.05rem}
.t-corp__solutions .cl-card{display:flex;flex-direction:column;gap:10px}
.t-corp__case{display:flex;flex-wrap:wrap;align-items:center;justify-content:space-between;gap:20px;background:color-mix(in srgb,var(--cl-primary) 6%,var(--cl-surface))}
.t-corp__case h3{margin:8px 0;font-size:1.15rem}
.t-corp__case-copy{max-width:480px}`,
  }),
];
