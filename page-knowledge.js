/* Local, read-only Q&A over explicitly selected public page content. */
(() => {
  'use strict';

  const excluded = [
    'script, style, template, noscript, svg, canvas, iframe, object, embed, video, audio',
    'form, input, select, textarea, button, [contenteditable]:not([contenteditable="false"])',
    'nav, [role="navigation"], [hidden], [inert], [aria-hidden="true" i]',
    '[data-private], [data-guide-private], [data-guide-ignore], [data-guide-widget], [data-page-guide], local-page-guide, #yellowAgentContainer',
    '.sr-only, .visually-hidden, .screen-reader-only'
  ].join(', ');
  const headings = 'h1, h2, h3, h4, h5, h6';
  const regions = 'section, footer, main, [data-guide-section], [data-guide-source]';
  const entries = 'article, .card-item-warm, .timeline-row, .skill-item, [data-guide-item]';
  const facts = 'p, li, dt, dd, figcaption, [data-guide-fact], .meta-entry, .seeking-banner, .kicker-tag, .footer-meta-text, .comp-name, .comp-date, .skill-use, .caption-sub';
  const list = value => value == null ? [] : typeof value === 'string' || value.nodeType ? [value] : Array.from(value);
  const clean = value => String(value || '').replace(/\s+/g, ' ').trim();
  const normalize = value => clean(value).normalize('NFKD').replace(/\p{M}/gu, '').toLowerCase().replace(/[’']/g, '').replace(/[^\p{L}\p{N}+#]+/gu, ' ').trim();
  const words = value => normalize(value).split(' ').filter(Boolean);
  const stop = new Set(words('a an the to on at of from in and or for with about by as this that these those me my you your yours he his she her they their them it its is are was were be been being do does did has have had can could would should will i we what who which why how where when tell give show please describe explain learn know there here more details detail any all list overview summary summarize summarise page site website portfolio mentioned listed using use uses built building build made make making developed work works used someone something another also exactly briefly brief information some').concat(['s']));
  const scopes = {
    projects: /\b(projects?|selected work|case studies|portfolio pieces)\b/,
    skills: /\b(skills?|tools?|stack|technolog(?:y|ies)|toolkit|tech)\b/,
    experience: /\b(experience|roles?|jobs?|employment|career|work history)\b/,
    contact: /\b(contact|reach|get in touch|lets talk)\b/,
    about: /\b(about|intro|introduction|bio|biography)\b/
  };
  function typeOf(value) {
    return Object.keys(scopes).find(key => scopes[key].test(normalize(value))) || '';
  }
  const joinNames = items => items.length < 2 ? (items[0] || '') : items.slice(0, -1).join(', ') + ' and ' + items.at(-1);
  const unknown = () => ({
    matched: false, text: 'I couldn’t find that on this page. Try asking about one of its headings.',
    sources: [], context: null
  });

  function permittedLink(anchor) {
    const raw = clean(anchor.getAttribute('href'));
    if (!raw || raw === '#' || /[\u0000-\u001f\u007f]/.test(raw)) return '';
    try {
      const base = new URL(anchor.ownerDocument.baseURI);
      const url = new URL(raw, base);
      if (raw.startsWith('#')) return raw;
      if (/^https?:$/.test(url.protocol) && !url.username && !url.password) return url.href;
      if (/^(mailto|tel):$/.test(url.protocol)) return url.href;
      if (url.protocol === 'file:' && base.protocol === 'file:' && !/^[a-z][a-z\d+.-]*:|^[\\/]|%2f|%5c/i.test(raw) &&
          url.href.startsWith(new URL('./', base).href)) return raw;
    } catch { /* The page can contain incomplete or unsupported links. */ }
    return '';
  }

  function readPage(roots, exclusions) {
    const deniedNodes = exclusions.filter(item => item?.nodeType === 1);
    const deniedSelectors = exclusions.filter(item => typeof item === 'string');
    const hidden = new WeakMap();
    const textCache = new WeakMap();
    function publicNode(node) {
      if (!node) return true;
      if (hidden.has(node)) return !hidden.get(node);
      let blocked = node.matches(excluded) || deniedNodes.includes(node) || deniedSelectors.some(selector => node.matches(selector)) || !publicNode(node.parentElement);
      if (!blocked) {
        const style = node.ownerDocument.defaultView?.getComputedStyle(node);
        blocked = style?.display === 'none' || ['hidden', 'collapse'].includes(style?.visibility) ||
          style?.contentVisibility === 'hidden' || (style?.opacity === '0' && !node.matches('.scroll-reveal, .read-word, .name-letter'));
      }
      hidden.set(node, blocked);
      return !blocked;
    }
    function content(node) {
      if (!node || !publicNode(node)) return '';
      if (textCache.has(node)) return textCache.get(node);
      // Preserve inline words broken up by animation spans or <strong>.
      // Native <details> content is public even when its disclosure is closed.
      const fragments = [];
      for (const child of node.childNodes) {
        if (child.nodeType === 3) fragments.push(child.data);
        else if (child.nodeType === 1) {
          const breaks = child.matches('br, p, li, div, section, dt, dd');
          fragments.push(breaks ? ' ' + content(child) + ' ' : content(child));
        }
      }
      const value = fragments.join('');
      textCache.set(node, value);
      return value;
    }
    const label = node => clean(node?.getAttribute('aria-label') || content(node));
    const records = [];
    function make(node, title, section) {
      const record = { title, node, section: section || null, facts: [], tags: [], links: [] };
      records.push(record);
      return record;
    }
    const nameIn = (node, selector, boundary) => [...node.querySelectorAll(selector)].find(el =>
      publicNode(el) && el.parentElement.closest(boundary) === node);
    // Plain author-written prose may be directly inside a div with inline emphasis.
    // Keep its inline words together without pulling in text from neighboring subjects.
    const proseBlocks = 'div, section, article, main, footer, header, aside, blockquote, address, pre, td, th, ul, ol, dl, details';
    function looseFacts(node) {
      const lines = [];
      let fragment = '';
      function flush() { if (clean(fragment)) lines.push(clean(fragment)); fragment = ''; }
      for (const child of node.childNodes) {
        if (child.nodeType === 3) fragment += child.data;
        else if (child.nodeType === 1 && child.matches(proseBlocks + ', ' + headings + ', ' + facts + ', a, summary, br')) flush();
        else if (child.nodeType === 1) fragment += content(child);
      }
      flush();
      return lines;
    }
    const covered = new Set();
    function scan(node, root, region, state) {
      if (!publicNode(node) || covered.has(node)) return;
      covered.add(node);
      if (node !== root && node.matches(entries) && !node.matches('[data-guide-source]')) {
        const titleNode = nameIn(node, '[data-guide-title], .skill-name, ' + headings, entries);
        const title = titleNode ? label(titleNode) : clean(node.getAttribute('aria-label'));
        if (title) {
          state = { item: make(node, title, region), titleNode, fixed: true };
          state.item.headingId = titleNode?.id;
        }
      } else if (node === root || node.matches(regions)) {
        const titleNode = [...node.querySelectorAll(headings)].find(el => {
          const owner = el.parentElement.closest(regions);
          return publicNode(el) && !el.parentElement.closest(entries) && (!owner || owner === node || !node.contains(owner));
        });
        const title = clean(node.getAttribute('data-guide-source')) || (titleNode && label(titleNode)) || clean(node.getAttribute('aria-label')) || node.id || 'Page content';
        region = make(node, title, null);
        region.headingId = titleNode?.id;
        region.kind = typeOf(node.id + ' ' + title);
        state = { item: region, titleNode, fixed: false };
      }
      if (!state) return;
      if (node.matches(headings) && node !== state.titleNode) {
        if (!state.fixed && label(node)) state.item = make(node, label(node), region);
        return;
      }
      const item = state.item;
      if (node.matches('a[href]')) {
        const href = permittedLink(node);
        const name = clean(content(node)) || clean(node.getAttribute('aria-label'));
        if (href && name && !item.links.some(link => link.href === href)) item.links.push({label: name, href});
      } else if (node.matches('.card-stack-pill, [data-guide-tag]')) {
        const value = clean(content(node));
        if (value) item.tags.push(value);
      } else if ((node !== item.node || node === root) && node.matches(facts)) {
        const value = clean(content(node));
        if (value && !item.facts.includes(value)) item.facts.push(value);
        if (node.matches('.comp-name')) item.employer = value;
        if (node.matches('.comp-date')) item.dates = value;
      } else if (node !== state.titleNode && (node === root || node.matches(proseBlocks)) &&
          !node.closest(facts + ', a, summary, .card-stack-row, .accent-sub, .card-top-tag, .skills-gallery, .preview-media-caption, ' + headings)) {
        for (const value of looseFacts(node)) if (!item.facts.includes(value)) item.facts.push(value);
      }
      for (const child of node.children) scan(child, root, region, state);
    }
    roots.forEach(root => { if (root.isConnected) scan(root, root, null, null); });
    for (const item of records) {
      item.kind = item.kind || item.section?.kind || '';
      const section = item.section || item;
      // Do not change host IDs just to supply a citation.
      const anchorId = item.node.id || item.headingId || section.node.id || section.headingId;
      item.anchor = anchorId ? '#' + encodeURIComponent(anchorId) : '';
      item.key = item.node.id || item.title;
      item.sectionId = section.node.id || section.title;
      item.links = item.links.filter(link => {
        if (!link.href.startsWith('#')) return true;
        try {
          const target = item.node.ownerDocument.getElementById(decodeURIComponent(link.href.slice(1)));
          return target && roots.some(root => root.contains(target)) && publicNode(target);
        } catch { return false; }
      });
    }
    return records;
  }

  const compactFacts = values => [...new Set(values)].filter(Boolean).slice(0, 2).map(value => /[.!?]$/.test(value) ? value : value + '.').join(' ');
  function brief(value) {
    const line = clean(value);
    if (line.length <= 460) return line;
    const start = line.slice(0, 459);
    const sentences = [...start.matchAll(/[.!?](?=\s|$)/g)];
    const end = sentences.at(-1)?.index;
    return end > 220 ? start.slice(0, end + 1) : start.replace(/\s+\S*$/, '') + '…';
  }
  function reply(item, text, links = [], context = {}) {
    const sources = [];
    for (const link of [...links, ...(item.anchor ? [{ label: item.node.id || item.headingId ? item.title : (item.section || item).title, href: item.anchor }] : [])]) {
      if (!sources.some(other => other.href === link.href)) sources.push({ label: link.label, href: link.href });
    }
    return { matched: true, text: brief(text), sources: sources.slice(0, 7), context: { sectionId: item.sectionId, topic: item.key, ...context } };
  }
  const childrenOf = (records, section) => records.filter(item => item.section === section);
  const recordFor = (records, context) => context && records.find(item => item.sectionId === context.sectionId && item.key === context.topic);
  const summaryFor = item => item.facts.find(line => line.length > 45 && !/^(?:status|project outcome):/i.test(line)) || item.facts[0] || item.title;
  const linkTo = item => item.anchor && ({ label: item.title, href: item.anchor });
  const demoLinks = item => item.links.filter(link => /demo|live|preview|console|playground|dashboard/i.test(link.label));
  const sourceLinks = item => item.links.filter(link => /\b(?:source|repo|repository)\b/i.test(link.label) ||
    /^https?:\/\/(?:www\.)?(?:github|gitlab)\.com\/[^/?#]+\/[^/?#]+/i.test(link.href));
  const asksMore = q => /^(?:and )?(?:(?:tell|show|give) me (?:more|another detail)|(?:a little |a bit )?more(?: details?)?|another detail|what else(?: can you (?:tell|show) me)?|anything else|go on|continue)(?: (?:please|about (?:it|that|this)|on (?:it|that|this)))?$/.test(q);
  const cursorFor = context => Number.isSafeInteger(context?.nextDetail) && context.nextDetail > 0 ? context.nextDetail : 0;
  function detailChoices(records, item) {
    const children = childrenOf(records, item);
    if (children.length) return children.map(child => ({ text: child.title + ' — ' + summaryFor(child), source: child }));
    const lead = summaryFor(item);
    return item.facts.filter(line => line !== lead && normalize(line) !== normalize(item.title) &&
      words(line).length >= 2 && !lead.includes(line)).map(text => ({ text, source: item }));
  }
  function nextIndex(choices, previous) {
    const shown = Array.isArray(previous?.seenDetails) ? previous.seenDetails : [];
    return choices.findIndex((_, index) => index >= cursorFor(previous) && !shown.includes(index));
  }
  function nextDetails(records, item, previous) {
    const choices = detailChoices(records, item);
    const cursor = nextIndex(choices, previous);
    if (cursor < 0) return reply(item, 'That’s the last detail on this page about ' + item.title + '.', [], { nextDetail: choices.length });
    // Keep each spoken turn short enough for one complete piece of evidence.
    const next = choices[cursor];
    return reply(item, compactFacts([next.text]), [linkTo(next.source)].filter(Boolean), { nextDetail: cursor + 1 });
  }
  function describes(terms, line) {
    const pool = new Set(words(line));
    return terms.filter(term => pool.has(term) || (term.length > 3 && (pool.has(term + 's') || (term.endsWith('s') && pool.has(term.slice(0, -1))))));
  }
  function pageOverview(records) {
    const sections = records.filter(item => !item.section);
    if (!sections.length) return { ...unknown(), text: 'There are no shared sections to summarize on this page.' };
    const intro = sections.find(section => section.kind === 'about') || sections[0];
    const introFacts = [...intro.facts, ...records.filter(item => item.section === intro).flatMap(item => item.facts)];
    const lead = introFacts.find(line => line.length > 48) || introFacts[0];
    const projects = sections.find(section => section.kind === 'projects');
    const examples = projects && records.filter(item => item.section === projects).slice(0, 3).map(item => item.title);
    const parts = [];
    if (lead) parts.push(lead);
    if (examples?.length) parts.push('Projects include ' + joinNames(examples) + '.');
    const remaining = sections.filter(section => !(section === intro && lead) && !(section === projects && examples?.length));
    if (remaining.length) parts.push('This page covers ' + joinNames(remaining.map(section => section.title).slice(0, 5)) + '.');
    const links = [intro, projects, ...remaining].filter(section => section?.anchor)
      .map(section => ({ label: section.title, href: section.anchor }));
    return reply(intro, parts.join(' '), links, { view: 'overview' });
  }
  function asksForPageOverview(question) {
    const request = question.replace(/^(?:please |(?:can|could|would) you (?:please )?)/, '').replace(/ please$/, '');
    return /^(?:(?:give|show) me |provide )?(?:a |an |the )?(?:quick |brief )?(?:overview|summary)(?: of (?:this |the )?(?:page|site|website|portfolio|portal))?$/.test(request) ||
      /^(?:summari[sz]e (?:this|the) (?:page|site|website|portfolio|portal)|what(?:s| is) (?:on )?(?:this |the )?(?:page|site|website|portfolio|portal)(?: about)?|what can (?:i|you) (?:ask(?: about)?|answer|help(?: me)?(?: with)?))$/.test(request);
  }
  function askPage(records, prompt, previous) {
    const q = normalize(prompt);
    if (/^(?:hi|hello|hey|help|what can i (?:explore|ask about)(?: here| on this page)?|where (?:can|should) i start|what can you (?:help(?: me)? with|answer))$/.test(q) && records.length) {
      const sections = records.filter(item => !item.section);
      const example = records.find(item => item.section && item.facts.length);
      const titles = sections.map(item => item.title);
      return reply(sections[0], 'You can explore ' + joinNames(titles.slice(0, 5)) + '.' +
        (example ? ' For example, try “Tell me about ' + example.title + '.”' : ''), sections.map(linkTo).filter(Boolean), { view: 'overview' });
    }
    if (asksForPageOverview(q)) return pageOverview(records);
    if (!q || !records.length) return unknown();
    const sections = records.filter(rec => !rec.section);
    const sectionFor = kind => sections.find(rec => rec.kind === kind);
    const children = section => childrenOf(records, section);
    const overview = section => {
      const items = children(section);
      const titles = items.map(item => item.title);
      if (section.kind === 'experience') {
        const roles = items.map(item => [item.title, item.employer].filter(Boolean).join(' at '));
        return reply(section, roles.length ? 'The roles listed are ' + joinNames(roles) + '.' : compactFacts(section.facts) || section.title, [], { view: 'list' });
      }
      const links = items.filter(item => item.node.id).map(linkTo).filter(Boolean);
      if (section.kind === 'skills' && titles.length > 6) {
        return reply(section, 'The toolkit includes ' + joinNames(titles.slice(0, 6)) + '. The full list has ' + titles.length + ' entries.', [], { view: 'list' });
      }
      const prefix = section.kind === 'projects' ? 'The projects are ' : section.title + ' includes ';
      return reply(section, titles.length ? prefix + joinNames(titles) + '.' : compactFacts(section.facts) || section.title, links, { view: 'list' });
    };
    const prior = recordFor(records, previous);
    if (previous && !prior && (asksMore(q) || /\b(?:its?|their|them|that one|this one)\b/.test(q) ||
        (previous.topic && (' ' + q + ' ').includes(' ' + normalize(previous.topic) + ' ')))) {
      return { ...unknown(), text: 'The earlier topic is no longer available in the sections shared with this guide.' };
    }
    if (asksMore(q)) return prior ? nextDetails(records, prior, previous) :
      { ...unknown(), text: 'Which topic would you like to hear more about? Try a heading from the page.' };
    const namedRequest = /^(?:tell me about|describe|tell me more about) (.+)$/.exec(q);
    if (namedRequest) {
      const exact = records.find(item => normalize(item.title) === namedRequest[1]);
      if (exact) {
        if (q.startsWith('tell me more about')) return nextDetails(records, exact, exact === prior ? previous : null);
        if (!exact.section) return overview(exact);
        const lead = summaryFor(exact);
        return reply(exact, normalize(lead).startsWith(normalize(exact.title)) ? lead : exact.title + ' — ' + lead);
      }
    }
    const follow = !!prior && (/\b(it|its|that|this one|they|them|their|those)\b/.test(q) ||
      /^(?:and |what about )?(?:more|details|tell me more|go on|what else|(?:the )?(?:stack|tools|demo|link|status|source|dates))\b/.test(q));
    const requested = Object.keys(scopes).find(key => key !== 'about' && scopes[key].test(q)) || '';
    const wantsTags = scopes.skills.test(q) || /\bprogramming languages?\b/.test(q);
    // A capability question about a demo needs its stated facts, not a URL.
    const asksCapability = /\b(supports?|supported|contains?|includes?|measures?|works?|requires?|needs?|compares?|handles?)\b/.test(q) ||
      /\bwhat (?:does|can) .+ do\b/.test(q);
    const wantsSource = !asksCapability && /\b(github|repository|repo|source code|source)\b/.test(q);
    const wantsDemo = !asksCapability && /\b(demo|live|preview|playground|console)\b/.test(q);
    const wantsLink = /\b(link|url|open|visit)\b/.test(q);
    const resume = /\b(resume|cv)\b/.test(q);
    const contactMethod = /\b(email|e mail|linkedin|phone number|telephone|whatsapp|twitter|instagram)\b/.exec(q)?.[0];
    const isContact = requested === 'contact' || !!contactMethod || /\b(?:github (?:profile|account)|(?:his|your) github)\b/.test(q);
    const ignore = new Set([...stop, ...words('project projects experience role roles skills tools tool stack tech technology technologies toolkit job jobs demo live preview link links url source repository repo github status date dates outcome features feature status contact reach get touch places section sections key give examples example please')]);
    const intro = sectionFor('about');
    const terms = [...new Set(words(q).filter(term => !ignore.has(term)))];
    const items = records.filter(item => item.section);
    if (requested && /\bhow many\b/.test(q) && terms.every(term => term === 'many')) {
      const section = sectionFor(requested);
      if (section) {
        const count = children(section).length;
        const names = { projects: 'project', skills: 'skill', experience: 'role' };
        const unit = names[requested] || 'entry';
        if (count) return reply(section, 'This page lists ' + count + ' ' + (count === 1 ? unit : unit === 'entry' ? 'entries' : unit + 's') + '.');
      }
    }
    const projectSection = sectionFor('projects');
    if (projectSection && !terms.length && /\b(?:build|built|developed|made)\b/.test(q)) return overview(projectSection);
    if (intro && /\b(?:open to|looking for|seeking|available for)\b/.test(q) &&
        !terms.some(term => !/^(?:open|looking|seeking|available|opportunities|opportunity|internships?|engineering|software|positions?|currently)$/.test(term))) {
      const line = intro.facts.find(fact => /\b(open to|looking for|seeking|available for)\b/.test(normalize(fact)));
      if (line) return reply(intro, compactFacts([line]));
    }
    if (projectSection && requested === 'projects' && /\b(?:live|demos?|try)\b/.test(q) && terms.every(term => /^(?:try|demos)$/.test(term))) {
      const liveOnly = /\blive\b/.test(q);
      const live = children(projectSection).map(item => ({ item, link: demoLinks(item).find(link => !liveOnly || !/package|download/i.test(link.label)) })).filter(row => row.link);
      return live.length ? reply(projectSection, 'You can try ' + joinNames(live.map(row => row.item.title)) + '.',
        live.map(row => ({ label: row.item.title, href: row.link.href })), { view: 'list', choices: live.map(row => row.item.key) }) : unknown();
    }
    const asksForProjects = requested === 'projects' && projectSection && /\b(which|what|list|projects (?:with|using)|projects? (?:use|used|feature))\b/.test(q);
    if (asksForProjects && terms.length) {
      const matches = children(projectSection).filter(item =>
        describes(terms, [item.title, ...item.tags, ...item.facts].join(' ')).length === terms.length);
      if (matches.length) {
        const links = matches.filter(item => item.anchor && item.node.id).map(item => ({ label: item.title, href: item.anchor }));
        const names = joinNames(matches.map(item => item.title));
        const tool = matches[0].tags.find(tag => normalize(tag) === terms.join(' '));
        const usesTool = tool && matches.every(item => item.tags.includes(tool));
        const answer = usesTool ? names + (matches.length === 1 ? ' uses ' : ' use ') + tool + '.' : 'That’s covered in ' + names + '.';
        return reply(projectSection, answer, links,
          { view: 'list', choices: matches.map(item => item.key) });
      }
      return unknown();
    }
    const educationTerms = new Set(words('education educational background study studies studied studying school university college degree graduation graduate attend attends attended go goes pursue pursuing enrolled enrollment major field subject academic program currently'));
    if (terms.some(term => /^(?:education|study|studied|studying|school|university|college|degree|graduation)$/.test(term)) && terms.every(term => educationTerms.has(term))) {
      for (const item of records) {
        const line = item.facts.find(value => /\b(?:b\.?\s?tech|bachelor|master.s|ph\.?d|stud(?:ied|ying) at|studies at|graduated from|enrolled at|attend(?:ed|s) (?:a |the )?(?:university|college))\b/i.test(value));
        if (line) return reply(item, line);
      }
    }
    if (/\b(intern|internship)\b/.test(q) && /\b(company|employer|where|experience|responsibilities)\b/.test(q)) {
      const jobs = items.filter(item => item.kind === 'experience' && /\bintern(ship)?\b/.test(normalize(item.title)));
      if (jobs.length) {
        const job = jobs[0];
        const position = job.employer ? 'The ' + job.title + ' role was at ' + job.employer : job.title;
        const locationQuestion = /\b(where|company|employer)\b/.test(q);
        const answer = locationQuestion && job.dates ? position + ' (' + job.dates + ').' : compactFacts([position, summaryFor(job)]);
        return reply(job, answer);
      }
    }
    const named = items.filter(item => !requested || requested === 'skills' || !sectionFor(requested) || item.kind === requested).map(item => {
      const labels = words(item.title);
      const titleHits = describes(terms, item.title);
      const exact = labels.length && (' ' + q + ' ').includes(' ' + labels.join(' ') + ' ');
      const unique = titleHits.some(term => term.length >= 3 && items.filter(other => describes([term], other.title).length).length === 1);
      // A meaningful multiword title prefix must outrank a one-word tool name.
      const prefix = labels.length > 2 && titleHits.length >= 2 &&
        (' ' + q + ' ').includes(' ' + labels.slice(0, titleHits.length).join(' ') + ' ');
      const projectCue = item.kind === 'projects' && titleHits.length &&
        /\b(project|demo|studio|app|application|website|repository|repo|source)\b/.test(q);
      return { item, score: projectCue ? 200 + titleHits.length : prefix ? 150 + titleHits.length : exact ? 100 + labels.length : unique ? 10 + titleHits.length : 0 };
    }).filter(result => result.score).sort((a, b) => {
      if (wantsDemo || wantsSource || wantsLink) {
        const linkRank = Number(!!b.item.links.length) - Number(!!a.item.links.length);
        if (linkRank) return linkRank;
      }
      return b.score - a.score;
    });
    let target = named[0]?.item;
    if (!target && (follow || prior?.section && wantsTags && !terms.length)) target = prior;
    if (resume) {
      const item = records.find(rec => rec.links.some(link => /\b(resume|cv)\b/.test(normalize(link.label + ' ' + link.href))));
      const links = item?.links.filter(link => /\b(resume|cv)\b/.test(normalize(link.label + ' ' + link.href))) || [];
      return links.length ? reply(item, 'You can download the résumé' + (/\.pdf(?:$|[?#])/i.test(links[0].href) ? ' as a PDF.' : ' from this page.'), links, { action: 'resume' }) : unknown();
    }
    if (isContact && !target) {
      const contact = sectionFor('contact');
      const pool = contact ? [contact, ...children(contact)] : sections;
      const kind = contactMethod || (wantsSource ? 'github' : '');
      const method = {email:/^mailto:/i, 'e mail':/^mailto:/i, linkedin:/linkedin/i, 'phone number':/^tel:/i, telephone:/^tel:/i, whatsapp:/whatsapp|wa\.me/i, instagram:/instagram/i, twitter:/twitter|x\.com/i, github:/github/i}[kind];
      for (const item of pool) {
        const links = item.links.filter(link => method ? method.test(link.href) : /^(mailto:|tel:)|linkedin|github/i.test(link.href));
        if (!links.length) continue;
        const email = links.find(link => link.href.startsWith('mailto:'));
        return reply(item, email ? 'The email address is ' + email.href.slice(7).split('?')[0] + '.' : 'You can use ' + joinNames(links.map(link => link.label)) + '.', links, { action: 'contact' });
      }
      if (contact && !kind && contact.facts.length) return reply(contact, summaryFor(contact));
      if (kind) return unknown();
    }
    if (target && (wantsSource || wantsDemo || wantsLink)) {
      const links = wantsSource ? sourceLinks(target) : wantsDemo ? demoLinks(target) : target.links;
      const action = wantsSource ? 'source' : wantsDemo ? 'demo' : 'links';
      const linkName = wantsSource ? 'source link' : wantsDemo ? 'demo link' : 'link';
      return links.length ? reply(target, (links.length === 1 ? 'Here’s the ' + linkName : 'Here are the ' + linkName + 's') + ' for ' + target.title + '.', links, { action }) :
        reply(target, 'I couldn’t find a ' + (wantsSource ? 'source ' : wantsDemo ? 'demo ' : '') + 'link for ' + target.title + '.');
    }
    if (target && wantsTags && target.tags.length) return reply(target, target.title + ' uses ' + joinNames(target.tags) + '.', [], { action: 'tools' });
    if (target) {
      if (/\blanguages?\b/.test(q) && !/\b(programming|code|software)\b/.test(q)) {
        const languageFacts = target.facts.filter(line => /\b(english|hindi|kannada|tamil|telugu|bengali|marathi|urdu|french|spanish|german|portuguese|japanese|korean|mandarin|arabic)\b/i.test(line));
        if (languageFacts.length) return reply(target, compactFacts(languageFacts));
      }
      const questionWords = new Set(words('support supports supported achieve achieved achievement achievements compatible compatibility current currently latest version versions today'));
      const remaining = terms.filter(term => !describes([term], target.title).length && !questionWords.has(term));
      if (/\b(compatible|compatibility)\b/.test(q)) {
        const limits = target.facts.filter(line => /\b(requires?|needs?|depends?|compatible|retired|unsupported)\b/i.test(line) &&
          (!remaining.length || describes(remaining, line).length >= Math.ceil(remaining.length / 2)));
        if (limits.length) return reply(target, compactFacts(limits));
      }
      const lines = target.facts.map((line, index) => ({line, index, hits: describes(remaining, line).length}))
        .sort((a, b) => b.hits - a.hits || a.index - b.index);
      const status = /\b(status|outcome)\b/.exec(q)?.[0];
      if (status) {
        const relevant = target.facts.find(line => normalize(line).includes(status));
        return relevant ? reply(target, target.title + ' — ' + relevant) : unknown();
      }
      if (remaining.length && !lines.some(line => line.hits >= Math.ceil(remaining.length / 2))) return unknown();
      const matched = lines.filter(line => line.hits).map(line => line.line);
      const detail = follow && !remaining.length ? target.facts.filter(line => line !== summaryFor(target) && line.length > 35) : [];
      let answer = matched.length ? compactFacts(matched) : detail.length ? compactFacts(detail) : summaryFor(target);
      if (!normalize(answer).startsWith(normalize(target.title))) answer = target.title + ' — ' + answer;
      return reply(target, answer);
    }
    if (intro && (q === normalize(intro.title) ||
      /^(?:who are you|who is (?:the author|behind (?:this|the) (?:portfolio|site|page))|introduce yourself|tell me about (?:yourself|the author|you|him|her))$/.test(q))) {
      return reply(intro, summaryFor(intro));
    }
    const area = sectionFor(requested);
    if (area && !terms.length) return overview(area);
    const sameName = sections.find(section => terms.length && describes(terms, section.title).length === terms.length);
    if (sameName) return overview(sameName);
    const eligible = requested && area ? [area, ...children(area)] : records;
    const ranked = eligible.map(item => {
      const titleHits = describes(terms, item.title);
      const lines = [...item.facts, ...item.tags].map(line => ({
        line, hits: describes(terms, line).length, withTitle: describes(terms, item.title + ' ' + line).length
      })).sort((a, b) => b.withTitle - a.withTitle || b.hits - a.hits);
      // One public passage must support the match. Separate paragraphs that
      // happen to contain different query words cannot establish a new topic.
      const coverage = Math.max(titleHits.length, lines[0]?.withTitle || 0);
      return { item, lines, score: coverage + titleHits.length * 2 + (lines[0]?.hits || 0), coverage };
    }).filter(row => terms.length && row.coverage >= Math.ceil(terms.length * .68)).sort((a, b) => b.score - a.score);
    if (!ranked.length) return unknown();
    const best = ranked[0];
    const answer = compactFacts(best.lines.filter(line => line.hits && line.withTitle >= best.coverage).map(line => line.line)) || summaryFor(best.item);
    return reply(best.item, best.item.title + ' — ' + answer);
  }

  function namedQuestion(item) {
    return item?.title && item.title.length <= 75 ? 'Tell me about ' + item.title : '';
  }
  function startersFor(records) {
    const sections = records.filter(item => !item.section);
    const project = records.find(item => item.section && item.kind === 'projects' && item.facts.length);
    const internship = records.find(item => item.section && item.kind === 'experience' && /\bintern(ship)?\b/i.test(item.title) && item.facts.length);
    const resume = records.some(item => item.links.some(link => /\b(resume|cv)\b/.test(normalize(link.label + ' ' + link.href))));
    const examples = sections.map(section => childrenOf(records, section).find(item => item.facts.length) || section);
    const candidates = [namedQuestion(project), internship && 'Where was the internship?', resume && 'Where can I download the résumé?',
      ...examples.map(namedQuestion), ...records.map(namedQuestion)];
    return suggestionsFrom(records, candidates, 3);
  }
  function suggestionsFrom(records, candidates, limit, previous) {
    const result = [];
    for (const question of new Set(candidates.filter(Boolean))) {
      if (askPage(records, question, previous).matched) result.push(question);
      if (result.length === limit) break;
    }
    return result;
  }
  function followUpsFor(records, context) {
    const item = recordFor(records, context);
    if (!item) return [];
    if (context.view === 'overview') return startersFor(records).slice(0, 2);
    const children = childrenOf(records, item);
    if (children.length) {
      const relevant = Array.isArray(context.choices) ? children.filter(child => context.choices.includes(child.key)) : children;
      return suggestionsFrom(records, relevant.map(namedQuestion), 2, context);
    }
    const answered = Array.isArray(context.answered) ? context.answered : [];
    const candidates = [];
    if (nextIndex(detailChoices(records, item), context) >= 0) candidates.push('Tell me more');
    if (item.kind === 'contact') {
      if (!answered.includes('resume') && item.links.some(link => /\b(resume|cv)\b/.test(normalize(link.label)))) candidates.push('Where can I download the résumé?');
      if (!answered.includes('contact') && item.links.some(link => /^mailto:/i.test(link.href))) candidates.push('How can I get in touch?');
    }
    if (item.tags.length && !answered.includes('tools')) candidates.push('Which tools does ' + item.title + ' use?');
    if (demoLinks(item).length && !answered.includes('demo')) candidates.push('Is there a demo for ' + item.title + '?');
    if (item.section && sourceLinks(item).length && !answered.includes('source')) candidates.push('Where’s the source for ' + item.title + '?');
    return suggestionsFrom(records, candidates, 2, context);
  }
  function create({ roots, exclude } = {}) {
    const scopes = list(roots).filter(node => node?.nodeType === 1);
    const exclusions = list(exclude);
    let records;
    function refresh() { records = readPage(scopes, exclusions); }
    refresh();
    function ask(question, { previous = null } = {}) {
      const result = askPage(records, question, previous);
      if (!result.context) return result;
      const next = result.context;
      const same = next.sectionId === previous?.sectionId && next.topic === previous?.topic;
      if (same && !Object.hasOwn(next, 'nextDetail') && cursorFor(previous)) next.nextDetail = cursorFor(previous);
      const choices = detailChoices(records, recordFor(records, next));
      const spoken = normalize(result.text);
      const seen = choices.flatMap((choice, i) => spoken.includes(normalize(choice.text)) ||
        (same && Array.isArray(previous.seenDetails) && previous.seenDetails.includes(i)) ? [i] : []);
      if (seen.length) next.seenDetails = seen;
      const answered = same && Array.isArray(previous.answered) ? previous.answered.filter(action => ['tools','demo','source','links','resume','contact'].includes(action)) : [];
      if (next.action) answered.push(next.action);
      if (answered.length) next.answered = [...new Set(answered)];
      return result;
    }
    return { refresh, overview: () => pageOverview(records), ask, starters: () => startersFor(records), followUps: context => followUpsFor(records, context) };
  }
  window.PageKnowledge = Object.freeze({ create });
})();
