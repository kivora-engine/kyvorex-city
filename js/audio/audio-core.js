// kyvorex-city/js/audio/audio-core.js
// Rôle : AudioContext, déblocage, muet, tone() et noise() (aucun asset)
// Dépend de : GAME.config.audio
// Expose : GAME.audio (init, unlock, isUnlocked, isMuted, toggleMute, tone, noise, getCtx, getMaster)

window.GAME = window.GAME || {};

(function () {

  var ctx = null;
  var master = null;
  var noiseBuffer = null;
  var muted = false;
  var unlocked = false;

  function readMute() {
    try { return localStorage.getItem(GAME.config.audio.muteKey) === '1'; }
    catch (e) { return false; }
  }
  function writeMute(v) {
    try { localStorage.setItem(GAME.config.audio.muteKey, v ? '1' : '0'); }
    catch (e) {}
  }

  function getNoiseBuffer() {
    if (noiseBuffer) return noiseBuffer;
    var len = Math.floor(ctx.sampleRate);
    noiseBuffer = ctx.createBuffer(1, len, ctx.sampleRate);
    var d = noiseBuffer.getChannelData(0);
    for (var i = 0; i < len; i++) d[i] = Math.random() * 2 - 1;
    return noiseBuffer;
  }

  function ensureCtx() {
    if (ctx) return true;
    try {
      var AC = window.AudioContext || window.webkitAudioContext;
      if (!AC) return false;
      ctx = new AC();
      master = ctx.createGain();
      master.gain.value = muted ? 0 : GAME.config.audio.master;
      master.connect(ctx.destination);
      return true;
    } catch (e) { ctx = null; return false; }
  }

  function doUnlock() {
    if (unlocked) return;
    if (!GAME.config.audio.enabled) return;
    if (!ensureCtx()) return;
    try { ctx.resume(); } catch (e) {}
    unlocked = true;
  }

  GAME.audio = {
    getCtx: function () { return ctx; },
    getMaster: function () { return master; },
    isMuted: function () { return muted; },
    isUnlocked: function () { return unlocked; },
    unlock: doUnlock,

    init: function () {
      if (!GAME.config.audio.enabled) return;
      muted = readMute();

      var handler = function () {
        doUnlock();
        if (unlocked) {
          window.removeEventListener('pointerdown', handler);
          window.removeEventListener('keydown', handler);
        }
      };
      window.addEventListener('pointerdown', handler);
      window.addEventListener('keydown', handler);

      document.addEventListener('visibilitychange', function () {
        if (!ctx) return;
        try {
          if (document.hidden) ctx.suspend();
          else ctx.resume();
        } catch (e) {}
      });
    },

    toggleMute: function () {
      muted = !muted;
      writeMute(muted);
      if (master) {
        try { master.gain.value = muted ? 0 : GAME.config.audio.master; }
        catch (e) {}
      }
      return muted;
    },

    // Une note courte, avec enveloppe et glissement optionnel
    tone: function (freq, dur, type, vol, endFreq) {
      if (!ctx || muted || !GAME.config.audio.enabled) return;
      try {
        var osc = ctx.createOscillator();
        var g = ctx.createGain();
        osc.type = type || 'sine';
        osc.frequency.setValueAtTime(freq, ctx.currentTime);
        if (endFreq) {
          osc.frequency.linearRampToValueAtTime(endFreq, ctx.currentTime + dur);
        }
        g.gain.setValueAtTime(0, ctx.currentTime);
        g.gain.linearRampToValueAtTime(vol, ctx.currentTime + 0.005);
        g.gain.exponentialRampToValueAtTime(0.0001, ctx.currentTime + dur);
        osc.connect(g);
        g.connect(master);
        osc.onended = function () {
          try { osc.disconnect(); g.disconnect(); } catch (e) {}
        };
        osc.start();
        osc.stop(ctx.currentTime + dur + 0.02);
      } catch (e) {}
    },

    // Bruit blanc filtré, court
    noise: function (dur, vol, cutoff) {
      if (!ctx || muted || !GAME.config.audio.enabled) return;
      try {
        var src = ctx.createBufferSource();
        src.buffer = getNoiseBuffer();
        var filt = ctx.createBiquadFilter();
        filt.type = 'lowpass';
        filt.frequency.value = cutoff || 900;
        var g = ctx.createGain();
        g.gain.setValueAtTime(vol, ctx.currentTime);
        g.gain.exponentialRampToValueAtTime(0.0001, ctx.currentTime + dur);
        src.connect(filt);
        filt.connect(g);
        g.connect(master);
        src.onended = function () {
          try { src.disconnect(); filt.disconnect(); g.disconnect(); } catch (e) {}
        };
        src.start();
        src.stop(ctx.currentTime + dur + 0.02);
      } catch (e) {}
    }
  };
})();