import { def, wrapRoot, type CatalogComponentDef } from "@/lib/catalog/shared";

export const FEEDBACK: CatalogComponentDef[] = [
  def({
    slug: "feedback-alert",
    name: "Alert",
    layer: "patterns",
    category: "feedback",
    problemTags: ["build-ui-sections", "build-dashboard"],
    description: "Inline alert banner for important notices with optional action.",
    html: wrapRoot(`
<div class="c-alert c-alert--info" role="alert">
  <div class="c-alert__icon" aria-hidden="true">i</div>
  <div class="c-alert__body">
    <strong>Scheduled maintenance</strong>
    <p>CompLib sync will be unavailable Saturday 2&ndash;4 AM UTC. Exports queued during this window will process automatically.</p>
  </div>
  <a href="#" class="cl-link c-alert__action">View status</a>
</div>`),
    css: `
.c-alert{display:flex;align-items:flex-start;gap:14px;padding:16px 18px;border-radius:var(--cl-radius);border:1px solid var(--cl-border);max-width:560px}
.c-alert--info{background:color-mix(in srgb,var(--cl-primary) 8%,var(--cl-surface));border-color:color-mix(in srgb,var(--cl-primary) 25%,var(--cl-border))}
.c-alert__icon{width:24px;height:24px;border-radius:999px;display:grid;place-items:center;font-weight:800;font-size:var(--cl-font-sm);background:var(--cl-primary);color:#fff;flex-shrink:0}
.c-alert__body{flex:1;font-size:var(--cl-font-sm)}
.c-alert__body strong{display:block;margin-bottom:4px;font-weight:700}
.c-alert__body p{margin:0;line-height:1.55;color:var(--cl-text-muted)}
.c-alert__action{white-space:nowrap;font-size:var(--cl-font-sm);align-self:center}`,
  }),

  def({
    slug: "feedback-toast",
    name: "Toast",
    layer: "patterns",
    category: "feedback",
    problemTags: ["build-dashboard", "build-ui-sections"],
    description: "Dismissible toast notification for transient success or info messages.",
    html: wrapRoot(`
<div class="c-toast" data-toast role="status">
  <div class="c-toast__icon" aria-hidden="true">&#10003;</div>
  <div class="c-toast__body">
    <strong>Pattern exported</strong>
    <p class="cl-muted">card-pricing pushed to main branch successfully.</p>
  </div>
  <button type="button" class="c-toast__close" data-toast-close aria-label="Dismiss">&times;</button>
</div>`),
    css: `
.c-toast{display:flex;align-items:flex-start;gap:12px;padding:14px 16px;max-width:380px;background:var(--cl-surface);border:1px solid var(--cl-border);border-radius:var(--cl-radius);box-shadow:0 12px 32px rgba(15,23,42,.12);animation:c-toast-in .3s ease}
.c-toast__icon{width:28px;height:28px;border-radius:999px;display:grid;place-items:center;background:color-mix(in srgb,#16a34a 15%,transparent);color:#15803d;font-weight:700;flex-shrink:0}
.c-toast__body{flex:1;font-size:var(--cl-font-sm)}
.c-toast__body strong{display:block;font-weight:700;margin-bottom:2px}
.c-toast__body p{margin:0;font-size:calc(var(--cl-font-sm)*.92)}
.c-toast__close{border:none;background:none;font-size:1.25rem;line-height:1;color:var(--cl-text-muted);cursor:pointer;padding:0 4px;border-radius:4px;transition:color .15s,background .15s}
.c-toast__close:hover{color:var(--cl-text);background:var(--cl-surface-muted)}
@keyframes c-toast-in{from{opacity:0;transform:translateY(8px)}to{opacity:1;transform:translateY(0)}}`,
    js: `
(function(){
  var toast=document.querySelector('[data-toast]');
  var close=toast&&toast.querySelector('[data-toast-close]');
  if(!close||!toast)return;
  close.addEventListener('click',function(){
    toast.style.opacity='0';
    toast.style.transform='translateY(8px)';
    toast.style.transition='opacity .2s,transform .2s';
    setTimeout(function(){toast.remove();},200);
  });
})();`,
  }),

  def({
    slug: "feedback-empty",
    name: "Empty State",
    layer: "patterns",
    category: "feedback",
    problemTags: ["build-dashboard", "build-ui-sections"],
    description: "Empty state placeholder when no data exists with guided next step.",
    html: wrapRoot(`
<div class="c-empty">
  <div class="c-empty__icon" aria-hidden="true">&#128451;</div>
  <h3 class="c-empty__title">No patterns yet</h3>
  <p class="c-empty__desc cl-muted">Browse the catalog or create your first pattern to populate this workspace.</p>
  <div class="c-empty__actions">
    <button type="button" class="cl-btn cl-btn--primary">Browse catalog</button>
    <button type="button" class="cl-btn cl-btn--secondary">Import from Figma</button>
  </div>
</div>`),
    css: `
.c-empty{max-width:400px;padding:48px 32px;text-align:center;background:var(--cl-surface);border:1px dashed var(--cl-border);border-radius:var(--cl-radius);display:flex;flex-direction:column;align-items:center;gap:12px}
.c-empty__icon{width:56px;height:56px;border-radius:16px;display:grid;place-items:center;font-size:1.5rem;background:var(--cl-surface-muted);color:var(--cl-text-muted);margin-bottom:4px}
.c-empty__title{margin:0;font-size:1.15rem;font-weight:700}
.c-empty__desc{margin:0;font-size:var(--cl-font-sm);line-height:1.55;max-width:320px}
.c-empty__actions{display:flex;flex-wrap:wrap;gap:10px;justify-content:center;margin-top:8px}`,
  }),

  def({
    slug: "feedback-error",
    name: "Error State",
    layer: "patterns",
    category: "feedback",
    problemTags: ["build-dashboard", "build-form"],
    description: "Error message block with retry action for failed operations.",
    html: wrapRoot(`
<div class="c-error" role="alert">
  <div class="c-error__icon" aria-hidden="true">!</div>
  <h3 class="c-error__title">Export failed</h3>
  <p class="c-error__desc cl-muted">We could not push card-pricing to your repository. The GitHub token may have expired or lacks write access.</p>
  <div class="c-error__actions">
    <button type="button" class="cl-btn cl-btn--primary">Retry export</button>
    <button type="button" class="cl-btn cl-btn--ghost">View logs</button>
  </div>
</div>`),
    css: `
.c-error{max-width:420px;padding:28px;background:color-mix(in srgb,#dc2626 4%,var(--cl-surface));border:1px solid color-mix(in srgb,#dc2626 20%,var(--cl-border));border-radius:var(--cl-radius);text-align:center;display:flex;flex-direction:column;align-items:center;gap:10px}
.c-error__icon{width:44px;height:44px;border-radius:999px;display:grid;place-items:center;font-weight:800;font-size:1.2rem;background:color-mix(in srgb,#dc2626 12%,transparent);color:#dc2626}
.c-error__title{margin:0;font-size:1.05rem;font-weight:700;color:#991b1b}
.c-error__desc{margin:0;font-size:var(--cl-font-sm);line-height:1.55;max-width:360px}
.c-error__actions{display:flex;flex-wrap:wrap;gap:10px;justify-content:center;margin-top:8px}`,
  }),

  def({
    slug: "feedback-success",
    name: "Success State",
    layer: "patterns",
    category: "feedback",
    problemTags: ["build-form", "build-authentication"],
    description: "Confirmation success screen after completing an action or signup.",
    html: wrapRoot(`
<div class="c-success">
  <div class="c-success__icon" aria-hidden="true">&#10003;</div>
  <h3 class="c-success__title">Workspace created</h3>
  <p class="c-success__desc cl-muted">Your CompLib workspace is ready. We sent a confirmation to alex@northwind.io.</p>
  <button type="button" class="cl-btn cl-btn--primary">Go to dashboard</button>
</div>`),
    css: `
.c-success{max-width:400px;padding:40px 32px;text-align:center;background:var(--cl-surface);border:1px solid var(--cl-border);border-radius:var(--cl-radius);display:flex;flex-direction:column;align-items:center;gap:12px}
.c-success__icon{width:52px;height:52px;border-radius:999px;display:grid;place-items:center;font-size:1.3rem;font-weight:700;background:color-mix(in srgb,#16a34a 15%,transparent);color:#15803d}
.c-success__title{margin:0;font-size:1.2rem;font-weight:800;letter-spacing:-.02em}
.c-success__desc{margin:0;font-size:var(--cl-font-sm);line-height:1.55;max-width:320px}`,
  }),

  def({
    slug: "feedback-loading",
    name: "Loading State",
    layer: "patterns",
    category: "feedback",
    problemTags: ["build-dashboard", "build-ui-sections"],
    description: "Loading indicator with message for async data fetches.",
    html: wrapRoot(`
<div class="c-loading" role="status" aria-live="polite">
  <div class="c-loading__spinner" aria-hidden="true"></div>
  <p class="c-loading__text">Syncing patterns from Figma...</p>
  <p class="c-loading__sub cl-muted">This usually takes a few seconds</p>
</div>`),
    css: `
.c-loading{max-width:320px;padding:40px 32px;text-align:center;background:var(--cl-surface);border:1px solid var(--cl-border);border-radius:var(--cl-radius);display:flex;flex-direction:column;align-items:center;gap:12px}
.c-loading__spinner{width:40px;height:40px;border:3px solid var(--cl-border);border-top-color:var(--cl-primary);border-radius:999px;animation:c-spin .8s linear infinite}
.c-loading__text{margin:0;font-size:var(--cl-font-sm);font-weight:600}
.c-loading__sub{margin:0;font-size:calc(var(--cl-font-sm)*.92)}
@keyframes c-spin{to{transform:rotate(360deg)}}`,
  }),

  def({
    slug: "feedback-confirmation",
    name: "Confirmation Dialog",
    layer: "patterns",
    category: "feedback",
    problemTags: ["build-dashboard", "build-ui-sections"],
    description: "Destructive action confirmation dialog with cancel and confirm buttons.",
    html: wrapRoot(`
<div class="c-confirm">
  <div class="c-confirm__icon" aria-hidden="true">?</div>
  <h3 class="c-confirm__title">Delete this pattern?</h3>
  <p class="c-confirm__desc cl-muted">card-pricing will be permanently removed from your workspace. Exported copies in connected repos will not be affected.</p>
  <div class="c-confirm__actions">
    <button type="button" class="cl-btn cl-btn--ghost">Cancel</button>
    <button type="button" class="cl-btn cl-btn--primary c-confirm__danger">Delete pattern</button>
  </div>
</div>`),
    css: `
.c-confirm{max-width:400px;padding:28px;background:var(--cl-surface);border:1px solid var(--cl-border);border-radius:calc(var(--cl-radius)*1.1);box-shadow:0 16px 40px rgba(15,23,42,.12);display:flex;flex-direction:column;gap:12px}
.c-confirm__icon{width:40px;height:40px;border-radius:999px;display:grid;place-items:center;font-weight:800;background:color-mix(in srgb,#ca8a04 12%,transparent);color:#a16207}
.c-confirm__title{margin:0;font-size:1.1rem;font-weight:700}
.c-confirm__desc{margin:0;font-size:var(--cl-font-sm);line-height:1.55}
.c-confirm__actions{display:flex;justify-content:flex-end;gap:10px;margin-top:8px}
.c-confirm__danger{background:#dc2626!important}
.c-confirm__danger:hover{background:#b91c1c!important}`,
  }),

  def({
    slug: "feedback-progress",
    name: "Progress Indicator",
    layer: "patterns",
    category: "feedback",
    problemTags: ["build-form", "build-dashboard"],
    description: "Linear progress bar with step label for multi-step or upload flows.",
    html: wrapRoot(`
<div class="c-progress">
  <div class="c-progress__head">
    <span class="c-progress__label">Importing design tokens</span>
    <span class="c-progress__pct">68%</span>
  </div>
  <div class="c-progress__track" role="progressbar" aria-valuenow="68" aria-valuemin="0" aria-valuemax="100">
    <div class="c-progress__fill" style="width:68%"></div>
  </div>
  <p class="c-progress__hint cl-muted">Processing color, spacing, and typography tokens from tokens.json</p>
</div>`),
    css: `
.c-progress{max-width:480px;padding:20px;background:var(--cl-surface);border:1px solid var(--cl-border);border-radius:var(--cl-radius);display:flex;flex-direction:column;gap:10px}
.c-progress__head{display:flex;justify-content:space-between;align-items:center;font-size:var(--cl-font-sm)}
.c-progress__label{font-weight:600}
.c-progress__pct{font-weight:800;color:var(--cl-primary)}
.c-progress__track{height:8px;background:var(--cl-surface-muted);border-radius:999px;overflow:hidden}
.c-progress__fill{height:100%;background:linear-gradient(90deg,var(--cl-primary),#14b8a6);border-radius:999px;transition:width .3s ease}
.c-progress__hint{margin:0;font-size:calc(var(--cl-font-sm)*.92)}`,
  }),

  def({
    slug: "feedback-status",
    name: "Status Badge",
    layer: "patterns",
    category: "feedback",
    problemTags: ["build-dashboard", "build-ui-sections"],
    description: "Status indicator group showing system health and service states.",
    html: wrapRoot(`
<div class="c-status">
  <div class="c-status__row">
    <span class="c-status__dot c-status__dot--ok"></span>
    <span class="c-status__name">API</span>
    <span class="c-status__val">Operational</span>
  </div>
  <div class="c-status__row">
    <span class="c-status__dot c-status__dot--ok"></span>
    <span class="c-status__name">Figma sync</span>
    <span class="c-status__val">Operational</span>
  </div>
  <div class="c-status__row">
    <span class="c-status__dot c-status__dot--warn"></span>
    <span class="c-status__name">Export queue</span>
    <span class="c-status__val">Degraded</span>
  </div>
  <div class="c-status__row">
    <span class="c-status__dot c-status__dot--ok"></span>
    <span class="c-status__name">CDN</span>
    <span class="c-status__val">Operational</span>
  </div>
  <p class="c-status__updated cl-muted">Last checked 30 seconds ago</p>
</div>`),
    css: `
.c-status{max-width:360px;padding:18px;background:var(--cl-surface);border:1px solid var(--cl-border);border-radius:var(--cl-radius);display:flex;flex-direction:column;gap:10px}
.c-status__row{display:flex;align-items:center;gap:10px;font-size:var(--cl-font-sm);padding:8px 0;border-bottom:1px solid var(--cl-border)}
.c-status__row:last-of-type{border-bottom:none}
.c-status__dot{width:8px;height:8px;border-radius:999px;flex-shrink:0}
.c-status__dot--ok{background:#16a34a;box-shadow:0 0 0 3px color-mix(in srgb,#16a34a 20%,transparent)}
.c-status__dot--warn{background:#ca8a04;box-shadow:0 0 0 3px color-mix(in srgb,#ca8a04 20%,transparent)}
.c-status__name{flex:1;font-weight:600}
.c-status__val{color:var(--cl-text-muted);font-weight:500}
.c-status__updated{margin:4px 0 0;font-size:calc(var(--cl-font-sm)*.92);text-align:center}`,
  }),

  def({
    slug: "feedback-activity",
    name: "Activity Feed",
    layer: "patterns",
    category: "feedback",
    problemTags: ["build-dashboard", "build-ui-sections"],
    description: "Live activity feed showing recent team actions and system events.",
    html: wrapRoot(`
<div class="c-activity">
  <header class="c-activity__head">
    <h3 class="c-activity__title">Recent activity</h3>
    <span class="c-activity__live"><span class="c-activity__pulse"></span> Live</span>
  </header>
  <ul class="c-activity__list">
    <li class="c-activity__item">
      <div class="cl-avatar">MR</div>
      <div class="c-activity__body">
        <strong>Maya Rodriguez</strong> published <em>nav-sidebar</em>
        <time class="cl-muted">Just now</time>
      </div>
    </li>
    <li class="c-activity__item">
      <div class="cl-avatar">JK</div>
      <div class="c-activity__body">
        <strong>James Kim</strong> exported 3 patterns to GitHub
        <time class="cl-muted">4 min ago</time>
      </div>
    </li>
    <li class="c-activity__item">
      <div class="cl-avatar">SL</div>
      <div class="c-activity__body">
        <strong>Sarah Lin</strong> updated brand tokens
        <time class="cl-muted">12 min ago</time>
      </div>
    </li>
    <li class="c-activity__item">
      <div class="c-activity__sys">&#9881;</div>
      <div class="c-activity__body">
        <strong>System</strong> completed nightly catalog sync
        <time class="cl-muted">1 hr ago</time>
      </div>
    </li>
  </ul>
</div>`),
    css: `
.c-activity{max-width:420px;background:var(--cl-surface);border:1px solid var(--cl-border);border-radius:var(--cl-radius);overflow:hidden}
.c-activity__head{display:flex;align-items:center;justify-content:space-between;padding:16px 18px;border-bottom:1px solid var(--cl-border)}
.c-activity__title{margin:0;font-size:1rem;font-weight:700}
.c-activity__live{display:flex;align-items:center;gap:6px;font-size:calc(var(--cl-font-sm)*.88);font-weight:700;color:#15803d}
.c-activity__pulse{width:8px;height:8px;border-radius:999px;background:#16a34a;animation:c-pulse 1.5s ease infinite}
.c-activity__list{margin:0;padding:0;list-style:none}
.c-activity__item{display:flex;align-items:flex-start;gap:12px;padding:14px 18px;border-bottom:1px solid var(--cl-border);font-size:var(--cl-font-sm)}
.c-activity__item:last-child{border-bottom:none}
.c-activity__body{display:flex;flex-direction:column;gap:2px;line-height:1.45}
.c-activity__body em{font-style:normal;color:var(--cl-primary);font-weight:600}
.c-activity__body time{font-size:calc(var(--cl-font-sm)*.88)}
.c-activity__sys{width:40px;height:40px;border-radius:999px;display:grid;place-items:center;background:var(--cl-surface-muted);color:var(--cl-text-muted);flex-shrink:0;font-size:.9rem}
@keyframes c-pulse{0%,100%{opacity:1}50%{opacity:.4}}`,
  }),
];
