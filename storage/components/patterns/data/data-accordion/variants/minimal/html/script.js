
(function(){
  var root=document.querySelector('[data-accordion]');
  if(!root)return;
  root.querySelectorAll('.c-accordion__item').forEach(function(item){
    item.addEventListener('toggle',function(){
      if(!item.open)return;
      root.querySelectorAll('.c-accordion__item').forEach(function(other){
        if(other!==item)other.open=false;
      });
    });
  });
})();