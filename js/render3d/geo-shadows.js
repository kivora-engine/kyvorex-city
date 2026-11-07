// kyvorex-city/js/render3d/geo-shadows.js
// Rôle : fabrique l'ombre portée de chaque maison (un seul polygone, sans double couche)
// Dépend de : GAME.geo (heightOf), GAME.world.buildings, GAME.config.render3d
// Expose : GAME.geo.shadows(v)

window.GAME = window.GAME || {};

(function () {

  function cross(o, a, b) {
    return (a[0] - o[0]) * (b[1] - o[1]) - (a[1] - o[1]) * (b[0] - o[0]);
  }

  // Enveloppe convexe de quelques points (chaîne monotone)
  function enveloppe(pts) {
    pts.sort(function (a, b) { return a[0] - b[0] || a[1] - b[1]; });
    var bas = [], haut = [], i;
    for (i = 0; i < pts.length; i++) {
      while (bas.length >= 2 && cross(bas[bas.length - 2], bas[bas.length - 1], pts[i]) <= 0) bas.pop();
      bas.push(pts[i]);
    }
    for (i = pts.length - 1; i >= 0; i--) {
      while (haut.length >= 2 && cross(haut[haut.length - 2], haut[haut.length - 1], pts[i]) <= 0) haut.pop();
      haut.push(pts[i]);
    }
    bas.pop(); haut.pop();
    return bas.concat(haut);
  }

  GAME.geo.shadows = function (v) {
    var G = GAME.geo;
    var cfg = GAME.config.render3d;
    var noir = [0, 0, 0];
    var z = cfg.sidewalkHeight + cfg.interiorLift + 0.6;   // juste au-dessus des trottoirs et des routes
    var list = GAME.world.buildings;

    for (var i = 0; i < list.length; i++) {
      var b = list[i];
      var haut = G.heightOf(b) - cfg.sidewalkHeight;
      var dx = haut * cfg.shadowDir.x, dy = haut * cfg.shadowDir.y;
      var coins = [[b.x, b.y], [b.x + b.w, b.y], [b.x + b.w, b.y + b.h], [b.x, b.y + b.h]];
      var pts = [];
      for (var k = 0; k < 4; k++) {
        pts.push(coins[k]);
        pts.push([coins[k][0] + dx, coins[k][1] + dy]);
      }
      var h = enveloppe(pts);
      for (var t = 1; t < h.length - 1; t++) {   // éventail de triangles
        G.vert(v, [h[0][0], h[0][1], z], noir);
        G.vert(v, [h[t][0], h[t][1], z], noir);
        G.vert(v, [h[t + 1][0], h[t + 1][1], z], noir);
      }
    }
  };
})();
