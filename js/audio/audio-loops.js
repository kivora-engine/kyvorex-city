// kyvorex-city/js/audio/audio-loops.js
// Rôle : moteur et sirène en continu (nœuds créés une seule fois)
// Dépend de : GAME.audio, GAME.config.audio, GAME.car, GAME.game, GAME.wanted, GAME.policeCars
// Expose : GAME.audioLoops.update(dt)

window.GAME = window.GAME || {};

(function () {

  var engine = null;      // { osc, filt, gain }
  var siren = null;       // { osc, gain }
  var sirenTimer = 0;
  var sirenFlip = false;
  var built = false;

  function build() {
    if (built) return;
    var ctx = GAME.audio.getCtx();
    var master = GAME.audio.getMaster();
    if (!ctx || !master) return;
    try {
      // Moteur : sawtooth + passe-bas
      var eOsc = ctx.createOscillator();
      var eFilt = ctx.createBiquadFilter();
      var eGain = ctx.createGain();
      eOsc.type = 'sawtooth';
      eOsc.frequency.value = GAME.config.audio.engineMinHz;
      eFilt.type = 'lowpass';
      eFilt.frequency.value = 600;
      eGain.gain.value = 0;
      eOsc.connect(eFilt);
      eFilt.connect(eGain);
      eGain.connect(master);
      eOsc.start();
      engine = { osc: eOsc, filt: eFilt, gain: eGain };

      // Sirène : square
      var sOsc = ctx.createOscillator();
      var sGain = ctx.createGain();
      sOsc.type = 'square';
      sOsc.frequency.value = GAME.config.audio.sirenHz1;
      sGain.gain.value = 0;
      sOsc.connect(sGain);
      sGain.connect(master);
      sOsc.start();
      siren = { osc: sOsc, gain: sGain };

      built = true;
    } catch (e) {}
  }

  GAME.audioLoops = {
    update: function (dt) {
      if (!GAME.config.audio.enabled) return;
      if (!GAME.audio.isUnlocked()) return;
      build();
      if (!built) return;

      var ctx = GAME.audio.getCtx();
      var a = GAME.config.audio;
      var playing = GAME.game && GAME.game.state === 'playing';

      // --- Moteur (fréquence + volume selon vitesse) ---
      var ratio = Math.abs(GAME.car.speed) / GAME.config.car.maxSpeed;
      if (ratio > 1) ratio = 1;
      var freq = a.engineMinHz + (a.engineMaxHz - a.engineMinHz) * ratio;
      var vol = playing ? a.engineVol * (0.4 + 0.6 * ratio) : 0;
      try {
        engine.osc.frequency.setTargetAtTime(freq, ctx.currentTime, 0.05);
        engine.gain.gain.setTargetAtTime(vol, ctx.currentTime, 0.05);
      } catch (e) {}

      // --- Sirène (volume selon distance police la plus proche) ---
      var sirenVol = 0;
      if (playing && GAME.wanted.active && GAME.wanted.fleeingTimer <= 0) {
        var minD = Infinity;
        if (GAME.policeCars) {
          for (var i = 0; i < GAME.policeCars.length; i++) {
            var p = GAME.policeCars[i];
            var dx = p.x - GAME.car.x;
            var dy = p.y - GAME.car.y;
            var d = Math.sqrt(dx * dx + dy * dy);
            if (d < minD) minD = d;
          }
        }
        var v = 1 - minD / a.sirenMaxDist;
        if (v < 0) v = 0;
        if (v > 1) v = 1;
        sirenVol = a.sirenVol * v;
      }
      sirenTimer -= dt;
      if (sirenTimer <= 0) {
        sirenFlip = !sirenFlip;
        sirenTimer = a.sirenPeriod;
        var hz = sirenFlip ? a.sirenHz2 : a.sirenHz1;
        try { siren.osc.frequency.setTargetAtTime(hz, ctx.currentTime, 0.02); }
        catch (e) {}
      }
      try { siren.gain.gain.setTargetAtTime(sirenVol, ctx.currentTime, 0.05); }
      catch (e) {}
    }
  };
})();