// kyvorex-city/js/render3d/geo-world.js
// Rôle : fabrique le sol, les blocs (trottoir + intérieur) et les lignes pointillées des routes
// Dépend de : GAME.geo, GAME.config.city, GAME.config.colors, GAME.config.render3d
// Expose : GAME.geo.world(v)

window.GAME = window.GAME || {};

GAME.geo.world = function (v) {
  var G = GAME.geo;
  var cc = GAME.config.city;
  var col = GAME.config.colors;
  var cfg = GAME.config.render3d;
  var taille = cc.blocksX * cc.pitch + cc.roadWidth;
  var i, j, k;

  // Sol (asphalte), très grand pour couvrir l'écran même au bord de la ville
  G.rect(v, -3000, -3000, taille + 6000, taille + 6000, 0, G.hex(col.asphalt));

  // Blocs : trottoir (pavé bas) + intérieur à peine plus haut
  var sh = cfg.sidewalkHeight;
  var bs = cc.blockSize;
  var cTrot = G.hex(col.sidewalk);
  var cInt = G.hex(col.blockInterior);
  for (j = 0; j < cc.blocksY; j++) {
    for (i = 0; i < cc.blocksX; i++) {
      var wx = cc.roadWidth + i * cc.pitch;
      var wy = cc.roadWidth + j * cc.pitch;
      G.walls(v, wx, wy, bs, bs, 0, sh, cTrot);
      G.rect(v, wx, wy, bs, bs, sh, cTrot);
      G.rect(v, wx + cc.sidewalk, wy + cc.sidewalk, bs - 2 * cc.sidewalk, bs - 2 * cc.sidewalk,
        sh + cfg.interiorLift, cInt);
    }
  }

  // Lignes pointillées (mêmes mesures que l'affichage 2D : trait 16, pas 40, épaisseur 4)
  var cLigne = G.hex(col.roadLine);
  var dash = 16, pas = 40, zl = 0.3;
  var rw2 = cc.roadWidth / 2;
  for (i = 0; i < 6; i++) {
    var c = rw2 + i * cc.pitch;
    for (j = 0; j < 5; j++) {
      var a = cc.roadWidth + j * cc.pitch;
      var b = a + bs;
      for (k = a; k < b; k += pas) {
        var l = Math.min(dash, b - k);
        G.rect(v, c - 2, k, 4, l, zl, cLigne);   // route verticale
        G.rect(v, k, c - 2, l, 4, zl, cLigne);   // route horizontale
      }
    }
  }
};
