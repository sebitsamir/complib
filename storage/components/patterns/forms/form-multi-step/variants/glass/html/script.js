
(function(){
  var root=document.querySelector('[data-wizard]');
  if(!root)return;
  var steps=root.querySelectorAll('[data-step]');
  var panels=root.querySelectorAll('[data-panel]');
  var back=root.querySelector('[data-wizard-back]');
  var next=root.querySelector('[data-wizard-next]');
  var submit=root.querySelector('[data-wizard-submit]');
  var i=0;
  function show(n){
    i=n;
    steps.forEach(function(s,j){s.classList.toggle('is-active',j===i);});
    panels.forEach(function(p,j){p.hidden=j!==i;p.classList.toggle('is-active',j===i);});
    back.hidden=i===0;
    next.hidden=i===panels.length-1;
    submit.hidden=i!==panels.length-1;
  }
  back.addEventListener('click',function(){if(i>0)show(i-1);});
  next.addEventListener('click',function(){if(i<panels.length-1)show(i+1);});
  show(0);
})();