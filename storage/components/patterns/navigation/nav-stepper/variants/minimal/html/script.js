
(function(){
  var root=document.querySelector('[data-stepper]');
  if(!root)return;
  var steps=root.querySelectorAll('[data-step]');
  var lines=root.querySelectorAll('.c-stepper__line');
  steps.forEach(function(step,i){
    step.addEventListener('click',function(){
      steps.forEach(function(s,j){
        s.classList.remove('is-active');
        if(j<i){s.classList.add('is-complete');s.querySelector('.c-stepper__num').textContent='\u2713';}
        else{s.classList.remove('is-complete');s.querySelector('.c-stepper__num').textContent=String(j+1);}
      });
      lines.forEach(function(l,j){l.classList.toggle('is-complete',j<i);});
      step.classList.add('is-active');
      step.classList.remove('is-complete');
      step.querySelector('.c-stepper__num').textContent=String(i+1);
    });
  });
})();