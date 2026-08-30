import { def, wrapRoot, type CatalogComponentDef } from "@/lib/catalog/shared";

export const NAVIGATION: CatalogComponentDef[] = [
  def({
    slug: "nav-navbar",
    name: "Navbar",
    layer: "patterns",
    category: "navigation",
    problemTags: ["build-navigation", "build-landing-page"],
    description: "Responsive top navigation with brand, links, and mobile menu toggle.",
    html: wrapRoot(`
<header class="c-navbar" data-navbar>
  <a href="#" class="c-navbar__brand">CompLib</a>
  <button type="button" class="c-navbar__toggle" data-nav-toggle aria-label="Toggle menu" aria-expanded="false">&#9776;</button>
  <nav class="c-navbar__nav" data-nav-menu>
    <a href="#" class="c-navbar__link is-active">Product</a>
    <a href="#" class="c-navbar__link">Patterns</a>
    <a href="#" class="c-navbar__link">Pricing</a>
    <a href="#" class="c-navbar__link">Docs</a>
  </nav>
  <div class="c-navbar__actions" data-nav-actions>
    <a href="#" class="cl-btn cl-btn--ghost">Sign in</a>
    <a href="#" class="cl-btn cl-btn--primary">Start free</a>
  </div>
</header>`),
    css: `
.c-navbar{display:flex;align-items:center;gap:20px;padding:14px 24px;background:var(--cl-surface);border:1px solid var(--cl-border);border-radius:var(--cl-radius);flex-wrap:wrap}
.c-navbar__brand{font-weight:800;font-size:1.1rem;letter-spacing:-.02em;color:var(--cl-text);text-decoration:none}
.c-navbar__nav{display:flex;gap:4px;flex:1}
.c-navbar__link{padding:8px 12px;border-radius:calc(var(--cl-radius)*.7);font-size:var(--cl-font-sm);font-weight:600;color:var(--cl-text-muted);text-decoration:none;transition:background .15s,color .15s}
.c-navbar__link:hover{color:var(--cl-text);background:var(--cl-surface-muted)}
.c-navbar__link.is-active{color:var(--cl-primary);background:color-mix(in srgb,var(--cl-primary) 10%,transparent)}
.c-navbar__actions{display:flex;gap:8px;margin-left:auto}
.c-navbar__toggle{display:none;background:none;border:1px solid var(--cl-border);border-radius:calc(var(--cl-radius)*.7);padding:8px 12px;font-size:1.1rem;cursor:pointer;color:var(--cl-text)}
@media(max-width:640px){
  .c-navbar__toggle{display:block}
  .c-navbar__nav,.c-navbar__actions{display:none;width:100%;flex-direction:column}
  .c-navbar__nav.is-open,.c-navbar__actions.is-open{display:flex}
  .c-navbar__actions{margin-left:0}
}`,
    js: `
(function(){
  var btn=document.querySelector('[data-nav-toggle]');
  var menu=document.querySelector('[data-nav-menu]');
  var actions=document.querySelector('[data-nav-actions]');
  if(!btn||!menu)return;
  btn.addEventListener('click',function(){
    var open=menu.classList.toggle('is-open');
    if(actions)actions.classList.toggle('is-open',open);
    btn.setAttribute('aria-expanded',open?'true':'false');
  });
})();`,
  }),

  def({
    slug: "nav-sidebar",
    name: "Sidebar",
    layer: "patterns",
    category: "navigation",
    problemTags: ["build-navigation", "build-dashboard"],
    description: "Vertical sidebar with grouped nav items and active state highlighting.",
    html: wrapRoot(`
<aside class="c-sidebar">
  <div class="c-sidebar__brand">CompLib</div>
  <nav class="c-sidebar__nav">
    <span class="c-sidebar__group">Main</span>
    <a href="#" class="c-sidebar__item is-active"><span class="c-sidebar__icon">&#9632;</span> Overview</a>
    <a href="#" class="c-sidebar__item"><span class="c-sidebar__icon">&#9670;</span> Patterns</a>
    <a href="#" class="c-sidebar__item"><span class="c-sidebar__icon">&#9673;</span> Components</a>
    <span class="c-sidebar__group">Workspace</span>
    <a href="#" class="c-sidebar__item"><span class="c-sidebar__icon">&#9881;</span> Settings</a>
    <a href="#" class="c-sidebar__item"><span class="c-sidebar__icon">&#9783;</span> Team</a>
    <a href="#" class="c-sidebar__item"><span class="c-sidebar__icon">&#128196;</span> Billing</a>
  </nav>
  <div class="c-sidebar__foot">
    <div class="cl-avatar">AC</div>
    <div><strong style="font-size:var(--cl-font-sm)">Alex Chen</strong><br><span class="cl-muted" style="font-size:calc(var(--cl-font-sm)*.92)">Pro plan</span></div>
  </div>
</aside>`),
    css: `
.c-sidebar{width:240px;min-height:420px;display:flex;flex-direction:column;background:var(--cl-surface);border:1px solid var(--cl-border);border-radius:var(--cl-radius);overflow:hidden}
.c-sidebar__brand{padding:18px 20px;font-weight:800;font-size:1.05rem;border-bottom:1px solid var(--cl-border)}
.c-sidebar__nav{flex:1;padding:12px;display:flex;flex-direction:column;gap:2px}
.c-sidebar__group{padding:12px 10px 6px;font-size:calc(var(--cl-font-sm)*.85);font-weight:700;text-transform:uppercase;letter-spacing:.05em;color:var(--cl-text-muted)}
.c-sidebar__item{display:flex;align-items:center;gap:10px;padding:10px 12px;border-radius:calc(var(--cl-radius)*.7);font-size:var(--cl-font-sm);font-weight:600;color:var(--cl-text-muted);text-decoration:none;transition:background .15s,color .15s}
.c-sidebar__item:hover{background:var(--cl-surface-muted);color:var(--cl-text)}
.c-sidebar__item.is-active{background:color-mix(in srgb,var(--cl-primary) 12%,transparent);color:var(--cl-primary-hover)}
.c-sidebar__icon{width:18px;text-align:center;font-size:.75rem;opacity:.7}
.c-sidebar__foot{display:flex;align-items:center;gap:12px;padding:16px 20px;border-top:1px solid var(--cl-border)}`,
  }),

  def({
    slug: "nav-breadcrumb",
    name: "Breadcrumb",
    layer: "patterns",
    category: "navigation",
    problemTags: ["build-navigation", "build-dashboard"],
    description: "Hierarchical breadcrumb trail for nested page navigation.",
    html: wrapRoot(`
<nav class="c-breadcrumb" aria-label="Breadcrumb">
  <ol class="c-breadcrumb__list">
    <li><a href="#">Home</a></li>
    <li><a href="#">Patterns</a></li>
    <li><a href="#">Forms</a></li>
    <li aria-current="page">Multi-Step Form</li>
  </ol>
</nav>`),
    css: `
.c-breadcrumb{padding:12px 16px;background:var(--cl-surface);border:1px solid var(--cl-border);border-radius:var(--cl-radius)}
.c-breadcrumb__list{display:flex;flex-wrap:wrap;align-items:center;gap:6px;margin:0;padding:0;list-style:none;font-size:var(--cl-font-sm)}
.c-breadcrumb__list li{display:flex;align-items:center;gap:6px;color:var(--cl-text-muted)}
.c-breadcrumb__list li:not(:last-child)::after{content:"/";opacity:.45}
.c-breadcrumb__list a{color:var(--cl-primary);text-decoration:none;font-weight:600}
.c-breadcrumb__list a:hover{text-decoration:underline}
.c-breadcrumb__list li[aria-current="page"]{color:var(--cl-text);font-weight:600}`,
  }),

  def({
    slug: "nav-tabs",
    name: "Tabs",
    layer: "patterns",
    category: "navigation",
    problemTags: ["build-navigation", "build-dashboard"],
    description: "Horizontal tab bar with panel switching for settings and detail views.",
    html: wrapRoot(`
<div class="c-tabs" data-tabs>
  <div class="c-tabs__list" role="tablist">
    <button type="button" class="c-tabs__tab is-active" role="tab" data-tab="0" aria-selected="true">Overview</button>
    <button type="button" class="c-tabs__tab" role="tab" data-tab="1" aria-selected="false">Analytics</button>
    <button type="button" class="c-tabs__tab" role="tab" data-tab="2" aria-selected="false">Settings</button>
  </div>
  <div class="c-tabs__panel is-active" data-panel="0" role="tabpanel">
    <h3 class="c-tabs__title">Workspace overview</h3>
    <p class="cl-muted">12 active patterns, 4 team members, last sync 2 hours ago.</p>
  </div>
  <div class="c-tabs__panel" data-panel="1" role="tabpanel" hidden>
    <h3 class="c-tabs__title">Usage analytics</h3>
    <p class="cl-muted">847 component exports this month, up 23% from last period.</p>
  </div>
  <div class="c-tabs__panel" data-panel="2" role="tabpanel" hidden>
    <h3 class="c-tabs__title">Workspace settings</h3>
    <p class="cl-muted">Manage tokens, integrations, and access controls.</p>
  </div>
</div>`),
    css: `
.c-tabs{max-width:520px;background:var(--cl-surface);border:1px solid var(--cl-border);border-radius:var(--cl-radius);overflow:hidden}
.c-tabs__list{display:flex;border-bottom:1px solid var(--cl-border);background:var(--cl-surface-muted)}
.c-tabs__tab{flex:1;padding:12px 16px;border:none;background:transparent;font:inherit;font-size:var(--cl-font-sm);font-weight:600;color:var(--cl-text-muted);cursor:pointer;border-bottom:2px solid transparent;margin-bottom:-1px;transition:color .15s,border-color .15s}
.c-tabs__tab:hover{color:var(--cl-text)}
.c-tabs__tab.is-active{color:var(--cl-primary);border-bottom-color:var(--cl-primary);background:var(--cl-surface)}
.c-tabs__panel{padding:20px;display:flex;flex-direction:column;gap:8px}
.c-tabs__panel[hidden]{display:none!important}
.c-tabs__title{margin:0;font-size:1rem;font-weight:700}`,
    js: `
(function(){
  var root=document.querySelector('[data-tabs]');
  if(!root)return;
  var tabs=root.querySelectorAll('[data-tab]');
  var panels=root.querySelectorAll('[data-panel]');
  tabs.forEach(function(tab){
    tab.addEventListener('click',function(){
      var id=tab.getAttribute('data-tab');
      tabs.forEach(function(t){t.classList.remove('is-active');t.setAttribute('aria-selected','false');});
      panels.forEach(function(p){p.hidden=p.getAttribute('data-panel')!==id;p.classList.toggle('is-active',p.getAttribute('data-panel')===id);});
      tab.classList.add('is-active');
      tab.setAttribute('aria-selected','true');
    });
  });
})();`,
  }),

  def({
    slug: "nav-pagination",
    name: "Pagination",
    layer: "patterns",
    category: "navigation",
    problemTags: ["build-navigation", "build-dashboard"],
    description: "Page number pagination with previous/next controls and result count.",
    html: wrapRoot(`
<nav class="c-pagination" aria-label="Pagination">
  <span class="c-pagination__info cl-muted">Showing 21&ndash;30 of 142 results</span>
  <div class="c-pagination__controls">
    <button type="button" class="c-pagination__btn" aria-label="Previous page">&larr;</button>
    <button type="button" class="c-pagination__btn">1</button>
    <button type="button" class="c-pagination__btn">2</button>
    <button type="button" class="c-pagination__btn is-active" aria-current="page">3</button>
    <button type="button" class="c-pagination__btn">4</button>
    <span class="c-pagination__ellipsis">&hellip;</span>
    <button type="button" class="c-pagination__btn">15</button>
    <button type="button" class="c-pagination__btn" aria-label="Next page">&rarr;</button>
  </div>
</nav>`),
    css: `
.c-pagination{display:flex;flex-wrap:wrap;align-items:center;justify-content:space-between;gap:12px;padding:14px 18px;background:var(--cl-surface);border:1px solid var(--cl-border);border-radius:var(--cl-radius)}
.c-pagination__info{font-size:var(--cl-font-sm)}
.c-pagination__controls{display:flex;align-items:center;gap:4px}
.c-pagination__btn{min-width:36px;height:36px;padding:0 10px;border:1px solid var(--cl-border);border-radius:calc(var(--cl-radius)*.7);background:var(--cl-surface);font:inherit;font-size:var(--cl-font-sm);font-weight:600;color:var(--cl-text-muted);cursor:pointer;transition:background .15s,border-color .15s,color .15s}
.c-pagination__btn:hover{background:var(--cl-surface-muted);color:var(--cl-text)}
.c-pagination__btn.is-active{background:var(--cl-primary);border-color:var(--cl-primary);color:#fff}
.c-pagination__ellipsis{padding:0 6px;color:var(--cl-text-muted)}`,
  }),

  def({
    slug: "nav-stepper",
    name: "Stepper",
    layer: "patterns",
    category: "navigation",
    problemTags: ["build-navigation", "build-form"],
    description: "Visual progress stepper for multi-step flows with clickable completed steps.",
    html: wrapRoot(`
<nav class="c-stepper" data-stepper aria-label="Progress">
  <button type="button" class="c-stepper__step is-complete" data-step="0">
    <span class="c-stepper__num">&#10003;</span>
    <span class="c-stepper__label">Account</span>
  </button>
  <span class="c-stepper__line is-complete"></span>
  <button type="button" class="c-stepper__step is-active" data-step="1">
    <span class="c-stepper__num">2</span>
    <span class="c-stepper__label">Workspace</span>
  </button>
  <span class="c-stepper__line"></span>
  <button type="button" class="c-stepper__step" data-step="2">
    <span class="c-stepper__num">3</span>
    <span class="c-stepper__label">Billing</span>
  </button>
  <span class="c-stepper__line"></span>
  <button type="button" class="c-stepper__step" data-step="3">
    <span class="c-stepper__num">4</span>
    <span class="c-stepper__label">Confirm</span>
  </button>
</nav>`),
    css: `
.c-stepper{display:flex;align-items:center;gap:0;max-width:560px;padding:20px;background:var(--cl-surface);border:1px solid var(--cl-border);border-radius:var(--cl-radius)}
.c-stepper__step{display:flex;flex-direction:column;align-items:center;gap:6px;border:none;background:none;cursor:pointer;padding:0;min-width:72px}
.c-stepper__num{width:32px;height:32px;border-radius:999px;display:grid;place-items:center;font-size:var(--cl-font-sm);font-weight:700;border:2px solid var(--cl-border);color:var(--cl-text-muted);background:var(--cl-surface);transition:background .2s,border-color .2s,color .2s}
.c-stepper__label{font-size:calc(var(--cl-font-sm)*.88);font-weight:600;color:var(--cl-text-muted)}
.c-stepper__step.is-active .c-stepper__num{border-color:var(--cl-primary);background:var(--cl-primary);color:#fff}
.c-stepper__step.is-active .c-stepper__label{color:var(--cl-primary-hover)}
.c-stepper__step.is-complete .c-stepper__num{border-color:var(--cl-primary);background:color-mix(in srgb,var(--cl-primary) 12%,transparent);color:var(--cl-primary)}
.c-stepper__line{flex:1;height:2px;background:var(--cl-border);min-width:24px;margin-bottom:22px}
.c-stepper__line.is-complete{background:var(--cl-primary)}`,
    js: `
(function(){
  var root=document.querySelector('[data-stepper]');
  if(!root)return;
  var steps=root.querySelectorAll('[data-step]');
  var lines=root.querySelectorAll('.c-stepper__line');
  steps.forEach(function(step,i){
    step.addEventListener('click',function(){
      steps.forEach(function(s,j){
        s.classList.remove('is-active');
        if(j<i){s.classList.add('is-complete');s.querySelector('.c-stepper__num').textContent='\\u2713';}
        else{s.classList.remove('is-complete');s.querySelector('.c-stepper__num').textContent=String(j+1);}
      });
      lines.forEach(function(l,j){l.classList.toggle('is-complete',j<i);});
      step.classList.add('is-active');
      step.classList.remove('is-complete');
      step.querySelector('.c-stepper__num').textContent=String(i+1);
    });
  });
})();`,
  }),

  def({
    slug: "nav-mega-menu",
    name: "Mega Menu",
    layer: "patterns",
    category: "navigation",
    problemTags: ["build-navigation", "build-landing-page"],
    description: "Expanded dropdown mega menu with categorized links and featured content.",
    html: wrapRoot(`
<div class="c-mega">
  <nav class="c-mega__bar">
    <a href="#" class="c-mega__brand">CompLib</a>
    <div class="c-mega__trigger-wrap">
      <button type="button" class="c-mega__trigger">Product &#9662;</button>
      <div class="c-mega__panel">
        <div class="c-mega__col">
          <span class="c-mega__heading">Platform</span>
          <a href="#">Pattern catalog</a>
          <a href="#">Design tokens</a>
          <a href="#">Figma plugin</a>
        </div>
        <div class="c-mega__col">
          <span class="c-mega__heading">Solutions</span>
          <a href="#">For startups</a>
          <a href="#">For enterprises</a>
          <a href="#">For agencies</a>
        </div>
        <div class="c-mega__featured">
          <span class="cl-kicker">New</span>
          <strong>AI pattern generator</strong>
          <p class="cl-muted">Describe your UI and get production-ready blocks instantly.</p>
          <a href="#" class="cl-link">Learn more &rarr;</a>
        </div>
      </div>
    </div>
    <a href="#" class="c-mega__link">Pricing</a>
    <a href="#" class="c-mega__link">Docs</a>
  </nav>
</div>`),
    css: `
.c-mega{background:var(--cl-surface);border:1px solid var(--cl-border);border-radius:var(--cl-radius);overflow:visible}
.c-mega__bar{display:flex;align-items:center;gap:20px;padding:14px 24px}
.c-mega__brand{font-weight:800;text-decoration:none;color:var(--cl-text)}
.c-mega__trigger-wrap{position:relative}
.c-mega__trigger{background:none;border:none;font:inherit;font-size:var(--cl-font-sm);font-weight:600;color:var(--cl-text);cursor:pointer;padding:8px 12px;border-radius:calc(var(--cl-radius)*.7)}
.c-mega__trigger:hover{background:var(--cl-surface-muted)}
.c-mega__link{font-size:var(--cl-font-sm);font-weight:600;color:var(--cl-text-muted);text-decoration:none;padding:8px 12px}
.c-mega__link:hover{color:var(--cl-text)}
.c-mega__panel{display:grid;grid-template-columns:1fr 1fr 1.2fr;gap:24px;padding:24px;border-top:1px solid var(--cl-border);background:var(--cl-surface-muted)}
.c-mega__col{display:flex;flex-direction:column;gap:8px}
.c-mega__heading{font-size:calc(var(--cl-font-sm)*.85);font-weight:700;text-transform:uppercase;letter-spacing:.04em;color:var(--cl-text-muted);margin-bottom:4px}
.c-mega__col a{font-size:var(--cl-font-sm);font-weight:600;color:var(--cl-text);text-decoration:none;padding:6px 0}
.c-mega__col a:hover{color:var(--cl-primary)}
.c-mega__featured{padding:16px;background:var(--cl-surface);border:1px solid var(--cl-border);border-radius:var(--cl-radius);display:flex;flex-direction:column;gap:6px;font-size:var(--cl-font-sm)}`,
  }),

  def({
    slug: "nav-command-palette",
    name: "Command Palette",
    layer: "patterns",
    category: "navigation",
    problemTags: ["build-navigation", "build-dashboard"],
    description: "Keyboard-driven command palette for quick actions and navigation.",
    html: wrapRoot(`
<div class="c-cmd" data-cmd>
  <button type="button" class="c-cmd__trigger" data-cmd-open>
    <span>Search commands...</span>
    <kbd>&#8984;K</kbd>
  </button>
  <div class="c-cmd__overlay" data-cmd-overlay hidden>
    <div class="c-cmd__modal" role="dialog" aria-label="Command palette">
      <input class="c-cmd__input" type="search" placeholder="Type a command or search..." aria-label="Command search" />
      <ul class="c-cmd__list">
        <li class="c-cmd__item is-highlight"><span>Go to Patterns</span><kbd>G P</kbd></li>
        <li class="c-cmd__item"><span>New component</span><kbd>N C</kbd></li>
        <li class="c-cmd__item"><span>Export tokens</span><kbd>E T</kbd></li>
        <li class="c-cmd__item"><span>Open settings</span><kbd>,</kbd></li>
      </ul>
    </div>
  </div>
</div>`),
    css: `
.c-cmd{max-width:400px}
.c-cmd__trigger{width:100%;display:flex;align-items:center;justify-content:space-between;padding:10px 14px;background:var(--cl-surface);border:1px solid var(--cl-border);border-radius:var(--cl-radius);font:inherit;font-size:var(--cl-font-sm);color:var(--cl-text-muted);cursor:pointer}
.c-cmd__trigger kbd{padding:3px 7px;border-radius:6px;font-size:calc(var(--cl-font-sm)*.85);background:var(--cl-surface-muted);border:1px solid var(--cl-border)}
.c-cmd__overlay{position:fixed;inset:0;background:rgba(15,23,42,.45);display:grid;place-items:start center;padding-top:15vh;z-index:100}
.c-cmd__overlay[hidden]{display:none!important}
.c-cmd__modal{width:min(480px,92vw);background:var(--cl-surface);border:1px solid var(--cl-border);border-radius:calc(var(--cl-radius)*1.1);box-shadow:0 24px 48px rgba(15,23,42,.18);overflow:hidden}
.c-cmd__input{width:100%;padding:16px 18px;border:none;border-bottom:1px solid var(--cl-border);font:inherit;font-size:var(--cl-font-sm);outline:none;background:var(--cl-surface);color:var(--cl-text)}
.c-cmd__list{margin:0;padding:8px;list-style:none}
.c-cmd__item{display:flex;align-items:center;justify-content:space-between;padding:10px 12px;border-radius:calc(var(--cl-radius)*.7);font-size:var(--cl-font-sm);cursor:pointer;color:var(--cl-text)}
.c-cmd__item.is-highlight,.c-cmd__item:hover{background:color-mix(in srgb,var(--cl-primary) 10%,transparent);color:var(--cl-primary-hover)}
.c-cmd__item kbd{font-size:calc(var(--cl-font-sm)*.85);color:var(--cl-text-muted);background:var(--cl-surface-muted);padding:2px 6px;border-radius:4px;border:1px solid var(--cl-border)}`,
    js: `
(function(){
  var openBtn=document.querySelector('[data-cmd-open]');
  var overlay=document.querySelector('[data-cmd-overlay]');
  if(!openBtn||!overlay)return;
  var input=overlay.querySelector('.c-cmd__input');
  function show(){overlay.hidden=false;if(input){input.focus();}}
  function hide(){overlay.hidden=true;}
  openBtn.addEventListener('click',show);
  overlay.addEventListener('click',function(e){if(e.target===overlay)hide();});
  document.addEventListener('keydown',function(e){
    if(e.key==='Escape'&&!overlay.hidden)hide();
    if((e.metaKey||e.ctrlKey)&&e.key==='k'){e.preventDefault();show();}
  });
})();`,
  }),

  def({
    slug: "nav-menu",
    name: "Dropdown Menu",
    layer: "patterns",
    category: "navigation",
    problemTags: ["build-navigation", "build-dashboard"],
    description: "Contextual dropdown menu with grouped actions and keyboard-friendly structure.",
    html: wrapRoot(`
<div class="c-menu">
  <button type="button" class="cl-btn cl-btn--secondary c-menu__trigger">Actions &#9662;</button>
  <div class="c-menu__dropdown" role="menu">
    <span class="c-menu__label">Pattern</span>
    <button type="button" class="c-menu__item" role="menuitem">Duplicate</button>
    <button type="button" class="c-menu__item" role="menuitem">Export HTML</button>
    <button type="button" class="c-menu__item" role="menuitem">Copy link</button>
    <div class="c-menu__sep"></div>
    <span class="c-menu__label">Danger zone</span>
    <button type="button" class="c-menu__item c-menu__item--danger" role="menuitem">Delete pattern</button>
  </div>
</div>`),
    css: `
.c-menu{position:relative;display:inline-block}
.c-menu__dropdown{position:absolute;top:calc(100% + 6px);left:0;min-width:200px;padding:6px;background:var(--cl-surface);border:1px solid var(--cl-border);border-radius:var(--cl-radius);box-shadow:0 12px 32px rgba(15,23,42,.12);z-index:10}
.c-menu__label{display:block;padding:8px 12px 4px;font-size:calc(var(--cl-font-sm)*.82);font-weight:700;text-transform:uppercase;letter-spacing:.04em;color:var(--cl-text-muted)}
.c-menu__item{display:block;width:100%;padding:8px 12px;border:none;background:none;text-align:left;font:inherit;font-size:var(--cl-font-sm);font-weight:500;color:var(--cl-text);cursor:pointer;border-radius:calc(var(--cl-radius)*.6);transition:background .12s}
.c-menu__item:hover{background:var(--cl-surface-muted)}
.c-menu__item--danger{color:#dc2626}
.c-menu__item--danger:hover{background:color-mix(in srgb,#dc2626 8%,transparent)}
.c-menu__sep{height:1px;background:var(--cl-border);margin:6px 0}`,
  }),

  def({
    slug: "nav-bottom",
    name: "Bottom Navigation",
    layer: "patterns",
    category: "navigation",
    problemTags: ["build-navigation", "build-dashboard"],
    description: "Mobile-first bottom tab bar for app-level primary navigation.",
    html: wrapRoot(`
<nav class="c-bottom" aria-label="Main navigation">
  <a href="#" class="c-bottom__item is-active">
    <span class="c-bottom__icon" aria-hidden="true">&#9632;</span>
    <span class="c-bottom__label">Home</span>
  </a>
  <a href="#" class="c-bottom__item">
    <span class="c-bottom__icon" aria-hidden="true">&#9670;</span>
    <span class="c-bottom__label">Browse</span>
  </a>
  <a href="#" class="c-bottom__item">
    <span class="c-bottom__icon" aria-hidden="true">&#43;</span>
    <span class="c-bottom__label">Create</span>
  </a>
  <a href="#" class="c-bottom__item">
    <span class="c-bottom__icon" aria-hidden="true">&#128276;</span>
    <span class="c-bottom__label">Alerts</span>
  </a>
  <a href="#" class="c-bottom__item">
    <span class="c-bottom__icon" aria-hidden="true">&#9786;</span>
    <span class="c-bottom__label">Profile</span>
  </a>
</nav>`),
    css: `
.c-bottom{display:flex;max-width:420px;background:var(--cl-surface);border:1px solid var(--cl-border);border-radius:var(--cl-radius);overflow:hidden}
.c-bottom__item{flex:1;display:flex;flex-direction:column;align-items:center;gap:4px;padding:10px 6px;text-decoration:none;color:var(--cl-text-muted);font-size:calc(var(--cl-font-sm)*.82);font-weight:600;transition:color .15s,background .15s}
.c-bottom__item:hover{background:var(--cl-surface-muted);color:var(--cl-text)}
.c-bottom__item.is-active{color:var(--cl-primary)}
.c-bottom__icon{font-size:1.1rem;line-height:1}
.c-bottom__label{line-height:1}`,
  }),
];
