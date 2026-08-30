/** Injected into playground preview iframe for layout editing. */
export const PLAYGROUND_EDITOR_SCRIPT = `
(function(){
  const SNAP = 16;
  const EDITOR_SELECTOR = ".complib-editor";
  const SECTION_SELECTOR = "[data-complib-instance]";

  const root = document.querySelector(EDITOR_SELECTOR);
  if (!root) return;

  let editMode = false;
  let drag = null;
  let selectedIds = new Set();

  function post(type, payload){
    try{
      window.parent.postMessage({ type: type, ...(payload||{}) }, "*");
    } catch {}
  }

  function idsArray(){
    return Array.from(selectedIds);
  }

  function applySelectionVisual(){
    root.querySelectorAll(SECTION_SELECTOR).forEach((el) => {
      const n = el instanceof HTMLElement ? el : null;
      if (!n) return;
      const id = n.getAttribute("data-complib-instance");
      if (id && selectedIds.has(id)) n.classList.add("complib-selected");
      else n.classList.remove("complib-selected");
    });
  }

  function setSelection(ids, notifyParent){
    selectedIds = new Set(Array.isArray(ids) ? ids.filter(Boolean) : []);
    applySelectionVisual();
    if (notifyParent) post("complib:select", { ids: idsArray() });
  }

  function toggleInSelection(id, additive){
    const next = new Set(selectedIds);
    if (additive) {
      if (next.has(id)) next.delete(id);
      else next.add(id);
    } else {
      next.clear();
      next.add(id);
    }
    setSelection(Array.from(next), true);
  }

  function updateZFront(node){
    let maxZ = 0;
    root.querySelectorAll(SECTION_SELECTOR).forEach((el) => {
      const n = el instanceof HTMLElement ? el : null;
      if (!n) return;
      const z = parseInt(n.style.zIndex || n.getAttribute("data-complib-z") || "0", 10);
      if (Number.isFinite(z)) maxZ = Math.max(maxZ, z);
    });
    const next = maxZ + 1;
    node.style.zIndex = String(next);
    node.setAttribute("data-complib-z", String(next));
    return next;
  }

  function getNodeFromTarget(target){
    if (!(target instanceof Element)) return null;
    return target.closest(SECTION_SELECTOR);
  }

  function applySnap(v){
    return Math.round(v / SNAP) * SNAP;
  }

  function clamp(v, min, max){
    return Math.min(Math.max(v, min), max);
  }

  function ensureInlinePos(node){
    const computed = window.getComputedStyle(node);
    const currentLeft = parseFloat(computed.left || "0");
    const currentTop = parseFloat(computed.top || "0");
    if (Number.isFinite(currentLeft)) node.style.left = String(currentLeft) + "px";
    if (Number.isFinite(currentTop)) node.style.top = String(currentTop) + "px";
  }

  function measureAutoHeights(){
    const sizes = [];
    root.querySelectorAll(SECTION_SELECTOR + '[data-height-auto="true"]').forEach((el) => {
      if (!(el instanceof HTMLElement)) return;
      const id = el.getAttribute("data-complib-instance");
      if (!id) return;
      const height = Math.ceil(el.getBoundingClientRect().height);
      if (height > 0) sizes.push({ id: id, height: height });
    });
    if (sizes.length > 0) post("complib:measure", { sizes: sizes });
  }

  function applyLayouts(layouts, editorHeight){
    if (!Array.isArray(layouts)) return;
    layouts.forEach((layout) => {
      if (!layout || typeof layout.id !== "string") return;
      const el = root.querySelector(
        SECTION_SELECTOR + '[data-complib-instance="' + CSS.escape(layout.id) + '"]',
      );
      if (!(el instanceof HTMLElement)) return;
      if (typeof layout.x === "number" && Number.isFinite(layout.x)) {
        el.style.left = String(Math.round(layout.x)) + "px";
      }
      if (typeof layout.y === "number" && Number.isFinite(layout.y)) {
        el.style.top = String(Math.round(layout.y)) + "px";
      }
      if (typeof layout.width === "number" && Number.isFinite(layout.width)) {
        el.style.width = String(Math.round(layout.width)) + "px";
      }
      if (layout.heightAuto === true) {
        el.style.height = "auto";
        el.setAttribute("data-height-auto", "true");
      } else if (typeof layout.height === "number" && Number.isFinite(layout.height)) {
        el.style.height = String(Math.round(layout.height)) + "px";
        el.removeAttribute("data-height-auto");
      }
      if (typeof layout.zIndex === "number" && Number.isFinite(layout.zIndex)) {
        const z = Math.round(layout.zIndex);
        el.style.zIndex = String(z);
        el.setAttribute("data-complib-z", String(z));
      }
    });
    if (typeof editorHeight === "number" && Number.isFinite(editorHeight) && editorHeight > 0) {
      root.style.height = String(Math.round(editorHeight)) + "px";
    }
    window.requestAnimationFrame(function(){
      window.requestAnimationFrame(measureAutoHeights);
    });
  }

  root.addEventListener("pointerdown", (event) => {
    if (!editMode) return;
    if (event.button !== 0) return;

    const node = getNodeFromTarget(event.target);
    const additive = event.shiftKey || event.metaKey || event.ctrlKey;

    if (!node) {
      if (!additive) setSelection([], true);
      return;
    }

    const id = node.getAttribute("data-complib-instance");
    if (!id) return;

    event.preventDefault();
    event.stopPropagation();

    if (additive) toggleInSelection(id, true);
    else if (!selectedIds.has(id)) setSelection([id], true);

    const moveIds = idsArray().includes(id) ? idsArray() : [id];
    const editorRect = root.getBoundingClientRect();
    const nodeRect = node.getBoundingClientRect();
    const offsetX = event.clientX - nodeRect.left;
    const offsetY = event.clientY - nodeRect.top;

    const nodes = moveIds.map((mid) => {
      const el = root.querySelector(
        SECTION_SELECTOR + '[data-complib-instance="' + CSS.escape(mid) + '"]',
      );
      if (!(el instanceof HTMLElement)) return null;
      ensureInlinePos(el);
      const left = parseFloat(el.style.left || "0");
      const top = parseFloat(el.style.top || "0");
      return { id: mid, node: el, startLeft: left, startTop: top };
    }).filter(Boolean);

    if (nodes.length === 0) return;

    updateZFront(node);
    node.setPointerCapture?.(event.pointerId);

    drag = {
      nodes,
      offsetX,
      offsetY,
      editorLeft: editorRect.left,
      editorTop: editorRect.top,
      anchorId: id,
    };
  }, true);

  root.addEventListener("pointermove", (event) => {
    if (!editMode || !drag) return;
    const left = applySnap(event.clientX - drag.editorLeft - drag.offsetX);
    const top = applySnap(event.clientY - drag.editorTop - drag.offsetY);
    const anchor = drag.nodes.find((n) => n.id === drag.anchorId) || drag.nodes[0];
    const dx = left - anchor.startLeft;
    const dy = top - anchor.startTop;
    const maxLeft = Math.max(0, root.getBoundingClientRect().width - 1);
    const maxTop = Math.max(0, root.getBoundingClientRect().height - 1);

    drag.nodes.forEach((entry) => {
      const nx = clamp(applySnap(entry.startLeft + dx), 0, maxLeft);
      const ny = clamp(applySnap(entry.startTop + dy), 0, maxTop);
      entry.node.style.left = String(nx) + "px";
      entry.node.style.top = String(ny) + "px";
    });
  }, true);

  root.addEventListener("pointerup", () => {
    if (!editMode || !drag) return;
    const moves = drag.nodes.map((entry) => {
      const left = parseFloat(entry.node.style.left || "0");
      const top = parseFloat(entry.node.style.top || "0");
      const zIndex = parseInt(entry.node.style.zIndex || "1", 10);
      return {
        id: entry.id,
        x: left,
        y: top,
        zIndex: Number.isFinite(zIndex) ? zIndex : 1,
      };
    });
    post("complib:patch", { moves });
    drag = null;
  }, true);

  window.addEventListener("message", (event) => {
    const data = event && event.data ? event.data : null;
    if (!data || typeof data.type !== "string") return;
    if (data.type === "complib:set-edit-mode") {
      editMode = !!data.value;
      if (!editMode) setSelection([], false);
    }
    if (data.type === "complib:set-selection") {
      const ids = Array.isArray(data.ids) ? data.ids : [];
      setSelection(ids, false);
    }
    if (data.type === "complib:apply-layout") {
      applyLayouts(data.layouts, data.editorHeight);
    }
    if (data.type === "complib:measure-request") {
      measureAutoHeights();
    }
  });

  window.requestAnimationFrame(function(){
    window.requestAnimationFrame(measureAutoHeights);
  });
})();
`.trim();
