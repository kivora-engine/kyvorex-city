// kyvorex-city/js/render3d/geo-buildings.js
// Rôle : fabrique les maisons en pavés (murs ombrés, toit, contour et cadre du toit)
// Dépend de : GAME.geo, GAME.world.buildings, GAME.config.render3d, GAME.config.colors
// Expose : GAME.geo.buildings(v)

window.GAME = window.GAME || {};

// Hauteur d'une maison, choisie par sa position : la même à chaque partie
GAME.geo.heightOf = function (b) {
  var cfg = GAME.config.render3d;
  if (b.kind === 'house') return GAME.geo.houseBase() + cfg.house.wall + cfg.house.ridge;
  if (b.kind === 'poi') return cfg.poi.height;
  var niveau = ((Math.floor(b.x) * 73 + Math.floor(b.y) * 19) >>> 0) % cfg.heightLevels;
  return cfg.heightMin + niveau * cfg.heightStep;
};

GAME.geo.buildings = function (v) {
  var G = GAME.geo;
  var cfg = GAME.config.render3d;
  var list = GAME.world.buildings;
  var cContour = G.hex(GAME.config.colors.buildingOutline);
  var z0 = cfg.sidewalkHeight + cfg.interiorLift;

  for (var i = 0; i < list.length; i++) {
    var b = list[i];
    var c = G.hex(b.color);

    if (b.kind === 'house') { G.house(v, b); continue; }   // maison : toit à deux pentes

    var z1 = G.heightOf(b);

    G.walls(v, b.x, b.y, b.w, b.h, z0, z1, c);
    G.rect(v, b.x, b.y, b.w, b.h, z1, c);
    if (G.details) G.details(v, b, z0, z1, c);   // fenêtres, bord du toit, ventilation
    if (b.kind === 'poi') G.poi(v, b, z0, z1, c); // portes de garage, croix, gyrophares, tour

    // Contour sombre du toit (2 px, comme avant)
    var zc = z1 + 0.3;
    G.rect(v, b.x, b.y, b.w, 2, zc, cContour);
    G.rect(v, b.x, b.y + b.h - 2, b.w, 2, zc, cContour);
    G.rect(v, b.x, b.y + 2, 2, b.h - 4, zc, cContour);
    G.rect(v, b.x + b.w - 2, b.y + 2, 2, b.h - 4, zc, cContour);

    // Cadre intérieur du toit (1 px)
    var d = Math.min(b.w, b.h) * 0.2;
    if (d > 4) {
      var cl = G.mul(c, cfg.roofLine);
      var zi = z1 + 0.6;
      var iw = b.w - 2 * d, ih = b.h - 2 * d;
      G.rect(v, b.x + d, b.y + d, iw, 1, zi, cl);
      G.rect(v, b.x + d, b.y + d + ih - 1, iw, 1, zi, cl);
      G.rect(v, b.x + d, b.y + d + 1, 1, ih - 2, zi, cl);
      G.rect(v, b.x + d + iw - 1, b.y + d + 1, 1, ih - 2, zi, cl);
    }
  }
};
