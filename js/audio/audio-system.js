// kyvorex-city/js/audio/audio-system.js
// Rôle : détecte les événements en lisant l'état et joue les sons ; bouton muet
// Dépend de : GAME.audio, GAME.audioLoops, GAME.missionState, GAME.wanted, GAME.police, GAME.game, GAME.collision
// Expose : GAME.sound (init, update)

window.GAME = window.GAME || {};

(function () {

  var prev = {
    missionState: null,
    wantedActive: false,
    contactSeconds: 0,
    gameState: null
  };
  var crashCooldown = 0;

  GAME.sound = {

    init: function () {
      GAME.audio.init();

      var btn = document.getElementById('mute');
      if (btn) {
        btn.addEventListener('pointerup', function (e) {
          e.preventDefault();
          GAME.audio.unlock();
          var m = GAME.audio.toggleMute();
          if (m) btn.classList.add('coupe');
          else btn.classList.remove('coupe');
        });
        btn.addEventListener('contextmenu', function (e) { e.preventDefault(); });
        if (GAME.audio.isMuted()) btn.classList.add('coupe');
      }

      // Snapshot initial
      prev.missionState = GAME.missionState ? GAME.missionState.state : null;
      prev.wantedActive = GAME.wanted ? GAME.wanted.active : false;
      prev.contactSeconds = GAME.police ? GAME.police.contactSeconds : 0;
      prev.gameState = GAME.game ? GAME.game.state : null;
    },

    update: function (dt) {
      if (crashCooldown > 0) crashCooldown -= dt;
      if (!GAME.config.audio.enabled) return;

      var a = GAME.config.audio;
      var audio = GAME.audio;

      // --- Crash (choc violent pendant la partie) ---
      if (GAME.game && GAME.game.state === 'playing'
          && GAME.collision.lastImpact > a.crashMinImpact
          && crashCooldown <= 0) {
        var impactVol = Math.min(1, GAME.collision.lastImpact / 340);
        audio.noise(0.18, a.crashVol * impactVol, 900);
        crashCooldown = 0.15;
      }

      // --- Mission ---
      var ms = GAME.missionState ? GAME.missionState.state : null;
      if (prev.missionState === 'pickup' && ms === 'delivery') {
        audio.tone(660, 0.08, 'square', 0.25);
        setTimeout(function () { audio.tone(880, 0.08, 'square', 0.25); }, 90);
      } else if (prev.missionState === 'delivery' && ms === 'done') {
        audio.tone(523, 0.09, 'triangle', 0.28);
        setTimeout(function () { audio.tone(659, 0.09, 'triangle', 0.28); }, 95);
        setTimeout(function () { audio.tone(784, 0.09, 'triangle', 0.28); }, 190);
      } else if (prev.missionState === 'delivery' && ms === 'failed') {
        audio.tone(300, 0.4, 'sawtooth', 0.28, 150);
      }
      prev.missionState = ms;

      // --- Alerte police activée ---
      var activeNow = GAME.wanted ? GAME.wanted.active : false;
      if (!prev.wantedActive && activeNow) {
        audio.tone(900, 0.1, 'square', 0.25);
        setTimeout(function () { audio.tone(900, 0.1, 'square', 0.25); }, 150);
      }
      prev.wantedActive = activeNow;

      // --- Premier contact avec la police ---
      var cs = GAME.police ? GAME.police.contactSeconds : 0;
      if (prev.contactSeconds === 0 && cs > 0) {
        audio.tone(90, 0.12, 'sine', 0.3);
      }
      prev.contactSeconds = cs;

      // --- Game over ---
      var gs = GAME.game ? GAME.game.state : null;
      if (prev.gameState === 'playing' && gs === 'over') {
        audio.tone(400, 0.25, 'triangle', 0.3);
        setTimeout(function () { audio.tone(300, 0.25, 'triangle', 0.3); }, 260);
        setTimeout(function () { audio.tone(200, 0.25, 'triangle', 0.3); }, 520);
      }
      prev.gameState = gs;

      // Boucles continues (moteur + sirène)
      GAME.audioLoops.update(dt);
    }
  };
})();