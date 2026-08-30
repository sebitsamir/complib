(() => {
  const root = document.currentScript?.closest(".cl-ui") || document;
  const slider = root.querySelector("#cl-slider");
  const out = root.querySelector("#cl-slider-out");
  if (!slider || !out) return;
  const sync = () => { out.textContent = slider.value; };
  slider.addEventListener("input", sync);
  sync();
})();