// kyvorex-city/js/mission/mission-points.js
// Rôle : calcule les intersections possibles et en choisit une
// Dépend de : GAME.config.city, GAME.config.mission
// Expose : GAME.missionPoints (getAll, pickPickup, pickDelivery)

window.GAME = window.GAME || {};

(function () {

  function dist2(ax, ay, bx, by) {
    var dx = ax - bx, dy = ay - by;
    return dx * dx + dy * dy;
  }

  GAME.missionPoints = {

    // 36 intersections : centres des routes de la grille 6x6
    getAll: function () {
      var cc = GAME.config.city;
      var half = cc.roadWidth / 2;
      var pts = [];
      for (var i = 0; i < 6; i++) {
        for (var j = 0; j < 6; j++) {
          pts.push({ x: half + i * cc.pitch, y: half + j * cc.pitch });
        }
      }
      return pts;
    },

    // Point colis : entre pickupMinDist et pickupMaxDist de la voiture
    pickPickup: function (carX, carY) {
      var mc = GAME.config.mission;
      var pts = this.getAll();
      var minD2 = mc.pickupMinDist * mc.pickupMinDist;
      var maxD2 = mc.pickupMaxDist * mc.pickupMaxDist;
      var valid = [];
      for (var i = 0; i < pts.length; i++) {
        var d2 = dist2(carX, carY, pts[i].x, pts[i].y);
        if (d2 >= minD2 && d2 <= maxD2) valid.push(pts[i]);
      }
      if (valid.length > 0) {
        return valid[Math.floor(Math.random() * valid.length)];
      }
      // Aucun dans la plage : prendre le plus éloigné
      var best = null, bestD = -1;
      for (var k = 0; k < pts.length; k++) {
        var d2b = dist2(carX, carY, pts[k].x, pts[k].y);
        if (d2b > bestD) { bestD = d2b; best = pts[k]; }
      }
      return best;
    },

    // Point livraison : entre deliveryMinDist et deliveryMaxDist du colis
    pickDelivery: function (fromPt) {
      var mc = GAME.config.mission;
      var pts = this.getAll();
      var minD2 = mc.deliveryMinDist * mc.deliveryMinDist;
      var maxD2 = mc.deliveryMaxDist * mc.deliveryMaxDist;
      var valid = [];
      for (var i = 0; i < pts.length; i++) {
        // Ne jamais reprendre le point du colis
        if (pts[i].x === fromPt.x && pts[i].y === fromPt.y) continue;
        var d2 = dist2(fromPt.x, fromPt.y, pts[i].x, pts[i].y);
        if (d2 >= minD2 && d2 <= maxD2) valid.push(pts[i]);
      }
      if (valid.length > 0) {
        return valid[Math.floor(Math.random() * valid.length)];
      }
      // Aucun dans la plage : prendre le plus éloigné (hors colis)
      var best = null, bestD = -1;
      for (var k = 0; k < pts.length; k++) {
        if (pts[k].x === fromPt.x && pts[k].y === fromPt.y) continue;
        var d2b = dist2(fromPt.x, fromPt.y, pts[k].x, pts[k].y);
        if (d2b > bestD) { bestD = d2b; best = pts[k]; }
      }
      return best;
    }
  };
})();