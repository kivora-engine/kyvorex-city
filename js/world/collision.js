// kyvorex-city/js/world/collision.js
// Rôle : collision générique (joueur + police) avec bâtiments et bords du monde
// Dépend de : GAME.config.city, GAME.config.car, GAME.world
// Expose : GAME.collision (resolve, resolveEntity, lastImpact)

window.GAME = window.GAME || {};

(function () {

  // Test cercle / rectangle (AABB) : renvoie le vecteur de push ou null
  function pushCircleFromAABB(cx, cy, r, b) {
    if (cx + r < b.x || cx - r > b.x + b.w) return null;
    if (cy + r < b.y || cy - r > b.y + b.h) return null;

    var nx = Math.max(b.x, Math.min(cx, b.x + b.w));
    var ny = Math.max(b.y, Math.min(cy, b.y + b.h));
    var dx = cx - nx;
    var dy = cy - ny;
    var d2 = dx * dx + dy * dy;
    if (d2 >= r * r) return null;

    var dist = Math.sqrt(d2);
    if (dist > 0.001) {
      var mag = r - dist;
      return { x: dx / dist * mag, y: dy / dist * mag };
    }
    var left = cx - b.x;
    var right = b.x + b.w - cx;
    var top = cy - b.y;
    var bottom = b.y + b.h - cy;
    var m = Math.min(left, right, top, bottom);
    if (m === left) return { x: -(left + r), y: 0 };
    if (m === right) return { x: right + r, y: 0 };
    if (m === top) return { x: 0, y: -(top + r) };
    return { x: 0, y: bottom + r };
  }

  // Résout la collision d'une entité générique (3 cercles, 3 passes).
  // Retourne { hit, impact }. First-contact = choc, glissade = slide.
  function resolveEntity(e, hitFactor, slideFactor) {
    var world = GAME.world;
    var cc = GAME.config.city;
    var ccCar = GAME.config.car;
    var r = cc.carCircleRadius;
    var speedBefore = e.speed;
    var half = ccCar.length / 3;
    var offsets = [-half, 0, half];
    var hasHit = false;

    for (var pass = 0; pass < 3; pass++) {
      var resolved = false;
      var sin = Math.sin(e.angle);
      var cos = Math.cos(e.angle);

      for (var i = 0; i < offsets.length; i++) {
        var off = offsets[i];
        var cx = e.x + sin * off;
        var cy = e.y - cos * off;

        if (cx - r < 0) { e.x += -(cx - r); resolved = true; cx = e.x + sin * off; }
        if (cx + r > world.width) { e.x += world.width - (cx + r); resolved = true; cx = e.x + sin * off; }
        if (cy - r < 0) { e.y += -(cy - r); resolved = true; cy = e.y - cos * off; }
        if (cy + r > world.height) { e.y += world.height - (cy + r); resolved = true; cy = e.y - cos * off; }

        for (var j = 0; j < world.buildings.length; j++) {
          var push = pushCircleFromAABB(cx, cy, r, world.buildings[j]);
          if (push) {
            e.x += push.x;
            e.y += push.y;
            resolved = true;
            cx += push.x;
            cy += push.y;
          }
        }
      }

      if (resolved) hasHit = true;
      else break;
    }

    // Application du facteur de choc : UNE SEULE FOIS par contact
    var impact = 0;
    if (hasHit) {
      if (!e.wasHit) { e.speed *= hitFactor; impact = Math.abs(speedBefore); }
      else { e.speed *= slideFactor; }
    }
    e.wasHit = hasHit;

    return { hit: hasHit, impact: impact };
  }

  GAME.collision = {
    lastImpact: 0,
    resolveEntity: resolveEntity,
    resolve: function () {
      var result = resolveEntity(
        GAME.car,
        GAME.config.city.hitFactor,
        GAME.config.city.slideFactor
      );
      GAME.collision.lastImpact = result.impact;
    }
  };
})();