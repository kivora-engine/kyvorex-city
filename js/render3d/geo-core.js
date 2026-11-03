// kyvorex-city/js/render3d/geo-core.js
// Rôle : petits outils pour fabriquer des triangles colorés (sommet = x, y, z, r, g, b)
// Dépend de : rien
// Expose : GAME.geo (hex, mul, quad, rect, walls)

window.GAME = window.GAME || {};

GAME.geo = {

  // '#rrggbb' -> [r, g, b] entre 0 et 1
  hex: function (h) {
    var n = parseInt(h.slice(1), 16);
    return [((n >> 16) & 255) / 255, ((n >> 8) & 255) / 255, (n & 255) / 255];
  },

  mul: function (c, k) {
    return [c[0] * k, c[1] * k, c[2] * k];
  },

  vert: function (v, p, c) {
    v.push(p[0], p[1], p[2], c[0], c[1], c[2]);
  },

  // Quadrilatère = 2 triangles ; une couleur par coin
  quad: function (v, p0, p1, p2, p3, c0, c1, c2, c3) {
    this.vert(v, p0, c0); this.vert(v, p1, c1); this.vert(v, p2, c2);
    this.vert(v, p0, c0); this.vert(v, p2, c2); this.vert(v, p3, c3);
  },

  // Rectangle à plat à la hauteur z
  rect: function (v, x, y, w, h, z, c) {
    this.quad(v, [x, y, z], [x + w, y, z], [x + w, y + h, z], [x, y + h, z], c, c, c, c);
  },

  // 4 murs d'un pavé, de z0 (bas) à z1 (haut), avec ombrage par face
  walls: function (v, x, y, w, h, z0, z1, c) {
    var cfg = GAME.config.render3d;
    var s = cfg.faceShade;
    var g = this;
    function face(ax, ay, bx, by, k) {
      var haut = g.mul(c, k);
      var bas = g.mul(c, k * cfg.wallBottomShade);
      g.quad(v, [ax, ay, z0], [bx, by, z0], [bx, by, z1], [ax, ay, z1], bas, bas, haut, haut);
    }
    face(x, y, x + w, y, s.n);
    face(x, y + h, x + w, y + h, s.s);
    face(x + w, y, x + w, y + h, s.e);
    face(x, y, x, y + h, s.w);
  }
};
