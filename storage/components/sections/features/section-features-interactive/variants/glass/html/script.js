
(function(){
  var root=document.querySelector('[data-feature-tabs]');
  if(!root)return;
  var btns=root.querySelectorAll('[data-ftab]');
  var panes=root.querySelectorAll('[data-fpanel]');
  btns.forEach(function(btn){
    btn.addEventListener('click',function(){
      var id=btn.getAttribute('data-ftab');
      btns.forEach(function(b){b.classList.remove('is-active');});
      panes.forEach(function(p){
        var active=p.getAttribute('data-fpanel')===id;
        p.classList.toggle('is-active',active);
        p.hidden=!active;
      });
      btn.classList.add('is-active');
    });
  });
})();