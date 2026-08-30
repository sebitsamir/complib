
(function(){
  var btn=document.querySelector('[data-nav-toggle]');
  var menu=document.querySelector('[data-nav-menu]');
  var actions=document.querySelector('[data-nav-actions]');
  if(!btn||!menu)return;
  btn.addEventListener('click',function(){
    var open=menu.classList.toggle('is-open');
    if(actions)actions.classList.toggle('is-open',open);
    btn.setAttribute('aria-expanded',open?'true':'false');
  });
})();