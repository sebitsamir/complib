(() => {
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
})();