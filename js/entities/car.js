// kyvorex-city/js/entities/car.js
// Rôle : état et physique arcade de la voiture du joueur
// Dépend de : GAME.config, GAME.input
// Expose : GAME.car (x, y, angle, speed) + GAME.car.update(dt)

window.GAME = window.GAME || {};

GAME.car = {

  x: 0,
  y: 0,
  angle: 0,   // 0 = la voiture pointe vers le haut de l'écran
  speed: 0,   // px/s : positif en avant, négatif en marche arrière

  reset: function () {
    this.x = 0;
    this.y = 0;
    this.angle = 0;
    this.speed = 0;
  },

  update: function (dt) {
    var cfg = GAME.config.car;
    var inp = GAME.input;
    var s = this.speed;

    // --- 1. Accélération / freinage / friction ---
    if (inp.gas && !inp.brake) {
      s += cfg.accel * dt;
    } else if (inp.brake && !inp.gas) {
      // ▼ freine si on avance, puis enclenche la marche arrière
      s -= (s > 0 ? cfg.brake : cfg.accel) * dt;
    } else if (!inp.gas && !inp.brake) {
      var f = cfg.friction * dt;
      if (s > 0) s = Math.max(0, s - f);
      else if (s < 0) s = Math.min(0, s + f);
    }

    // --- 2. Limites de vitesse ---
    if (s > cfg.maxSpeed) s = cfg.maxSpeed;
    if (s < -cfg.maxReverse) s = -cfg.maxReverse;

    // --- 3. Direction : proportionnelle à la vitesse, inversée en reculant ---
    var abs = Math.abs(s);
    if (abs > cfg.minTurnSpeed) {
      var volant = (inp.left ? -1 : 0) + (inp.right ? 1 : 0);
      if (volant !== 0) {
        var sens = s >= 0 ? 1 : -1;
        var ratio = Math.min(1, abs / cfg.maxSpeed);
        this.angle += volant * cfg.turnSpeed * ratio * sens * dt;
      }
    }

    // --- 4. Déplacement (angle 0 = vers le haut) ---
    this.x += Math.sin(this.angle) * s * dt;
    this.y -= Math.cos(this.angle) * s * dt;

    this.speed = s;
  }
};