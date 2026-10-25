// kyvorex-city/js/world/city-map.js
// Rôle : génère GAME.world (dimensions, bâtiments, point de spawn)
// Dépend de : GAME.config.city
// Expose : GAME.world, GAME.cityMap.generate()

window.GAME = window.GAME || {};

(function () {

  // Générateur pseudo-aléatoire à graine fixe (LCG)
  function makeRng(seed) {
    var s = seed >>> 0;
    return function () {
      s = (s * 1664525 + 1013904223) >>> 0;
      return s / 4294967296;
    };
  }

  // Génère 1 ou 2 bâtiments dans une zone rectangulaire donnée
  function genBuildings(x, y, w, h, rand, palette) {
    var r1 = rand();
    var color1 = palette[Math.floor(rand() * palette.length)];

    if (r1 < 0.5) {
      // Un seul bâtiment, avec une petite marge intérieure
      var mx = w * (0.05 + rand() * 0.1);
      var my = h * (0.05 + rand() * 0.1);
      return [{
        x: x + mx, y: y + my,
        w: w - 2 * mx, h: h - 2 * my,
        color: color1
      }];
    }

    // Deux bâtiments séparés par un passage
    var color2 = palette[Math.floor(rand() * palette.length)];
    var gap = 24;

    if (rand() < 0.5) {
      // Côte à côte (séparation verticale)
      var splitX = w * (0.4 + rand() * 0.2);
      return [
        { x: x, y: y, w: splitX - gap / 2, h: h, color: color1 },
        { x: x + splitX + gap / 2, y: y,
          w: w - splitX - gap / 2, h: h, color: color2 }
      ];
    }

    // Empilés (séparation horizontale)
    var splitY = h * (0.4 + rand() * 0.2);
    return [
      { x: x, y: y, w: w, h: splitY - gap / 2, color: color1 },
      { x: x, y: y + splitY + gap / 2,
        w: w, h: h - splitY - gap / 2, color: color2 }
    ];
  }

  GAME.cityMap = {
    generate: function () {
      var cc = GAME.config.city;
      var rand = makeRng(cc.seed);
      var buildings = [];

      // Taille totale : 6 routes + 5 blocs
      var worldSize = cc.blocksX * cc.pitch + cc.roadWidth;

      // Parcours des blocs dans un ordre fixe (déterminisme total)
      for (var by = 0; by < cc.blocksY; by++) {
        for (var bx = 0; bx < cc.blocksX; bx++) {
          var innerW = cc.blockSize - 2 * cc.sidewalk;
          var blockX = cc.roadWidth + bx * cc.pitch + cc.sidewalk;
          var blockY = cc.roadWidth + by * cc.pitch + cc.sidewalk;

          var blds = genBuildings(blockX, blockY, innerW, innerW, rand, cc.palette);
          for (var k = 0; k < blds.length; k++) buildings.push(blds[k]);
        }
      }

      // Spawn : centre d'une intersection proche du milieu de la ville.
      // Intersections aux centres de route : 64, 512, 960, 1408, 1856, 2304.
      var spawnRoad = 2; // 3e route sur 6
      var spawnX = cc.roadWidth / 2 + spawnRoad * cc.pitch;

      GAME.world = {
        width: worldSize,
        height: worldSize,
        buildings: buildings,
        spawn: { x: spawnX, y: spawnX, angle: 0 }
      };
    }
  };
})();