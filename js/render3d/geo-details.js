// kyvorex-city/js/render3d/geo-details.js
// Rôle : finitions des maisons : fenêtres sur les murs (certaines éclairées), bord relevé du toit, blocs de ventilation
// Dépend de : GAME.geo (hex, mul, quad, rect, walls), GAME.config.render3d
// Expose : GAME.geo.details(v, b, z0, z1, c)

window.GAME = window.GAME || {};

(function () {

  var OFFSET = 0.4;   // les fenêtres sont posées juste devant le mur

  function hash(n) {
    n = (n ^ 61) ^ (n >>> 16);
    n = n + (n << 3);
    n = n ^ (n >>> 4);
    n = (n * 0x27d4eb2d) | 0;
    return (n ^ (n >>> 15)) >>> 0;
  }

  // Fenêtres sur une face. face : 's' (sud), 'e' (est), 'w' (ouest). Le mur nord n'est jamais visible.
  function fenetres(v, b, z0, z1, face, graine) {
    var cfg = GAME.config.render3d;
    var G = GAME.geo;
    var longueur = face === 's' ? b.w : b.h;
    var nC = Math.min(10, Math.floor((longueur - 8) / 14));
    var hMur = z1 - z0;
    var nF = Math.min(5, Math.floor((hMur - 8) / 13));
    if (nC < 1 || nF < 1) return;

    var pas = (longueur - 8) / nC, larg = pas * 0.5;
    var hEtage = (hMur - 8) / nF, haut = hEtage * 0.5;
    var k = cfg.faceShade[face];
    var sombre = G.mul([0.09, 0.14, 0.2], 0.6 + k);
    var allume = G.mul(G.hex('#ffd98a'), 0.95);

    for (var f = 0; f < nF; f++) {
      var za = z0 + 4 + f * hEtage + hEtage * 0.25;
      for (var i = 0; i < nC; i++) {
        var a = 4 + pas * 0.25 + i * pas;
        var col = hash(graine + f * 31 + i * 17 + face.charCodeAt(0)) % 5 === 0 ? allume : sombre;
        var p0, p1;
        if (face === 's') {
          var ys = b.y + b.h + OFFSET;
          p0 = [b.x + a, ys]; p1 = [b.x + a + larg, ys];
        } else {
          var xs = face === 'e' ? b.x + b.w + OFFSET : b.x - OFFSET;
          p0 = [xs, b.y + a]; p1 = [xs, b.y + a + larg];
        }
        G.quad(v, [p0[0], p0[1], za], [p1[0], p1[1], za], [p1[0], p1[1], za + haut], [p0[0], p0[1], za + haut],
          col, col, col, col);
      }
    }
  }

  // Bord relevé tout autour du toit (3 px de large, 2 de haut), juste en dedans du contour
  function bord(v, b, z1, c) {
    var G = GAME.geo;
    var cb = G.mul(c, 0.88), ch = G.mul(c, 1.1);
    var w = 3, h = 2, o = 2;
    var bandes = [
      [b.x + o, b.y + o, b.w - 2 * o, w],
      [b.x + o, b.y + b.h - o - w, b.w - 2 * o, w],
      [b.x + o, b.y + o + w, w, b.h - 2 * o - 2 * w],
      [b.x + b.w - o - w, b.y + o + w, w, b.h - 2 * o - 2 * w]
    ];
    for (var i = 0; i < 4; i++) {
      var r = bandes[i];
      G.walls(v, r[0], r[1], r[2], r[3], z1, z1 + h, cb);
      G.rect(v, r[0], r[1], r[2], r[3], z1 + h, ch);
    }
  }

  // Petits blocs de ventilation sur le toit (position choisie par la maison)
  function ventilation(v, b, z1, c, graine) {
    var G = GAME.geo;
    if (b.w < 60 || b.h < 60) return;
    var n = 1 + (graine % 2);
    for (var i = 0; i < n; i++) {
      var fx = 0.3 + (hash(graine + i * 7) % 40) / 100;
      var fy = 0.3 + (hash(graine + i * 13 + 5) % 40) / 100;
      var w = 14 + (hash(graine + i) % 8), h = 10 + (hash(graine + i * 3) % 6);
      var x = b.x + (b.w - w) * fx, y = b.y + (b.h - h) * fy;
      var haut = 6 + (hash(graine + i * 5) % 4);
      var cv = G.mul(c, 0.78);
      G.walls(v, x, y, w, h, z1, z1 + haut, cv);
      G.rect(v, x, y, w, h, z1 + haut, G.mul(c, 0.9));
    }
  }

  GAME.geo.details = function (v, b, z0, z1, c) {
    var graine = hash((Math.floor(b.x) * 31 + Math.floor(b.y) * 17) | 0);
    fenetres(v, b, z0, z1, 's', graine);
    fenetres(v, b, z0, z1, 'e', graine + 101);
    fenetres(v, b, z0, z1, 'w', graine + 203);
    bord(v, b, z1, c);
    ventilation(v, b, z1, c, graine);
  };
})();
