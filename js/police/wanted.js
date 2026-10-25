// kyvorex-city/js/police/wanted.js
// Rôle : jauge d'alerte (monte, descend, actif/inactif, fuite)
// Dépend de : GAME.config.police, GAME.collision, GAME.car, GAME.policeCars, GAME.police
// Expose : GAME.wanted (gauge, active, fleeingTimer, fleeBlink, reset, update)

window.GAME = window.GAME || {};

GAME.wanted = {

  gauge: 0,
  active: false,
  lastImpactTimer: 0,
  fleeingTimer: 0,
  fleeBlink: 0,

  reset: function () {
    this.gauge = 0;
    this.active = false;
    this.lastImpactTimer = 0;
    this.fleeingTimer = 0;
    this.fleeBlink = 0;
  },

  update: function (dt) {
    var c = GAME.config.police;

    if (this.lastImpactTimer > 0) this.lastImpactTimer -= dt;

    // Impact violent (choc joueur contre bâtiment/bord)
    var impact = GAME.collision.lastImpact || 0;
    if (impact > c.impactThreshold && this.lastImpactTimer <= 0) {
      this.gauge = Math.min(c.maxGauge, this.gauge + c.impactAdd);
      this.lastImpactTimer = c.impactCooldown;
    }

    // Décroissance (bloquée si une voiture de police est proche)
    var near = false;
    if (GAME.policeCars) {
      var r2 = c.nearPlayerRadius * c.nearPlayerRadius;
      for (var i = 0; i < GAME.policeCars.length; i++) {
        var p = GAME.policeCars[i];
        var dx = p.x - GAME.car.x;
        var dy = p.y - GAME.car.y;
        if (dx * dx + dy * dy < r2) { near = true; break; }
      }
    }
    if (!near) {
      this.gauge = Math.max(0, this.gauge - c.decayPerSec * dt);
    }

    // Activation
    if (!this.active && this.gauge >= c.activateAt) {
      this.active = true;
      this.fleeingTimer = 0;
      this.fleeBlink = 0;
      GAME.police.clearCars();
      GAME.police.spawnFirstCar();
    }

    // Désactivation (jauge retombée à 0)
    if (this.active && this.gauge <= 0) {
      this.active = false;
      this.fleeingTimer = c.fleeDuration;
      this.fleeBlink = 0;
    }

    // Clignotement de fuite puis disparition
    if (this.fleeingTimer > 0) {
      this.fleeingTimer -= dt;
      this.fleeBlink += dt;
      if (this.fleeingTimer <= 0) {
        GAME.police.clearCars();
      }
    }
  }
};