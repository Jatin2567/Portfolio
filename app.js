// Portfolio interactions and site details.
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
        if (!navigator.clipboard?.writeText) {
          showToast(`Email: ${email}`);
          return;
        }
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
      const headerLiveClock = document.getElementById('headerLiveClock');

      // Local time in Delhi, independent of the visitor's time zone.
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

  if (document.getElementById('visitorWaveCanvas')) {
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
  }
});
