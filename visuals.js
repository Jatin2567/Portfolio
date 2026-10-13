document.addEventListener('DOMContentLoaded',()=>{
 const sculpture=document.querySelector('.hero-sculpture');
 const reduced=matchMedia('(prefers-reduced-motion: reduce)');
 if(sculpture){sculpture.addEventListener('pointermove',e=>{if(reduced.matches)return;const r=sculpture.getBoundingClientRect();sculpture.style.setProperty('--sculpt-x',((e.clientY-r.top)/r.height-.5)*-12+'deg');sculpture.style.setProperty('--sculpt-y',((e.clientX-r.left)/r.width-.5)*18+'deg');});sculpture.addEventListener('pointerleave',()=>{sculpture.style.setProperty('--sculpt-x','0deg');sculpture.style.setProperty('--sculpt-y','0deg');});}
 document.querySelectorAll('.card-item-warm').forEach(card=>{card.addEventListener('pointermove',e=>{if(reduced.matches)return;const r=card.getBoundingClientRect();card.style.setProperty('--pointer-x',(e.clientX-r.left)+'px');card.style.setProperty('--pointer-y',(e.clientY-r.top)+'px');});});
 const video=document.getElementById('dockVideo');if(video&&reduced.matches)video.pause();
});
