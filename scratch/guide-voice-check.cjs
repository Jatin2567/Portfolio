// Run with: node --test scratch/guide-voice-check.cjs
const { test } = require('node:test');
const assert = require('node:assert/strict');
const { readFileSync } = require('node:fs');
const { join } = require('node:path');
const { runInNewContext } = require('node:vm');

const source = readFileSync(join(__dirname, '..', 'local-guide-voice.js'), 'utf8');

function browser({ available = () => 'available', install = () => true, legacy = false, voices = [] } = {}) {
  const calls = { recordings: [], downloads: [], replies: [], transcripts: [], offers: [], status: [] };
  class Recognition {
    static available(options) {
      assert.equal(options.processLocally, true);
      return available();
    }
    static install(options) {
      assert.equal(options.processLocally, true);
      calls.downloads.push(options.langs[0]);
      return install();
    }
    set processLocally(value) { this.local = value; }
    get processLocally() { return this.local; }
    start() {
      assert.equal(this.local, true);
      calls.recordings.push(this);
      this.onstart();
    }
    abort() { this.aborted = true; }
  }
  const synth = new EventTarget();
  synth.getVoices = () => voices;
  synth.speak = line => calls.replies.push(line);
  synth.cancel = () => {};
  const window = Object.assign(new EventTarget(), {
    isSecureContext: true,
    navigator: { languages: ['en-US'], userActivation: { isActive: true } },
    SpeechRecognition: legacy ? undefined : Recognition,
    webkitSpeechRecognition: class { start() { assert.fail('Cloud recognizer started'); } },
    speechSynthesis: synth,
    SpeechSynthesisUtterance: class { constructor(text) { this.text = text; } },
  });
  runInNewContext(source, { window, document: new EventTarget(), setTimeout, clearTimeout });
  const voice = window.createLocalGuideVoice({
    onTranscript: (text, final) => calls.transcripts.push([text, final]),
    onStatus: text => calls.status.push(text),
    onInstallOffer: value => calls.offers.push(value),
  });
  return { voice, calls, synth };
}

test('legacy cloud recognition leaves the microphone closed and offers typing', async () => {
  const { voice, calls } = browser({ legacy: true });
  await voice.listen();
  assert.equal(calls.recordings.length, 0);
  assert.match(calls.status.at(-1), /type your question/i);
});

test('checking for English never downloads a pack, and installing never starts recording', async () => {
  let installed = false;
  const { voice, calls } = browser({
    available: () => installed ? 'available' : 'downloadable',
    install: () => (installed = true),
  });
  await voice.listen();
  assert.deepEqual(calls.downloads, []);
  assert.deepEqual(calls.offers, [true]);
  await voice.install();
  assert.deepEqual(calls.downloads, ['en-US']);
  assert.deepEqual(calls.offers, [true, false]);
  assert.equal(calls.recordings.length, 0);
  await voice.listen();
  assert.equal(calls.recordings.length, 1);
});

test('cancel invalidates a pending pack check before it can open the microphone', async () => {
  let resolve;
  const { voice, calls } = browser({ available: () => new Promise(done => { resolve = done; }) });
  const pending = voice.listen();
  voice.cancel();
  resolve('available');
  await pending;
  assert.deepEqual(calls.recordings, []);
});

test('an interim transcript is editable and the final result submits only once', async () => {
  const { voice, calls } = browser();
  await voice.listen();
  const engine = calls.recordings[0];
  const deliver = engine.onresult;
  const event = (text, isFinal) => ({ results: [Object.assign([{ transcript: text }], { isFinal })] });
  deliver(event('show', false));
  deliver(event('show projects', true));
  deliver(event('show projects', true)); // A late callback from the stopped session.
  assert.deepEqual(calls.transcripts, [['show', false], ['show projects', true]]);
  assert.equal(engine.aborted, true);
});

test('replies wait for an installed, recognized male English voice', () => {
  const voices = [
    { name: 'Microsoft David Desktop', lang: 'en-US', localService: false },
    { name: 'Samantha', lang: 'en-US', localService: true, default: true },
    { name: 'Daniel', lang: 'fr-FR', localService: true },
  ];
  const { voice, calls, synth } = browser({ voices });
  voice.speak('first reply');
  synth.dispatchEvent(new Event('voiceschanged'));
  assert.deepEqual(calls.replies, []);
  voice.cancel();
  const local = { name: 'Daniel', lang: 'en-GB', localService: true };
  voices.push(local);
  synth.dispatchEvent(new Event('voiceschanged'));
  assert.deepEqual(calls.replies, []);
  voice.speak('second reply');
  assert.deepEqual(calls.replies.map(reply => reply.voice), [local]);
  voice.destroy();
});

test('only the audio reads technical terms phonetically and keeps unrelated words and numbers', () => {
  const { voice, calls } = browser({ voices: [{ name: 'Daniel', lang: 'en-GB', localService: true }] });
  const visible = 'B.Tech in 2027. SQL and Node.js for a 3-node service; GitHub CI/CD for C++/C#. ';
  const audible = 'Bachelor of Technology in 2027. S Q L and Node J S for a 3 node service; Git Hub C I C D for C plus plus/C sharp. ';
  const untouched = 'SQLite, PostgreSQL, C++17, CSQLError, _SQL, GitHubActions, 28+, 2.75, https://example.com/SQL.';
  const pageAnswer = Object.freeze({ text: visible + untouched });
  voice.speak(pageAnswer.text);
  assert.equal(calls.replies.length, 1);
  assert.equal(calls.replies[0].text, audible + untouched);
  assert.equal(pageAnswer.text, visible + untouched);
  voice.destroy();
});
