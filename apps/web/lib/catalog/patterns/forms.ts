import { def, wrapRoot, type CatalogComponentDef } from "@/lib/catalog/shared";

export const FORMS: CatalogComponentDef[] = [
  def({
    slug: "form-login",
    name: "Login Form",
    layer: "patterns",
    category: "forms",
    problemTags: ["build-authentication", "build-form"],
    description: "Email and password sign-in form with remember-me and forgot-password links.",
    html: wrapRoot(`
<form class="c-form c-form--auth" action="#" method="post">
  <header class="c-form__head">
    <h2 class="c-form__title">Sign in to CompLib</h2>
    <p class="c-form__sub cl-muted">Access your workspace, patterns, and team settings.</p>
  </header>
  <div class="cl-field">
    <label for="login-email">Work email</label>
    <input class="cl-input" id="login-email" type="email" name="email" placeholder="you@company.com" autocomplete="email" required />
  </div>
  <div class="cl-field">
    <label for="login-password">Password</label>
    <input class="cl-input" id="login-password" type="password" name="password" placeholder="Enter your password" autocomplete="current-password" required />
  </div>
  <div class="c-form__row">
    <label class="c-form__check"><input type="checkbox" name="remember" /> Remember me</label>
    <a href="#" class="cl-link">Forgot password?</a>
  </div>
  <button type="submit" class="cl-btn cl-btn--primary c-form__submit">Sign in</button>
  <p class="c-form__foot cl-muted">No account? <a href="#" class="cl-link">Create one free</a></p>
</form>`),
    css: `
.c-form--auth{max-width:400px;padding:32px;background:var(--cl-surface);border:1px solid var(--cl-border);border-radius:var(--cl-radius);display:flex;flex-direction:column;gap:18px}
.c-form__head{text-align:center;margin-bottom:4px}
.c-form__title{margin:0 0 6px;font-size:1.35rem;font-weight:800;letter-spacing:-.02em}
.c-form__sub{margin:0;font-size:var(--cl-font-sm)}
.c-form__row{display:flex;align-items:center;justify-content:space-between;gap:12px;font-size:var(--cl-font-sm)}
.c-form__check{display:flex;align-items:center;gap:8px;cursor:pointer;color:var(--cl-text-muted)}
.c-form__submit{width:100%}
.c-form__foot{margin:0;text-align:center;font-size:var(--cl-font-sm)}`,
  }),

  def({
    slug: "form-register",
    name: "Register Form",
    layer: "patterns",
    category: "forms",
    problemTags: ["build-authentication", "build-form"],
    description: "Account creation form with name, email, password, and terms acceptance.",
    html: wrapRoot(`
<form class="c-form c-form--auth" action="#" method="post">
  <header class="c-form__head">
    <h2 class="c-form__title">Create your account</h2>
    <p class="c-form__sub cl-muted">Start building with CompLib in under a minute.</p>
  </header>
  <div class="cl-field">
    <label for="reg-name">Full name</label>
    <input class="cl-input" id="reg-name" type="text" name="name" placeholder="Alex Chen" autocomplete="name" required />
  </div>
  <div class="cl-field">
    <label for="reg-email">Work email</label>
    <input class="cl-input" id="reg-email" type="email" name="email" placeholder="alex@startup.io" autocomplete="email" required />
  </div>
  <div class="cl-field">
    <label for="reg-password">Password</label>
    <input class="cl-input" id="reg-password" type="password" name="password" placeholder="Min. 8 characters" autocomplete="new-password" required />
  </div>
  <label class="c-form__check"><input type="checkbox" name="terms" required /> I agree to the <a href="#" class="cl-link">Terms of Service</a></label>
  <button type="submit" class="cl-btn cl-btn--primary c-form__submit">Create account</button>
</form>`),
    css: `
.c-form--auth{max-width:400px;padding:32px;background:var(--cl-surface);border:1px solid var(--cl-border);border-radius:var(--cl-radius);display:flex;flex-direction:column;gap:18px}
.c-form__head{text-align:center;margin-bottom:4px}
.c-form__title{margin:0 0 6px;font-size:1.35rem;font-weight:800;letter-spacing:-.02em}
.c-form__sub{margin:0;font-size:var(--cl-font-sm)}
.c-form__check{display:flex;align-items:flex-start;gap:8px;font-size:var(--cl-font-sm);color:var(--cl-text-muted);cursor:pointer}
.c-form__submit{width:100%}`,
  }),

  def({
    slug: "form-contact",
    name: "Contact Form",
    layer: "patterns",
    category: "forms",
    problemTags: ["build-form", "build-landing-page"],
    description: "Lead capture contact form with subject, message, and company fields.",
    html: wrapRoot(`
<form class="c-form c-form--contact" action="#" method="post">
  <h2 class="c-form__title">Talk to sales</h2>
  <p class="c-form__sub cl-muted">Tell us about your team and we will respond within one business day.</p>
  <div class="c-form__grid">
    <div class="cl-field">
      <label for="contact-name">Name</label>
      <input class="cl-input" id="contact-name" type="text" name="name" placeholder="Jordan Lee" required />
    </div>
    <div class="cl-field">
      <label for="contact-company">Company</label>
      <input class="cl-input" id="contact-company" type="text" name="company" placeholder="Acme Corp" />
    </div>
  </div>
  <div class="cl-field">
    <label for="contact-email">Email</label>
    <input class="cl-input" id="contact-email" type="email" name="email" placeholder="jordan@acme.com" required />
  </div>
  <div class="cl-field">
    <label for="contact-subject">Subject</label>
    <select class="cl-select" id="contact-subject" name="subject">
      <option>Enterprise pricing</option>
      <option>Technical demo</option>
      <option>Partnership inquiry</option>
    </select>
  </div>
  <div class="cl-field">
    <label for="contact-message">Message</label>
    <textarea class="cl-textarea" id="contact-message" name="message" placeholder="Describe your use case..." required></textarea>
  </div>
  <button type="submit" class="cl-btn cl-btn--primary">Send message</button>
</form>`),
    css: `
.c-form--contact{max-width:520px;padding:28px;background:var(--cl-surface);border:1px solid var(--cl-border);border-radius:var(--cl-radius);display:flex;flex-direction:column;gap:16px}
.c-form__title{margin:0;font-size:1.25rem;font-weight:800}
.c-form__sub{margin:0;font-size:var(--cl-font-sm)}
.c-form__grid{display:grid;grid-template-columns:1fr 1fr;gap:14px}
@media(max-width:480px){.c-form__grid{grid-template-columns:1fr}}`,
  }),

  def({
    slug: "form-search",
    name: "Search Form",
    layer: "patterns",
    category: "forms",
    problemTags: ["build-navigation", "build-dashboard"],
    description: "Global search input with scope selector and keyboard shortcut hint.",
    html: wrapRoot(`
<form class="c-search" role="search" action="#" method="get">
  <div class="c-search__wrap">
    <span class="c-search__icon" aria-hidden="true">&#128269;</span>
    <input class="c-search__input" type="search" name="q" placeholder="Search patterns, tokens, docs..." aria-label="Search" />
    <kbd class="c-search__kbd">&#8984;K</kbd>
  </div>
  <select class="cl-select c-search__scope" name="scope" aria-label="Search scope">
    <option>All</option>
    <option>Patterns</option>
    <option>Components</option>
    <option>Docs</option>
  </select>
  <button type="submit" class="cl-btn cl-btn--primary">Search</button>
</form>`),
    css: `
.c-search{display:flex;flex-wrap:wrap;align-items:center;gap:10px;max-width:640px;padding:12px;background:var(--cl-surface);border:1px solid var(--cl-border);border-radius:var(--cl-radius)}
.c-search__wrap{flex:1;min-width:200px;display:flex;align-items:center;gap:10px;padding:0 12px;background:var(--cl-surface-muted);border:1px solid var(--cl-border);border-radius:calc(var(--cl-radius)*.85)}
.c-search__icon{opacity:.5;font-size:.9rem}
.c-search__input{flex:1;border:none;background:transparent;padding:10px 0;font:inherit;font-size:var(--cl-font-sm);outline:none;color:var(--cl-text)}
.c-search__kbd{padding:3px 7px;border-radius:6px;font-size:calc(var(--cl-font-sm)*.85);font-family:inherit;background:var(--cl-surface);border:1px solid var(--cl-border);color:var(--cl-text-muted)}
.c-search__scope{max-width:140px}`,
  }),

  def({
    slug: "form-newsletter",
    name: "Newsletter Form",
    layer: "patterns",
    category: "forms",
    problemTags: ["build-landing-page", "build-form"],
    description: "Inline email signup with value proposition and privacy note.",
    html: wrapRoot(`
<form class="c-newsletter" action="#" method="post">
  <div class="c-newsletter__copy">
    <span class="cl-kicker">Stay updated</span>
    <h3 class="c-newsletter__title">Ship better UI, weekly</h3>
    <p class="cl-muted">Pattern drops, token recipes, and release notes. No spam, unsubscribe anytime.</p>
  </div>
  <div class="c-newsletter__row">
    <div class="cl-field c-newsletter__field">
      <label class="visually-hidden" for="newsletter-email">Email</label>
      <input class="cl-input" id="newsletter-email" type="email" name="email" placeholder="you@company.com" required />
    </div>
    <button type="submit" class="cl-btn cl-btn--primary">Subscribe</button>
  </div>
  <p class="c-newsletter__privacy cl-muted">By subscribing you agree to our <a href="#" class="cl-link">Privacy Policy</a>.</p>
</form>`),
    css: `
.c-newsletter{max-width:560px;padding:28px;background:var(--cl-surface);border:1px solid var(--cl-border);border-radius:var(--cl-radius);display:flex;flex-direction:column;gap:16px}
.c-newsletter__title{margin:8px 0 6px;font-size:1.15rem;font-weight:700}
.c-newsletter__row{display:flex;flex-wrap:wrap;gap:10px;align-items:flex-end}
.c-newsletter__field{flex:1;min-width:200px;margin:0}
.c-newsletter__privacy{margin:0;font-size:calc(var(--cl-font-sm)*.92)}
.visually-hidden{position:absolute;width:1px;height:1px;padding:0;margin:-1px;overflow:hidden;clip:rect(0,0,0,0);border:0}`,
  }),

  def({
    slug: "form-checkout",
    name: "Checkout Form",
    layer: "patterns",
    category: "forms",
    problemTags: ["build-form", "build-ui-sections"],
    description: "Payment checkout with billing details and order summary sidebar.",
    html: wrapRoot(`
<form class="c-checkout" action="#" method="post">
  <div class="c-checkout__main">
    <h2 class="c-form__title">Billing details</h2>
    <div class="c-form__grid">
      <div class="cl-field">
        <label for="checkout-fname">First name</label>
        <input class="cl-input" id="checkout-fname" type="text" name="firstName" required />
      </div>
      <div class="cl-field">
        <label for="checkout-lname">Last name</label>
        <input class="cl-input" id="checkout-lname" type="text" name="lastName" required />
      </div>
    </div>
    <div class="cl-field">
      <label for="checkout-card">Card number</label>
      <input class="cl-input" id="checkout-card" type="text" name="card" placeholder="4242 4242 4242 4242" inputmode="numeric" required />
    </div>
    <div class="c-form__grid">
      <div class="cl-field">
        <label for="checkout-exp">Expiry</label>
        <input class="cl-input" id="checkout-exp" type="text" name="expiry" placeholder="MM / YY" required />
      </div>
      <div class="cl-field">
        <label for="checkout-cvc">CVC</label>
        <input class="cl-input" id="checkout-cvc" type="text" name="cvc" placeholder="123" inputmode="numeric" required />
      </div>
    </div>
  </div>
  <aside class="c-checkout__summary">
    <h3 class="c-checkout__summary-title">Order summary</h3>
    <div class="c-checkout__line"><span>CompLib Pro (annual)</span><span>$948</span></div>
    <div class="c-checkout__line cl-muted"><span>Discount (LAUNCH20)</span><span>-$189.60</span></div>
    <div class="cl-divider"></div>
    <div class="c-checkout__line c-checkout__total"><span>Total due today</span><span>$758.40</span></div>
    <button type="submit" class="cl-btn cl-btn--primary c-form__submit">Complete purchase</button>
  </aside>
</form>`),
    css: `
.c-checkout{display:grid;grid-template-columns:1fr 280px;gap:24px;max-width:720px;padding:24px;background:var(--cl-surface-muted);border:1px solid var(--cl-border);border-radius:var(--cl-radius)}
.c-checkout__main{display:flex;flex-direction:column;gap:14px;padding:20px;background:var(--cl-surface);border:1px solid var(--cl-border);border-radius:var(--cl-radius)}
.c-checkout__summary{padding:20px;background:var(--cl-surface);border:1px solid var(--cl-border);border-radius:var(--cl-radius);display:flex;flex-direction:column;gap:12px;height:fit-content}
.c-checkout__summary-title{margin:0;font-size:1rem;font-weight:700}
.c-checkout__line{display:flex;justify-content:space-between;gap:12px;font-size:var(--cl-font-sm)}
.c-checkout__total{font-weight:800;font-size:1.05rem}
.c-form__grid{display:grid;grid-template-columns:1fr 1fr;gap:14px}
.c-form__title{margin:0;font-size:1.15rem;font-weight:700}
.c-form__submit{width:100%;margin-top:8px}
@media(max-width:640px){.c-checkout{grid-template-columns:1fr}}`,
  }),

  def({
    slug: "form-multi-step",
    name: "Multi-Step Form",
    layer: "patterns",
    category: "forms",
    problemTags: ["build-form", "build-authentication"],
    description: "Wizard-style form with step indicator and next/back navigation.",
    html: wrapRoot(`
<form class="c-wizard" data-wizard action="#" method="post">
  <div class="c-wizard__steps" role="tablist">
    <span class="c-wizard__step is-active" data-step="0">1. Account</span>
    <span class="c-wizard__step" data-step="1">2. Workspace</span>
    <span class="c-wizard__step" data-step="2">3. Review</span>
  </div>
  <div class="c-wizard__panel is-active" data-panel="0">
    <h3 class="c-wizard__title">Create your account</h3>
    <div class="cl-field"><label for="wiz-email">Email</label><input class="cl-input" id="wiz-email" type="email" required /></div>
    <div class="cl-field"><label for="wiz-pass">Password</label><input class="cl-input" id="wiz-pass" type="password" required /></div>
  </div>
  <div class="c-wizard__panel" data-panel="1" hidden>
    <h3 class="c-wizard__title">Set up workspace</h3>
    <div class="cl-field"><label for="wiz-workspace">Workspace name</label><input class="cl-input" id="wiz-workspace" type="text" placeholder="Acme Design" /></div>
    <div class="cl-field"><label for="wiz-team">Team size</label><select class="cl-select" id="wiz-team"><option>1-5</option><option>6-20</option><option>21+</option></select></div>
  </div>
  <div class="c-wizard__panel" data-panel="2" hidden>
    <h3 class="c-wizard__title">Review and confirm</h3>
    <p class="cl-muted">You are creating a CompLib workspace with the Growth plan trial. You can change settings anytime.</p>
  </div>
  <div class="c-wizard__nav">
    <button type="button" class="cl-btn cl-btn--secondary" data-wizard-back hidden>Back</button>
    <button type="button" class="cl-btn cl-btn--primary" data-wizard-next>Continue</button>
    <button type="submit" class="cl-btn cl-btn--primary" data-wizard-submit hidden>Finish setup</button>
  </div>
</form>`),
    css: `
.c-wizard{max-width:480px;padding:28px;background:var(--cl-surface);border:1px solid var(--cl-border);border-radius:var(--cl-radius);display:flex;flex-direction:column;gap:20px}
.c-wizard__steps{display:flex;gap:8px;font-size:calc(var(--cl-font-sm)*.92);font-weight:600}
.c-wizard__step{flex:1;padding:8px 10px;text-align:center;border-radius:calc(var(--cl-radius)*.7);background:var(--cl-surface-muted);color:var(--cl-text-muted)}
.c-wizard__step.is-active{background:color-mix(in srgb,var(--cl-primary) 12%,transparent);color:var(--cl-primary-hover)}
.c-wizard__panel{display:flex;flex-direction:column;gap:14px}
.c-wizard__panel[hidden]{display:none!important}
.c-wizard__title{margin:0;font-size:1.05rem;font-weight:700}
.c-wizard__nav{display:flex;justify-content:flex-end;gap:10px;margin-top:4px}`,
    js: `
(function(){
  var root=document.querySelector('[data-wizard]');
  if(!root)return;
  var steps=root.querySelectorAll('[data-step]');
  var panels=root.querySelectorAll('[data-panel]');
  var back=root.querySelector('[data-wizard-back]');
  var next=root.querySelector('[data-wizard-next]');
  var submit=root.querySelector('[data-wizard-submit]');
  var i=0;
  function show(n){
    i=n;
    steps.forEach(function(s,j){s.classList.toggle('is-active',j===i);});
    panels.forEach(function(p,j){p.hidden=j!==i;p.classList.toggle('is-active',j===i);});
    back.hidden=i===0;
    next.hidden=i===panels.length-1;
    submit.hidden=i!==panels.length-1;
  }
  back.addEventListener('click',function(){if(i>0)show(i-1);});
  next.addEventListener('click',function(){if(i<panels.length-1)show(i+1);});
  show(0);
})();`,
  }),

  def({
    slug: "form-feedback",
    name: "Feedback Form",
    layer: "patterns",
    category: "forms",
    problemTags: ["build-form", "build-dashboard"],
    description: "In-app feedback collector with rating, category, and open comment field.",
    html: wrapRoot(`
<form class="c-feedback" action="#" method="post">
  <h3 class="c-form__title">How was your experience?</h3>
  <fieldset class="c-feedback__rating">
    <legend class="visually-hidden">Rating</legend>
    <label><input type="radio" name="rating" value="1" /> 1</label>
    <label><input type="radio" name="rating" value="2" /> 2</label>
    <label><input type="radio" name="rating" value="3" /> 3</label>
    <label><input type="radio" name="rating" value="4" checked /> 4</label>
    <label><input type="radio" name="rating" value="5" /> 5</label>
  </fieldset>
  <div class="cl-field">
    <label for="feedback-type">Category</label>
    <select class="cl-select" id="feedback-type" name="category">
      <option>Bug report</option>
      <option>Feature request</option>
      <option>General feedback</option>
    </select>
  </div>
  <div class="cl-field">
    <label for="feedback-comment">Details</label>
    <textarea class="cl-textarea" id="feedback-comment" name="comment" placeholder="Tell us what worked or what could improve..."></textarea>
  </div>
  <button type="submit" class="cl-btn cl-btn--primary">Submit feedback</button>
</form>`),
    css: `
.c-feedback{max-width:420px;padding:24px;background:var(--cl-surface);border:1px solid var(--cl-border);border-radius:var(--cl-radius);display:flex;flex-direction:column;gap:16px}
.c-form__title{margin:0;font-size:1.05rem;font-weight:700}
.c-feedback__rating{display:flex;gap:8px;border:none;padding:0;margin:0}
.c-feedback__rating label{display:grid;place-items:center;width:40px;height:40px;border:1px solid var(--cl-border);border-radius:calc(var(--cl-radius)*.7);cursor:pointer;font-weight:700;font-size:var(--cl-font-sm);transition:background .15s,border-color .15s}
.c-feedback__rating input{position:absolute;opacity:0;pointer-events:none}
.c-feedback__rating label:has(input:checked){background:color-mix(in srgb,var(--cl-primary) 12%,transparent);border-color:var(--cl-primary);color:var(--cl-primary-hover)}
.visually-hidden{position:absolute;width:1px;height:1px;padding:0;margin:-1px;overflow:hidden;clip:rect(0,0,0,0);border:0}`,
  }),

  def({
    slug: "form-settings",
    name: "Settings Form",
    layer: "patterns",
    category: "forms",
    problemTags: ["build-form", "build-dashboard"],
    description: "Account settings panel with profile fields and notification toggles.",
    html: wrapRoot(`
<form class="c-settings" action="#" method="post">
  <section class="c-settings__section">
    <h3 class="c-settings__heading">Profile</h3>
    <div class="cl-field"><label for="set-name">Display name</label><input class="cl-input" id="set-name" type="text" value="Alex Chen" /></div>
    <div class="cl-field"><label for="set-email">Email</label><input class="cl-input" id="set-email" type="email" value="alex@northwind.io" /></div>
  </section>
  <div class="cl-divider"></div>
  <section class="c-settings__section">
    <h3 class="c-settings__heading">Notifications</h3>
    <label class="c-settings__toggle"><input type="checkbox" checked /> Product updates</label>
    <label class="c-settings__toggle"><input type="checkbox" checked /> Weekly digest</label>
    <label class="c-settings__toggle"><input type="checkbox" /> Marketing emails</label>
  </section>
  <div class="c-settings__actions">
    <button type="button" class="cl-btn cl-btn--ghost">Cancel</button>
    <button type="submit" class="cl-btn cl-btn--primary">Save changes</button>
  </div>
</form>`),
    css: `
.c-settings{max-width:480px;padding:24px;background:var(--cl-surface);border:1px solid var(--cl-border);border-radius:var(--cl-radius);display:flex;flex-direction:column;gap:16px}
.c-settings__section{display:flex;flex-direction:column;gap:14px}
.c-settings__heading{margin:0;font-size:1rem;font-weight:700}
.c-settings__toggle{display:flex;align-items:center;gap:10px;font-size:var(--cl-font-sm);cursor:pointer;color:var(--cl-text)}
.c-settings__actions{display:flex;justify-content:flex-end;gap:10px;margin-top:8px}`,
  }),

  def({
    slug: "form-filter",
    name: "Filter Form",
    layer: "patterns",
    category: "forms",
    problemTags: ["build-dashboard", "build-form"],
    description: "Compact filter bar with date range, status, and assignee selectors.",
    html: wrapRoot(`
<form class="c-filter" action="#" method="get">
  <div class="cl-field c-filter__field">
    <label for="filter-q">Search</label>
    <input class="cl-input" id="filter-q" type="search" name="q" placeholder="Filter by name..." />
  </div>
  <div class="cl-field c-filter__field">
    <label for="filter-status">Status</label>
    <select class="cl-select" id="filter-status" name="status">
      <option value="">All statuses</option>
      <option>Active</option>
      <option>Paused</option>
      <option>Archived</option>
    </select>
  </div>
  <div class="cl-field c-filter__field">
    <label for="filter-date">Date range</label>
    <select class="cl-select" id="filter-date" name="range">
      <option>Last 7 days</option>
      <option>Last 30 days</option>
      <option>This quarter</option>
    </select>
  </div>
  <div class="cl-field c-filter__field">
    <label for="filter-owner">Owner</label>
    <select class="cl-select" id="filter-owner" name="owner">
      <option>Anyone</option>
      <option>Me</option>
      <option>My team</option>
    </select>
  </div>
  <div class="c-filter__actions">
    <button type="submit" class="cl-btn cl-btn--primary">Apply</button>
    <button type="reset" class="cl-btn cl-btn--ghost">Reset</button>
  </div>
</form>`),
    css: `
.c-filter{display:flex;flex-wrap:wrap;align-items:flex-end;gap:12px;padding:16px 18px;background:var(--cl-surface);border:1px solid var(--cl-border);border-radius:var(--cl-radius)}
.c-filter__field{min-width:140px;flex:1}
.c-filter__actions{display:flex;gap:8px;padding-bottom:2px}`,
  }),
];
