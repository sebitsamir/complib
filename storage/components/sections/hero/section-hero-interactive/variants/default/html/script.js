
(function(){
  var root=document.querySelector('[data-hero-tabs]');
  if(!root)return;
  var tabs=root.querySelectorAll('[data-tab]');
  var panels=root.querySelectorAll('[data-panel]');
  tabs.forEach(function(tab){
    tab.addEventListener('click',function(){
      var id=tab.getAttribute('data-tab');
      tabs.forEach(function(t){t.classList.remove('is-active');t.setAttribute('aria-selected','false');});
      panels.forEach(function(p){
        var active=p.getAttribute('data-panel')===id;
        p.classList.toggle('is-active',active);
        p.hidden=!active;
      });
      tab.classList.add('is-active');
      tab.setAttribute('aria-selected','true');
    });
  });
})();