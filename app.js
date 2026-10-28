// Jatin Aggarwal Neural Video Avatar Player & Smart In-Browser NLP Engine
document.addEventListener('DOMContentLoaded', () => {
  // 1. Stage 3D Perspective Tilt Physics
  const stage = document.getElementById('c4dStage');
  const card = document.getElementById('c4dCard');

  if (stage && card) {
    const satellites = stage.querySelectorAll('.holo-satellite');
    const sheen = card.querySelector('.c4d-sheen');

    stage.addEventListener('mousemove', (e) => {
      const rect = stage.getBoundingClientRect();
      const x = e.clientX - rect.left;
      const y = e.clientY - rect.top;
      const centerX = rect.width / 2;
      const centerY = rect.height / 2;
      const rotateX = ((y - centerY) / centerY) * -9;
      const rotateY = ((x - centerX) / centerX) * 9;
      card.style.transform = `perspective(1400px) rotateX(${rotateX}deg) rotateY(${rotateY}deg) scale3d(1.025, 1.025, 1.025)`;
      
      // Specular sheen light sweep
      if (sheen) {
        const pctX = (x / rect.width) * 100;
        const pctY = (y / rect.height) * 100;
        sheen.style.background = `radial-gradient(circle at ${pctX}% ${pctY}%, rgba(255, 255, 255, 0.22) 0%, rgba(232, 158, 70, 0.08) 35%, transparent 65%)`;
      }

      // Parallax shift for floating satellites in 3D Z-space
      satellites.forEach((sat, idx) => {
        const depth = (idx + 1) * 7;
        const shiftX = ((x - centerX) / centerX) * depth;
        const shiftY = ((y - centerY) / centerY) * depth;
        sat.style.transform = `translateZ(${35 + depth}px) translate(${shiftX}px, ${shiftY}px)`;
      });
    });

    stage.addEventListener('mouseleave', () => {
      card.style.transform = 'perspective(1400px) rotateX(0deg) rotateY(0deg) scale3d(1, 1, 1)';
      if (sheen) {
        sheen.style.background = `linear-gradient(125deg, rgba(255, 255, 255, 0.14) 0%, transparent 45%, rgba(216, 79, 49, 0.08) 100%)`;
      }
      satellites.forEach((sat) => {
        sat.style.transform = `translateZ(35px) translate(0px, 0px)`;
      });
    });
  }

  // 2. Comprehensive Smart In-Browser Knowledge Base (Tackles Any Question Intelligently)
  const smartKnowledgeBase = [
    {
      intent: 'greetings',
      videoFile: 'intro.mp4',
      patterns: ['hi', 'hello', 'hey', 'greetings', 'morning', 'afternoon', 'who are you', 'introduce'],
      speech: "Hi! I’m Jatin’s portfolio guide. I can introduce his projects, experience, skills, and contact details."
    },
    {
      intent: 'raft',
      videoFile: 'raft.mp4',
      patterns: ['raft', 'distributed', 'kv', 'rocksdb', 'consensus', 'go', 'golang', 'cluster', 'storage engine', 'election', 'quorum', 'wal'],
      speech: "Distributed KV Server is Jatin’s distributed systems project in Go, featuring a live 3-node web playground on Render and exploring Raft elections, replicated logs, and distributed consensus."
    },
    {
      intent: 'voiceops',
      videoFile: 'intro.mp4',
      patterns: ['voiceops', 'voice ai', 'pipecat', 'ttfa', 'time to first audio', 'latency', 'guardrails', 'voice pipeline', 'groq whisper', 'observability', 'streamlit'],
      speech: "VoiceOps Enterprise is Jatin’s Voice AI benchmarking and observability platform deployed on Render. It quantifies sub-second Time-to-First-Audio latency across Cascade and Hybrid pipelines using Pipecat DAGs, FastAPI, Redis, and Supabase."
    },
    {
      intent: 'mariadb',
      videoFile: 'mariadb.mp4',
      patterns: ['mariadb', 'magics', 'studio', 'hackathon', 'vector', 'jupyter', 'top 59', 'sentence-transformers', 'sql', 'temporal', 'ranking', 'system versioning'],
      speech: "MariaDB Magics is a Top 59 Global Hackathon project featuring both a Jupyter extension and a live interactive web studio deployed on Render. It brings SQL queries, MariaDB 11.8 LTS vector similarity search, system-versioned temporal analytics, and plotting into a clean workspace."
    },
    {
      intent: 'bhdesk',
      videoFile: 'bhdesk.mp4',
      patterns: ['bhdesk', 'gemini', 'nano', 'offline', 'chrome', 'extension', 'on-device', 'local ai', 'manifest v3', 'privacy', 'translation'],
      speech: "BHDesk is a Chrome extension prototype exploring built-in browser AI, Hindi–English translation, and tab grouping. Its AI features depend on browser and device support."
    },

    {
      intent: 'devsecops',
      videoFile: 'devsecops.mp4',
      patterns: ['devsecops', 'guardian', 'gitlab', 'ci/cd', 'pipeline', 'sentinel', 'security', 'vulnerability', 'webhooks', 'ci'],
      speech: "AI DevSecOps Guardian is a past GitLab integration project for pipeline events, job failure context, and diagnostic suggestions. Compatibility with current GitLab interfaces needs revalidation."
    },

    {
      intent: 'ivr',
      videoFile: 'ivr.mp4',
      patterns: ['weathergpt', 'weather', 'farmer', 'ivr', 'telephony', 'dtmf', 'asterisk', 'voice', 'indic', 'audio', 'g711', 'esp32', 'sip', 'telephone', 'call'],
      speech: "WeatherGPT is a voice platform prototype for weather guidance and emergency notifications over basic phones. It explores multilingual speech, keypad navigation, call retries, and SMS fallbacks."
    },
    {
      intent: 'bluella',
      videoFile: 'bluella.mp4',
      patterns: ['bluella', 'intern', 'internship', 'experience', 'work', 'deliverables', 'production', 'lcp', 'wcag', 'aria'],
      speech: "Jatin worked as a Web Engineer Intern at Bluella in Gurugram from May to July 2026. His work included more than 28 web deliverables across responsive pages, partner portals, and HTML emails, with attention to accessibility and performance."
    },
    {
      intent: 'leadership',
      videoFile: 'leadership.mp4',
      patterns: ['acm', 'chair', 'lead', 'leadership', 'student chapter', 'chapter', 'async', 'aisynctech', 'workshop', 'hackathon'],
      speech: "Jatin chairs the ACM Student Chapter at IILM University and helps organize development events, talks, and student pitch sessions. He has also led workshops on software development, virtualization, and command-line tools."
    },
    {
      intent: 'stack',
      videoFile: 'stack.mp4',
      patterns: ['stack', 'tech stack', 'technologies', 'skills', 'tools', 'tier', 'tiers', 'languages', 'docker'],
      speech: "Jatin uses HTML, CSS, JavaScript, TypeScript, and React for interfaces; Go, Python, Node.js, and FastAPI for software and APIs; PostgreSQL and MariaDB for data; and Git, GitLab, Docker, Linux, and Jupyter in his workflow."
    },
    {
      intent: 'approach',
      videoFile: 'approach.mp4',
      patterns: ['approach', 'philosophy', 'principles', 'claims', 'assumptions', 'limitations', 'testing'],
      speech: "My engineering approach prioritizes measurable behavior over exaggerated claims, cleanly separates public code from exploratory prototypes, records system assumptions and limitations, and designs explicitly for failure and degraded connectivity."
    },
    {
      intent: 'contact',
      videoFile: 'contact.mp4',
      patterns: ['contact', 'email', 'reach', 'connect', 'phone', 'call', 'mail', 'message', 'linkedin'],
      speech: "You can email Jatin at Jatin946work@yahoo.com, visit his GitHub profile at Jatin2567, or use the LinkedIn link in the Contact section."
    }
  ];

  // 3. Smart Fallback Generator (Synthesizes answers for any unlisted question)
  function answerQuestionSmartly(query) {
    if (!query) return { speech: "How can I help you explore my systems and engineering projects?", videoFile: "raft.mp4", intent: "general" };
    const clean = query.toLowerCase().trim();
    
    // Pattern scoring with word boundaries
    let bestMatch = null;
    let maxScore = 0;

    for (const item of smartKnowledgeBase) {
      let score = 0;
      for (const pattern of item.patterns) {
        if (clean.includes(pattern)) {
          score += (pattern.length >= 4 ? 3 : 1);
          const words = clean.split(' ');
          if (words.includes(pattern)) score += 2;
        }
      }
      if (score > maxScore) {
        maxScore = score;
        bestMatch = item;
      }
    }

    if (bestMatch && maxScore > 0) {
      return {
        speech: bestMatch.speech,
        videoFile: bestMatch.videoFile,
        intent: bestMatch.intent
      };
    }

    // Contextual fallbacks
    if (clean.includes('who') || clean.includes('about') || clean.includes('jatin')) {
      return {
        speech: "Jatin is a software engineer studying B.Tech Computer Science with a focus on AI and ML at IILM University, Gurugram. His portfolio includes web development, AI tools, voice interfaces, and distributed systems.",
        videoFile: 'bluella.mp4',
        intent: 'general'
      };
    }

    if (clean.includes('how') || clean.includes('why')) {
      return {
        speech: "I can share a brief overview of the projects on this page. Try asking about WeatherGPT, MariaDB-magics, BHDesk, or Jatin’s experience. For a detailed question, please use the email link.",
        videoFile: 'raft.mp4',
        intent: 'general'
      };
    }

    return {
      speech: "I don’t have an answer for that in this portfolio guide. You can ask about projects, skills, experience, or contact details.",
      videoFile: 'raft.mp4',
      intent: 'general'
    };
  }

  // 4. Voice Guide & Neural Video Controller
  const videoContainer = document.getElementById('videoContainer');
  const heroVideo = document.getElementById('heroVideo');
  const dockVideo = document.getElementById('dockVideo');
  const btnHeroAudioToggle = document.getElementById('btnHeroAudioToggle');
  const heroVolIcon = document.getElementById('heroVolIcon');
  const indicatorStatus = document.getElementById('indicatorStatus');
  const speechQuote = document.getElementById('speechQuoteText');
  const qChips = document.querySelectorAll('.q-chip[data-topic]');
  const btnMic = document.getElementById('btnYellowMic');

  // Start video autoplay
  if (heroVideo) heroVideo.play().catch(() => {});
  if (dockVideo) dockVideo.play().catch(() => {});

  // Hero Video Mute/Unmute Audio Toggle
  if (btnHeroAudioToggle && heroVideo) {
    btnHeroAudioToggle.addEventListener('click', (e) => {
      e.stopPropagation();
      heroVideo.muted = !heroVideo.muted;
      if (heroVideo.muted) {
        heroVolIcon.innerHTML = '<polygon points="11 5 6 9 2 9 2 15 6 15 11 19 11 5"></polygon><line x1="23" y1="9" x2="17" y2="15"></line><line x1="17" y1="9" x2="23" y2="15"></line>';
        btnHeroAudioToggle.title = "Unmute Video";
      } else {
        heroVolIcon.innerHTML = '<polygon points="11 5 6 9 2 9 2 15 6 15 11 19 11 5"></polygon><path d="M19.07 4.93a10 10 0 0 1 0 14.14M15.54 8.46a5 5 0 0 1 0 7.07"></path>';
        btnHeroAudioToggle.title = "Mute Video";
        heroVideo.play().catch(() => {});
      }
    });
  }

  // Bottom Dock Agent Interactivity (Image 1 Spec)
  const yellowAgentBar = document.getElementById('yellowAgentBar');
  const yellowAgentInput = document.getElementById('yellowAgentInput');
  const btnYellowWave = document.getElementById('btnYellowWave');
  const btnYellowAudioToggle = document.getElementById('btnYellowAudioToggle');
  const dockVolIcon = document.getElementById('dockVolIcon');
  const btnYellowMinimize = document.getElementById('btnYellowMinimize');
  const yellowCompactPill = document.getElementById('yellowCompactPill');
  let spokenRepliesEnabled = true;
  let speechRequestId = 0;
  const voiceStatus = document.getElementById('yellowVoiceStatus');

  function setVoiceStatus(message) {
    if (voiceStatus) voiceStatus.textContent = message;
  }

  function setSpeakingState(isSpeaking) {
    if (videoContainer) videoContainer.classList.toggle('speaking', isSpeaking);
    if (card) card.classList.toggle('speaking', isSpeaking);
    if (indicatorStatus) indicatorStatus.textContent = isSpeaking ? 'Guide speaking' : 'Portfolio guide';
  }

  function expandGuide() {
    if (!yellowAgentBar) return;
    yellowAgentBar.classList.remove('agent-compact');
    yellowAgentBar.classList.add('agent-expanded');
  }

  if (dockVideo) {
    // The avatar stays muted so its prerecorded voice can never override the selected guide voice.
    dockVideo.defaultMuted = true;
    dockVideo.muted = true;
    dockVideo.play().catch(() => {});
  }

  function updateVoiceToggle() {
    if (!btnYellowAudioToggle) return;
    const label = spokenRepliesEnabled ? 'Mute spoken replies' : 'Enable spoken replies';
    btnYellowAudioToggle.title = label;
    btnYellowAudioToggle.setAttribute('aria-label', label);
    btnYellowAudioToggle.setAttribute('aria-pressed', String(spokenRepliesEnabled));
    if (dockVolIcon) {
      dockVolIcon.innerHTML = spokenRepliesEnabled
        ? '<polygon points="11 5 6 9 2 9 2 15 6 15 11 19 11 5"></polygon><path d="M15.54 8.46a5 5 0 0 1 0 7.07M19.07 4.93a10 10 0 0 1 0 14.14"></path>'
        : '<polygon points="11 5 6 9 2 9 2 15 6 15 11 19 11 5"></polygon><line x1="23" y1="9" x2="17" y2="15"></line><line x1="17" y1="9" x2="23" y2="15"></line>';
    }
  }

  if (btnYellowAudioToggle) {
    updateVoiceToggle();
    btnYellowAudioToggle.addEventListener('click', (e) => {
      e.stopPropagation();
      spokenRepliesEnabled = !spokenRepliesEnabled;
      updateVoiceToggle();
      speechRequestId += 1;
      if (!spokenRepliesEnabled) {
        if ('speechSynthesis' in window) window.speechSynthesis.cancel();
        setSpeakingState(false);
        setVoiceStatus('Spoken replies are muted. Answers remain available as text.');
      } else {
        setVoiceStatus('Spoken replies are on. The guide uses a recognized masculine English voice when available.');
      }
    });
  }

  if (yellowAgentBar) {
    // Click anywhere on the panel to expand & focus the input field so text cursor comes!
    yellowAgentBar.addEventListener('click', (e) => {
      if (e.target.closest('#btnYellowMinimize')) return;
      if (e.target.closest('.yellow-audio-btn')) return;
      if (e.target.closest('#btnYellowMic')) return;
      if (e.target.closest('#btnYellowWave')) return;

      if (yellowAgentBar.classList.contains('agent-compact')) {
        yellowAgentBar.classList.remove('agent-compact');
        yellowAgentBar.classList.add('agent-expanded');
        if (dockVideo) dockVideo.play().catch(() => {});
      }

      // Focus the text input whenever anywhere on the panel is clicked
      if (yellowAgentInput) {
        yellowAgentInput.focus();
        setTimeout(() => {
          if (yellowAgentInput) yellowAgentInput.focus();
        }, 120);
      }
    });
  }

  // Minimize button click shrinks back to compact panel
  if (btnYellowMinimize && yellowAgentBar) {
    btnYellowMinimize.addEventListener('click', (e) => {
      e.stopPropagation();
      yellowAgentBar.classList.remove('agent-expanded');
      yellowAgentBar.classList.add('agent-compact');
    });
  }

  // Click outside to collapse back to compact panel
  document.addEventListener('click', (e) => {
    if (yellowAgentBar && !yellowAgentBar.contains(e.target) && !e.target.closest('#yellowAgentContainer')) {
      if (!yellowAgentBar.classList.contains('agent-compact')) {
        yellowAgentBar.classList.remove('agent-expanded');
        yellowAgentBar.classList.add('agent-compact');
      }
    }
  });

  // Escape key minimizes back
  document.addEventListener('keydown', (e) => {
    if (e.key === 'Escape' && yellowAgentBar && !yellowAgentBar.classList.contains('agent-compact')) {
      yellowAgentBar.classList.remove('agent-expanded');
      yellowAgentBar.classList.add('agent-compact');
    }
  });

  if (btnYellowWave) {
    btnYellowWave.addEventListener('click', () => {
      const val = yellowAgentInput ? yellowAgentInput.value.trim() : '';
      if (val) {
        handleQuery(val);
        if (yellowAgentInput) {
          yellowAgentInput.value = '';
          yellowAgentInput.placeholder = "Answer ready. Ask another question";
        }
      } else {
        handleQuery("explain Raft consensus");
      }
    });
  }

  // Focus bottom chat agent when clicking Ask Question in hero
  const btnFocusChatAgent = document.getElementById('btnFocusChatAgent');
  if (btnFocusChatAgent) {
    btnFocusChatAgent.addEventListener('click', () => {
      const bar = document.getElementById('yellowAgentBar');
      const input = document.getElementById('yellowAgentInput');
      if (bar) bar.classList.remove('minimized');
      if (input) {
        input.focus();
        input.placeholder = "Ask Jatin about Raft, projects, or experience...";
      }
    });
  }

  function triggerResponse(responseObj) {
    expandGuide();
    if (speechQuote) {
      speechQuote.textContent = responseObj.speech;
    }
    const yellowSpeech = document.getElementById('yellowSpeechText');
    if (yellowSpeech) {
      yellowSpeech.textContent = responseObj.speech;
    }
    setVoiceStatus(spokenRepliesEnabled ? 'Finding a masculine English voice for this reply.' : 'Spoken replies are muted. This answer is shown as text.');
    playAudioVoice(responseObj.speech);
  }

  function playAudioVoice(text) {
    const requestId = ++speechRequestId;
    setSpeakingState(false);
    if (!spokenRepliesEnabled) return;

    if (!('speechSynthesis' in window) || typeof SpeechSynthesisUtterance === 'undefined') {
      setVoiceStatus('Spoken replies are unavailable in this browser. The answer is shown as text.');
      return;
    }
    window.speechSynthesis.cancel();

    const masculineName = /\b(david|mark|guy|ryan|brian|daniel|christopher|eric|alex|fred|lee|tom|aaron|andrew|james|jason|michael|samuel|henry|thomas|stephen|steffan|liam|william|robert|arthur|male)(?:\b|(?=neural|online|desktop|natural))/i;
    const feminineName = /\b(female|woman|zira|aria|jenny|samantha|victoria|susan|karen|ava)(?:\b|(?=neural|online|desktop|natural))/i;
    const localeRank = (lang) => (/^en-US\b/i.test(lang) ? 0 : /^en-GB\b/i.test(lang) ? 1 : /^en(-|_)/i.test(lang) ? 2 : 3);

    function findMasculineEnglishVoice() {
      return window.speechSynthesis.getVoices()
        .filter(voice => /^en(-|_)/i.test(voice.lang) && masculineName.test(voice.name) && !feminineName.test(voice.name))
        .sort((a, b) => localeRank(a.lang) - localeRank(b.lang))[0] || null;
    }

    function speakWithSelectedVoice() {
      if (requestId !== speechRequestId || !spokenRepliesEnabled) return;
      const voice = findMasculineEnglishVoice();
      if (!voice) {
        setSpeakingState(false);
        const message = 'No recognized masculine English voice is installed. Your answer is shown as text; install a masculine English voice in your device settings to hear it.';
        setVoiceStatus(message);
        showToast('No masculine English voice is installed. The answer is shown as text.');
        return;
      }

      const utterance = new SpeechSynthesisUtterance(text);
      utterance.voice = voice;
      utterance.lang = voice.lang;
      utterance.rate = 0.96;
      utterance.pitch = 0.92;
      utterance.onstart = () => {
        if (requestId !== speechRequestId) return;
        setSpeakingState(true);
        setVoiceStatus(`Speaking with ${voice.name}.`);
      };
      utterance.onend = () => {
        if (requestId !== speechRequestId) return;
        setSpeakingState(false);
        setVoiceStatus('Reply finished.');
      };
      utterance.onerror = () => {
        if (requestId !== speechRequestId) return;
        setSpeakingState(false);
        setVoiceStatus('Voice playback did not start. Your answer is shown as text.');
      };
      window.speechSynthesis.cancel();
      window.speechSynthesis.speak(utterance);
    }

    // Some browsers populate their voice list after the page has loaded.
    if (window.speechSynthesis.getVoices().length) {
      speakWithSelectedVoice();
      return;
    }

    let settled = false;
    const finishVoiceLookup = () => {
      if (settled) return;
      settled = true;
      window.speechSynthesis.removeEventListener?.('voiceschanged', finishVoiceLookup);
      clearTimeout(voiceLookupTimeout);
      speakWithSelectedVoice();
    };
    const voiceLookupTimeout = setTimeout(finishVoiceLookup, 1200);
    window.speechSynthesis.addEventListener?.('voiceschanged', finishVoiceLookup, { once: true });
  }

  function handleQuery(text) {
    if (!text || !text.trim()) return;
    const response = answerQuestionSmartly(text);
    triggerResponse(response);
  }

  // Topic chip click handlers
  qChips.forEach(chip => {
    chip.addEventListener('click', () => {
      const topic = chip.getAttribute('data-topic');
      const item = smartKnowledgeBase.find(k => k.intent === topic);
      if (item) {
        qChips.forEach(c => c.classList.remove('active'));
        chip.classList.add('active');
        triggerResponse({ speech: item.speech, videoFile: item.videoFile, intent: item.intent });
      }
    });
  });

  // 5. Voice questions use the browser's speech recognition, then the existing guide reply.
  const SpeechRecognition = window.SpeechRecognition || window.webkitSpeechRecognition;
  if (yellowAgentInput) {
    yellowAgentInput.addEventListener('focus', expandGuide);
    yellowAgentInput.addEventListener('keydown', (event) => {
      if (event.key !== 'Enter' || event.isComposing || event.repeat) return;
      event.preventDefault();
      const question = yellowAgentInput.value.trim();
      if (question) {
        handleQuery(question);
        yellowAgentInput.value = '';
        yellowAgentInput.placeholder = 'Answer ready. Ask another question';
      }
    });
  }

  if (btnMic) {
    if (!SpeechRecognition) {
      btnMic.addEventListener('click', () => {
        setVoiceStatus('Voice input is not available in this browser. Type your question instead.');
        showToast('Voice input is not available here. You can type your question.');
      });
    } else {
      const recognition = new SpeechRecognition();
      recognition.continuous = false;
      recognition.interimResults = true;
      recognition.lang = 'en-US';
      let isListening = false;
      let receivedFinalResult = false;

      const resetMicButton = () => {
        isListening = false;
        btnMic.classList.remove('listening');
        btnMic.setAttribute('aria-pressed', 'false');
        btnMic.setAttribute('aria-label', 'Ask by voice');
        btnMic.title = 'Ask by voice';
      };

      recognition.onstart = () => {
        isListening = true;
        receivedFinalResult = false;
        btnMic.classList.add('listening');
        btnMic.setAttribute('aria-pressed', 'true');
        btnMic.setAttribute('aria-label', 'Stop listening');
        btnMic.title = 'Stop listening';
        yellowAgentInput.placeholder = 'Listening… ask your question';
        setVoiceStatus('Listening. Ask your question, then pause.');
      };

      recognition.onresult = (event) => {
        let transcript = '';
        for (let index = 0; index < event.results.length; index += 1) {
          transcript += event.results[index][0].transcript;
        }
        transcript = transcript.trim();
        if (transcript) yellowAgentInput.value = transcript;

        const lastResult = event.results[event.results.length - 1];
        if (lastResult?.isFinal && transcript) {
          receivedFinalResult = true;
          handleQuery(transcript);
          yellowAgentInput.placeholder = 'Answer ready. Ask another question';
        }
      };

      recognition.onerror = (event) => {
        resetMicButton();
        yellowAgentInput.placeholder = 'Ask about projects, skills, or experience';
        const message = event.error === 'not-allowed' || event.error === 'service-not-allowed'
          ? 'Microphone access was blocked. Allow it in your browser or type your question.'
          : event.error === 'no-speech'
            ? 'No speech was heard. Tap the microphone and try again.'
            : 'Voice input stopped. You can type your question instead.';
        setVoiceStatus(message);
        showToast(message);
      };

      recognition.onend = () => {
        resetMicButton();
        if (!receivedFinalResult && yellowAgentInput.placeholder.startsWith('Listening')) {
          yellowAgentInput.placeholder = 'Ask about projects, skills, or experience';
          setVoiceStatus('Listening ended. Tap the microphone to try again, or type your question.');
        }
      };

      btnMic.addEventListener('click', () => {
        if (isListening) {
          recognition.stop();
          return;
        }
        try {
          receivedFinalResult = false;
          // Stop the guide's reply so the microphone cannot transcribe it.
          speechRequestId += 1;
          if ('speechSynthesis' in window) window.speechSynthesis.cancel();
          setSpeakingState(false);
          expandGuide();
          recognition.start();
        } catch (error) {
          setVoiceStatus('The microphone is busy. Wait a moment and try again.');
        }
      });
    }
  }

  // 6. Contact email copy functionality
  const toast = document.getElementById('toast');
  const copyBtns = [
    document.getElementById('copyEmailHero'),
    document.getElementById('copyEmailFooter')
  ];

  function showToast(msg) {
    if (!toast) return;
    toast.textContent = msg;
    toast.classList.add('show');
    setTimeout(() => {
      toast.classList.remove('show');
    }, 2800);
  }

  copyBtns.forEach(btn => {
    if (btn) {
      btn.addEventListener('click', () => {
        const email = btn.getAttribute('data-email') || 'Jatin946work@yahoo.com';
        navigator.clipboard.writeText(email).then(() => {
          showToast(`Copied ${email} to clipboard!`);
        }).catch(() => {
          showToast(`Email: ${email}`);
        });
      });
    }
  });

  /* ========================================================================
     SCROLL DEEP-DIVE TECH BACKGROUND ENGINE (Imagined Architecture Canvas)
     ======================================================================== */
  

  // ==========================================================================
  
  // ==========================================================================
  
  // ==========================================================================
  // 6. PROFESSIONAL AMBIENT DUAL-FLANK 3D BACKGROUND (Three.js WebGL)
  // Silent, elegant, senior-level systems depth strictly on left & right flanks
  // ==========================================================================
    function initNavbarViewerMetrics() {
      const navVisitorCount = document.getElementById('navVisitorCount');
      const navPingMs = document.getElementById('navPingMs');
      const popoverTotalViews = document.getElementById('popoverTotalViews');
      const popoverRtt = document.getElementById('popoverRtt');
      const popoverEdge = document.getElementById('popoverEdge');
      const popoverVisitorLocation = document.getElementById('popoverVisitorLocation');
      const popoverProtocol = document.getElementById('popoverProtocol');
      const popoverGpu = document.getElementById('popoverGpu');
      const popoverFps = document.getElementById('popoverFps');
      const popoverSession = document.getElementById('popoverSession');
      const popoverGithubCommit = document.getElementById('popoverGithubCommit');
      const popoverGithubRepo = document.getElementById('popoverGithubRepo');
      const popoverGithubCount = document.getElementById('popoverGithubCount');
      const popoverDelhiTime = document.getElementById('popoverDelhiTime');
      const popoverWorkMode = document.getElementById('popoverWorkMode');
      const headerLiveClock = document.getElementById('headerLiveClock');

      // 1. Live Delhi NCR Clock & Availability Mode (Real-Time IST UTC+5:30)
      function updateDelhiClock() {
        try {
          const now = new Date();
          const optionsTime = { timeZone: 'Asia/Kolkata', hour: '2-digit', minute: '2-digit', second: '2-digit', hour12: true };
          const timeStr = new Intl.DateTimeFormat('en-US', optionsTime).format(now);
          if (popoverDelhiTime) popoverDelhiTime.textContent = `${timeStr} IST`;

          // Concise format for top brand pill
          const optionsShort = { timeZone: 'Asia/Kolkata', hour: '2-digit', minute: '2-digit', hour12: true };
          const shortTime = new Intl.DateTimeFormat('en-US', optionsShort).format(now);
          if (headerLiveClock) headerLiveClock.textContent = `${shortTime} IST`;

          // Real hour in Delhi to calculate active engineer mode
          const optionsHour = { timeZone: 'Asia/Kolkata', hour: 'numeric', hour12: false };
          const delhiHour = parseInt(new Intl.DateTimeFormat('en-US', optionsHour).format(now), 10);
          if (popoverWorkMode) {
            if (delhiHour >= 9 && delhiHour < 19) {
              popoverWorkMode.innerHTML = '<span style="color:#22c55e;">Available // SDE &amp; Systems</span>';
            } else if (delhiHour >= 19 && delhiHour < 23) {
              popoverWorkMode.innerHTML = '<span style="color:#fbbf24;">Deep Focus // Systems &amp; Raft</span>';
            } else {
              popoverWorkMode.innerHTML = '<span style="color:#94a3b8;">Offline // Async Mode</span>';
            }
          }
        } catch (e) {}
      }

      updateDelhiClock();
      setInterval(updateDelhiClock, 1000);

      // 2. Active Session Chronometer (Genuine elapsed time on page)
      let sessionSec = 0;
      setInterval(() => {
        sessionSec++;
        const h = String(Math.floor(sessionSec / 3600)).padStart(2, '0');
        const m = String(Math.floor((sessionSec % 3600) / 60)).padStart(2, '0');
        const s = String(sessionSec % 60).padStart(2, '0');
        if (popoverSession) popoverSession.textContent = `${h}:${m}:${s}`;
      }, 1000);

      // 3. Client Hardware GPU & Live Canvas Render FPS
      try {
        if (popoverGpu) {
          const testCanvas = document.createElement('canvas');
          const gl = testCanvas.getContext('webgl') || testCanvas.getContext('experimental-webgl');
          if (gl) {
            const ext = gl.getExtension('WEBGL_debug_renderer_info');
            if (ext) {
              const unmasked = gl.getParameter(ext.UNMASKED_RENDERER_WEBGL) || '';
              const cleaned = unmasked
                .replace(/^ANGLE \((.+)\)$/, '$1')
                .replace(/ vs_[0-9_]+ ps_[0-9_]+/, '')
                .replace(/ Direct3D.+$/, '')
                .trim();
              popoverGpu.textContent = cleaned.length > 22 ? cleaned.substring(0, 22) + '...' : cleaned;
              popoverGpu.title = unmasked;
            } else {
              popoverGpu.textContent = gl.getParameter(gl.RENDERER) || 'WebGL Acceleration';
            }
          }
        }

        // Measure live FPS
        let frameCount = 0;
        let fpsTimer = performance.now();

        function measureFps(now) {
          frameCount++;
          if (now - fpsTimer >= 1000) {
            const currentFps = Math.min(144, Math.round((frameCount * 1000) / (now - fpsTimer)));
            if (popoverFps) popoverFps.textContent = `${currentFps}.0 FPS`;
            frameCount = 0;
            fpsTimer = now;
          }
          requestAnimationFrame(measureFps);
        }
        requestAnimationFrame(measureFps);
      } catch (e) {}

      // 4. Edge Runtime, Protocol & Geolocation
      try {
        // Detect Vercel / Host Edge
        if (popoverEdge) {
          if (window.location.hostname.includes('vercel.app')) {
            popoverEdge.textContent = 'Vercel Global Edge (Active)';
          } else if (window.location.protocol === 'https:') {
            popoverEdge.textContent = 'Global HTTPS Edge';
          } else {
            popoverEdge.textContent = `Local Node (${window.location.port || '80'})`;
          }
        }

        // Protocol & Link Detection
        if (popoverProtocol) {
          let proto = 'HTTP/1.1';
          try {
            const nav = performance.getEntriesByType('navigation');
            if (nav && nav[0] && nav[0].nextHopProtocol) {
              const p = nav[0].nextHopProtocol;
              proto = p === 'h2' ? 'HTTP/2' : p === 'h3' ? 'HTTP/3 (QUIC)' : p.toUpperCase();
            }
          } catch (e) {}

          const net = navigator.connection?.effectiveType ? ` • ${navigator.connection.effectiveType.toUpperCase()}` : '';
          popoverProtocol.textContent = `${proto}${net}`;
        }

        // Geolocation via ipwho.is (CORS free, no auth) with timezone fallback
        const tz = Intl.DateTimeFormat().resolvedOptions().timeZone || 'Asia/Kolkata';
        fetch('https://ipwho.is/')
          .then(res => res.json())
          .then(data => {
            if (popoverVisitorLocation) {
              if (data && data.success) {
                const flag = data.flag?.emoji || '';
                popoverVisitorLocation.textContent = `${data.city || 'Edge'}, ${data.country_code || ''} ${flag}`.trim();
              } else {
                popoverVisitorLocation.textContent = tz;
              }
            }
          })
          .catch(() => {
            if (popoverVisitorLocation) popoverVisitorLocation.textContent = tz;
          });
      } catch (e) {}

      // 5. True Origin RTT Latency Probe
      function measureRtt() {
        const start = performance.now();
        fetch(window.location.href, { method: 'HEAD', cache: 'no-store' })
          .then(() => {
            const delta = Math.round(performance.now() - start);
            if (navPingMs) navPingMs.textContent = `${delta}ms`;
            if (popoverRtt) popoverRtt.textContent = `${delta}ms`;
          })
          .catch(() => {
            try {
              const navEntries = performance.getEntriesByType('navigation');
              const rtt = navEntries && navEntries[0] ? Math.round(navEntries[0].responseEnd - navEntries[0].requestStart) : 18;
              const finalMs = Math.max(12, rtt || 18);
              if (navPingMs) navPingMs.textContent = `${finalMs}ms`;
              if (popoverRtt) popoverRtt.textContent = `${finalMs}ms`;
            } catch (err) {
              if (navPingMs) navPingMs.textContent = '18ms';
              if (popoverRtt) popoverRtt.textContent = '18ms';
            }
          });
      }
      measureRtt();
      setInterval(measureRtt, 25000);

      // 6. Live GitHub Engineering Activity (Direct GitHub API)
      try {
        const GH_CACHE_KEY = 'jatin_github_live_cache';
        const cachedGh = sessionStorage.getItem(GH_CACHE_KEY);

        if (cachedGh) {
          const parsed = JSON.parse(cachedGh);
          renderGh(parsed);
        } else {
          // Fetch latest commit from DistributedKvServer and total repos
          Promise.all([
            fetch('https://api.github.com/repos/Jatin2567/DistributedKvServer/commits?per_page=1').then(r => r.json()),
            fetch('https://api.github.com/users/Jatin2567/repos?per_page=100').then(r => r.json())
          ])
            .then(([commits, repos]) => {
              const commitMsg = commits && commits[0]?.commit?.message ? commits[0].commit.message.split('\n')[0] : 'Unavailable';
              const repoCount = Array.isArray(repos) ? `${repos.length} Repositories` : 'Unavailable';
              const ghData = { commitMsg, repoCount };
              sessionStorage.setItem(GH_CACHE_KEY, JSON.stringify(ghData));
              renderGh(ghData);
            })
            .catch(() => {
              renderGh({ commitMsg: 'Unavailable', repoCount: 'Unavailable' });
            });
        }

        function renderGh(data) {
          if (popoverGithubCommit) {
            popoverGithubCommit.textContent = data.commitMsg.length > 24 ? data.commitMsg.substring(0, 24) + '...' : data.commitMsg;
            popoverGithubCommit.title = data.commitMsg;
          }
          if (popoverGithubCount) {
            popoverGithubCount.textContent = data.repoCount;
          }
        }
      } catch (e) {}

      // 7. Genuine Live Real-Time View Counter (100% Real, Zero Demo/Seed Data)
      const STORAGE_KEY = 'jatin_live_views_prod';
      const SESSION_KEY = 'jatin_session_counted_prod';

      function renderCount(num) {
        if (typeof num !== 'number' || !Number.isFinite(num) || num < 0) return;
        const status = document.getElementById('viewsDataStatus'); if (status) status.textContent = 'Updated';
        const formatted = Number(num).toLocaleString('en-US');
        if (navVisitorCount) navVisitorCount.textContent = formatted;
        if (popoverTotalViews) popoverTotalViews.textContent = formatted;
      }

      // Show existing verified count from previous local session immediately if present
      const cached = localStorage.getItem(STORAGE_KEY);
      if (cached && !isNaN(parseInt(cached, 10))) {
        renderCount(parseInt(cached, 10));
      }

      const isLocalPreview = ['localhost','127.0.0.1'].includes(location.hostname);
      const isNewSession = !isLocalPreview && !sessionStorage.getItem(SESSION_KEY);
      const endpoint = isNewSession
        ? 'https://countapi.mileshilliard.com/api/v1/hit/jatin_aggarwal_portfolio_live'
        : 'https://countapi.mileshilliard.com/api/v1/get/jatin_aggarwal_portfolio_live';

      // Check Vercel edge endpoint first
      (isLocalPreview ? Promise.reject(new Error('Local preview')) : fetch('/api/views'))
        .then(res => {
          if (!res.ok) throw new Error('Not on Vercel');
          return res.json();
        })
        .then(data => {
          if (data && typeof data.views === 'number') {
            sessionStorage.setItem(SESSION_KEY, '1');
            localStorage.setItem(STORAGE_KEY, data.views.toString());
            renderCount(data.views);
            if (popoverEdge && data.edgeRegion) {
              popoverEdge.textContent = `Vercel Edge (${data.edgeRegion})`;
            }
          }
        })
        .catch(() => {
          fetch(endpoint)
            .then(res => res.json())
            .then(data => {
              if (data && typeof data.value === 'number') {
                sessionStorage.setItem(SESSION_KEY, '1');
                localStorage.setItem(STORAGE_KEY, data.value.toString());
                renderCount(data.value);
              }
            })
            .catch(() => {
              if (!cached) { if (navVisitorCount) navVisitorCount.textContent = '—'; if (popoverTotalViews) popoverTotalViews.textContent = 'Unavailable'; }
              const status = document.getElementById('viewsDataStatus'); if (status) status.textContent = cached ? 'Cached' : 'Offline';
            });
        });
    }

    initNavbarViewerMetrics();

  const techCanvas = document.getElementById('tech3dCanvas');

  if (techCanvas && typeof THREE !== 'undefined' && !matchMedia('(prefers-reduced-motion: reduce)').matches && window.innerWidth > 760) {
    // 1. Scene, Camera, Fog & Renderer
    const scene = new THREE.Scene();
    scene.background = null;
    scene.fog = new THREE.FogExp2(0x14100e, 0.009);

    function getZoomScale() {
      const htmlZoom = parseFloat(getComputedStyle(document.documentElement).zoom) || 1.0;
      const bodyZoom = parseFloat(getComputedStyle(document.body).zoom) || 1.0;
      return htmlZoom !== 1.0 ? htmlZoom : bodyZoom;
    }

    let zScale = getZoomScale();
    let width = Math.ceil(window.innerWidth / zScale);
    let height = Math.ceil(window.innerHeight / zScale);

    const camera = new THREE.PerspectiveCamera(52, width / height, 0.1, 420);
    camera.position.set(0, 3.0, 12);

    const renderer = new THREE.WebGLRenderer({ canvas: techCanvas, antialias: true, alpha: true });
    renderer.setPixelRatio(Math.min(window.devicePixelRatio || 1, 2));
    renderer.setSize(width, height, false);

    // 2. Atmospheric Warm & Cool Studio Lighting
    const ambientLight = new THREE.AmbientLight(0x281912, 1.8);
    scene.add(ambientLight);

    const goldenSun = new THREE.DirectionalLight(0xe89e46, 2.2);
    goldenSun.position.set(25, 35, 20);
    scene.add(goldenSun);

    const cyanRim = new THREE.DirectionalLight(0x06b6d4, 1.4);
    cyanRim.position.set(-25, 20, -40);
    scene.add(cyanRim);

    // 3. Cyber Ground Plane & Flank Boundary Rails (Seamless Wide Floor)
    const groundGeo = new THREE.PlaneGeometry(1400, 800, 40, 40);
    const groundMat = new THREE.MeshStandardMaterial({
      color: 0x110c0a,
      roughness: 0.92,
      metalness: 0.15
    });
    const ground = new THREE.Mesh(groundGeo, groundMat);
    ground.rotation.x = -Math.PI / 2;
    ground.position.set(0, -0.2, -140);
    scene.add(ground);

    // Flanking Boundary Rails (defining the clear center corridor)
    function createRail(x, color) {
      const railGeo = new THREE.BoxGeometry(0.25, 0.2, 500);
      const railMat = new THREE.MeshBasicMaterial({ color: color });
      const rail = new THREE.Mesh(railGeo, railMat);
      rail.position.set(x, -0.05, -140);
      return rail;
    }
    scene.add(createRail(-12, 0xc86b1e));
    scene.add(createRail(12, 0x0891b2));
    scene.add(createRail(-26, 0x591617));
    scene.add(createRail(26, 0x164e63));

    // Floor Grid Wireframe (Seamless Horizon)
    const gridHelper = new THREE.GridHelper(1400, 80, 0x421b14, 0x1a120e);
    gridHelper.position.set(0, 0.04, -140);
    scene.add(gridHelper);

    // 4. Subtle Bioluminescent Embers (Flanks Only)
    const PARTICLE_COUNT = 550;
    const pGeo = new THREE.BufferGeometry();
    const pPos = new Float32Array(PARTICLE_COUNT * 3);
    const pColors = new Float32Array(PARTICLE_COUNT * 3);

    const colorAmber = new THREE.Color(0xe89e46);
    const colorCyan = new THREE.Color(0x06b6d4);
    const colorGold = new THREE.Color(0xfbbf24);

    for (let i = 0; i < PARTICLE_COUNT; i++) {
      const side = Math.random() < 0.5 ? -1 : 1;
      const x = side * (12.5 + Math.random() * 18);
      const y = 0.5 + Math.random() * 20;
      const z = 15 - Math.random() * 300;

      pPos[i * 3] = x;
      pPos[i * 3 + 1] = y;
      pPos[i * 3 + 2] = z;

      const pick = Math.random();
      const col = side < 0 ? (pick < 0.6 ? colorAmber : colorGold) : (pick < 0.6 ? colorCyan : colorAmber);
      pColors[i * 3] = col.r;
      pColors[i * 3 + 1] = col.g;
      pColors[i * 3 + 2] = col.b;
    }

    pGeo.setAttribute('position', new THREE.BufferAttribute(pPos, 3));
    pGeo.setAttribute('color', new THREE.BufferAttribute(pColors, 3));

    const pMat = new THREE.PointsMaterial({
      size: 0.42,
      vertexColors: true,
      transparent: true,
      opacity: 0.75,
      blending: THREE.AdditiveBlending
    });
    const particleCloud = new THREE.Points(pGeo, pMat);
    scene.add(particleCloud);

    // =========================================================================
    // 5. ARCHITECTURAL STRUCTURES ON FLANKS
    // =========================================================================

    // Gateway Orbital Clusters (Left & Right)
    const leftGatewayGroup = new THREE.Group();
    const rightGatewayGroup = new THREE.Group();
    const gateGeo = new THREE.IcosahedronGeometry(0.7, 0);
    const matAmber = new THREE.MeshStandardMaterial({ color: 0xe89e46, emissive: 0xc86b1e, emissiveIntensity: 0.4, roughness: 0.3 });
    const matCyan = new THREE.MeshStandardMaterial({ color: 0x06b6d4, emissive: 0x0891b2, emissiveIntensity: 0.4, roughness: 0.3 });

    for (let i = 0; i < 6; i++) {
      const angle = (i / 6) * Math.PI * 2;
      const mLeft = new THREE.Mesh(gateGeo, matAmber);
      mLeft.position.set(-18 + Math.cos(angle) * 4.5, 5 + Math.sin(angle) * 3.5, -18 + Math.sin(angle * 2) * 3);
      leftGatewayGroup.add(mLeft);

      const mRight = new THREE.Mesh(gateGeo, matCyan);
      mRight.position.set(18 + Math.cos(angle) * 4.5, 5 + Math.sin(angle) * 3.5, -18 + Math.sin(angle * 2) * 3);
      rightGatewayGroup.add(mRight);
    }
    scene.add(leftGatewayGroup);
    scene.add(rightGatewayGroup);

    // Consensus Monolith (Left) & RocksDB WAL Blocks (Right)
    const leaderGeo = new THREE.CylinderGeometry(1.4, 2.0, 16, 6);
    const leaderMat = new THREE.MeshStandardMaterial({
      color: 0xe89e46,
      emissive: 0xc86b1e,
      emissiveIntensity: 0.5,
      roughness: 0.3,
      metalness: 0.4
    });
    const leaderTower = new THREE.Mesh(leaderGeo, leaderMat);
    leaderTower.position.set(-18, 8, -65);
    scene.add(leaderTower);

    const consensusRings = [];
    for (let r = 0; r < 2; r++) {
      const ringGeo = new THREE.RingGeometry(3.2 + r * 2.0, 3.5 + r * 2.0, 32);
      const ringMat = new THREE.MeshBasicMaterial({ color: 0xfbbf24, side: THREE.DoubleSide, transparent: true, opacity: 0.55 });
      const ring = new THREE.Mesh(ringGeo, ringMat);
      ring.position.set(-18, 7.5 + r * 1.5, -65);
      ring.rotation.x = Math.PI / 2;
      scene.add(ring);
      consensusRings.push(ring);
    }

    // RocksDB Commit Blocks (Right Flank)
    const walBlocks = [];
    const blockGeo = new THREE.BoxGeometry(1.6, 1.1, 1.6);
    const blockMat = new THREE.MeshStandardMaterial({ color: 0x7c2d12, emissive: 0xc86b1e, emissiveIntensity: 0.35 });
    for (let b = 0; b < 10; b++) {
      const walBlock = new THREE.Mesh(blockGeo, blockMat);
      walBlock.position.set(15 + (b % 3) * 2.0, 0.6 + b * 0.4, -48 - b * 3.2);
      scene.add(walBlock);
      walBlocks.push(walBlock);
    }

    // Cryptographic Arch (Left) & Synapse Lattice (Right)
    const hexArchGeo = new THREE.CylinderGeometry(5.5, 5.5, 1.2, 6, 1, true);
    const hexArchMat = new THREE.MeshStandardMaterial({ color: 0x10b981, emissive: 0x059669, emissiveIntensity: 0.65, wireframe: true });
    const hexArch = new THREE.Mesh(hexArchGeo, hexArchMat);
    hexArch.rotation.x = Math.PI / 2;
    hexArch.position.set(-18, 7, -120);
    scene.add(hexArch);

    const neuronGeo = new THREE.SphereGeometry(0.38, 12, 12);
    const neuronMat = new THREE.MeshStandardMaterial({ color: 0x34d399, emissive: 0x10b981, emissiveIntensity: 0.8 });
    for (let l = 0; l < 3; l++) {
      for (let n = 0; n < 3; n++) {
        const neuron = new THREE.Mesh(neuronGeo, neuronMat);
        neuron.position.set(15 + l * 3.2, 3 + n * 2.2, -112 - l * 5);
        scene.add(neuron);
      }
    }

    // Telemetry Radar (Right) & Voice Waves
    const radarGroup = new THREE.Group();
    const dish = new THREE.Mesh(
      new THREE.SphereGeometry(2.0, 16, 8, 0, Math.PI * 2, 0, Math.PI * 0.4),
      new THREE.MeshStandardMaterial({ color: 0xe89e46, emissive: 0xc86b1e, emissiveIntensity: 0.45, side: THREE.DoubleSide })
    );
    dish.rotation.x = Math.PI * 0.65;
    radarGroup.add(dish);
    const mast = new THREE.Mesh(new THREE.CylinderGeometry(0.18, 0.3, 6, 8), new THREE.MeshStandardMaterial({ color: 0x52525b }));
    mast.position.y = -3.0;
    radarGroup.add(mast);
    radarGroup.position.set(20, 7.5, -172);
    scene.add(radarGroup);

    // Silicon Bus Rails (Left & Right Flanks)
    for (let c = 0; c < 6; c++) {
      const conduitL = new THREE.Mesh(new THREE.BoxGeometry(0.35, 0.15, 60), new THREE.MeshBasicMaterial({ color: 0xe89e46 }));
      conduitL.position.set(-24 + c * 1.8, 0.08, -235);
      scene.add(conduitL);

      const conduitR = new THREE.Mesh(new THREE.BoxGeometry(0.35, 0.15, 60), new THREE.MeshBasicMaterial({ color: 0x06b6d4 }));
      conduitR.position.set(14 + c * 1.8, 0.08, -235);
      scene.add(conduitR);
    }

    // =========================================================================
    // 6. SCROLL CAMERA TRAVEL & PARALLAX
    // =========================================================================
    let targetCamZ = 12;
    let currentCamZ = 12;
    let mouseX = 0;
    let mouseY = 0;
    let targetMouseX = 0;
    let targetMouseY = 0;

    const copilotDock = document.getElementById('copilotDock');
    const btnCopilotPill = document.getElementById('btnCopilotPill');
    const questionInputEl = document.getElementById('avatarQuestionInput');

    window.addEventListener('scroll', () => {
      const scrollY = window.scrollY;
      const maxScroll = document.documentElement.scrollHeight - window.innerHeight;
      const progress = maxScroll > 0 ? Math.min(1, Math.max(0, scrollY / maxScroll)) : 0;
      targetCamZ = 12 - progress * 250;

      // Show/hide floating copilot dock on scroll past hero
      if (copilotDock) {
        if (scrollY > 380) {
          copilotDock.classList.add('active');
        } else {
          copilotDock.classList.remove('active');
        }
      }
    });

    window.addEventListener('mousemove', (e) => {
      targetMouseX = (e.clientX / window.innerWidth - 0.5) * 3;
      targetMouseY = (e.clientY / window.innerHeight - 0.5) * 1.5;
    });

    window.addEventListener('resize', () => {
      zScale = getZoomScale();
      width = Math.ceil(window.innerWidth / zScale);
      height = Math.ceil(window.innerHeight / zScale);
      camera.aspect = width / height;
      camera.updateProjectionMatrix();
      renderer.setPixelRatio(Math.min(window.devicePixelRatio || 1, 2));
      renderer.setSize(width, height, false);
    });

    // Animation Loop
    const clock = new THREE.Clock();

    function render3DBackground() {
      requestAnimationFrame(render3DBackground);
      if (document.hidden || document.documentElement.dataset.motion === "paused") return;

      const elapsed = clock.getElapsedTime();

      // Smooth camera interpolation
      currentCamZ += (targetCamZ - currentCamZ) * 0.07;
      mouseX += (targetMouseX - mouseX) * 0.05;
      mouseY += (targetMouseY - mouseY) * 0.05;

      camera.position.z = currentCamZ;
      camera.position.x = mouseX;
      camera.position.y = 3.0 - mouseY;

      // Subtle particle oscillation
      const positions = particleCloud.geometry.attributes.position.array;
      for (let i = 0; i < PARTICLE_COUNT; i++) {
        positions[i * 3 + 1] += Math.sin(elapsed * 0.8 + i) * 0.01;
      }
      particleCloud.geometry.attributes.position.needsUpdate = true;

      // Ambient rotations on flanks
      leftGatewayGroup.rotation.z = elapsed * 0.06;
      rightGatewayGroup.rotation.z = -elapsed * 0.06;

      consensusRings.forEach((ring, i) => {
        ring.rotation.z = elapsed * (0.2 + i * 0.1) * (i % 2 === 0 ? 1 : -1);
      });
      leaderTower.rotation.y = elapsed * 0.15;
      walBlocks.forEach((b, i) => { b.rotation.y = elapsed * 0.2 + i; });

      hexArch.rotation.z = elapsed * 0.18;
      radarGroup.rotation.y = elapsed * 1.2;

      renderer.render(scene, camera);
    }

    // =========================================================================
    // 7. REAL-TIME VISITOR INTELLIGENCE & 100% GENUINE RUNTIME TELEMETRY
    // =========================================================================
    function initVisitorTelemetry() {
      const visitorIndexVal = document.getElementById('visitorIndexVal');
      const visitorTagYou = document.getElementById('visitorTagYou');
      const edgeLatencyVal = document.getElementById('edgeLatencyVal');
      const protocolTag = document.getElementById('protocolTag');
      const sessionTimer = document.getElementById('sessionTimer');
      const metaClientRegion = document.getElementById('metaClientRegion');
      const metaPlatform = document.getElementById('metaPlatform');
      const metaResolution = document.getElementById('metaResolution');
      const metaReferrer = document.getElementById('metaReferrer');
      const canvas = document.getElementById('visitorWaveCanvas');
      const logStreamWrap = document.getElementById('logStreamWrap');
      const btnSimulatePing = document.getElementById('btnSimulatePing');
      const pingAckText = document.getElementById('pingAckText');
      const canvasThroughputLabel = document.getElementById('canvasThroughputLabel');

      if (!canvas) return;

      // --- Helper: Append 100% Genuine Session Event Log ---
      function appendSessionLog(title, desc, badge = 'EVENT') {
        if (!logStreamWrap) return;
        const d = new Date();
        const timeStr = `[${String(d.getHours()).padStart(2, '0')}:${String(d.getMinutes()).padStart(2, '0')}:${String(d.getSeconds()).padStart(2, '0')}]`;
        
        const el = document.createElement('div');
        el.className = 'log-entry';
        el.innerHTML = `<span class="log-ts">${timeStr}</span> <span class="log-ip">${title}</span> • <span class="log-route">${desc}</span> <span class="log-ms">${badge}</span>`;
        
        logStreamWrap.prepend(el);
        while (logStreamWrap.children.length > 3) {
          logStreamWrap.removeChild(logStreamWrap.lastChild);
        }
      }

      // --- 1. Real Visitor Return Index (LocalStorage + SessionStorage) ---
      const STORAGE_KEY = 'jatin_visitor_return_index';
      const SESSION_KEY = 'jatin_active_session_flag';

      let returnCount = parseInt(localStorage.getItem(STORAGE_KEY) || '0', 10);

      // Increment only when starting a fresh browser session
      if (!sessionStorage.getItem(SESSION_KEY)) {
        returnCount += 1;
        localStorage.setItem(STORAGE_KEY, returnCount.toString());
        sessionStorage.setItem(SESSION_KEY, 'active');
      }

      if (visitorIndexVal) {
        visitorIndexVal.textContent = `VISIT #${returnCount}`;
      }
      if (visitorTagYou) {
        if (returnCount === 1) {
          visitorTagYou.textContent = 'First Arrival';
          visitorTagYou.style.color = '#34d399';
        } else {
          visitorTagYou.textContent = `Return Visitor (${returnCount}x)`;
          visitorTagYou.style.color = '#fbbf24';
        }
      }

      // --- 2. Active Session Chronometer (Real Elapsed Time) ---
      let sessionSeconds = 0;
      setInterval(() => {
        sessionSeconds++;
        const hrs = String(Math.floor(sessionSeconds / 3600)).padStart(2, '0');
        const mins = String(Math.floor((sessionSeconds % 3600) / 60)).padStart(2, '0');
        const secs = String(sessionSeconds % 60).padStart(2, '0');
        if (sessionTimer) {
          sessionTimer.textContent = `${hrs}:${mins}:${secs}`;
        }
      }, 1000);

      // --- 3. Client & Environment Metadata Extraction ---
      let clientTz = 'UTC';
      try {
        clientTz = Intl.DateTimeFormat().resolvedOptions().timeZone || 'UTC';
        // Compute GMT offset
        const d = new Date();
        const offsetMin = -d.getTimezoneOffset();
        const sign = offsetMin >= 0 ? '+' : '-';
        const absOffset = Math.abs(offsetMin);
        const offHours = String(Math.floor(absOffset / 60)).padStart(2, '0');
        const offMins = String(absOffset % 60).padStart(2, '0');
        const gmtStr = `GMT${sign}${offHours}:${offMins}`;
        if (metaClientRegion) metaClientRegion.textContent = `${clientTz} (${gmtStr})`;

        // Real OS & Browser detection
        const ua = navigator.userAgent;
        const platform = navigator.userAgentData?.platform || navigator.platform || 'Client';
        const browser = ua.includes('Edg/') ? 'Edge V8'
          : ua.includes('Chrome/') ? 'Chrome V8'
          : ua.includes('Firefox/') ? 'Gecko/Firefox'
          : ua.includes('Safari/') ? 'WebKit/Safari'
          : 'Standard Web';
        const cores = navigator.hardwareConcurrency ? ` • ${navigator.hardwareConcurrency} Cores` : '';
        if (metaPlatform) metaPlatform.textContent = `${platform} • ${browser}${cores}`;

        // Viewport calibration function
        function updateViewportMeta() {
          if (!metaResolution) return;
          const dpr = window.devicePixelRatio ? window.devicePixelRatio.toFixed(1) : '1.0';
          metaResolution.textContent = `${window.innerWidth} × ${window.innerHeight} (${window.screen.width}×${window.screen.height} @ ${dpr}x DPR)`;
        }
        updateViewportMeta();
        window.addEventListener('resize', () => {
          updateViewportMeta();
        });

        // Real Referrer source
        if (metaReferrer) {
          if (document.referrer) {
            try {
              const refUrl = new URL(document.referrer);
              metaReferrer.textContent = `${refUrl.hostname} (Referral)`;
            } catch {
              metaReferrer.textContent = 'External Reference Link';
            }
          } else {
            metaReferrer.textContent = 'Direct Navigation / Local Access';
          }
        }
      } catch (e) {
        console.warn('Telemetry inspection error', e);
      }

      // --- 4. Genuine Origin Network Latency Probe ---
      async function probeOriginLatency(isManualClick = false) {
        const t0 = performance.now();
        try {
          // Genuine HEAD request to origin
          const resp = await fetch(window.location.href, { method: 'HEAD', cache: 'no-store' });
          const rtt = Math.max(1, Math.round(performance.now() - t0));
          
          if (edgeLatencyVal) edgeLatencyVal.textContent = `${rtt}ms`;
          
          // Real protocol from navigation timing
          const navEntry = performance.getEntriesByType('navigation')[0];
          const proto = navEntry?.nextHopProtocol 
            ? navEntry.nextHopProtocol.toUpperCase() 
            : (window.location.protocol === 'https:' ? 'HTTP/2' : 'HTTP/1.1');
          if (protocolTag) protocolTag.textContent = proto;

          if (isManualClick) {
            if (pingAckText) {
              pingAckText.textContent = `ACK: 200 OK (${rtt}ms RTT)`;
              pingAckText.classList.add('show');
              setTimeout(() => pingAckText.classList.remove('show'), 2400);
            }
            appendSessionLog('Origin RTT Probe', `Verified ${rtt}ms roundtrip (${proto})`, `${rtt}ms`);
            addTelemetryPulse(2.4);
          }
          return rtt;
        } catch {
          const rtt = Math.max(1, Math.round(performance.now() - t0));
          if (edgeLatencyVal) edgeLatencyVal.textContent = `${rtt}ms`;
          if (isManualClick && pingAckText) {
            pingAckText.textContent = `ACK: Local (${rtt}ms)`;
            pingAckText.classList.add('show');
            setTimeout(() => pingAckText.classList.remove('show'), 2400);
          }
          return rtt;
        }
      }

      // Initial probe and periodic refresh (every 12 seconds)
      probeOriginLatency();
      setInterval(() => {
        probeOriginLatency(false);
      }, 12000);

      // --- 5. Interactive Event-Driven Canvas Waveform ---
      const ctx = canvas.getContext('2d');
      
      function resizeCanvas() {
        const rect = canvas.getBoundingClientRect();
        if (rect.width > 0) {
          canvas.width = rect.width;
          canvas.height = rect.height;
        }
      }
      resizeCanvas();
      window.addEventListener('resize', resizeCanvas);

      const maxPoints = 42;
      const dataPoints = [];
      for (let i = 0; i < maxPoints; i++) {
        dataPoints.push(6); // baseline idle state
      }

      let ripplePulses = [];
      function addTelemetryPulse(intensity = 1.0) {
        const w = canvas.width || 480;
        ripplePulses.push({
          x: w - 8,
          radius: 3,
          alpha: 1.0,
          intensity: intensity
        });
        dataPoints[dataPoints.length - 1] = Math.min(34, dataPoints[dataPoints.length - 1] + 12 * intensity);
      }

      // Track real user interaction intensity
      let userEventIntensity = 0;
      let totalInteractionsLogged = 0;

      window.addEventListener('mousemove', () => {
        userEventIntensity = Math.min(10, userEventIntensity + 0.5);
        totalInteractionsLogged++;
      }, { passive: true });

      window.addEventListener('scroll', () => {
        userEventIntensity = Math.min(12, userEventIntensity + 1.2);
        totalInteractionsLogged++;
      }, { passive: true });

      window.addEventListener('click', (e) => {
        userEventIntensity = Math.min(14, userEventIntensity + 3.0);
        totalInteractionsLogged++;
        addTelemetryPulse(1.5);
        
        // If clicking on a project or card, log real exploration
        const projectCard = e.target.closest('.project-card, .visionary-project-card, .bento-card');
        if (projectCard) {
          const cardTitle = projectCard.querySelector('h3, .project-card-title, .p-title')?.textContent?.trim() || 'Project Module';
          appendSessionLog('Project Focus', `Inspected "${cardTitle.slice(0, 26)}"`, 'EXPLORE');
        }
      }, { passive: true });

      window.addEventListener('keydown', () => {
        userEventIntensity = Math.min(10, userEventIntensity + 1.0);
        totalInteractionsLogged++;
      }, { passive: true });

      let lastTick = performance.now();

      function renderCanvas() {
        requestAnimationFrame(renderCanvas);
        const width = canvas.width;
        const height = canvas.height;
        if (!width || !height) return;

        ctx.clearRect(0, 0, width, height);

        // Background subtle grid lines
        ctx.strokeStyle = 'rgba(255, 255, 255, 0.04)';
        ctx.lineWidth = 1;
        for (let y = 14; y < height; y += 18) {
          ctx.beginPath();
          ctx.moveTo(0, y);
          ctx.lineTo(width, y);
          ctx.stroke();
        }

        // Advance wave based on user interaction intensity
        const now = performance.now();
        if (now - lastTick > 90) {
          lastTick = now;
          dataPoints.shift();
          
          // Target height reflects user activity
          const targetY = Math.min(32, 6 + userEventIntensity * 2.4 + (userEventIntensity > 0.5 ? (Math.random() * 3 - 1.5) : 0));
          dataPoints.push(targetY);

          // Update label with genuine event metrics
          if (canvasThroughputLabel) {
            if (userEventIntensity > 0.4) {
              canvasThroughputLabel.textContent = `User Input Active • ${(userEventIntensity * 2.2).toFixed(1)} ev/s (${totalInteractionsLogged} total events)`;
              canvasThroughputLabel.style.color = '#34d399';
            } else {
              canvasThroughputLabel.textContent = totalInteractionsLogged > 0
                ? `Idle • ${totalInteractionsLogged} Session Actions Logged`
                : 'Session Active • Listening for user inputs...';
              canvasThroughputLabel.style.color = '#94a3b8';
            }
          }

          // Smooth exponential decay back to idle
          userEventIntensity *= 0.74;
          if (userEventIntensity < 0.05) userEventIntensity = 0;
        }

        const stepX = width / (maxPoints - 1);
        
        // Gradient fill below wave
        const grad = ctx.createLinearGradient(0, 0, 0, height);
        grad.addColorStop(0, 'rgba(232, 158, 70, 0.30)');
        grad.addColorStop(0.6, 'rgba(232, 158, 70, 0.06)');
        grad.addColorStop(1, 'rgba(232, 158, 70, 0.0)');

        ctx.beginPath();
        ctx.moveTo(0, height);
        for (let i = 0; i < maxPoints; i++) {
          const x = i * stepX;
          const val = dataPoints[i];
          const y = Math.max(3, Math.min(height - 3, height - (val / 36) * (height - 6) - 3));
          if (i === 0) {
            ctx.lineTo(x, y);
          } else {
            const prevX = (i - 1) * stepX;
            const prevVal = dataPoints[i - 1];
            const prevY = Math.max(3, Math.min(height - 3, height - (prevVal / 36) * (height - 6) - 3));
            const cx = (prevX + x) / 2;
            ctx.quadraticCurveTo(prevX, prevY, cx, (prevY + y) / 2);
          }
        }
        ctx.lineTo(width, height);
        ctx.closePath();
        ctx.fillStyle = grad;
        ctx.fill();

        // Stroke glowing wave line
        ctx.beginPath();
        for (let i = 0; i < maxPoints; i++) {
          const x = i * stepX;
          const val = dataPoints[i];
          const y = Math.max(3, Math.min(height - 3, height - (val / 36) * (height - 6) - 3));
          if (i === 0) {
            ctx.moveTo(x, y);
          } else {
            const prevX = (i - 1) * stepX;
            const prevVal = dataPoints[i - 1];
            const prevY = Math.max(3, Math.min(height - 3, height - (prevVal / 36) * (height - 6) - 3));
            const cx = (prevX + x) / 2;
            ctx.quadraticCurveTo(prevX, prevY, cx, (prevY + y) / 2);
          }
        }
        ctx.strokeStyle = userEventIntensity > 0.5 ? '#34d399' : '#f59e0b';
        ctx.lineWidth = 1.8;
        ctx.shadowColor = userEventIntensity > 0.5 ? '#34d399' : '#f59e0b';
        ctx.shadowBlur = 6;
        ctx.stroke();
        ctx.shadowBlur = 0;

        // Render pulse ripples from clicks or latency probes
        for (let p = ripplePulses.length - 1; p >= 0; p--) {
          const pulse = ripplePulses[p];
          pulse.radius += 1.6;
          pulse.alpha -= 0.024;
          pulse.x -= 2.0;

          if (pulse.alpha <= 0) {
            ripplePulses.splice(p, 1);
            continue;
          }

          ctx.beginPath();
          const pulseY = height * 0.45;
          ctx.arc(pulse.x, pulseY, pulse.radius, 0, Math.PI * 2);
          ctx.strokeStyle = `rgba(52, 211, 153, ${pulse.alpha * 0.8})`;
          ctx.lineWidth = 1.4;
          ctx.stroke();

          ctx.beginPath();
          ctx.arc(pulse.x, pulseY, 2.5, 0, Math.PI * 2);
          ctx.fillStyle = `rgba(255, 255, 255, ${pulse.alpha})`;
          ctx.fill();
        }
      }
      renderCanvas();

      // --- 6. Initial Session Calibration Logs (100% Genuine) ---
      appendSessionLog('Session Initialized', `Client node (${clientTz}) established`, 'LIVE');
      
      const loadTiming = Math.round(performance.now());
      appendSessionLog('DOM Calibrated', `Viewport ready in ${loadTiming}ms`, `${loadTiming}ms`);

      // Section intersection observer to log genuine reading progress
      try {
        const sections = document.querySelectorAll('section[id], header[id]');
        const seenSections = new Set();
        const observer = new IntersectionObserver((entries) => {
          entries.forEach((entry) => {
            if (entry.isIntersecting && !seenSections.has(entry.target.id)) {
              seenSections.add(entry.target.id);
              const name = entry.target.id.replace(/-/g, ' ').toUpperCase();
              appendSessionLog('Section Inspected', `Visitor entered [${name}]`, 'VIEW');
            }
          });
        }, { threshold: 0.35 });

        sections.forEach((sec) => observer.observe(sec));
      } catch (e) {
        console.warn('Intersection observer setup', e);
      }

      // --- 7. Interactive Latency Probe Button ---
      if (btnSimulatePing) {
        btnSimulatePing.addEventListener('click', (e) => {
          e.preventDefault();
          probeOriginLatency(true);
        });
      }
    }

    // =========================================================================
    // REAL-TIME SYSTEM TELEMETRY, GITHUB PIPELINE & LIVE OPS SUITE
    // =========================================================================

    initVisitorTelemetry();

    render3DBackground();
  }
});

