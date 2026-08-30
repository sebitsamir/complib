
(function(){
  var openBtn=document.querySelector('[data-cmd-open]');
  var overlay=document.querySelector('[data-cmd-overlay]');
  if(!openBtn||!overlay)return;
  var input=overlay.querySelector('.c-cmd__input');
  function show(){overlay.hidden=false;if(input){input.focus();}}
  function hide(){overlay.hidden=true;}
  openBtn.addEventListener('click',show);
  overlay.addEventListener('click',function(e){if(e.target===overlay)hide();});
  document.addEventListener('keydown',function(e){
    if(e.key==='Escape'&&!overlay.hidden)hide();
    if((e.metaKey||e.ctrlKey)&&e.key==='k'){e.preventDefault();show();}
  });
})();