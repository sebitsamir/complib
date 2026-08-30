export interface Component {
    id: string;
    name: string;
    slug: string;
    description: string;
    html: string;
    css: string;
    js: string;
    tags: string[];
    tier: 'FREE' | 'PRO' | 'ENTERPRISE';
    module: { name: string; slug: string };
    viewCount: number;
}

export const mockComponents: Component[] = [
    {
        id: "pro-glass-1",
        name: "Glassmorphism Card",
        slug: "glassmorphism-card",
        description: "Frosted glass panel with subtle border — Pro tier showcase.",
        html: `<div class="glass-card"><h3>Pro</h3><p>Premium polish</p></div>`,
        css: `.glass-card {
        padding: 24px 28px;
        border-radius: 16px;
        background: rgba(255,255,255,0.06);
        border: 1px solid rgba(255,255,255,0.12);
        backdrop-filter: blur(12px);
        max-width: 280px;
        color: #fafafa;
        }
        .glass-card h3 { font-size: 1.125rem; margin-bottom: 8px; }
        .glass-card p { font-size: 0.875rem; color: #a1a1aa; }`,
        js: "",
        tags: ["card", "glass", "pro"],
        tier: "PRO",
        module: { name: "Surfaces & Cards", slug: "cards" },
        viewCount: 890,
    },

    {
        id: "2",
        name: "Neon Glow Button",
        slug: "neon-glow-button",
        description: "Button with glowing neon border effect - pure CSS magic.",
        html: `<button class="neon-btn">Neon Glow</button>`,
        css: `.neon-btn  {
        padding: 14px 32px;
        font-size: 18px;
        font-weight: 700;
        background: transparent;
        border: 3px solid #e8ff47;
        color: #e8ff48;
        border-radius: 9999px;
        cursor: pointer;
        transition: all 0.3s ease;
        box-shadow: 0 0 20px #e8ff47
        }
        
        .neon-btn {
        box-shadow: 0 0 40px #e8ff47;
        transform: scale(1.05);
        }
        
        .neon-btn:hover{
        border: 3px solid black;
        color: #e8ff47;}`,
        js: "pure CSS -no JS needed",
        tags: ["buttton", "neon", "css-only", "glow"],
        tier: "FREE",
        module: { name: "Button & Actions", slug: "buttons"},
        viewCount: 1234,
    },

    {
        id: "3",
        name: "Maintenance Page",
        slug: "maintenance-page",
        description: "A page show that the website is down and still under changes.",
        html: `<div class="maintenance-page"><div class="mp-icon">🔧</div><h4>We'll Be Back Soon</h4><p>Scheduled maintenance in progress.<br>Estimated time: 2 hours</p><div class="mp-progress"><div class="mp-progress-fill"></div></div></div>`,
        css: `:root {
    --bg: #0a0a0f;
    --surface: #13131a;
    --surface2: #1c1c26;
    --border: #2a2a3a;
    --accent: #7c6af7;
    --accent2: #f7c56a;
    --accent3: #6af7c5;
    --text: #e8e8f0;
    --muted: #6b6b80;
    --danger: #f76a6a;
    --success: #6af79c;
    --warning: #f7c56a;
    --radius: 8px;
    --font-mono: 'Space Mono', monospace;
    --font-display: 'Fraunces', serif;
  }

/* --- Base body (optional) --- */
body{
    background:var(--bg);
    color:var(--text);
    font-family:
    var(--font-mono);
    font-size:14px;
    line-height:1.6;
    overflow-x:hidden;
  }

/* --- Component #99 (from style.css) --- */
/* 91–100: Advanced */
  .pwa-prompt{
    background:var(--surface2);border:1px solid var(--border);
    border-radius:12px;padding:14px;display:flex;align-items:center;gap:12px;width:100%;
  }
  .pwa-icon{font-size:28px}
  .pwa-text h4{font-size:13px;margin-bottom:2px}
  .pwa-text p{font-size:11px;color:var(--muted)}
  .pwa-install{background:var(--accent);border:none;color:#fff;padding:8px 14px;border-radius:var(--radius);cursor:pointer;font-family:var(--font-mono);font-size:11px;margin-left:auto;flex-shrink:0}
  
  .focus-ring-demo{padding:16px;display:flex;gap:12px;flex-wrap:wrap;align-items:center}
  .focus-ring-btn{background:var(--surface2);border:2px solid transparent;color:var(--text);padding:8px 16px;border-radius:var(--radius);cursor:pointer;font-family:var(--font-mono);font-size:12px;transition:.2s;outline:none}
  .focus-ring-btn:focus{border-color:var(--accent);box-shadow:0 0 0 4px rgba(124,106,247,.2)}

  .qr-display{display:flex;flex-direction:column;align-items:center;gap:8px}
  .qr-grid{display:grid;grid-template-columns:repeat(7,1fr);gap:2px;width:84px;height:84px}
  .qr-cell{border-radius:1px}

  .tour-step{background:var(--surface2);border:1px solid var(--accent);border-radius:12px;padding:14px;width:100%;position:relative}
  .tour-step::before{content:'';position:absolute;bottom:-10px;left:20px;border:5px solid transparent;border-top-color:var(--accent)}
  .tour-step-num{font-size:10px;color:var(--accent);margin-bottom:4px;text-transform:uppercase;letter-spacing:.08em}
  .tour-step h4{font-size:13px;margin-bottom:4px}
  .tour-step p{font-size:11px;color:var(--muted);margin-bottom:10px}
  .tour-actions{display:flex;gap:6px;justify-content:flex-end}
  .tour-skip{background:none;border:none;color:var(--muted);font-family:var(--font-mono);font-size:11px;cursor:pointer}
  .tour-next{background:var(--accent);border:none;color:#fff;padding:6px 14px;border-radius:var(--radius);cursor:pointer;font-family:var(--font-mono);font-size:11px}

  .cursor-demo{width:100%;height:80px;background:var(--surface2);border:1px solid var(--border);border-radius:var(--radius);position:relative;overflow:hidden;cursor:none;display:flex;align-items:center;justify-content:center;font-size:11px;color:var(--muted)}
  .cursor-follower{position:absolute;width:20px;height:20px;border-radius:50%;border:2px solid var(--accent);pointer-events:none;transition:transform .1s;mix-blend-mode:difference;transform:translate(-50%,-50%)}

  .favicon-demo{display:flex;flex-direction:column;gap:8px;width:100%}
  .favicon-tab{background:var(--surface2);border:1px solid var(--border);border-radius:var(--radius) var(--radius) 0 0;padding:6px 14px;display:inline-flex;align-items:center;gap:6px;font-size:11px}
  .favicon-icon{width:14px;height:14px;border-radius:2px;display:flex;align-items:center;justify-content:center;font-size:8px}
  .favicon-btn{background:var(--accent);border:none;color:#fff;padding:6px 12px;border-radius:var(--radius);cursor:pointer;font-family:var(--font-mono);font-size:11px;margin-top:4px}

  .maintenance-page{
    width:100%;padding:20px;text-align:center;
    background:linear-gradient(135deg,rgba(124,106,247,.1),rgba(106,247,197,.05));
    border:1px solid var(--border);border-radius:var(--radius);
  }
  .maintenance-page .mp-icon{font-size:32px;margin-bottom:8px}
  .maintenance-page h4{font-family:var(--font-display);font-size:1.1rem;font-weight:900;margin-bottom:4px}
  .maintenance-page p{font-size:11px;color:var(--muted)}
  .mp-progress{width:100%;height:4px;background:var(--border);border-radius:2px;margin-top:12px;overflow:hidden}
  .mp-progress-fill{width:70%;height:100%;background:linear-gradient(90deg,var(--accent),var(--accent3));animation:mpLoad 2s ease-in-out infinite alternate;border-radius:2px}
  @keyframes mpLoad{from{width:30%}to{width:85%}}

  .ai-stream-wrap{width:100%}
  .ai-stream-text{background:var(--surface2);border:1px solid var(--border);border-radius:var(--radius);padding:12px;font-size:12px;color:var(--text);min-height:60px;line-height:1.8}
  .ai-cursor{display:inline-block;width:2px;height:14px;background:var(--accent);margin-left:2px;animation:blink .7s infinite}
  @keyframes blink{0%,100%{opacity:1}50%{opacity:0}}
  .ai-stream-btn{background:var(--accent);border:none;color:#fff;padding:8px 16px;border-radius:var(--radius);cursor:pointer;font-family:var(--font-mono);font-size:12px;margin-top:8px;transition:.2s}
  .ai-stream-btn:hover{background:#6559e0}`,
        js: "Soon coming",
        tags: ["maintenance", "page", "css-only", "load"],
        tier: "PRO",
        module: { name: "Web Maintenance", slug: "maintenance"},
        viewCount: 1234,
    },

    {
        id: "4",
        name: "Dashboard",
        slug: "dashboard",
        description: "Dashboard with charts, tables and more.",
        html: `<div style="padding:8px;width:100%"><div class="tour-step"><div class="tour-step-num">Step 2 of 4</div><h4>📊 Your Dashboard</h4><p>Here you can see all your metrics, charts, and key performance indicators at a glance.</p><div class="tour-actions"><button class="tour-skip">Skip tour</button><button class="tour-next" onclick="showToast(&#39;info&#39;,&#39;Next step!&#39;)">Next →</button></div></div></div>`,
        css: `:root {
    --bg: #0a0a0f;
    --surface: #13131a;
    --surface2: #1c1c26;
    --border: #2a2a3a;
    --accent: #7c6af7;
    --accent2: #f7c56a;
    --accent3: #6af7c5;
    --text: #e8e8f0;
    --muted: #6b6b80;
    --danger: #f76a6a;
    --success: #6af79c;
    --warning: #f7c56a;
    --radius: 8px;
    --font-mono: 'Space Mono', monospace;
    --font-display: 'Fraunces', serif;
  }

/* --- Base body (optional) --- */
body{
    background:var(--bg);
    color:var(--text);
    font-family:
    var(--font-mono);
    font-size:14px;
    line-height:1.6;
    overflow-x:hidden;
  }

/* --- Component #96 (from style.css) --- */
/* 91–100: Advanced */
  .pwa-prompt{
    background:var(--surface2);border:1px solid var(--border);
    border-radius:12px;padding:14px;display:flex;align-items:center;gap:12px;width:100%;
  }
  .pwa-icon{font-size:28px}
  .pwa-text h4{font-size:13px;margin-bottom:2px}
  .pwa-text p{font-size:11px;color:var(--muted)}
  .pwa-install{background:var(--accent);border:none;color:#fff;padding:8px 14px;border-radius:var(--radius);cursor:pointer;font-family:var(--font-mono);font-size:11px;margin-left:auto;flex-shrink:0}
  
  .focus-ring-demo{padding:16px;display:flex;gap:12px;flex-wrap:wrap;align-items:center}
  .focus-ring-btn{background:var(--surface2);border:2px solid transparent;color:var(--text);padding:8px 16px;border-radius:var(--radius);cursor:pointer;font-family:var(--font-mono);font-size:12px;transition:.2s;outline:none}
  .focus-ring-btn:focus{border-color:var(--accent);box-shadow:0 0 0 4px rgba(124,106,247,.2)}

  .qr-display{display:flex;flex-direction:column;align-items:center;gap:8px}
  .qr-grid{display:grid;grid-template-columns:repeat(7,1fr);gap:2px;width:84px;height:84px}
  .qr-cell{border-radius:1px}

  .tour-step{background:var(--surface2);border:1px solid var(--accent);border-radius:12px;padding:14px;width:100%;position:relative}
  .tour-step::before{content:'';position:absolute;bottom:-10px;left:20px;border:5px solid transparent;border-top-color:var(--accent)}
  .tour-step-num{font-size:10px;color:var(--accent);margin-bottom:4px;text-transform:uppercase;letter-spacing:.08em}
  .tour-step h4{font-size:13px;margin-bottom:4px}
  .tour-step p{font-size:11px;color:var(--muted);margin-bottom:10px}
  .tour-actions{display:flex;gap:6px;justify-content:flex-end}
  .tour-skip{background:none;border:none;color:var(--muted);font-family:var(--font-mono);font-size:11px;cursor:pointer}
  .tour-next{background:var(--accent);border:none;color:#fff;padding:6px 14px;border-radius:var(--radius);cursor:pointer;font-family:var(--font-mono);font-size:11px}

  .cursor-demo{width:100%;height:80px;background:var(--surface2);border:1px solid var(--border);border-radius:var(--radius);position:relative;overflow:hidden;cursor:none;display:flex;align-items:center;justify-content:center;font-size:11px;color:var(--muted)}
  .cursor-follower{position:absolute;width:20px;height:20px;border-radius:50%;border:2px solid var(--accent);pointer-events:none;transition:transform .1s;mix-blend-mode:difference;transform:translate(-50%,-50%)}

  .favicon-demo{display:flex;flex-direction:column;gap:8px;width:100%}
  .favicon-tab{background:var(--surface2);border:1px solid var(--border);border-radius:var(--radius) var(--radius) 0 0;padding:6px 14px;display:inline-flex;align-items:center;gap:6px;font-size:11px}
  .favicon-icon{width:14px;height:14px;border-radius:2px;display:flex;align-items:center;justify-content:center;font-size:8px}
  .favicon-btn{background:var(--accent);border:none;color:#fff;padding:6px 12px;border-radius:var(--radius);cursor:pointer;font-family:var(--font-mono);font-size:11px;margin-top:4px}

  .maintenance-page{
    width:100%;padding:20px;text-align:center;
    background:linear-gradient(135deg,rgba(124,106,247,.1),rgba(106,247,197,.05));
    border:1px solid var(--border);border-radius:var(--radius);
  }
  .maintenance-page .mp-icon{font-size:32px;margin-bottom:8px}
  .maintenance-page h4{font-family:var(--font-display);font-size:1.1rem;font-weight:900;margin-bottom:4px}
  .maintenance-page p{font-size:11px;color:var(--muted)}
  .mp-progress{width:100%;height:4px;background:var(--border);border-radius:2px;margin-top:12px;overflow:hidden}
  .mp-progress-fill{width:70%;height:100%;background:linear-gradient(90deg,var(--accent),var(--accent3));animation:mpLoad 2s ease-in-out infinite alternate;border-radius:2px}
  @keyframes mpLoad{from{width:30%}to{width:85%}}

  .ai-stream-wrap{width:100%}
  .ai-stream-text{background:var(--surface2);border:1px solid var(--border);border-radius:var(--radius);padding:12px;font-size:12px;color:var(--text);min-height:60px;line-height:1.8}
  .ai-cursor{display:inline-block;width:2px;height:14px;background:var(--accent);margin-left:2px;animation:blink .7s infinite}
  @keyframes blink{0%,100%{opacity:1}50%{opacity:0}}
  .ai-stream-btn{background:var(--accent);border:none;color:#fff;padding:8px 16px;border-radius:var(--radius);cursor:pointer;font-family:var(--font-mono);font-size:12px;margin-top:8px;transition:.2s}
  .ai-stream-btn:hover{background:#6559e0}`,
  js: `function showToast(type, msg) {
  try {
    if (window.parent && window.parent !== window) {
      window.parent.postMessage({ type: 'app-toast', payload: { type, msg } }, '*');
      return;
    }
  } catch (e) {}
  const c = document.getElementById('toast-container');
  if (!c) return;
  const t = document.createElement('div');
  t.className = ;
  t.textContent = msg;
  c.appendChild(t);
  setTimeout(() => t.remove(), 3000);
}`,
        tags: ["dashboard", "charts", "css-only", "show"],
        tier: "FREE",
        module: { name: "Dashboards", slug: "dashboards"},
        viewCount: 1234,
    }
];

export const getMockComponentBySlug = (slug: string) =>
    mockComponents.find((c) => c.slug === slug);

export type LibraryNavComponent = {
    name: string;
    slug: string;
    tier: Component["tier"];
};

export type LibraryNavModule = {
    name: string;
    slug: string;
    components: LibraryNavComponent[];
};

/** Deduped tree of modules → components for side navigation */
export function getLibraryNavigation(): LibraryNavModule[] {
    const byModule = new Map<
        string,
        { name: string; slug: string; comps: Map<string, LibraryNavComponent> }
    >();

    for (const c of mockComponents) {
        const key = c.module.slug;
        if (!byModule.has(key)) {
            byModule.set(key, {
                name: c.module.name,
                slug: c.module.slug,
                comps: new Map(),
            });
        }
        const m = byModule.get(key)!;
        if (!m.comps.has(c.slug)) {
            m.comps.set(c.slug, {
                name: c.name,
                slug: c.slug,
                tier: c.tier,
            });
        }
    }

    return Array.from(byModule.values())
        .map((m) => ({
            name: m.name,
            slug: m.slug,
            components: Array.from(m.comps.values()).sort((a, b) =>
                a.name.localeCompare(b.name),
            ),
        }))
        .sort((a, b) => a.name.localeCompare(b.name));
}

export const getMockComponents = (search = "", module?: string, tier?: string) => {
    let filtered = mockComponents;

    if (search) {
        const term = search.toLowerCase();
        filtered = filtered.filter(
            (c) =>
                c.name.toLowerCase().includes(term) || 
                c.description.toLowerCase().includes(term) ||
                c.tags.some((tag) => tag.includes(term))
        );
    }

    if (module) filtered = filtered.filter((c) => c.module.slug === module);
    if (tier) filtered = filtered.filter((c) => c.tier === tier);

    return filtered;

}
