document.addEventListener('DOMContentLoaded', () => {
  document.querySelectorAll('.card-item-warm').forEach(card => {
    const bullets=card.querySelector('.item-bullet-list'); if(!bullets)return;
    const details=document.createElement('details');details.className='project-details';
    const summary=document.createElement('summary');summary.textContent='Project details';
    bullets.before(details);details.append(summary,bullets);
  });
  const toggle=document.getElementById('viewerToggle');
  const panel=document.getElementById('viewerPopover');
  function setPanel(open){panel.hidden=!open;toggle.setAttribute('aria-expanded',String(open));}
  toggle.addEventListener('click',()=>setPanel(panel.hidden));
  document.addEventListener('click',event=>{if(!event.target.closest('#navViewerBadge'))setPanel(false);});
  document.addEventListener('keydown',event=>{if(event.key==='Escape'&&!panel.hidden){setPanel(false);toggle.focus();}});
  const links=[...document.querySelectorAll('.capsule-item')];
  const sections=links.map(link=>document.querySelector(link.hash)).filter(Boolean);
  let pending=false;
  function updateNavigation(){pending=false;let active='';for(const section of sections){if(section.getBoundingClientRect().top<=180)active='#'+section.id;}links.forEach(link=>{const current=link.hash===active;link.classList.toggle('active',current);if(current)link.setAttribute('aria-current','location');else link.removeAttribute('aria-current');});}
  addEventListener('scroll',()=>{if(!pending){pending=true;requestAnimationFrame(updateNavigation);}},{passive:true});updateNavigation();
  const input=document.getElementById('yellowAgentInput');input?.setAttribute('aria-label','Ask Jatin’s portfolio guide');
  if(matchMedia('(prefers-reduced-motion: reduce)').matches)document.getElementById('dockVideo')?.pause();
});
