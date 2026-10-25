// kyvorex-city/js/police/police-system.js
// Rôle : point d'entrée police (init, update, draw, drawHud, spawn, contact)
// Dépend de : GAME.wanted, GAME.policeCar, GAME.policeGraph, GAME.config.police, GAME.car, GAME.collision
// Expose : GAME.police (init, update, draw, drawHud, spawnFirstCar, clearCars, contactSeconds)

window.GAME = window.GAME || {};

(function () {

  // Cherche une intersection éloignée du joueur (650..1100 px), sinon la plus loin
  function findSpawnPosition() {
    var c = GAME.config.police;
    var cc = GAME.config.city;
    var half = cc.roadWidth / 2;
    var valid = [];
    var farthest = null, farthestD2 = -1;

    for (var i = 0; i < 6; i++) {
      for (var j = 0; j < 6; j++) {
        var px = half + i * cc.pitch;
        var py = half + j * cc.pitch;
        var dx = px - GAME.car.x;
        var dy = py - GAME.car.y;
        var d2 = dx * dx + dy * dy;
        if (d2 < c.spawnMinDist * c.spawnMinDist) continue;
        if (d2 <= c.spawnMaxDist * c.spawnMaxDist) valid.push({ x: px, y: py });
        if (d2 > farthestD2) { farthestD2 = d2; farthest = { x: px, y: py }; }
      }
    }
    if (valid.length > 0) {
      return valid[Math.floor(Math.random() * valid.length)];
    }
    return farthest;
  }

  // Écarte légèrement deux voitures de police qui se chevauchent
  function pushPoliceApart() {
    var minD = GAME.config.police.policePushRadius;
    var minD2 = minD * minD;
    for (var i = 0; i < GAME.policeCars.length; i++) {
      for (var j = i + 1; j < GAME.policeCars.length; j++) {
        var a = GAME.policeCars[i], b = GAME.policeCars[j];
        var dx = b.x - a.x, dy = b.y - a.y;
        var d2 = dx * dx + dy * dy;
        if (d2 < minD2 && d2 > 0.01) {
          var d = Math.sqrt(d2);
          var push = (minD - d) / 2;
          var nx = dx / d, ny = dy / d;
          a.x -= nx * push; a.y -= ny * push;
          b.x += nx * push; b.y += ny * push;
        }
      }
    }
  }

  GAME.police = {

    secondCarTimer: -1,
    contactTimer: 0,
    contactSeconds: 0,

    init: function () {
      if (!GAME.policeCars) GAME.policeCars = [];
      this.secondCarTimer = -1;
      this.contactTimer = 0;
      this.contactSeconds = 0;
      GAME.wanted.reset();
    },

    spawnFirstCar: function () {
      if (GAME.policeCars.length >= GAME.config.police.maxCars) return;
      var pos = findSpawnPosition();
      if (!pos) return;
      GAME.policeCars.push(GAME.policeCar.create(pos.x, pos.y));
      this.secondCarTimer = GAME.config.police.spawnDelaySecond;
    },

    clearCars: function () {
      GAME.policeCars.length = 0;
      this.secondCarTimer = -1;
    },

    update: function (dt) {
      // Jauge d'alerte (peut activer/désactiver et spawner)
      GAME.wanted.update(dt);

      // Pendant la fuite : voitures figées, on ne met rien à jour
      if (GAME.wanted.fleeingTimer > 0) return;

      // Programmation de la 2e voiture
      if (this.secondCarTimer > 0) {
        this.secondCarTimer -= dt;
        if (this.secondCarTimer <= 0) {
          this.secondCarTimer = -1;
          if (GAME.policeCars.length < GAME.config.police.maxCars) {
            var pos = findSpawnPosition();
            if (pos) GAME.policeCars.push(GAME.policeCar.create(pos.x, pos.y));
          }
        }
      }

      // Physique de chaque voiture
      for (var i = 0; i < GAME.policeCars.length; i++) {
        GAME.policeCar.update(GAME.policeCars[i], dt);
      }
      pushPoliceApart();
      this.updateContact(dt);
    },

    updateContact: function (dt) {
      var c = GAME.config.police;
      if (this.contactTimer > 0) this.contactTimer -= dt;

      var touching = false;
      var cr = c.contactRadius;
      var cr2 = cr * cr;

      for (var i = 0; i < GAME.policeCars.length; i++) {
        var p = GAME.policeCars[i];
        var dx = p.x - GAME.car.x;
        var dy = p.y - GAME.car.y;
        var d2 = dx * dx + dy * dy;
        if (d2 >= cr2) continue;

        touching = true;
        var d = Math.sqrt(d2) || 1;
        var overlap = cr - d;
        var nx = dx / d, ny = dy / d;
        GAME.car.x -= nx * overlap * 0.5;
        GAME.car.y -= ny * overlap * 0.5;
        p.x += nx * overlap * 0.5;
        p.y += ny * overlap * 0.5;

        if (this.contactTimer <= 0) {
          GAME.car.speed *= c.contactSpeedMult;
          GAME.wanted.gauge = Math.min(c.maxGauge, GAME.wanted.gauge + c.contactGaugeAdd);
          this.contactTimer = c.contactCooldown;
        }
      }

      if (touching) this.contactSeconds += dt;
      else this.contactSeconds = 0;
    },

    draw: function (ctx) {
      GAME.drawPolice(ctx);
    },

    drawHud: function (ctx) {
      GAME.drawWantedHud(ctx);
    }
  };
})();