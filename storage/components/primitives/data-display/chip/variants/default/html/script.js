(() => {
  const root = document.currentScript?.closest(".cl-ui") || document;
  root.querySelectorAll(".cl-chip").forEach((btn) => {
    btn.addEventListener("click", () => {
      root.querySelectorAll(".cl-chip").forEach((b) => b.setAttribute("data-active", "false"));
      btn.setAttribute("data-active", "true");
    });
  });
})();