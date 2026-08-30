import { def, wrapRoot, type CatalogComponentDef } from "@/lib/catalog/shared";

export const DATA: CatalogComponentDef[] = [
  def({
    slug: "data-accordion",
    name: "Accordion",
    layer: "patterns",
    category: "data",
    problemTags: ["build-ui-sections", "build-landing-page"],
    description: "Collapsible FAQ accordion with expand/collapse interaction.",
    html: wrapRoot(`
<div class="c-accordion" data-accordion>
  <details class="c-accordion__item" open>
    <summary class="c-accordion__head">What is included in the Pro plan?</summary>
    <div class="c-accordion__body cl-muted">Unlimited pattern exports, Figma sync, custom brand tokens, team analytics, and priority support for your entire workspace.</div>
  </details>
  <details class="c-accordion__item">
    <summary class="c-accordion__head">Can I use CompLib in commercial projects?</summary>
    <div class="c-accordion__body cl-muted">Yes. All exported components are yours to use in client and production work under our standard license.</div>
  </details>
  <details class="c-accordion__item">
    <summary class="c-accordion__head">How does token sync work?</summary>
    <div class="c-accordion__body cl-muted">Push design tokens from Figma or JSON files. Changes propagate to every connected repo within seconds via webhooks.</div>
  </details>
</div>`),
    css: `
.c-accordion{max-width:560px;display:flex;flex-direction:column;gap:8px}
.c-accordion__item{background:var(--cl-surface);border:1px solid var(--cl-border);border-radius:var(--cl-radius);overflow:hidden}
.c-accordion__head{padding:16px 18px;font-weight:700;font-size:var(--cl-font-sm);cursor:pointer;list-style:none;display:flex;align-items:center;justify-content:space-between}
.c-accordion__head::-webkit-details-marker{display:none}
.c-accordion__head::after{content:"+";font-size:1.1rem;color:var(--cl-text-muted);transition:transform .2s}
.c-accordion__item[open] .c-accordion__head::after{transform:rotate(45deg);color:var(--cl-primary)}
.c-accordion__item[open] .c-accordion__head{color:var(--cl-primary)}
.c-accordion__body{padding:0 18px 16px;font-size:var(--cl-font-sm);line-height:1.6}`,
    js: `
(function(){
  var root=document.querySelector('[data-accordion]');
  if(!root)return;
  root.querySelectorAll('.c-accordion__item').forEach(function(item){
    item.addEventListener('toggle',function(){
      if(!item.open)return;
      root.querySelectorAll('.c-accordion__item').forEach(function(other){
        if(other!==item)other.open=false;
      });
    });
  });
})();`,
  }),

  def({
    slug: "data-table",
    name: "Data Table",
    layer: "patterns",
    category: "data",
    problemTags: ["build-dashboard", "build-ui-sections"],
    description: "Sortable-style data table with status badges and realistic row data.",
    html: wrapRoot(`
<div class="c-table-wrap">
  <table class="cl-table c-table">
    <thead>
      <tr>
        <th>Customer</th>
        <th>Plan</th>
        <th>MRR</th>
        <th>Status</th>
      </tr>
    </thead>
    <tbody>
      <tr>
        <td><strong>Northwind Analytics</strong><br><span class="cl-muted">northwind.io</span></td>
        <td>Enterprise</td>
        <td>$2,400</td>
        <td><span class="cl-badge">Active</span></td>
      </tr>
      <tr>
        <td><strong>Lumina Health</strong><br><span class="cl-muted">lumina.health</span></td>
        <td>Growth</td>
        <td>$490</td>
        <td><span class="cl-badge">Active</span></td>
      </tr>
      <tr>
        <td><strong>Pixel Forge Studio</strong><br><span class="cl-muted">pixelforge.design</span></td>
        <td>Starter</td>
        <td>$29</td>
        <td><span class="cl-badge" style="background:color-mix(in srgb,#ca8a04 12%,#fff);color:#a16207">Trial</span></td>
      </tr>
      <tr>
        <td><strong>Contoso Retail</strong><br><span class="cl-muted">contoso.com</span></td>
        <td>Growth</td>
        <td>$0</td>
        <td><span class="cl-badge" style="background:color-mix(in srgb,#64748b 12%,#fff);color:#475569">Churned</span></td>
      </tr>
    </tbody>
  </table>
</div>`),
    css: `
.c-table-wrap{overflow-x:auto;background:var(--cl-surface);border:1px solid var(--cl-border);border-radius:var(--cl-radius)}
.c-table tbody tr{transition:background .12s}
.c-table tbody tr:hover{background:var(--cl-surface-muted)}
.c-table td strong{font-weight:600}
.c-table td .cl-muted{font-size:calc(var(--cl-font-sm)*.92)}`,
  }),

  def({
    slug: "data-list",
    name: "Data List",
    layer: "patterns",
    category: "data",
    problemTags: ["build-dashboard", "build-ui-sections"],
    description: "Structured list with avatars, metadata, and row actions.",
    html: wrapRoot(`
<ul class="c-list">
  <li class="c-list__item">
    <div class="cl-avatar">MR</div>
    <div class="c-list__main">
      <strong>Pattern export completed</strong>
      <span class="cl-muted">card-pricing exported to main branch</span>
    </div>
    <time class="c-list__time cl-muted">2m ago</time>
    <button type="button" class="cl-btn cl-btn--ghost">View</button>
  </li>
  <li class="c-list__item">
    <div class="cl-avatar">JK</div>
    <div class="c-list__main">
      <strong>James invited you to Lumina workspace</strong>
      <span class="cl-muted">Accept to collaborate on 24 patterns</span>
    </div>
    <time class="c-list__time cl-muted">1h ago</time>
    <button type="button" class="cl-btn cl-btn--primary">Accept</button>
  </li>
  <li class="c-list__item">
    <div class="cl-avatar">SL</div>
    <div class="c-list__main">
      <strong>Token sync succeeded</strong>
      <span class="cl-muted">142 tokens updated from Figma</span>
    </div>
    <time class="c-list__time cl-muted">3h ago</time>
    <button type="button" class="cl-btn cl-btn--ghost">Details</button>
  </li>
</ul>`),
    css: `
.c-list{margin:0;padding:0;list-style:none;max-width:620px;background:var(--cl-surface);border:1px solid var(--cl-border);border-radius:var(--cl-radius);overflow:hidden}
.c-list__item{display:flex;align-items:center;gap:14px;padding:14px 18px;border-bottom:1px solid var(--cl-border);transition:background .12s}
.c-list__item:last-child{border-bottom:none}
.c-list__item:hover{background:var(--cl-surface-muted)}
.c-list__main{flex:1;display:flex;flex-direction:column;gap:2px;font-size:var(--cl-font-sm)}
.c-list__main strong{font-weight:600}
.c-list__time{font-size:calc(var(--cl-font-sm)*.92);white-space:nowrap}`,
  }),

  def({
    slug: "data-timeline",
    name: "Timeline",
    layer: "patterns",
    category: "data",
    problemTags: ["build-dashboard", "build-ui-sections"],
    description: "Vertical activity timeline with timestamps and status markers.",
    html: wrapRoot(`
<ol class="c-timeline">
  <li class="c-timeline__item">
    <span class="c-timeline__dot c-timeline__dot--active"></span>
    <div class="c-timeline__content">
      <time class="cl-muted">Today, 2:14 PM</time>
      <strong>Deployed v2.4.0 to production</strong>
      <p class="cl-muted">50 new patterns, token refresh, and glass style variant.</p>
    </div>
  </li>
  <li class="c-timeline__item">
    <span class="c-timeline__dot"></span>
    <div class="c-timeline__content">
      <time class="cl-muted">Mar 12, 10:30 AM</time>
      <strong>Enterprise contract signed</strong>
      <p class="cl-muted">Northwind Analytics upgraded to 50 seats.</p>
    </div>
  </li>
  <li class="c-timeline__item">
    <span class="c-timeline__dot"></span>
    <div class="c-timeline__content">
      <time class="cl-muted">Mar 8, 4:45 PM</time>
      <strong>Figma plugin published</strong>
      <p class="cl-muted">Available on Community with 1,200 installs in week one.</p>
    </div>
  </li>
</ol>`),
    css: `
.c-timeline{margin:0;padding:0 0 0 8px;list-style:none;max-width:480px;display:flex;flex-direction:column;gap:0;position:relative}
.c-timeline::before{content:"";position:absolute;left:15px;top:8px;bottom:8px;width:2px;background:var(--cl-border)}
.c-timeline__item{display:flex;gap:16px;padding:0 0 24px;position:relative}
.c-timeline__dot{width:12px;height:12px;border-radius:999px;background:var(--cl-surface);border:2px solid var(--cl-border);flex-shrink:0;margin-top:4px;z-index:1}
.c-timeline__dot--active{border-color:var(--cl-primary);background:var(--cl-primary)}
.c-timeline__content{display:flex;flex-direction:column;gap:4px;font-size:var(--cl-font-sm)}
.c-timeline__content strong{font-weight:600}
.c-timeline__content p{margin:0;line-height:1.5}
.c-timeline__content time{font-size:calc(var(--cl-font-sm)*.92)}`,
  }),

  def({
    slug: "data-tree",
    name: "Tree View",
    layer: "patterns",
    category: "data",
    problemTags: ["build-dashboard", "build-navigation"],
    description: "Hierarchical tree for file explorers and nested category navigation.",
    html: wrapRoot(`
<ul class="c-tree" role="tree">
  <li class="c-tree__item is-open" role="treeitem" aria-expanded="true">
    <button type="button" class="c-tree__toggle">&#9662;</button>
    <span class="c-tree__label">Patterns</span>
    <ul class="c-tree__children" role="group">
      <li class="c-tree__item" role="treeitem"><span class="c-tree__spacer"></span><span class="c-tree__label is-active">Cards</span></li>
      <li class="c-tree__item" role="treeitem"><span class="c-tree__spacer"></span><span class="c-tree__label">Forms</span></li>
      <li class="c-tree__item is-open" role="treeitem" aria-expanded="true">
        <button type="button" class="c-tree__toggle">&#9662;</button>
        <span class="c-tree__label">Navigation</span>
        <ul class="c-tree__children" role="group">
          <li class="c-tree__item" role="treeitem"><span class="c-tree__spacer"></span><span class="c-tree__label">Navbar</span></li>
          <li class="c-tree__item" role="treeitem"><span class="c-tree__spacer"></span><span class="c-tree__label">Sidebar</span></li>
        </ul>
      </li>
    </ul>
  </li>
  <li class="c-tree__item" role="treeitem">
    <button type="button" class="c-tree__toggle">&#9656;</button>
    <span class="c-tree__label">Templates</span>
  </li>
</ul>`),
    css: `
.c-tree{margin:0;padding:12px;list-style:none;max-width:280px;background:var(--cl-surface);border:1px solid var(--cl-border);border-radius:var(--cl-radius);font-size:var(--cl-font-sm)}
.c-tree__item{display:flex;flex-wrap:wrap;align-items:center;gap:4px;padding:4px 0}
.c-tree__toggle{width:20px;height:20px;border:none;background:none;cursor:pointer;font-size:.7rem;color:var(--cl-text-muted);padding:0;display:grid;place-items:center}
.c-tree__spacer{width:20px;flex-shrink:0}
.c-tree__label{padding:4px 8px;border-radius:calc(var(--cl-radius)*.6);cursor:pointer;font-weight:500;color:var(--cl-text)}
.c-tree__label:hover{background:var(--cl-surface-muted)}
.c-tree__label.is-active{background:color-mix(in srgb,var(--cl-primary) 12%,transparent);color:var(--cl-primary-hover);font-weight:600}
.c-tree__children{width:100%;margin:0 0 0 20px;padding:0;list-style:none}
.c-tree__item:not(.is-open)>.c-tree__children{display:none}`,
  }),

  def({
    slug: "data-kanban",
    name: "Kanban Board",
    layer: "patterns",
    category: "data",
    problemTags: ["build-dashboard", "build-ui-sections"],
    description: "Three-column kanban board with draggable-style task cards.",
    html: wrapRoot(`
<div class="c-kanban">
  <div class="c-kanban__col">
    <header class="c-kanban__head"><span>To do</span><span class="c-kanban__count">2</span></header>
    <article class="c-kanban__card">
      <span class="cl-badge">Design</span>
      <strong>Refresh pricing cards</strong>
      <p class="cl-muted">Update copy and feature list for Q2 launch.</p>
    </article>
    <article class="c-kanban__card">
      <span class="cl-badge">Engineering</span>
      <strong>Token migration script</strong>
      <p class="cl-muted">Move legacy CSS vars to scalable tokens.</p>
    </article>
  </div>
  <div class="c-kanban__col">
    <header class="c-kanban__head"><span>In progress</span><span class="c-kanban__count">1</span></header>
    <article class="c-kanban__card">
      <span class="cl-badge">Content</span>
      <strong>Pattern catalog copy pass</strong>
      <p class="cl-muted">Review all 50 pattern descriptions for consistency.</p>
    </article>
  </div>
  <div class="c-kanban__col">
    <header class="c-kanban__head"><span>Done</span><span class="c-kanban__count">2</span></header>
    <article class="c-kanban__card">
      <span class="cl-badge">Shipped</span>
      <strong>Command palette pattern</strong>
      <p class="cl-muted">Merged and published to catalog.</p>
    </article>
    <article class="c-kanban__card">
      <span class="cl-badge">Shipped</span>
      <strong>Sidebar navigation</strong>
      <p class="cl-muted">Active state and mobile collapse added.</p>
    </article>
  </div>
</div>`),
    css: `
.c-kanban{display:grid;grid-template-columns:repeat(3,1fr);gap:14px;max-width:780px;padding:16px;background:var(--cl-surface-muted);border:1px solid var(--cl-border);border-radius:var(--cl-radius)}
.c-kanban__col{display:flex;flex-direction:column;gap:10px;min-width:0}
.c-kanban__head{display:flex;align-items:center;justify-content:space-between;padding:8px 10px;font-size:var(--cl-font-sm);font-weight:700;color:var(--cl-text-muted)}
.c-kanban__count{padding:2px 8px;border-radius:999px;background:var(--cl-surface);border:1px solid var(--cl-border);font-size:calc(var(--cl-font-sm)*.88)}
.c-kanban__card{padding:14px;background:var(--cl-surface);border:1px solid var(--cl-border);border-radius:calc(var(--cl-radius)*.85);display:flex;flex-direction:column;gap:6px;font-size:var(--cl-font-sm);cursor:grab;transition:box-shadow .15s,transform .15s}
.c-kanban__card:hover{box-shadow:0 4px 12px color-mix(in srgb,var(--cl-primary) 8%,transparent);transform:translateY(-1px)}
.c-kanban__card strong{font-weight:600}
.c-kanban__card p{margin:0;line-height:1.45;font-size:calc(var(--cl-font-sm)*.92)}
@media(max-width:640px){.c-kanban{grid-template-columns:1fr}}`,
  }),

  def({
    slug: "data-grid",
    name: "Data Grid",
    layer: "patterns",
    category: "data",
    problemTags: ["build-dashboard", "build-ui-sections"],
    description: "Responsive card grid for browsing catalog items or assets.",
    html: wrapRoot(`
<div class="c-grid">
  <article class="c-grid__item">
    <div class="c-grid__thumb"></div>
    <h4>Hero Section</h4>
    <p class="cl-muted">Landing page</p>
  </article>
  <article class="c-grid__item">
    <div class="c-grid__thumb"></div>
    <h4>Pricing Table</h4>
    <p class="cl-muted">Conversion</p>
  </article>
  <article class="c-grid__item">
    <div class="c-grid__thumb"></div>
    <h4>Dashboard Shell</h4>
    <p class="cl-muted">Template</p>
  </article>
  <article class="c-grid__item">
    <div class="c-grid__thumb"></div>
    <h4>Auth Flow</h4>
    <p class="cl-muted">Authentication</p>
  </article>
  <article class="c-grid__item">
    <div class="c-grid__thumb"></div>
    <h4>Feature Grid</h4>
    <p class="cl-muted">Marketing</p>
  </article>
  <article class="c-grid__item">
    <div class="c-grid__thumb"></div>
    <h4>Settings Panel</h4>
    <p class="cl-muted">Dashboard</p>
  </article>
</div>`),
    css: `
.c-grid{display:grid;grid-template-columns:repeat(auto-fill,minmax(160px,1fr));gap:14px;max-width:640px}
.c-grid__item{padding:12px;background:var(--cl-surface);border:1px solid var(--cl-border);border-radius:var(--cl-radius);cursor:pointer;transition:border-color .15s,box-shadow .15s}
.c-grid__item:hover{border-color:color-mix(in srgb,var(--cl-primary) 35%,var(--cl-border));box-shadow:0 4px 16px color-mix(in srgb,var(--cl-primary) 8%,transparent)}
.c-grid__thumb{height:80px;border-radius:calc(var(--cl-radius)*.7);background:linear-gradient(135deg,color-mix(in srgb,var(--cl-primary) 15%,#fff),var(--cl-surface-muted));margin-bottom:10px}
.c-grid__item h4{margin:0 0 4px;font-size:var(--cl-font-sm);font-weight:700}
.c-grid__item p{margin:0;font-size:calc(var(--cl-font-sm)*.92)}`,
  }),

  def({
    slug: "data-filter-bar",
    name: "Filter Bar",
    layer: "patterns",
    category: "data",
    problemTags: ["build-dashboard", "build-ui-sections"],
    description: "Inline chip-based filter bar with active selections and clear action.",
    html: wrapRoot(`
<div class="c-filter-bar">
  <div class="c-filter-bar__chips">
    <button type="button" class="c-filter-bar__chip is-active">All patterns</button>
    <button type="button" class="c-filter-bar__chip">Cards</button>
    <button type="button" class="c-filter-bar__chip">Forms</button>
    <button type="button" class="c-filter-bar__chip">Navigation</button>
    <button type="button" class="c-filter-bar__chip">Free tier</button>
  </div>
  <div class="c-filter-bar__meta">
    <span class="cl-muted">48 results</span>
    <button type="button" class="cl-link">Clear filters</button>
  </div>
</div>`),
    css: `
.c-filter-bar{display:flex;flex-wrap:wrap;align-items:center;justify-content:space-between;gap:12px;padding:12px 16px;background:var(--cl-surface);border:1px solid var(--cl-border);border-radius:var(--cl-radius)}
.c-filter-bar__chips{display:flex;flex-wrap:wrap;gap:8px}
.c-filter-bar__chip{padding:6px 14px;border:1px solid var(--cl-border);border-radius:999px;background:var(--cl-surface);font:inherit;font-size:var(--cl-font-sm);font-weight:600;color:var(--cl-text-muted);cursor:pointer;transition:background .15s,border-color .15s,color .15s}
.c-filter-bar__chip:hover{background:var(--cl-surface-muted);color:var(--cl-text)}
.c-filter-bar__chip.is-active{background:color-mix(in srgb,var(--cl-primary) 12%,transparent);border-color:var(--cl-primary);color:var(--cl-primary-hover)}
.c-filter-bar__meta{display:flex;align-items:center;gap:12px;font-size:var(--cl-font-sm)}`,
  }),

  def({
    slug: "data-sort-bar",
    name: "Sort Bar",
    layer: "patterns",
    category: "data",
    problemTags: ["build-dashboard", "build-ui-sections"],
    description: "Sort and view controls for list and grid data displays.",
    html: wrapRoot(`
<div class="c-sort-bar">
  <span class="c-sort-bar__label cl-muted">Sort by</span>
  <select class="cl-select c-sort-bar__select">
    <option>Recently updated</option>
    <option>Name A&ndash;Z</option>
    <option>Most popular</option>
    <option>Newest first</option>
  </select>
  <div class="c-sort-bar__views">
    <button type="button" class="c-sort-bar__view is-active" aria-label="Grid view">&#9638;</button>
    <button type="button" class="c-sort-bar__view" aria-label="List view">&#9776;</button>
  </div>
  <span class="c-sort-bar__count cl-muted">Showing 1&ndash;12 of 48</span>
</div>`),
    css: `
.c-sort-bar{display:flex;flex-wrap:wrap;align-items:center;gap:12px;padding:12px 16px;background:var(--cl-surface);border:1px solid var(--cl-border);border-radius:var(--cl-radius);font-size:var(--cl-font-sm)}
.c-sort-bar__label{font-weight:600}
.c-sort-bar__select{max-width:180px}
.c-sort-bar__views{display:flex;gap:4px;margin-left:auto}
.c-sort-bar__view{width:36px;height:36px;border:1px solid var(--cl-border);border-radius:calc(var(--cl-radius)*.7);background:var(--cl-surface);cursor:pointer;font-size:1rem;color:var(--cl-text-muted);display:grid;place-items:center;transition:background .15s,border-color .15s,color .15s}
.c-sort-bar__view.is-active,.c-sort-bar__view:hover{background:color-mix(in srgb,var(--cl-primary) 10%,transparent);border-color:var(--cl-primary);color:var(--cl-primary)}
.c-sort-bar__count{margin-left:8px}`,
  }),

  def({
    slug: "data-toolbar",
    name: "Toolbar",
    layer: "patterns",
    category: "data",
    problemTags: ["build-dashboard", "build-ui-sections"],
    description: "Action toolbar with bulk selection, search, and primary operations.",
    html: wrapRoot(`
<div class="c-toolbar">
  <label class="c-toolbar__check"><input type="checkbox" /> <span class="cl-muted">3 selected</span></label>
  <div class="c-toolbar__search">
    <input class="cl-input" type="search" placeholder="Filter selected..." aria-label="Filter" />
  </div>
  <div class="c-toolbar__actions">
    <button type="button" class="cl-btn cl-btn--secondary">Export</button>
    <button type="button" class="cl-btn cl-btn--secondary">Move to</button>
    <button type="button" class="cl-btn cl-btn--primary">Publish</button>
  </div>
  <button type="button" class="cl-btn cl-btn--ghost c-toolbar__more" aria-label="More actions">&#8943;</button>
</div>`),
    css: `
.c-toolbar{display:flex;flex-wrap:wrap;align-items:center;gap:12px;padding:12px 16px;background:var(--cl-surface);border:1px solid var(--cl-border);border-radius:var(--cl-radius)}
.c-toolbar__check{display:flex;align-items:center;gap:8px;font-size:var(--cl-font-sm);cursor:pointer;white-space:nowrap}
.c-toolbar__search{flex:1;min-width:160px;max-width:280px}
.c-toolbar__actions{display:flex;flex-wrap:wrap;gap:8px;margin-left:auto}
.c-toolbar__more{padding:10px 12px;min-width:auto}`,
  }),
];
