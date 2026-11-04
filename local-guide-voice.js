// Optional local voice controls for the portfolio guide. Nothing records on startup.
(() => {
  'use strict';

  // The Web Speech API does not expose gender. Use known voice names and decline
  // unfamiliar voices, including an unnamed device default.
  const appleMale = /^(?:Alex|Aaron|Daniel|Evan|Fred|Lee|Oliver|Rishi|Tom)(?: \((?:Enhanced|Premium|Compact)\))?$/i;
  const windowsMale = /^Microsoft (?:David|Mark|George|James|Ravi|Richard|Sean)(?: Desktop| Mobile)?(?: - English(?: \([^)]+\))?)?$/i;
  const noVoice = 'Text reply only. No matching male English voice is available on this device.';
  const noMicrophone = 'This browser can’t listen on this device. Type your question instead.';

  const pronunciations = new Map([
    ['sql', 'S Q L'], ['node.js', 'Node J S'], ['b.tech', 'Bachelor of Technology'],
    ['c++', 'C plus plus'], ['c#', 'C sharp'], ['github', 'Git Hub'], ['ci/cd', 'C I C D'],
  ]);

  // Match standalone terms in prose. Keep identifiers, versions, and names like
  // SQLite and PostgreSQL intact. Numbers stay in the source's notation.
  const spokenTerm = /\b(?:https?:\/\/|www\.)\S+|(^|[^\p{L}\p{M}\p{N}_@])(SQL|Node\.js|B\.Tech|C\+\+|C#|GitHub|CI\/CD|\d+[-‐‑]node)(?![\p{L}\p{M}\p{N}_+#]|\.[\p{L}\p{N}])/giu;
  function textForSpeech(text) {
    return text.replace(spokenTerm, (match, prefix, term) => {
      if (!term) return match; // Leave a full URL in its original form.
      return prefix + (pronunciations.get(term.toLowerCase()) ?? term.replace(/[-‐‑]node$/i, ' node'));
    });
  }

  function localVoice(voices) {
    return voices.find(({ name, lang, localService }) =>
      localService === true && /^en(?:[-_]|$)/i.test(lang) &&
      (appleMale.test(name) || windowsMale.test(name) || name === 'Google UK English Male')
    );
  }

  function recognitionError(code) {
    switch (code) {
      case 'not-allowed':
      case 'service-not-allowed':
      case 'NotAllowedError':
      case 'SecurityError':
        return 'Voice input is blocked. Allow access in your browser or type a question.';
      case 'audio-capture':
        return 'No microphone found. Connect one or type a question.';
      case 'no-speech':
        return 'I didn’t hear anything. Tap the microphone to try again.';
      case 'language-not-supported':
        return 'English voice input isn’t installed on this device. Typing still works.';
      default:
        return 'Voice input stopped. Tap to retry or type a question.';
    }
  }

  window.createLocalGuideVoice = function ({
    onStatus = () => {}, onListening = () => {}, onSpeaking = () => {},
    onTranscript = () => {}, onInstallOffer = () => {},
  } = {}) {
    const synth = window.speechSynthesis;
    let muted = false;
    let disposed = false;
    let capture = null;
    let utterance = null;
    let voiceLookup = null;
    let offeredPack = null;
    let installing = null;

    function endCapture() {
      const session = capture;
      capture = null;
      if (!session) return;
      if (session.recognition) {
        const engine = session.recognition;
        engine.onstart = engine.onresult = engine.onerror = engine.onend = null;
        // abort() may throw if a browser has already closed the input.
        try { engine.abort(); } catch { /* Already stopped. */ }
      }
      onListening(false);
    }

    function stopSpeech() {
      if (voiceLookup) voiceLookup();
      if (!utterance) return;
      utterance.onstart = utterance.onend = utterance.onerror = null;
      utterance = null;
      synth.cancel();
      onSpeaking(false);
    }

    function dismissOffer() {
      if (!offeredPack) return;
      offeredPack = null;
      onInstallOffer(false);
    }

    function cancel() {
      installing = null;
      dismissOffer();
      endCapture();
      stopSpeech();
    }

    async function install() {
      if (disposed || !offeredPack || installing) return;
      if (!window.navigator.userActivation?.isActive) {
        onStatus('Select Download English voice input to get the speech pack.');
        return;
      }
      const pack = offeredPack;
      installing = pack;
      dismissOffer();
      onStatus('Downloading the English speech pack. You can type while it installs.');
      try {
        const success = await pack.api.install({ langs: [pack.lang], processLocally: true });
        if (installing !== pack) return;
        onStatus(success === true
          ? 'English voice input is ready. Tap the microphone to speak.'
          : 'The speech pack didn’t install. You can still type a question.');
      } catch {
        if (installing === pack) onStatus('The browser blocked the speech pack download. Typing still works.');
      } finally {
        if (installing === pack) installing = null;
      }
    }

    async function listen() {
      if (disposed) return;
      if (installing) {
        onStatus('The English speech pack is still downloading.');
        return;
      }
      if (capture) {
        endCapture();
        onStatus('Microphone off.');
        return;
      }
      stopSpeech();
      const Recognition = [window.SpeechRecognition, window.webkitSpeechRecognition]
        .find(api => typeof api?.available === 'function' && 'processLocally' in api.prototype);
      if (!Recognition || window.isSecureContext === false) {
        onStatus(noMicrophone);
        return;
      }
      if (!window.navigator.userActivation?.isActive) {
        onStatus('Tap the microphone to speak.');
        return;
      }
      dismissOffer();

      // A pending language check can be cancelled by closing the guide, tapping
      // again or navigating away. Never allow its delayed result to open the mic.
      const session = {};
      capture = session;
      onStatus('Checking for English voice input…');
      try {
        const languages = Array.from(new Set([
          ...(window.navigator.languages || []).filter(lang => /^en(?:-|$)/i.test(lang)),
          'en-US', 'en-GB', 'en-IN',
        ]));
        let lang;
        let downloading = false;
        let downloadableLang;
        for (const candidate of languages) {
          const status = await Recognition.available({ langs: [candidate], processLocally: true });
          if (capture !== session) return;
          if (status === 'available') {
            lang = candidate;
            break;
          }
          if (status === 'downloading') downloading = true;
          if (status === 'downloadable' && !downloadableLang) downloadableLang = candidate;
        }
        if (!lang) {
          endCapture();
          if (downloadableLang && !downloading && typeof Recognition.install === 'function') {
            offeredPack = { api: Recognition, lang: downloadableLang };
            onStatus('To speak privately, download an English speech pack to this device. You can also type.');
            onInstallOffer(true);
            return;
          }
          onStatus(downloading
            ? 'The English speech pack is still downloading. You can type while you wait.'
            : 'English voice input isn’t available on this device. Type your question instead.');
          return;
        }

        const engine = new Recognition();
        session.recognition = engine;
        engine.processLocally = true;
        if (engine.processLocally !== true) {
          endCapture();
          onStatus(noMicrophone);
          return;
        }
        engine.lang = lang;
        engine.continuous = false;
        engine.interimResults = true;
        engine.onstart = () => {
          if (capture !== session) return;
          onListening(true);
          onStatus('Listening. Pause when you’ve finished your question.');
        };
        engine.onresult = event => {
          if (capture !== session) return;
          const results = Array.from(event.results);
          const transcript = results.map(result => result[0]?.transcript.trim()).filter(Boolean).join(' ');
          if (!transcript) return;
          const final = results.every(result => result.isFinal);
          if (final) endCapture();
          onTranscript(transcript, final);
        };
        engine.onerror = event => {
          if (capture !== session) return;
          endCapture();
          onStatus(recognitionError(event.error));
        };
        engine.onend = () => {
          if (capture !== session) return;
          endCapture();
          onStatus('Listening ended. Tap the microphone to try again.');
        };
        engine.start();
      } catch (error) {
        if (capture !== session) return;
        endCapture();
        onStatus(recognitionError(error.name));
      }
    }

    function speak(text) {
      if (disposed) return;
      cancel();
      if (muted || !text?.trim()) return;
      if (!synth || !window.SpeechSynthesisUtterance) {
        onStatus('This browser can’t read replies aloud. The answer is in the chat.');
        return;
      }
      function play(voice) {
        const line = new window.SpeechSynthesisUtterance(textForSpeech(text));
        utterance = line;
        line.voice = voice;
        line.lang = voice.lang;
        line.rate = 0.96;
        line.onstart = () => {
          if (utterance !== line) return;
          onSpeaking(true);
          onStatus('Reading aloud.');
        };
        function finish(message) {
          if (utterance !== line) return;
          utterance = null;
          onSpeaking(false);
          onStatus(message);
        }
        line.onend = () => finish('');
        line.onerror = () => finish('Playback stopped. The answer is in the chat.');
        try { synth.speak(line); }
        catch { finish('Playback couldn’t start. The answer is in the chat.'); }
      }

      const ready = localVoice(synth.getVoices());
      if (ready) {
        play(ready);
        return;
      }
      // Some browsers report default or remote voices before installed voices
      // arrive. Keep this lookup bound to this reply and drop it on cancellation.
      onStatus('Finding an installed voice…');
      function clearLookup() {
        clearTimeout(timeout);
        synth.removeEventListener('voiceschanged', onVoicesChanged);
        voiceLookup = null;
      }
      function onVoicesChanged() {
        if (voiceLookup !== clearLookup) return;
        const voice = localVoice(synth.getVoices());
        if (!voice) return;
        clearLookup();
        play(voice);
      }
      const timeout = setTimeout(() => {
        if (voiceLookup !== clearLookup) return;
        const voice = localVoice(synth.getVoices());
        clearLookup();
        if (voice) play(voice);
        else onStatus(noVoice);
      }, 1200);
      voiceLookup = clearLookup;
      synth.addEventListener('voiceschanged', onVoicesChanged);
    }

    function setMuted(value) {
      muted = Boolean(value);
      if (muted) cancel();
    }

    function onVisibilityChange() {
      if (document.hidden) cancel();
    }
    document.addEventListener('visibilitychange', onVisibilityChange);
    window.addEventListener('pagehide', cancel);
    function destroy() {
      disposed = true;
      cancel();
      document.removeEventListener('visibilitychange', onVisibilityChange);
      window.removeEventListener('pagehide', cancel);
    }
    return { listen, install, speak, setMuted, cancel, destroy };
  };
})();
