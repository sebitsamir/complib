import { def, wrapRoot, type CatalogComponentDef } from "@/lib/catalog/shared";

const DASH_CSS = `
.t-dash{display:grid;grid-template-columns:200px 1fr;min-height:460px}
.t-dash__side{padding:20px 14px;background:var(--cl-surface);border-right:1px solid var(--cl-border);display:flex;flex-direction:column;gap:6px}
.t-dash__side-brand{font-weight:800;font-size:var(--cl-font-sm);margin-bottom:16px;padding:0 8px}
.t-dash__nav{display:flex;flex-direction:column;gap:2px}
.t-dash__nav a{display:block;padding:8px 10px;border-radius:calc(var(--cl-radius)*.7);font-size:var(--cl-font-sm);color:var(--cl-text-muted);text-decoration:none}
.t-dash__nav a:hover,.t-dash__nav a.is-active{background:var(--cl-surface-muted);color:var(--cl-text);font-weight:600}
.t-dash__main{padding:20px;display:flex;flex-direction:column;gap:20px}
.t-dash__head{display:flex;flex-wrap:wrap;align-items:center;justify-content:space-between;gap:12px}
.t-dash__head h1{margin:0;font-size:1.25rem;font-weight:800;letter-spacing:-.02em}
.t-dash__stats{display:grid;grid-template-columns:repeat(auto-fit,minmax(140px,1fr));gap:var(--cl-gap)}
.t-dash__chart{height:160px;display:flex;align-items:flex-end;gap:8px;padding:16px;background:var(--cl-surface);border:1px solid var(--cl-border);border-radius:var(--cl-radius)}
.t-dash__bar{flex:1;border-radius:6px 6px 0 0;background:color-mix(in srgb,var(--cl-primary) 70%,#fff);min-height:20px}
.t-dash__table-wrap{overflow-x:auto;background:var(--cl-surface);border:1px solid var(--cl-border);border-radius:var(--cl-radius)}
@media(max-width:640px){.t-dash{grid-template-columns:1fr}.t-dash__side{display:none}}`;

function dashShell(brand: string, nav: string, title: string, body: string): string {
  return `
  <div class="cl-page t-dash">
    <aside class="t-dash__side">
      <div class="t-dash__side-brand">${brand}</div>
      <nav class="t-dash__nav" aria-label="Dashboard">${nav}</nav>
    </aside>
    <div class="t-dash__main">
      <header class="t-dash__head">
        <h1>${title}</h1>
        <button type="button" class="cl-btn cl-btn--primary">Export</button>
      </header>
      ${body}
    </div>
  </div>`;
}

export const DASHBOARD: CatalogComponentDef[] = [
  def({
    slug: "template-dashboard",
    name: "General Dashboard",
    layer: "templates",
    category: "dashboard",
    problemTags: ["build-dashboard", "build-ui-sections"],
    description: "Versatile app dashboard with sidebar nav, KPI stats, bar chart, and activity table.",
    html: wrapRoot(dashShell(
      "Pulse",
      `<a href="#" class="is-active">Overview</a><a href="#">Projects</a><a href="#">Team</a><a href="#">Reports</a><a href="#">Settings</a>`,
      "Overview",
      `
      <div class="t-dash__stats">
        <div class="cl-stat"><p class="cl-stat__value">12,847</p><p class="cl-stat__label">Active users</p></div>
        <div class="cl-stat"><p class="cl-stat__value">$48.2k</p><p class="cl-stat__label">Revenue (MTD)</p></div>
        <div class="cl-stat"><p class="cl-stat__value">94.1%</p><p class="cl-stat__label">Uptime</p></div>
        <div class="cl-stat"><p class="cl-stat__value">326</p><p class="cl-stat__label">Open tasks</p></div>
      </div>
      <div class="t-dash__chart" aria-label="Weekly activity chart">
        <div class="t-dash__bar" style="height:45%"></div>
        <div class="t-dash__bar" style="height:62%"></div>
        <div class="t-dash__bar" style="height:78%"></div>
        <div class="t-dash__bar" style="height:55%"></div>
        <div class="t-dash__bar" style="height:88%"></div>
        <div class="t-dash__bar" style="height:72%"></div>
        <div class="t-dash__bar" style="height:95%"></div>
      </div>
      <div class="t-dash__table-wrap">
        <table class="cl-table">
          <thead><tr><th>Activity</th><th>Owner</th><th>Status</th><th>Updated</th></tr></thead>
          <tbody>
            <tr><td>Deploy v2.4.1</td><td>S. Chen</td><td><span class="cl-badge">Complete</span></td><td class="cl-muted">2h ago</td></tr>
            <tr><td>Q3 forecast review</td><td>M. Ortiz</td><td><span class="cl-badge">In progress</span></td><td class="cl-muted">5h ago</td></tr>
            <tr><td>Security audit</td><td>J. Patel</td><td><span class="cl-badge">Scheduled</span></td><td class="cl-muted">Tomorrow</td></tr>
          </tbody>
        </table>
      </div>`,
    )),
    css: DASH_CSS,
  }),

  def({
    slug: "template-admin-dashboard",
    name: "Admin Dashboard",
    layer: "templates",
    category: "dashboard",
    problemTags: ["build-dashboard", "build-ui-sections"],
    description: "Admin control panel with user management table, system health stats, and quick actions.",
    html: wrapRoot(dashShell(
      "Admin Console",
      `<a href="#" class="is-active">Users</a><a href="#">Roles</a><a href="#">Billing</a><a href="#">Logs</a><a href="#">Integrations</a>`,
      "User management",
      `
      <div class="t-dash__stats">
        <div class="cl-stat"><p class="cl-stat__value">1,204</p><p class="cl-stat__label">Total users</p></div>
        <div class="cl-stat"><p class="cl-stat__value">38</p><p class="cl-stat__label">Pending invites</p></div>
        <div class="cl-stat"><p class="cl-stat__value">3</p><p class="cl-stat__label">Failed jobs</p></div>
      </div>
      <div class="t-dash__table-wrap">
        <table class="cl-table">
          <thead><tr><th>User</th><th>Role</th><th>Last login</th><th>Status</th><th></th></tr></thead>
          <tbody>
            <tr>
              <td><div style="display:flex;align-items:center;gap:10px"><div class="cl-avatar">EW</div><div><strong>Elena Wu</strong><br><span class="cl-muted">elena@acme.co</span></div></div></td>
              <td>Admin</td><td class="cl-muted">Today, 9:14 AM</td><td><span class="cl-badge">Active</span></td>
              <td><button type="button" class="cl-btn cl-btn--ghost">Edit</button></td>
            </tr>
            <tr>
              <td><div style="display:flex;align-items:center;gap:10px"><div class="cl-avatar">TR</div><div><strong>Tom Reyes</strong><br><span class="cl-muted">tom@acme.co</span></div></div></td>
              <td>Editor</td><td class="cl-muted">Yesterday</td><td><span class="cl-badge">Active</span></td>
              <td><button type="button" class="cl-btn cl-btn--ghost">Edit</button></td>
            </tr>
            <tr>
              <td><div style="display:flex;align-items:center;gap:10px"><div class="cl-avatar">NK</div><div><strong>Nadia Khan</strong><br><span class="cl-muted">nadia@acme.co</span></div></div></td>
              <td>Viewer</td><td class="cl-muted">Aug 2</td><td><span class="cl-badge" style="background:color-mix(in srgb,#64748b 12%,#fff);color:#475569">Suspended</span></td>
              <td><button type="button" class="cl-btn cl-btn--ghost">Edit</button></td>
            </tr>
          </tbody>
        </table>
      </div>`,
    )),
    css: DASH_CSS,
  }),

  def({
    slug: "template-crm",
    name: "CRM Dashboard",
    layer: "templates",
    category: "dashboard",
    problemTags: ["build-dashboard", "build-ui-sections"],
    description: "CRM pipeline view with deal stats, funnel chart bars, and recent opportunities table.",
    html: wrapRoot(dashShell(
      "CloseLoop CRM",
      `<a href="#" class="is-active">Pipeline</a><a href="#">Contacts</a><a href="#">Accounts</a><a href="#">Tasks</a><a href="#">Forecast</a>`,
      "Sales pipeline",
      `
      <div class="t-dash__stats">
        <div class="cl-stat"><p class="cl-stat__value">$1.2M</p><p class="cl-stat__label">Pipeline value</p></div>
        <div class="cl-stat"><p class="cl-stat__value">47</p><p class="cl-stat__label">Open deals</p></div>
        <div class="cl-stat"><p class="cl-stat__value">68%</p><p class="cl-stat__label">Win rate</p></div>
        <div class="cl-stat"><p class="cl-stat__value">12</p><p class="cl-stat__label">Closing this week</p></div>
      </div>
      <div class="t-dash__chart" aria-label="Pipeline stages">
        <div class="t-dash__bar" style="height:90%;opacity:.5" title="Lead"></div>
        <div class="t-dash__bar" style="height:75%;opacity:.65" title="Qualified"></div>
        <div class="t-dash__bar" style="height:58%;opacity:.8" title="Proposal"></div>
        <div class="t-dash__bar" style="height:42%" title="Negotiation"></div>
        <div class="t-dash__bar" style="height:28%;background:color-mix(in srgb,#16a34a 70%,#fff)" title="Closed won"></div>
      </div>
      <div class="t-dash__table-wrap">
        <table class="cl-table">
          <thead><tr><th>Deal</th><th>Account</th><th>Stage</th><th>Value</th><th>Close date</th></tr></thead>
          <tbody>
            <tr><td><strong>Enterprise expansion</strong></td><td>Northwind</td><td>Negotiation</td><td>$240k</td><td class="cl-muted">Aug 15</td></tr>
            <tr><td><strong>Annual renewal</strong></td><td>Lumina Health</td><td>Proposal</td><td>$86k</td><td class="cl-muted">Aug 22</td></tr>
            <tr><td><strong>Pilot program</strong></td><td>Pixel Forge</td><td>Qualified</td><td>$18k</td><td class="cl-muted">Sep 1</td></tr>
          </tbody>
        </table>
      </div>`,
    )),
    css: DASH_CSS,
  }),

  def({
    slug: "template-analytics",
    name: "Analytics Dashboard",
    layer: "templates",
    category: "dashboard",
    problemTags: ["build-dashboard", "build-ui-sections"],
    description: "Analytics workspace with traffic KPIs, trend chart, and top pages breakdown table.",
    html: wrapRoot(dashShell(
      "InsightHub",
      `<a href="#" class="is-active">Overview</a><a href="#">Acquisition</a><a href="#">Retention</a><a href="#">Events</a><a href="#">Segments</a>`,
      "Analytics overview",
      `
      <div class="t-dash__stats">
        <div class="cl-stat"><p class="cl-stat__value">284k</p><p class="cl-stat__label">Sessions (7d)</p></div>
        <div class="cl-stat"><p class="cl-stat__value">3.8%</p><p class="cl-stat__label">Conversion rate</p></div>
        <div class="cl-stat"><p class="cl-stat__value">2m 14s</p><p class="cl-stat__label">Avg. session</p></div>
        <div class="cl-stat"><p class="cl-stat__value">41%</p><p class="cl-stat__label">Return visitors</p></div>
      </div>
      <div class="t-dash__chart" aria-label="Daily sessions trend">
        <div class="t-dash__bar" style="height:35%"></div>
        <div class="t-dash__bar" style="height:48%"></div>
        <div class="t-dash__bar" style="height:52%"></div>
        <div class="t-dash__bar" style="height:61%"></div>
        <div class="t-dash__bar" style="height:58%"></div>
        <div class="t-dash__bar" style="height:74%"></div>
        <div class="t-dash__bar" style="height:82%"></div>
        <div class="t-dash__bar" style="height:70%"></div>
        <div class="t-dash__bar" style="height:90%"></div>
        <div class="t-dash__bar" style="height:85%"></div>
        <div class="t-dash__bar" style="height:92%"></div>
      </div>
      <div class="t-dash__table-wrap">
        <table class="cl-table">
          <thead><tr><th>Page</th><th>Views</th><th>Bounce rate</th><th>Avg. time</th></tr></thead>
          <tbody>
            <tr><td>/pricing</td><td>18,420</td><td>22%</td><td class="cl-muted">1m 48s</td></tr>
            <tr><td>/docs/getting-started</td><td>12,103</td><td>31%</td><td class="cl-muted">3m 02s</td></tr>
            <tr><td>/blog/product-update</td><td>8,774</td><td>45%</td><td class="cl-muted">2m 11s</td></tr>
          </tbody>
        </table>
      </div>`,
    )),
    css: DASH_CSS,
  }),

  def({
    slug: "template-project-management",
    name: "Project Management",
    layer: "templates",
    category: "dashboard",
    problemTags: ["build-dashboard", "build-ui-sections"],
    description: "Project tracker with sprint stats, burndown-style chart, and task assignment table.",
    html: wrapRoot(dashShell(
      "Sprintboard",
      `<a href="#" class="is-active">Board</a><a href="#">Backlog</a><a href="#">Sprints</a><a href="#">Roadmap</a><a href="#">Team</a>`,
      "Sprint 24 · Design system rollout",
      `
      <div class="t-dash__stats">
        <div class="cl-stat"><p class="cl-stat__value">18/26</p><p class="cl-stat__label">Tasks complete</p></div>
        <div class="cl-stat"><p class="cl-stat__value">4</p><p class="cl-stat__label">Blockers</p></div>
        <div class="cl-stat"><p class="cl-stat__value">3d</p><p class="cl-stat__label">Sprint remaining</p></div>
      </div>
      <div class="t-dash__chart" aria-label="Sprint burndown">
        <div class="t-dash__bar" style="height:100%;opacity:.4"></div>
        <div class="t-dash__bar" style="height:88%;opacity:.5"></div>
        <div class="t-dash__bar" style="height:76%;opacity:.6"></div>
        <div class="t-dash__bar" style="height:68%;opacity:.7"></div>
        <div class="t-dash__bar" style="height:55%;opacity:.8"></div>
        <div class="t-dash__bar" style="height:42%;opacity:.9"></div>
        <div class="t-dash__bar" style="height:31%"></div>
      </div>
      <div class="t-dash__table-wrap">
        <table class="cl-table">
          <thead><tr><th>Task</th><th>Assignee</th><th>Priority</th><th>Status</th></tr></thead>
          <tbody>
            <tr><td>Token migration script</td><td><div class="cl-avatar" style="width:28px;height:28px;font-size:.75rem">SC</div></td><td><span class="cl-badge">High</span></td><td>In review</td></tr>
            <tr><td>Button variant audit</td><td><div class="cl-avatar" style="width:28px;height:28px;font-size:.75rem">MR</div></td><td>Medium</td><td>In progress</td></tr>
            <tr><td>Storybook deploy</td><td><div class="cl-avatar" style="width:28px;height:28px;font-size:.75rem">JP</div></td><td>Low</td><td>Done</td></tr>
          </tbody>
        </table>
      </div>`,
    )),
    css: DASH_CSS,
  }),

  def({
    slug: "template-finance",
    name: "Finance Dashboard",
    layer: "templates",
    category: "dashboard",
    problemTags: ["build-dashboard", "build-ui-sections"],
    description: "Finance overview with cash flow KPIs, revenue chart, and recent transactions table.",
    html: wrapRoot(dashShell(
      "LedgerPro",
      `<a href="#" class="is-active">Overview</a><a href="#">Transactions</a><a href="#">Invoices</a><a href="#">Budgets</a><a href="#">Reports</a>`,
      "Financial overview",
      `
      <div class="t-dash__stats">
        <div class="cl-stat"><p class="cl-stat__value">$842k</p><p class="cl-stat__label">Cash on hand</p></div>
        <div class="cl-stat"><p class="cl-stat__value">+$124k</p><p class="cl-stat__label">Net income (Q2)</p></div>
        <div class="cl-stat"><p class="cl-stat__value">$38k</p><p class="cl-stat__label">Outstanding AR</p></div>
        <div class="cl-stat"><p class="cl-stat__value">14 mo</p><p class="cl-stat__label">Runway</p></div>
      </div>
      <div class="t-dash__chart" aria-label="Monthly revenue">
        <div class="t-dash__bar" style="height:52%"></div>
        <div class="t-dash__bar" style="height:58%"></div>
        <div class="t-dash__bar" style="height:64%"></div>
        <div class="t-dash__bar" style="height:61%"></div>
        <div class="t-dash__bar" style="height:72%"></div>
        <div class="t-dash__bar" style="height:78%"></div>
        <div class="t-dash__bar" style="height:85%"></div>
        <div class="t-dash__bar" style="height:82%"></div>
        <div class="t-dash__bar" style="height:90%"></div>
        <div class="t-dash__bar" style="height:88%"></div>
        <div class="t-dash__bar" style="height:95%"></div>
      </div>
      <div class="t-dash__table-wrap">
        <table class="cl-table">
          <thead><tr><th>Date</th><th>Description</th><th>Category</th><th>Amount</th></tr></thead>
          <tbody>
            <tr><td class="cl-muted">Aug 8</td><td>Stripe payout</td><td>Revenue</td><td style="color:#16a34a;font-weight:700">+$12,400</td></tr>
            <tr><td class="cl-muted">Aug 7</td><td>AWS infrastructure</td><td>COGS</td><td style="font-weight:600">-$3,280</td></tr>
            <tr><td class="cl-muted">Aug 6</td><td>Contractor payment</td><td>Payroll</td><td style="font-weight:600">-$8,500</td></tr>
          </tbody>
        </table>
      </div>`,
    )),
    css: DASH_CSS,
  }),
];
