// kyvorex-city/js/render3d/geo-poi.js
// Rôle : repères des bâtiments publics : portes de garage, croix de l'hôpital, gyrophares, tour des pompiers
// Dépend de : GAME.geo (hex, mul, quad, walls, rect)
// Expose : GAME.geo.poi(v, b, z0, z1, c)

window.GAME = window.GAME || {};

GAME.geo.poi = function (v, b, z0, z1, c) {
  var G = GAME.geo;
  var sombre = [0.05, 0.06, 0.08];
  var cx = b.x + b.w / 2, ys = b.y + b.h + 0.8;

  // Portes de garage sur le mur sud (2 chez les pompiers)
  var n = b.doors || 1;
  var lp = b.poi === 'caserne' ? 50 : 40;
  var espace = b.w / (n + 1);
  for (var i = 1; i <= n; i++) {
    var dx = b.x + espace * i - lp / 2;
    G.quad(v, [dx, ys, z0], [dx + lp, ys, z0], [dx + lp, ys, z0 + 24], [dx, ys, z0 + 24], sombre, sombre, sombre, sombre);
  }

  if (b.poi === 'hopital') {
    var rouge = G.hex('#d0342c');
    G.rect(v, cx - 3, b.y + b.h / 2 - 17, 6, 34, z1 + 0.9, rouge);   // croix rouge sur le toit
    G.rect(v, cx - 17, b.y + b.h / 2 - 3, 34, 6, z1 + 0.9, rouge);
  } else if (b.poi === 'commissariat') {
    var bleu = G.hex('#2d6cff'), rougeP = G.hex('#ff3b30');          // gyrophares
    G.walls(v, cx - 14, b.y + b.h - 22, 12, 6, z1, z1 + 4, bleu);
    G.rect(v, cx - 14, b.y + b.h - 22, 12, 6, z1 + 4, G.mul(bleu, 1.2));
    G.walls(v, cx + 2, b.y + b.h - 22, 12, 6, z1, z1 + 4, rougeP);
    G.rect(v, cx + 2, b.y + b.h - 22, 12, 6, z1 + 4, G.mul(rougeP, 1.1));
  } else if (b.poi === 'caserne') {
    var tour = G.mul(c, 0.8);                                         // tour pour sécher les tuyaux
    G.walls(v, b.x + b.w - 40, b.y + 10, 26, 26, z1, z1 + 26, tour);
    G.rect(v, b.x + b.w - 40, b.y + 10, 26, 26, z1 + 26, G.mul(tour, 1.1));
  }
};
