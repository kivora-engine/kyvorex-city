// kyvorex-city/js/render/camera.js
// Rôle : caméra qui suit la voiture + secousse à l'impact
// Dépend de : GAME.config.camera, GAME.car, GAME.config.feel, GAME.collision, GAME.game
// Expose : GAME.camera (x, y, w, h, snap, follow, kick)

window.GAME = window.GAME || {};

GAME.camera = {

  x: 0, y: 0, w: 0, h: 0,
  baseX: 0, baseY: 0,
  shakePower: 0,
  shakeDuration: 0,
  shakeTimer: 0,

  // Recadre instantanément sur la voiture et annule toute secousse
  snap: function () {
    this.baseX = GAME.car.x - this.w / 2;
    this.baseY = GAME.car.y - this.h / 2;
    this.x = this.baseX;
    this.y = this.baseY;
    this.shakeTimer = 0;
    this.shakePower = 0;
    this.shakeDuration = 0;
  },

  // Déclenche une secousse (amp = amplitude initiale en px)
  kick: function (power, duration) {
    this.shakePower = power;
    this.shakeDuration = duration;
    this.shakeTimer = duration;
  },

  follow: function (dt) {
    // Suivi lissé sur baseX/baseY, indépendant du framerate
    var k = GAME.config.camera.smooth;
    var t = 1 - Math.exp(-k * dt);
    var cibleX = GAME.car.x - this.w / 2;
    var cibleY = GAME.car.y - this.h / 2;
    this.baseX += (cibleX - this.baseX) * t;
    this.baseY += (cibleY - this.baseY) * t;

    // Détection d'impact violent pour déclencher une secousse
    var feel = GAME.config.feel;
    if (feel && GAME.game && GAME.game.state === 'playing'
        && GAME.collision.lastImpact > feel.shakeImpactMin
        && this.shakeTimer <= 0) {
      var amp = feel.shakePower * Math.min(1, GAME.collision.lastImpact / 340);
      this.kick(amp, feel.shakeDuration);
    }

    // Application / décroissance de la secousse
    var sx = 0, sy = 0;
    if (this.shakeTimer > 0) {
      var ratio = this.shakeTimer / this.shakeDuration;
      var a = this.shakePower * ratio;
      sx = (Math.random() * 2 - 1) * a;
      sy = (Math.random() * 2 - 1) * a;
      this.shakeTimer -= dt;
      if (this.shakeTimer < 0) this.shakeTimer = 0;
    }

    this.x = this.baseX + sx;
    this.y = this.baseY + sy;
  }
};