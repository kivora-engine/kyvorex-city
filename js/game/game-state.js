// kyvorex-city/js/game/game-state.js
// Rôle : état global de la partie (playing/over, vies, arrestation, restart)
// Dépend de : GAME.config.game, GAME.score, GAME.save, GAME.wanted, GAME.policeCars, GAME.car
// Expose : GAME.game (state, lives, arrestMeter, init, update, loseLife, gameOver, restart)

window.GAME = window.GAME || {};

GAME.game = {

  state: 'playing',      // 'playing' ou 'over'
  reason: '',
  lives: 0,
  arrestMeter: 0,
  restartLockTimer: 0,

  init: function () {
    var g = GAME.config.game;
    this.state = 'playing';
    this.reason = '';
    this.lives = g.startLives;
    this.arrestMeter = 0;
    this.restartLockTimer = 0;
    GAME.score.best = GAME.save.load();
    GAME.score.reset();
    GAME.gameoverUi.init();
  },

  update: function (dt) {
    var g = GAME.config.game;

    // Décompte du délai de réactivation du bouton REJOUER
    if (this.restartLockTimer > 0) {
      this.restartLockTimer -= dt;
      if (this.restartLockTimer <= 0) {
        this.restartLockTimer = 0;
        GAME.gameoverUi.enableRestart();
      }
    }

    if (this.state !== 'playing') return;

    // --- Jauge d'arrestation ---
    var canArrest = GAME.wanted.active && GAME.wanted.fleeingTimer <= 0;
    var near = false;
    var r2 = g.arrestRadius * g.arrestRadius;
    if (canArrest && GAME.policeCars) {
      for (var i = 0; i < GAME.policeCars.length; i++) {
        var p = GAME.policeCars[i];
        var dx = p.x - GAME.car.x;
        var dy = p.y - GAME.car.y;
        if (dx * dx + dy * dy < r2) { near = true; break; }
      }
    }
    var slow = Math.abs(GAME.car.speed) < g.arrestSpeedThreshold;

    if (near && slow) {
      this.arrestMeter += g.arrestRiseRate * dt;
    } else {
      this.arrestMeter -= g.arrestFallRate * dt;
      if (this.arrestMeter < 0) this.arrestMeter = 0;
    }

    if (this.arrestMeter >= g.arrestMax) {
      this.arrestMeter = g.arrestMax;
      this.gameOver('Arrêté !');
    }
  },

  loseLife: function () {
    if (this.state !== 'playing') return;
    this.lives -= 1;
    if (this.lives <= 0) {
      this.lives = 0;
      this.gameOver('Plus de vies');
    }
  },

  gameOver: function (reason) {
    if (this.state === 'over') return;
    this.state = 'over';
    this.reason = reason;
    GAME.input.reset();
    var isRecord = GAME.score.commitBest();
    GAME.gameoverUi.show({
      reason: reason,
      money: GAME.score.money,
      deliveries: GAME.score.deliveries,
      best: GAME.score.best,
      record: isRecord
    });
    this.restartLockTimer = GAME.config.game.restartDelay;
  },

  restart: function () {
    if (this.restartLockTimer > 0) return;

    // Voiture au spawn
    GAME.car.reset();
    GAME.car.x = GAME.world.spawn.x;
    GAME.car.y = GAME.world.spawn.y;
    GAME.car.angle = GAME.world.spawn.angle;

    GAME.input.reset();
    GAME.collision.lastImpact = 0;

    // Police + jauge d'alerte
    GAME.police.clearCars();
    GAME.police.init();

    // Nouvelle mission
    GAME.mission.init();
    GAME.camera.snap();

    // Score, vies, arrestation
    GAME.score.reset();
    this.lives = GAME.config.game.startLives;
    this.arrestMeter = 0;
    this.state = 'playing';
    this.reason = '';
    GAME.gameoverUi.hide();
  }
};