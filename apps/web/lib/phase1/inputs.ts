import type { Phase1PrimitiveDef } from "./shared";
import { INPUT_VARIANTS, SURFACE, wrapRoot } from "./shared";

const FIELD = `
.cl-field{display:flex;flex-direction:column;gap:6px;width:100%;max-width:var(--cl-max-w-form)}
.cl-field__label{font-size:var(--cl-font-sm);font-weight:600;color:var(--cl-text)}
.cl-input,.cl-select,.cl-textarea{
  width:100%;font:inherit;font-size:var(--cl-font-md);color:var(--cl-text);
  background:var(--cl-surface);border:1px solid var(--cl-border);border-radius:var(--cl-radius);
  padding:calc(10px * var(--cl-size-mult) * var(--cl-density-mult)) calc(12px * var(--cl-size-mult));
  box-shadow:var(--cl-shadow);transition:border-color .15s ease,box-shadow .15s ease;
}
.cl-input:focus-visible,.cl-select:focus-visible,.cl-textarea:focus-visible,.cl-btn:focus-visible{
  outline:2px solid var(--cl-primary);outline-offset:2px;border-color:var(--cl-primary);
}
.cl-input::placeholder,.cl-textarea::placeholder{color:var(--cl-text-muted)}
`.trim();

const BTN = `
.cl-btn{
  appearance:none;display:inline-flex;align-items:center;justify-content:center;gap:8px;
  font:inherit;font-size:var(--cl-font-md);font-weight:600;line-height:1;cursor:pointer;
  border-radius:var(--cl-radius);border:1px solid transparent;
  padding:calc(10px * var(--cl-size-mult) * var(--cl-density-mult)) calc(16px * var(--cl-size-mult));
  background:var(--cl-primary);color:#fff;box-shadow:var(--cl-shadow);transition:background .15s ease,transform .1s ease,box-shadow .15s ease;
}
.cl-btn:hover{background:var(--cl-primary-hover)}
.cl-btn:active{transform:translateY(1px)}
.cl-btn:disabled{opacity:.5;cursor:not-allowed;transform:none}
.cl-btn-row{display:flex;flex-wrap:wrap;gap:var(--cl-gap);align-items:center}
`.trim();

/** Input primitives (15) */
export const INPUTS: Phase1PrimitiveDef[] = [
  {
    slug: "button",
    name: "Button",
    category: "inputs",
    problemTags: ["build-form", "build-ui-sections"],
    description: "Primary action button with size, tone, and style variants (filled, outline, ghost, soft).",
    tags: ["inputs", "button", "action", "cta", "primitives", "standard"],
    dimensions: INPUT_VARIANTS,
    html: wrapRoot(`  <div class="cl-btn-row">
    <button type="button" class="cl-btn">Continue</button>
    <button type="button" class="cl-btn" disabled>Disabled</button>
  </div>`),
    css: `${SURFACE}\n${BTN}`,
    extraStyles: [
      {
        id: "outline",
        label: "Outline",
        cssExtra: `.cl-btn{background:transparent;color:var(--cl-primary);border-color:var(--cl-primary);box-shadow:none}
.cl-btn:hover{background:color-mix(in srgb,var(--cl-primary) 10%,transparent)}`,
      },
      {
        id: "ghost",
        label: "Ghost",
        cssExtra: `.cl-btn{background:transparent;color:var(--cl-primary);border-color:transparent;box-shadow:none}
.cl-btn:hover{background:color-mix(in srgb,var(--cl-primary) 12%,transparent)}`,
      },
      {
        id: "soft",
        label: "Soft",
        cssExtra: `.cl-btn{background:color-mix(in srgb,var(--cl-primary) 14%,var(--cl-surface));color:var(--cl-primary-hover);border-color:transparent;box-shadow:none}
.cl-btn:hover{background:color-mix(in srgb,var(--cl-primary) 22%,var(--cl-surface))}`,
      },
    ],
  },
  {
    slug: "icon-button",
    name: "Icon Button",
    category: "inputs",
    problemTags: ["build-ui-sections"],
    description: "Square icon-only button for toolbars and compact actions.",
    tags: ["inputs", "button", "icon", "toolbar", "primitives", "standard"],
    dimensions: INPUT_VARIANTS,
    html: wrapRoot(`  <div class="cl-btn-row">
    <button type="button" class="cl-icon-btn" aria-label="Add">
      <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" aria-hidden="true"><path d="M12 5v14M5 12h14"/></svg>
    </button>
    <button type="button" class="cl-icon-btn" aria-label="Settings" data-variant="outline">
      <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" aria-hidden="true"><circle cx="12" cy="12" r="3"/><path d="M12 1v2M12 21v2M4.2 4.2l1.4 1.4M18.4 18.4l1.4 1.4M1 12h2M21 12h2M4.2 19.8l1.4-1.4M18.4 5.6l1.4-1.4"/></svg>
    </button>
  </div>`),
    css: `${SURFACE}
.cl-btn-row{display:flex;gap:var(--cl-gap)}
.cl-icon-btn{
  appearance:none;display:inline-flex;align-items:center;justify-content:center;cursor:pointer;
  width:calc(40px * var(--cl-size-mult));height:calc(40px * var(--cl-size-mult));
  border-radius:var(--cl-radius);border:1px solid transparent;background:var(--cl-primary);color:#fff;
  box-shadow:var(--cl-shadow);transition:background .15s ease;
}
.cl-icon-btn:hover{background:var(--cl-primary-hover)}
.cl-icon-btn:focus-visible{outline:2px solid var(--cl-primary);outline-offset:2px}
.cl-icon-btn[data-variant="outline"]{background:var(--cl-surface);color:var(--cl-text);border-color:var(--cl-border)}
.cl-icon-btn[data-variant="outline"]:hover{border-color:var(--cl-primary);color:var(--cl-primary)}`,
  },
  {
    slug: "input",
    name: "Input",
    category: "inputs",
    problemTags: ["build-form"],
    description: "Single-line text field with label, focus ring, and placeholder.",
    tags: ["inputs", "input", "textfield", "form", "primitives", "standard"],
    dimensions: INPUT_VARIANTS,
    html: wrapRoot(`  <div class="cl-field">
    <label class="cl-field__label" for="cl-name">Full name</label>
    <input id="cl-name" class="cl-input" type="text" placeholder="Ada Lovelace" autocomplete="name" />
    <p class="cl-hint">Shown on invoices and receipts.</p>
  </div>`),
    css: `${SURFACE}\n${FIELD}`,
  },
  {
    slug: "textarea",
    name: "Textarea",
    category: "inputs",
    problemTags: ["build-form"],
    description: "Multi-line text area with resize control and comfortable padding.",
    tags: ["inputs", "textarea", "form", "primitives", "standard"],
    dimensions: INPUT_VARIANTS,
    html: wrapRoot(`  <div class="cl-field">
    <label class="cl-field__label" for="cl-msg">Message</label>
    <textarea id="cl-msg" class="cl-textarea" rows="4" placeholder="Tell us what you need…"></textarea>
  </div>`),
    css: `${SURFACE}\n${FIELD}
.cl-textarea{resize:vertical;min-height:calc(96px * var(--cl-size-mult));line-height:1.5}`,
  },
  {
    slug: "select",
    name: "Select",
    category: "inputs",
    problemTags: ["build-form"],
    description: "Native select styled to match CompLib form controls.",
    tags: ["inputs", "select", "dropdown", "form", "primitives", "standard"],
    dimensions: INPUT_VARIANTS,
    html: wrapRoot(`  <div class="cl-field">
    <label class="cl-field__label" for="cl-plan">Plan</label>
    <select id="cl-plan" class="cl-select">
      <option>Free</option>
      <option selected>Pro</option>
      <option>Enterprise</option>
    </select>
  </div>`),
    css: `${SURFACE}\n${FIELD}
.cl-select{cursor:pointer}`,
  },
  {
    slug: "checkbox",
    name: "Checkbox",
    category: "inputs",
    problemTags: ["build-form"],
    description: "Accessible checkbox with custom indicator and label.",
    tags: ["inputs", "checkbox", "form", "primitives", "standard"],
    dimensions: INPUT_VARIANTS,
    html: wrapRoot(`  <label class="cl-check">
    <input type="checkbox" class="cl-check__input" checked />
    <span class="cl-check__box" aria-hidden="true"></span>
    <span class="cl-check__text">Email me product updates</span>
  </label>`),
    css: `${SURFACE}
.cl-check{display:inline-flex;align-items:center;gap:10px;cursor:pointer;font-size:var(--cl-font-md);color:var(--cl-text);user-select:none}
.cl-check__input{position:absolute;opacity:0;width:1px;height:1px}
.cl-check__box{
  width:calc(18px * var(--cl-size-mult));height:calc(18px * var(--cl-size-mult));border-radius:calc(var(--cl-radius) * .45);
  border:1.5px solid var(--cl-border);background:var(--cl-surface);box-shadow:var(--cl-shadow);flex-shrink:0;
  display:grid;place-items:center;transition:background .15s ease,border-color .15s ease;
}
.cl-check__input:checked + .cl-check__box{background:var(--cl-primary);border-color:var(--cl-primary)}
.cl-check__input:checked + .cl-check__box::after{content:"";width:5px;height:9px;border:solid #fff;border-width:0 2px 2px 0;transform:rotate(45deg);margin-bottom:2px}
.cl-check__input:focus-visible + .cl-check__box{outline:2px solid var(--cl-primary);outline-offset:2px}`,
  },
  {
    slug: "radio",
    name: "Radio",
    category: "inputs",
    problemTags: ["build-form"],
    description: "Radio group for mutually exclusive choices.",
    tags: ["inputs", "radio", "form", "primitives", "standard"],
    dimensions: INPUT_VARIANTS,
    html: wrapRoot(`  <fieldset class="cl-radio-group">
    <legend class="cl-field__label">Billing cycle</legend>
    <label class="cl-radio"><input type="radio" name="cycle" class="cl-radio__input" checked /><span class="cl-radio__dot" aria-hidden="true"></span><span>Monthly</span></label>
    <label class="cl-radio"><input type="radio" name="cycle" class="cl-radio__input" /><span class="cl-radio__dot" aria-hidden="true"></span><span>Annual · save 20%</span></label>
  </fieldset>`),
    css: `${SURFACE}
.cl-field__label{font-size:var(--cl-font-sm);font-weight:600;color:var(--cl-text);margin-bottom:4px}
.cl-radio-group{border:0;margin:0;padding:0;display:flex;flex-direction:column;gap:10px}
.cl-radio{display:inline-flex;align-items:center;gap:10px;cursor:pointer;font-size:var(--cl-font-md);color:var(--cl-text)}
.cl-radio__input{position:absolute;opacity:0;width:1px;height:1px}
.cl-radio__dot{
  width:calc(18px * var(--cl-size-mult));height:calc(18px * var(--cl-size-mult));border-radius:999px;
  border:1.5px solid var(--cl-border);background:var(--cl-surface);display:grid;place-items:center;flex-shrink:0;
}
.cl-radio__input:checked + .cl-radio__dot{border-color:var(--cl-primary)}
.cl-radio__input:checked + .cl-radio__dot::after{content:"";width:8px;height:8px;border-radius:999px;background:var(--cl-primary)}
.cl-radio__input:focus-visible + .cl-radio__dot{outline:2px solid var(--cl-primary);outline-offset:2px}`,
  },
  {
    slug: "switch",
    name: "Switch",
    category: "inputs",
    problemTags: ["build-form", "build-ui-sections"],
    description: "Toggle switch for binary settings with keyboard support.",
    tags: ["inputs", "switch", "toggle", "form", "primitives", "standard"],
    dimensions: INPUT_VARIANTS,
    html: wrapRoot(`  <label class="cl-switch">
    <input type="checkbox" class="cl-switch__input" role="switch" checked />
    <span class="cl-switch__track" aria-hidden="true"><span class="cl-switch__thumb"></span></span>
    <span class="cl-switch__text">Enable dark mode sync</span>
  </label>`),
    css: `${SURFACE}
.cl-switch{display:inline-flex;align-items:center;gap:12px;cursor:pointer;font-size:var(--cl-font-md);color:var(--cl-text);user-select:none}
.cl-switch__input{position:absolute;opacity:0;width:1px;height:1px}
.cl-switch__track{
  width:calc(44px * var(--cl-size-mult));height:calc(26px * var(--cl-size-mult));border-radius:999px;
  background:var(--cl-border);position:relative;transition:background .2s ease;flex-shrink:0;
}
.cl-switch__thumb{
  position:absolute;top:3px;left:3px;width:calc(20px * var(--cl-size-mult));height:calc(20px * var(--cl-size-mult));
  border-radius:999px;background:#fff;box-shadow:0 1px 4px rgba(15,23,42,.25);transition:transform .2s ease;
}
.cl-switch__input:checked + .cl-switch__track{background:var(--cl-primary)}
.cl-switch__input:checked + .cl-switch__track .cl-switch__thumb{transform:translateX(calc(18px * var(--cl-size-mult)))}
.cl-switch__input:focus-visible + .cl-switch__track{outline:2px solid var(--cl-primary);outline-offset:2px}`,
  },
  {
    slug: "slider",
    name: "Slider",
    category: "inputs",
    problemTags: ["build-form", "build-ui-sections"],
    description: "Range slider with live value readout.",
    tags: ["inputs", "slider", "range", "form", "primitives", "standard"],
    dimensions: INPUT_VARIANTS,
    html: wrapRoot(`  <div class="cl-field">
    <div class="cl-slider-head">
      <label class="cl-field__label" for="cl-slider">Volume</label>
      <output class="cl-slider-val" for="cl-slider" id="cl-slider-out">50</output>
    </div>
    <input id="cl-slider" class="cl-slider" type="range" min="0" max="100" value="50" />
  </div>`),
    css: `${SURFACE}\n${FIELD}
.cl-slider-head{display:flex;justify-content:space-between;align-items:baseline}
.cl-slider-val{font-size:var(--cl-font-sm);font-weight:700;color:var(--cl-primary);font-variant-numeric:tabular-nums}
.cl-slider{appearance:none;width:100%;height:6px;border-radius:999px;background:var(--cl-border);outline:none}
.cl-slider::-webkit-slider-thumb{appearance:none;width:18px;height:18px;border-radius:999px;background:var(--cl-primary);cursor:pointer;box-shadow:var(--cl-shadow);border:2px solid #fff}
.cl-slider::-moz-range-thumb{width:18px;height:18px;border-radius:999px;background:var(--cl-primary);cursor:pointer;border:2px solid #fff}`,
    js: `(() => {
  const root = document.currentScript?.closest(".cl-ui") || document;
  const slider = root.querySelector("#cl-slider");
  const out = root.querySelector("#cl-slider-out");
  if (!slider || !out) return;
  const sync = () => { out.textContent = slider.value; };
  slider.addEventListener("input", sync);
  sync();
})();`,
  },
  {
    slug: "range",
    name: "Range",
    category: "inputs",
    problemTags: ["build-form"],
    description: "Dual-thumb style range demo for min/max filtering (visual pattern).",
    tags: ["inputs", "range", "filter", "form", "primitives", "standard"],
    dimensions: INPUT_VARIANTS,
    html: wrapRoot(`  <div class="cl-field">
    <span class="cl-field__label">Price range</span>
    <div class="cl-range">
      <input class="cl-slider" type="range" min="0" max="1000" value="200" aria-label="Minimum price" />
      <input class="cl-slider" type="range" min="0" max="1000" value="800" aria-label="Maximum price" />
    </div>
    <p class="cl-hint">$200 — $800</p>
  </div>`),
    css: `${SURFACE}\n${FIELD}
.cl-range{display:flex;flex-direction:column;gap:10px}
.cl-slider{appearance:none;width:100%;height:6px;border-radius:999px;background:var(--cl-border)}
.cl-slider::-webkit-slider-thumb{appearance:none;width:18px;height:18px;border-radius:999px;background:var(--cl-primary);cursor:pointer;border:2px solid #fff}
.cl-slider::-moz-range-thumb{width:18px;height:18px;border-radius:999px;background:var(--cl-primary);cursor:pointer;border:2px solid #fff}`,
  },
  {
    slug: "file-upload",
    name: "File Upload",
    category: "inputs",
    problemTags: ["build-form"],
    description: "Drag-and-drop styled file input with browse affordance.",
    tags: ["inputs", "file", "upload", "form", "primitives", "standard"],
    dimensions: INPUT_VARIANTS,
    html: wrapRoot(`  <label class="cl-upload">
    <input type="file" class="cl-upload__input" />
    <span class="cl-upload__icon" aria-hidden="true">↑</span>
    <span class="cl-upload__title">Drop files here or browse</span>
    <span class="cl-hint">PNG, JPG, or PDF up to 10MB</span>
  </label>`),
    css: `${SURFACE}
.cl-upload{
  display:flex;flex-direction:column;align-items:center;justify-content:center;gap:6px;text-align:center;
  width:100%;max-width:var(--cl-max-w-lg);min-height:calc(140px * var(--cl-size-mult));
  padding:var(--cl-pad);border:1.5px dashed var(--cl-border);border-radius:var(--cl-radius);
  background:var(--cl-surface-muted);cursor:pointer;transition:border-color .15s ease,background .15s ease;
}
.cl-upload:hover{border-color:var(--cl-primary);background:color-mix(in srgb,var(--cl-primary) 6%,var(--cl-surface-muted))}
.cl-upload__input{position:absolute;opacity:0;width:1px;height:1px}
.cl-upload__icon{font-size:var(--cl-font-xl);color:var(--cl-primary);font-weight:700}
.cl-upload__title{font-size:var(--cl-font-md);font-weight:600;color:var(--cl-text)}
.cl-upload:focus-within{outline:2px solid var(--cl-primary);outline-offset:2px}`,
  },
  {
    slug: "search-input",
    name: "Search Input",
    category: "inputs",
    problemTags: ["build-navigation", "build-form"],
    description: "Search field with leading icon and clear affordance.",
    tags: ["inputs", "search", "form", "primitives", "standard"],
    dimensions: INPUT_VARIANTS,
    html: wrapRoot(`  <div class="cl-search">
    <span class="cl-search__icon" aria-hidden="true">
      <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><circle cx="11" cy="11" r="7"/><path d="m20 20-3-3"/></svg>
    </span>
    <input class="cl-search__input" type="search" placeholder="Search components…" aria-label="Search" />
  </div>`),
    css: `${SURFACE}
.cl-search{
  display:flex;align-items:center;gap:8px;width:100%;max-width:var(--cl-max-w-form);
  padding:0 calc(12px * var(--cl-size-mult));border:1px solid var(--cl-border);border-radius:var(--cl-radius);
  background:var(--cl-surface);box-shadow:var(--cl-shadow);
}
.cl-search__icon{color:var(--cl-text-muted);display:flex}
.cl-search__input{
  flex:1;border:0;background:transparent;font:inherit;font-size:var(--cl-font-md);color:var(--cl-text);
  padding:calc(10px * var(--cl-size-mult) * var(--cl-density-mult)) 0;outline:none;
}
.cl-search:focus-within{border-color:var(--cl-primary);outline:2px solid color-mix(in srgb,var(--cl-primary) 35%,transparent);outline-offset:1px}`,
  },
  {
    slug: "combobox",
    name: "Combobox",
    category: "inputs",
    problemTags: ["build-form"],
    description: "Searchable select pattern — input plus suggestion list (vanilla demo).",
    tags: ["inputs", "combobox", "autocomplete", "form", "primitives", "standard"],
    dimensions: INPUT_VARIANTS,
    html: wrapRoot(`  <div class="cl-field cl-combo" data-open="false">
    <label class="cl-field__label" for="cl-combo">Framework</label>
    <input id="cl-combo" class="cl-input" role="combobox" aria-expanded="false" aria-autocomplete="list" aria-controls="cl-combo-list" placeholder="Type to filter…" />
    <ul id="cl-combo-list" class="cl-combo__list" role="listbox" hidden>
      <li role="option">Vanilla</li>
      <li role="option">React</li>
      <li role="option">Vue</li>
    </ul>
  </div>`),
    css: `${SURFACE}\n${FIELD}
.cl-combo{position:relative}
.cl-combo__list{
  list-style:none;margin:6px 0 0;padding:6px;position:absolute;left:0;right:0;z-index:5;
  background:var(--cl-surface);border:1px solid var(--cl-border);border-radius:var(--cl-radius);box-shadow:var(--cl-shadow);
}
.cl-combo__list li{padding:8px 10px;border-radius:calc(var(--cl-radius) * .7);cursor:pointer;font-size:var(--cl-font-md)}
.cl-combo__list li:hover,.cl-combo__list li[aria-selected="true"]{background:color-mix(in srgb,var(--cl-primary) 12%,transparent);color:var(--cl-primary-hover)}`,
    js: `(() => {
  const root = document.currentScript?.closest(".cl-ui") || document;
  const wrap = root.querySelector(".cl-combo");
  const input = root.querySelector("#cl-combo");
  const list = root.querySelector("#cl-combo-list");
  if (!wrap || !input || !list) return;
  const open = (on) => {
    list.hidden = !on;
    input.setAttribute("aria-expanded", on ? "true" : "false");
  };
  input.addEventListener("focus", () => open(true));
  input.addEventListener("input", () => {
    const q = input.value.toLowerCase();
    list.querySelectorAll("[role=option]").forEach((li) => {
      li.hidden = q && !li.textContent.toLowerCase().includes(q);
    });
    open(true);
  });
  list.addEventListener("click", (e) => {
    const li = e.target.closest("[role=option]");
    if (!li) return;
    input.value = li.textContent.trim();
    open(false);
  });
  document.addEventListener("click", (e) => {
    if (!wrap.contains(e.target)) open(false);
  });
})();`,
  },
  {
    slug: "date-input",
    name: "Date Input",
    category: "inputs",
    problemTags: ["build-form"],
    description: "Native date picker styled as a CompLib field.",
    tags: ["inputs", "date", "calendar", "form", "primitives", "standard"],
    dimensions: INPUT_VARIANTS,
    html: wrapRoot(`  <div class="cl-field">
    <label class="cl-field__label" for="cl-date">Start date</label>
    <input id="cl-date" class="cl-input" type="date" />
  </div>`),
    css: `${SURFACE}\n${FIELD}`,
  },
  {
    slug: "time-input",
    name: "Time Input",
    category: "inputs",
    problemTags: ["build-form"],
    description: "Native time picker styled as a CompLib field.",
    tags: ["inputs", "time", "form", "primitives", "standard"],
    dimensions: INPUT_VARIANTS,
    html: wrapRoot(`  <div class="cl-field">
    <label class="cl-field__label" for="cl-time">Meeting time</label>
    <input id="cl-time" class="cl-input" type="time" value="09:30" />
  </div>`),
    css: `${SURFACE}\n${FIELD}`,
  },
];
