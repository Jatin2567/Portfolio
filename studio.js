document.addEventListener('DOMContentLoaded', () => {
  const toggle=document.getElementById('viewerToggle');
  const panel=document.getElementById('viewerPopover');
  function setPanel(open){panel.hidden=!open;toggle.setAttribute('aria-expanded',String(open));}
  toggle.addEventListener('click',()=>setPanel(panel.hidden));
  document.addEventListener('click',event=>{if(!event.target.closest('#navViewerBadge'))setPanel(false);});
  document.addEventListener('keydown',event=>{if(event.key==='Escape'&&!panel.hidden){setPanel(false);toggle.focus();}});
  const links=[...document.querySelectorAll('.capsule-item')];
  const sections=links.map(link=>document.querySelector(link.hash)).filter(Boolean);
  const header = document.querySelector('.top-nav');
  const footer = document.getElementById('contact');
  const root = document.documentElement;
  if (header && 'ResizeObserver' in window) {
    new ResizeObserver(() => root.style.setProperty('--nav-offset', Math.ceil(header.getBoundingClientRect().height + 6) + 'px')).observe(header);
  }
  root.classList.toggle('motion-suspended', document.hidden);
  const reducedMotion = matchMedia('(prefers-reduced-motion: reduce)');
  const desktopMotion = matchMedia('(min-width: 900px)');
  const pointerDepth = matchMedia('(min-width: 900px) and (hover: hover) and (pointer: fine) and (prefers-reduced-motion: no-preference)');
  const heroScene = document.querySelector('.hero-scene');
  const skills = document.getElementById('stack');
  const projects = document.getElementById('projects');
  const reader = projects?.querySelector('.work-reader');
  const entries = [...(reader?.querySelectorAll('a[href^="#"]') || [])].map(link => ({
    link, card: document.getElementById(link.hash.slice(1))
  })).filter(entry => entry.card);
  const picker = document.createElement('select');
  const clamp = value => Math.max(0, Math.min(1, value));

  if (reader && entries.length) {
    picker.setAttribute('aria-label', 'Jump to a project');
    entries.forEach(({ link, card }, index) => {
      const label = card.querySelector('h3')?.textContent || link.textContent;
      picker.add(new Option(String(index + 1).padStart(2, '0') + ' · ' + label, card.id));
      card.tabIndex = -1;
    });
    picker.addEventListener('change', () => {
      const target = entries.find(entry => entry.card.id === picker.value)?.card;
      if (!target) return;
      location.hash = target.id;
      // A picker selection is a jump, even if an earlier anchor scroll is still running.
      target.scrollIntoView({ block: 'start', behavior: 'instant' });
      target.focus({ preventScroll: true });
    });
    reader.append(picker);
    reader.classList.add('has-picker');
  }
  const visibleMedia = new Set();
  let pending = false;

  if (footer) {
    const particles = document.createElement('div');
    particles.className = 'footer-particles';
    particles.setAttribute('aria-hidden', 'true');
    for (let index = 0; index < 24; index += 1) {
      const particle = document.createElement('i');
      particle.style.left = `${(index * 37 + 9) % 100}%`;
      particle.style.top = `${(index * 23 + 7) % 100}%`;
      particle.style.setProperty('--star-duration', `${12 + index % 7}s`);
      particle.style.setProperty('--star-delay', `${index * -0.8}s`);
      particles.append(particle);
    }
    footer.prepend(particles);
  }

  function updateProjectIndex(navEdge) {
    if (!entries.length) return;
    const region = projects.getBoundingClientRect();
    if (region.bottom <= 0 || region.top >= innerHeight) return;
    const bounds = entries.map(entry => entry.card.getBoundingClientRect());
    const line = Math.min(innerHeight * .65, navEdge + reader.offsetHeight + Math.min(145, innerHeight * .18));
    let current = 0;
    bounds.forEach((rect, i) => {
      if (rect.top > line + 1) return;
      // The final two projects share a desktop row. A direct link chooses either one.
      if (rect.top > bounds[current].top + 2 || entries[i].link.hash === location.hash) current = i;
    });
    entries.forEach(({ link, card }, i) => {
      const focused = Math.abs(bounds[i].top - bounds[current].top) <= 2;
      card.classList.toggle('in-reading-focus', focused);
      if (i === current) link.setAttribute('aria-current', 'location');
      else link.removeAttribute('aria-current');
      if (focused && !reducedMotion.matches) {
        card.style.setProperty('--work-progress', clamp((line - bounds[i].top) / Math.max(1, bounds[i].height)).toFixed(3));
      }
    });
    const activeId = entries[current].card.id;
    if (picker.value !== activeId) picker.value = activeId;
  }

  function updateScenery() {
    if (heroScene) {
      const box = heroScene.getBoundingClientRect();
      if (box.top <= innerHeight && box.bottom >= 0) {
        const wide = desktopMotion.matches;
        const travel = wide ? clamp(-box.top / Math.max(1, box.height)) : 2 * clamp((innerHeight - box.top) / (innerHeight + box.height)) - 1;
        heroScene.style.setProperty('--sky-offset', (travel * (wide ? 18 : 10)).toFixed(2) + 'px');
        heroScene.style.setProperty('--rail-x', (-travel * (wide ? 13 : 4)).toFixed(2) + 'px');
        heroScene.style.setProperty('--rail-y', (-travel * (wide ? 12 : 5)).toFixed(2) + 'px');
      }
    }
    if (footer) {
      const box = footer.getBoundingClientRect();
      if (box.top <= innerHeight && box.bottom >= 0) {
        const remaining = clamp((box.bottom - innerHeight) / Math.max(1, box.height));
        footer.style.setProperty('--sky-offset', (remaining * 6).toFixed(2) + 'px');
        footer.style.setProperty('--roof-offset', (remaining * (desktopMotion.matches ? 18 : 9)).toFixed(2) + 'px');
      }
    }
  }

  function updateScrollScene() {
    pending = false;
    if (document.hidden) return;
    let active = '';
    const navBottom = header?.getBoundingClientRect().bottom ?? 0;
    const navEdge = navBottom + 36;
    for (const section of sections) {
      if (section.getBoundingClientRect().top <= navEdge) active = '#' + section.id;
    }
    links.forEach(link => {
      const current = link.hash === active;
      link.classList.toggle('active', current);
      if (current) link.setAttribute('aria-current', 'location');
      else link.removeAttribute('aria-current');
    });
    header?.classList.toggle('in-contact', active === '#contact');
    header?.classList.toggle('in-journal', active === '#projects');
    const scrollRange = root.scrollHeight - innerHeight;
    root.style.setProperty('--page-progress', scrollRange > 0 ? Math.max(0, Math.min(1, scrollY / scrollRange)).toFixed(4) : '0');
    updateProjectIndex(navBottom);
    if (reducedMotion.matches) return;
    updateScenery();
    if (desktopMotion.matches) {
      visibleMedia.forEach(media => {
        const rect = media.getBoundingClientRect();
        const progress = (innerHeight / 2 - rect.top - rect.height / 2) / innerHeight;
        media.style.setProperty('--media-drift', `${Math.max(-10, Math.min(10, progress * 20)).toFixed(1)}px`);
      });
    }
  }

  function queueScrollScene() {
    if (pending) return;
    pending = true;
    requestAnimationFrame(updateScrollScene);
  }

  // One observer reveals content once; hover transforms remain independent.
  const revealTargets = [...document.querySelectorAll(
    '.section-title-box, .timeline-row, .skills-context'
  )];
  let revealObserver;
  function configureReveals() {
    revealObserver?.disconnect();
    if (reducedMotion.matches || !('IntersectionObserver' in window)) {
      root.classList.remove('motion-ready');
      return;
    }
    revealObserver = new IntersectionObserver(entries => {
      entries.forEach(entry => {
        if (!entry.isIntersecting) return;
        entry.target.classList.add('is-visible');
        revealObserver.unobserve(entry.target);
      });
    }, { threshold: 0.06, rootMargin: '0px 0px -32px 0px' });
    revealTargets.forEach((target, index) => {
      target.classList.add('scroll-reveal');
      target.style.setProperty('--reveal-delay', `${(index % 4) * 45}ms`);
      if (!target.classList.contains('is-visible')) revealObserver.observe(target);
    });
    root.classList.add('motion-ready');
  }
  configureReveals();

  // Track only on-screen artwork rather than running a continuous animation loop.
  if ('IntersectionObserver' in window) {
    const mediaObserver = new IntersectionObserver(entries => {
      entries.forEach(entry => {
        if (entry.target === footer || entry.target === skills) {
          entry.target.classList.toggle('ambient-active', entry.isIntersecting);
        }
        else if (entry.isIntersecting) visibleMedia.add(entry.target);
        else visibleMedia.delete(entry.target);
      });
      queueScrollScene();
    }, { rootMargin: '80px 0px' });
    document.querySelectorAll('.broad-col-media').forEach(media => mediaObserver.observe(media));
    if (footer) mediaObserver.observe(footer);
    if (skills) mediaObserver.observe(skills);
  }

  // Animate only numbers already stated in the portfolio, once on entry.
  const counters = [...document.querySelectorAll('[data-count]')];
  const counterFrames = new Map();
  if ('IntersectionObserver' in window) {
    const counterObserver = new IntersectionObserver(entries => {
      entries.forEach(entry => {
        if (!entry.isIntersecting) return;
        counterObserver.unobserve(entry.target);
        if (reducedMotion.matches) return;
        const element = entry.target;
        const value = Number(element.dataset.count);
        const started = performance.now();
        function tick(now) {
          const progress = Math.min(1, (now - started) / 950);
          element.textContent = Math.round(value * (1 - Math.pow(1 - progress, 3)));
          if (progress < 1) counterFrames.set(element, requestAnimationFrame(tick));
          else counterFrames.delete(element);
        }
        counterFrames.set(element, requestAnimationFrame(tick));
      });
    }, { threshold: 0.5 });
    counters.forEach(counter => counterObserver.observe(counter));
  }

  // Sample only the surface under the pointer. Nothing runs between pointer events.
  const pointerUpdates = new Map();
  let pointerFrame = 0;
  function clearView(element) {
    pointerUpdates.delete(element);
    element.classList.remove('is-tilting');
    element.style.removeProperty('--view-x');
    element.style.removeProperty('--view-y');
  }
  function clearPointerDepth() {
    cancelAnimationFrame(pointerFrame);
    pointerFrame = 0;
    pointerUpdates.clear();
    document.querySelectorAll('.is-tilting').forEach(clearView);
  }
  function renderPointerDepth() {
    pointerFrame = 0;
    if (!pointerDepth.matches || document.hidden) return clearPointerDepth();
    for (const [element, point] of pointerUpdates) {
      const box = element.getBoundingClientRect();
      if (!box.width || !box.height) continue;
      const x = 2 * clamp((point.x - box.left) / box.width) - 1;
      const y = 2 * clamp((point.y - box.top) / box.height) - 1;
      element.style.setProperty('--view-x', x.toFixed(3));
      element.style.setProperty('--view-y', y.toFixed(3));
      element.classList.add('is-tilting');
    }
    pointerUpdates.clear();
  }
  document.querySelectorAll('.hero-spread, .preview-media-frame, .skill-item').forEach(element => {
    element.addEventListener('pointermove', event => {
      if (!pointerDepth.matches || event.pointerType === 'touch' || document.hidden) return;
      pointerUpdates.set(element, { x: event.clientX, y: event.clientY });
      if (!pointerFrame) pointerFrame = requestAnimationFrame(renderPointerDepth);
    }, { passive: true });
    element.addEventListener('pointerleave', () => clearView(element));
    element.addEventListener('pointercancel', () => clearView(element));
  });
  pointerDepth.addEventListener('change', clearPointerDepth);
  reducedMotion.addEventListener('change', () => {
    configureReveals();
    if (reducedMotion.matches) {
      counterFrames.forEach(frame => cancelAnimationFrame(frame));
      counterFrames.clear();
      counters.forEach(counter => { counter.textContent = counter.dataset.count; });
    }
    queueScrollScene();
  });
  addEventListener('scroll', queueScrollScene, { passive: true });
  addEventListener('resize', queueScrollScene, { passive: true });
  addEventListener('hashchange', queueScrollScene);
  projects?.addEventListener('toggle', queueScrollScene, true);
  document.addEventListener('visibilitychange', () => {
    root.classList.toggle('motion-suspended', document.hidden);
    if (document.hidden) clearPointerDepth();
    queueScrollScene();
  });
  queueScrollScene();
});
