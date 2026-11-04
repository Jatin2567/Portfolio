/* Install this script beside page-knowledge.js, local-guide-voice.js and page-guide.css. */
(() => {
  'use strict';
  if (customElements.get('local-page-guide')) return;
  const widgetScript = new URL(document.currentScript.src);
  const stylesheet = new URL('page-guide.css', widgetScript);
  stylesheet.search = widgetScript.search;
  const grant = '[data-guide-source]';
  const excluded = '[data-private],[data-guide-private],[data-guide-ignore],[hidden],[inert],[aria-hidden="true" i],nav,[role="navigation"],form,template,local-page-guide';

  function canRead(element) {
    if (!element.isConnected || element.closest(excluded)) return false;
    for (let current = element; current; current = current.parentElement) {
      const style = getComputedStyle(current);
      if (style.display === 'none' || style.visibility === 'hidden' || style.visibility === 'collapse') return false;
    }
    return true;
  }

  function localAsset(value) {
    if (!value) return '';
    try {
      const url = new URL(value, document.baseURI);
      if (url.origin === location.origin && ['http:', 'https:', 'file:'].includes(url.protocol)) return url.href;
    } catch { /* An optional avatar may be omitted on other pages. */ }
    return '';
  }

  const icons = {
    mic: '<rect x="9" y="2" width="6" height="12" rx="3"/><path d="M5 10a7 7 0 0 0 14 0M12 17v5m-4 0h8"/>',
    audio: '<path d="m3 9 4 0 5-4v14l-5-4H3zM16 8a6 6 0 0 1 0 8m3-11a10 10 0 0 1 0 14"/>',
    send: '<path d="m5 12 14 0m-6-6 6 6-6 6"/>',
    close: '<path d="m6 6 12 12M18 6 6 18"/>'
  };
  const icon = name => '<svg aria-hidden="true" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.8" stroke-linecap="round" stroke-linejoin="round">'+icons[name]+'</svg>';

  class LocalPageGuide extends HTMLElement {
    connectedCallback() {
      const shadow = this.shadowRoot || this.attachShadow({ mode: 'open' });
      shadow.innerHTML = `
        <section aria-label="Page guide" class="widget">
          <section id="conversation" class="panel" aria-label="Conversation" hidden>
            <header class="panel-header">
              <strong class="guide-title">Page guide</strong><span class="local-label">On this device</span>
              <button class="close" type="button" aria-label="Close guide">${icon('close')}</button>
            </header>
            <div class="reading-area">
              <details class="access"><summary>What this guide can read</summary><p></p></details>
              <div class="intro"><p class="welcome"></p><div class="suggestions" role="group" aria-label="Conversation starters"></div></div>
              <div class="turns" role="log" aria-label="Conversation history" aria-live="polite" aria-relevant="additions"></div>
              <div class="next" hidden><p class="choice-label">Ask next</p><div class="followups" role="group" aria-label="Suggested next questions"></div></div>
            </div>
            <div class="panel-foot">
              <span class="voice-status" role="status"></span>
              <button class="stop" type="button" hidden>Stop speaking</button>
              <button class="install" type="button" hidden>Download English voice input</button>
              <button class="reset" type="button" hidden>Clear chat</button>
            </div>
          </section>
          <form class="dock" autocomplete="off">
            <button class="avatar" type="button" aria-label="Open page guide" aria-controls="conversation" aria-expanded="false"><span aria-hidden="true">?</span></button>
            <div class="composer">
              <input type="text" aria-label="Ask about this page" placeholder="Ask about this page…" maxlength="400" enterkeyhint="send" autocomplete="off">
              <div class="actions">
                <button class="sound" type="button" aria-label="Mute spoken replies" title="Mute spoken replies" aria-pressed="true">${icon('audio')}</button>
                <button class="mic" type="button" aria-label="Ask by voice" title="Ask by voice" aria-pressed="false">${icon('mic')}</button>
                <button class="send" type="submit" aria-label="Send question" title="Send question">${icon('send')}</button>
              </div>
            </div>
          </form>
        </section>`;
      const css = document.createElement('link');
      css.rel = 'stylesheet';
      css.href = stylesheet.href;
      shadow.prepend(css);

      const find = selector => shadow.querySelector(selector);
      find('.guide-title').textContent = this.dataset.title || 'Page guide';
      const panel = find('.panel');
      const input = find('input');
      const avatar = find('.avatar');
      const turns = find('.turns');
      const status = find('.voice-status');
      const microphone = find('.mic');
      const speaker = find('.sound');
      const reset = find('.reset');
      const stop = find('.stop');
      const install = find('.install');
      const events = new AbortController();
      const on = (element, event, handler) => element.addEventListener(event, handler, { signal: events.signal });
      const motion = matchMedia('(prefers-reduced-motion: reduce)');
      const videoUrl = localAsset(this.dataset.video);
      const posterUrl = localAsset(this.dataset.poster);
      let video;
      if (videoUrl) {
        video = document.createElement('video');
        video.muted = true;
        video.defaultMuted = true;
        video.playsInline = true;
        video.loop = true;
        video.preload = 'metadata';
        video.setAttribute('aria-hidden', 'true');
        if (posterUrl) video.poster = posterUrl;
        video.src = videoUrl;
        avatar.replaceChildren(video);
      }
      function animateAvatar() {
        if (document.hidden || motion.matches) video?.pause();
        else video?.play().catch(() => {});
      }
      animateAvatar();
      on(motion, 'change', animateAvatar);

      let muted = false;
      let previous = null;
      let roots = [];
      let route = location.pathname + location.search;
      let returnFocus = avatar;
      const voice = window.createLocalGuideVoice({
        onStatus: message => { status.textContent = message; },
        onInstallOffer: offered => { install.hidden = !offered; },
        onListening: active => {
          microphone.setAttribute('aria-pressed', String(active));
          microphone.title = active ? 'Stop listening' : 'Ask by voice';
          microphone.setAttribute('aria-label', microphone.title);
        },
        onTranscript: (words, final) => {
          input.value = words.slice(0, 400);
          if (final) submit(input.value);
        },
        onSpeaking: active => {
          avatar.classList.toggle('speaking', active);
          stop.hidden = !active;
        }
      });

      function clearChat() {
        voice.cancel();
        previous = null;
        input.value = '';
        turns.replaceChildren();
        find('.intro').hidden = false;
        find('.suggestions').replaceChildren();
        find('.next').hidden = true;
        find('.followups').replaceChildren();
        input.placeholder = 'Ask about this page…';
        reset.hidden = true;
        status.textContent = '';
      }

      function syncGrants() {
        const next = Array.from(document.querySelectorAll(grant)).filter(canRead);
        const url = location.pathname + location.search;
        if (route !== url || roots.length !== next.length || next.some((root, i) => root !== roots[i])) {
          clearChat();
        }
        roots = next;
        route = url;
        const names = roots.map(root => root.dataset.guideSource.trim() || root.getAttribute('aria-label') || root.id).filter(Boolean);
        find('.access p').textContent = roots.length
          ? 'My answers come from ' + (names.join(', ') || 'the shared text') + ' on this page. Private areas, form entries and linked pages are outside my scope.'
          : 'This page has not shared any sections with the guide.';
        find('.welcome').textContent = roots.length ? 'Where would you like to start?' : 'There’s no shared page content to explore yet.';
      }

      function showChoices(container, questions) {
        container.replaceChildren();
        for (const question of questions) {
          const button = document.createElement('button');
          button.type = 'button';
          button.dataset.action = question === 'Give me an overview' ? 'overview' : 'ask';
          button.textContent = question;
          container.append(button);
        }
      }

      function renderChoices(index) {
        const lastTurn = turns.lastElementChild;
        if (!lastTurn) {
          const starters = roots.length ? ['Give me an overview', ...index.starters().slice(0, 2)] : [];
          showChoices(find('.suggestions'), starters);
          return;
        }
        const lastQuestion = lastTurn.querySelector('.question').textContent;
        const next = previous ? index.followUps(previous) : index.starters();
        const options = next.filter(question => question !== lastQuestion || /^tell me more$/i.test(question)).slice(0, 2);
        const continuing = previous && options.length > 0;
        if (roots.length && !options.length && lastQuestion !== 'Give me an overview') options.push('Give me an overview');
        find('.choice-label').textContent = continuing ? 'Ask next' : previous ? 'Explore another topic' : 'Try another question';
        showChoices(find('.followups'), options);
        find('.next').hidden = !options.length;
      }

      const setExpanded = (expanded, showPrompts = true) => {
        panel.hidden = !expanded;
        avatar.setAttribute('aria-expanded', String(expanded));
        avatar.setAttribute('aria-label', expanded ? 'Focus guide question' : 'Open page guide');
        document.querySelectorAll('[data-open-page-guide]').forEach(button => {
          if (button.getAttribute('aria-controls') === this.id) button.setAttribute('aria-expanded', String(expanded));
        });
        if (expanded) {
          syncGrants();
          const index = window.PageKnowledge.create({ roots });
          if (showPrompts) renderChoices(index);
          if (!status.textContent && !turns.childElementCount) status.textContent = 'Type a question or tap the mic to speak.';
          return index;
        } else { voice.cancel(); status.textContent = ''; }
      };
      const open = (focus = true, showPrompts = true) => {
        const index = setExpanded(true, showPrompts);
        if (focus) input.focus({ preventScroll: true });
        return index;
      };
      const close = (focus = false) => {
        setExpanded(false);
        if (focus) (returnFocus?.isConnected ? returnFocus : avatar).focus({ preventScroll: true });
      };

      function sourceLink(source) {
        if (!source?.href || !source.label) return;
        let url;
        try { url = new URL(source.href, document.baseURI); } catch { return; }
        const onPage = source.href.startsWith('#');
        if (onPage) {
          let target;
          try { target = document.getElementById(decodeURIComponent(url.hash.slice(1))); } catch { return; }
          if (!target || !roots.some(root => root.contains(target)) || !canRead(target)) return;
        } else if (!['https:', 'http:', 'mailto:', 'tel:'].includes(url.protocol) && !(location.protocol === 'file:' && url.protocol === 'file:')) return;
        const link = document.createElement('a');
        const label = source.label.replace(/\s*↗\s*$/, '');
        link.textContent = label;
        link.href = url.href;
        if (!onPage && url.protocol !== 'mailto:' && url.protocol !== 'tel:') {
          link.target = '_blank';
          link.rel = 'noopener noreferrer';
          link.setAttribute('aria-label', label + ' (opens in a new tab)');
          const arrow = document.createElement('span');
          arrow.setAttribute('aria-hidden', 'true');
          arrow.textContent = ' ↗';
          link.append(arrow);
        }
        return link;
      }

      function showSources(container, sources) {
        const page = [];
        const related = [];
        for (const source of sources || []) {
          const link = sourceLink(source);
          if (link) (source.href.startsWith('#') ? page : related).push(link);
        }
        for (const [name, links] of [['On this page', page], ['Related links', related]]) {
          if (!links.length) continue;
          const group = document.createElement('div');
          group.className = 'source-group';
          group.setAttribute('role', 'group');
          group.setAttribute('aria-label', name);
          const caption = document.createElement('span');
          caption.className = 'source-label';
          caption.textContent = name;
          group.append(caption, ...links);
          container.append(group);
        }
      }

      function addTurn(question, result) {
        const turn = document.createElement('article');
        const prompt = document.createElement('p');
        prompt.className = 'question';
        prompt.textContent = question;
        const answer = document.createElement('p');
        answer.className = 'answer';
        answer.textContent = result.text;
        const links = document.createElement('div');
        links.className = 'sources';
        showSources(links, result.sources);
        turn.append(prompt, answer, links);
        turns.append(turn);
        if (turns.childElementCount > 6) turns.firstElementChild.remove();
        find('.intro').hidden = true;
        reset.hidden = false;
        return turn;
      }

      function submit(raw, action = 'ask') {
        const question = raw.trim().slice(0, 400);
        // Build a fresh index from the current grants exactly once for this turn.
        const index = open(false, false);
        if (!question) { input.focus(); return; }
        voice.cancel();
        let result;
        if (!roots.length) result = { matched: false, text: 'This page hasn’t shared any content with me yet.', sources: [] };
        else if (action === 'overview') result = index.overview();
        else result = index.ask(question, { previous });
        previous = result.matched ? result.context : null;
        const turn = addTurn(question, result);
        renderChoices(index);
        const reader = find('.reading-area');
        reader.scrollTop += turn.getBoundingClientRect().top - reader.getBoundingClientRect().top - 8;
        input.value = '';
        input.placeholder = 'Ask a follow-up…';
        status.textContent = muted ? 'Replies are muted.' : '';
        if (!muted) voice.speak(result.text);
      }

      on(find('form'), 'submit', event => { event.preventDefault(); submit(input.value); });
      on(avatar, 'click', () => { returnFocus = avatar; open(); });
      on(input, 'focus', () => { if (panel.hidden) open(false); });
      // A typed edit takes over from a pending microphone or spoken answer.
      on(input, 'input', () => { voice.cancel(); status.textContent = ''; });
      on(microphone, 'click', () => {
        open(false);
        if (roots.length) voice.listen();
        else status.textContent = 'This page hasn’t shared any content with me yet.';
      });
      on(install, 'click', () => voice.install());
      on(stop, 'click', event => {
        voice.cancel();
        status.textContent = 'Playback stopped.';
        if (event.detail === 0) input.focus({ preventScroll: true });
      });
      on(speaker, 'click', () => {
        open(false);
        muted = !muted;
        voice.setMuted(muted);
        speaker.setAttribute('aria-pressed', String(!muted));
        speaker.setAttribute('aria-label', muted ? 'Enable spoken replies' : 'Mute spoken replies');
        speaker.title = speaker.getAttribute('aria-label');
        status.textContent = muted ? 'Spoken replies are muted.' : 'Spoken replies are on when a local masculine English voice is available.';
      });
      on(find('.close'), 'click', () => close(true));
      on(reset, 'click', () => { clearChat(); open(); });
      function chooseQuestion(event) {
        const button = event.target.closest('button');
        if (!button) return;
        submit(button.textContent, button.dataset.action);
        if (event.detail === 0) input.focus({ preventScroll: true });
      }
      on(find('.suggestions'), 'click', chooseQuestion);
      on(find('.followups'), 'click', chooseQuestion);
      on(turns, 'click', event => {
        const link = event.target.closest('a');
        if (!link || !link.hash || link.origin !== location.origin || link.pathname !== location.pathname || link.target ||
            event.ctrlKey || event.metaKey || event.shiftKey || event.altKey) return;
        const target = document.getElementById(decodeURIComponent(link.hash.slice(1)));
        close();
        if (!target || !roots.some(root => root.contains(target)) || !canRead(target)) return;
        if (!target.hasAttribute('tabindex') && target.tabIndex < 0) {
          target.setAttribute('tabindex', '-1');
          target.addEventListener('blur', () => target.removeAttribute('tabindex'), { once: true });
        }
        target.focus({ preventScroll: true });
      });
      on(document, 'click', event => {
        if (event.composedPath().includes(this)) return;
        const button = event.target.closest?.('[data-open-page-guide]');
        if (button && button.getAttribute('aria-controls') === this.id) { returnFocus = button; open(); }
        else if (!panel.hidden) close();
      });
      on(document, 'keydown', event => {
        if (event.key === 'Escape' && !panel.hidden) { close(true); return; }
        const target = event.composedPath()[0];
        if (event.key !== '/' || event.ctrlKey || event.metaKey || event.altKey || event.isComposing ||
          target?.closest?.('input, textarea, select, [contenteditable]:not([contenteditable="false"])') ||
          document.querySelector('local-page-guide') !== this) return;
        event.preventDefault();
        returnFocus = document.activeElement instanceof HTMLElement && document.activeElement !== document.body ? document.activeElement : avatar;
        open();
      });
      on(document, 'visibilitychange', () => { animateAvatar(); if (document.hidden) voice.cancel(); });
      on(window, 'pagehide', () => clearChat());
      on(window, 'popstate', () => { if (!panel.hidden) open(false); });

      // A host can revoke a sharing marker while the panel is open. Drop previous turns and stop audio.
      const changes = new MutationObserver(records => {
        if (panel.hidden && !turns.childElementCount) return;
        const accessChanged = records.some(record => {
          if (record.type === 'attributes') return record.target.matches(grant) || record.attributeName === 'data-guide-source' ||
            roots.some(root => root.contains(record.target) || record.target.contains(root));
          return [...record.addedNodes, ...record.removedNodes].some(node =>
            node.nodeType === 1 && (node.matches(grant) || node.querySelector(grant)));
        });
        if (accessChanged) {
          clearChat();
          if (!panel.hidden) open(false);
          else syncGrants();
        }
      });
      changes.observe(document.documentElement, { subtree: true, childList: true, attributes: true,
        attributeFilter: ['data-guide-source','data-private','data-guide-private','data-guide-ignore','hidden','inert','aria-hidden'] });
      this.cleanup = () => { events.abort(); changes.disconnect(); voice.destroy(); video?.pause(); };
    }
    disconnectedCallback() { this.cleanup?.(); }
  }
  customElements.define('local-page-guide', LocalPageGuide);
})();
