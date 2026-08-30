
(function(){
  var toast=document.querySelector('[data-toast]');
  var close=toast&&toast.querySelector('[data-toast-close]');
  if(!close||!toast)return;
  close.addEventListener('click',function(){
    toast.style.opacity='0';
    toast.style.transform='translateY(8px)';
    toast.style.transition='opacity .2s,transform .2s';
    setTimeout(function(){toast.remove();},200);
  });
})();