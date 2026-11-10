// kyvorex-city/js/render3d/geo-houses.js
// Rôle : fabrique une maison : murs, toit à deux pentes avec pignons, porte, fenêtres, cheminée
// Dépend de : GAME.geo (hex, mul, quad, walls, rect), GAME.config.render3d (house, faceShade)
// Expose : GAME.geo.house(v, b), GAME.geo.houseBase()

window.GAME = window.GAME || {};

(function () {

  function base() {
    var cfg = GAME.config.render3d;
    return cfg.sidewalkHeight + cfg.interiorLift + 0.2;   // les maisons posent sur la pelouse
  }

  // Petit rectangle posé devant un mur (face sud, est ou ouest)
  function ouverture(v, b, face, a, larg, za, haut, col) {
    var G = GAME.geo, o = 0.5;
    var p0, p1;
    if (face === 's') {
      var y = b.y + b.h + o;
      p0 = [b.x + a, y]; p1 = [b.x + a + larg, y];
    } else {
      var x = face === 'e' ? b.x + b.w + o : b.x - o;
      p0 = [x, b.y + a]; p1 = [x, b.y + a + larg];
    }
    G.quad(v, [p0[0], p0[1], za], [p1[0], p1[1], za], [p1[0], p1[1], za + haut], [p0[0], p0[1], za + haut],
      col, col, col, col);
  }

  GAME.geo.houseBase = base;

  GAME.geo.house = function (v, b) {
    var G = GAME.geo, cfg = GAME.config.render3d, H = cfg.house, s = cfg.faceShade;
    var z0 = base(), zw = z0 + H.wall, zr = zw + H.ridge, e = H.eave;
    var c = G.hex(b.color), cr = G.hex(b.roof);
    var x0 = b.x, x1 = b.x + b.w, y0 = b.y, y1 = b.y + b.h;

    G.walls(v, x0, y0, b.w, b.h, z0, zw, c);

    // Toit à deux pentes : le faîtage suit le côté le plus long
    var pc = G.mul(cr, 0.95), pd = G.mul(cr, 0.6);
    if (b.w >= b.h) {
      var ym = (y0 + y1) / 2;
      G.quad(v, [x0 - e, y1 + e, zw - 1.5], [x1 + e, y1 + e, zw - 1.5], [x1 + e, ym, zr], [x0 - e, ym, zr], pc, pc, pc, pc);
      G.quad(v, [x0 - e, y0 - e, zw - 1.5], [x1 + e, y0 - e, zw - 1.5], [x1 + e, ym, zr], [x0 - e, ym, zr], pd, pd, pd, pd);
      var gw = G.mul(c, s.w), ge = G.mul(c, s.e);
      G.quad(v, [x0, y0, zw], [x0, y1, zw], [x0, ym, zr], [x0, ym, zr], gw, gw, gw, gw);
      G.quad(v, [x1, y0, zw], [x1, y1, zw], [x1, ym, zr], [x1, ym, zr], ge, ge, ge, ge);
    } else {
      var xm = (x0 + x1) / 2;
      G.quad(v, [x1 + e, y0 - e, zw - 1.5], [x1 + e, y1 + e, zw - 1.5], [xm, y1 + e, zr], [xm, y0 - e, zr], pc, pc, pc, pc);
      G.quad(v, [x0 - e, y0 - e, zw - 1.5], [x0 - e, y1 + e, zw - 1.5], [xm, y1 + e, zr], [xm, y0 - e, zr], pd, pd, pd, pd);
      var gn = G.mul(c, s.n), gs = G.mul(c, s.s);
      G.quad(v, [x0, y0, zw], [x1, y0, zw], [xm, y0, zr], [xm, y0, zr], gn, gn, gn, gn);
      G.quad(v, [x0, y1, zw], [x1, y1, zw], [xm, y1, zr], [xm, y1, zr], gs, gs, gs, gs);
    }

    // Porte au centre du mur sud, deux fenêtres de chaque côté, une fenêtre sur chaque côté
    var porte = [0.22, 0.14, 0.1], verre = [0.1, 0.16, 0.24], lumiere = [1, 0.85, 0.54];
    ouverture(v, b, 's', b.w / 2 - 5, 10, z0, 14, porte);
    var seed = (Math.floor(b.x) * 7 + Math.floor(b.y) * 3) % 4;
    ouverture(v, b, 's', b.w * 0.18, 9, z0 + 8, 8, seed === 0 ? lumiere : verre);
    ouverture(v, b, 's', b.w * 0.82 - 9, 9, z0 + 8, 8, seed === 1 ? lumiere : verre);
    ouverture(v, b, 'e', b.h / 2 - 4.5, 9, z0 + 8, 8, seed === 2 ? lumiere : verre);
    ouverture(v, b, 'w', b.h / 2 - 4.5, 9, z0 + 8, 8, seed === 3 ? lumiere : verre);

    // Cheminée sur une maison sur deux
    if (seed % 2 === 0) {
      var cx = b.w >= b.h ? x0 + b.w * 0.72 : x0 + b.w * 0.5 - 4;
      var cy = b.w >= b.h ? ((y0 + y1) / 2) - 4 : y0 + b.h * 0.3;
      var cc = G.mul(G.hex('#7a6a5e'), 1);
      G.walls(v, cx, cy, 8, 8, zw + 2, zr + 5, cc);
      G.rect(v, cx, cy, 8, 8, zr + 5, G.mul(cc, 0.7));
    }
  };
})();
