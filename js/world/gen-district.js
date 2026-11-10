// kyvorex-city/js/world/gen-district.js
// Rôle : fabrique les maisons (quartier résidentiel) et les bâtiments publics d'un bloc
// Dépend de : GAME.config.city (houses, pois), GAME.config.colors
// Expose : GAME.cityGen.houses(...), GAME.cityGen.poi(...)

window.GAME = window.GAME || {};

(function () {

  function makeRng(seed) {
    var s = seed >>> 0;
    return function () {
      s = (s * 1664525 + 1013904223) >>> 0;
      return s / 4294967296;
    };
  }

  GAME.cityGen = {

    // 4 terrains (2 x 2) avec une maison chacun ; x, y, size = zone intérieure du bloc
    houses: function (x, y, size, bx, by, out) {
      var cc = GAME.config.city;
      var H = cc.houses;
      var col = GAME.config.colors;
      var rand = makeRng(cc.seed + bx * 17 + by * 131);
      var lot = (size - H.gap) / 2;

      for (var r = 0; r < 2; r++) {
        for (var c = 0; c < 2; c++) {
          var lx = x + c * (lot + H.gap);
          var ly = y + r * (lot + H.gap);
          out.decor.push({ x: lx, y: ly, w: lot, h: lot, color: col.lawn, layer: 0 });

          var w = H.minW + rand() * (H.maxW - H.minW);
          var h = H.minH + rand() * (H.maxH - H.minH);
          var hx = lx + H.margin + rand() * (lot - 2 * H.margin - w);
          var hy = ly + H.margin + rand() * (lot - 2 * H.margin - h);

          // Allée de la porte jusqu'au bord du terrain (côté sud)
          var reste = (ly + lot) - (hy + h);
          if (reste > 4) out.decor.push({ x: hx + w / 2 - 7, y: hy + h, w: 14, h: reste, color: col.path, layer: 1 });

          out.buildings.push({
            x: hx, y: hy, w: w, h: h,
            color: H.walls[Math.floor(rand() * H.walls.length)],
            roof: H.roofs[Math.floor(rand() * H.roofs.length)],
            kind: 'house'
          });
        }
      }
    },

    // Un bâtiment public posé au sud du bloc (garage vers la route) + parking
    poi: function (x, y, size, def, out) {
      var cc = GAME.config.city;
      var bx0 = x + (size - def.w) / 2;
      var by0 = y + size - 40 - def.h;
      out.decor.push({ x: x, y: y, w: size, h: size, color: GAME.config.colors.apron, layer: 0 });
      out.buildings.push({ x: bx0, y: by0, w: def.w, h: def.h, color: def.color, kind: 'poi', poi: def.type, doors: def.doors });

      // Point de sortie des véhicules : centre de la route au sud du bloc
      var roadY = cc.roadWidth / 2 + (def.by + 1) * cc.pitch;
      out.pois.push({
        type: def.type, bx: def.bx, by: def.by,
        x: bx0, y: by0, w: def.w, h: def.h,
        exit: { x: bx0 + def.w / 2, y: roadY }
      });
    }
  };
})();
