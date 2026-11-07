// kyvorex-city/js/render3d/gl-camera.js
// Rôle : caméra penchée qui regarde la voiture ; projection monde -> écran et écran -> sol (même calcul que le GPU)
// Dépend de : GAME.config.render3d
// Expose : GAME.glCam (update, project, unproject, locations, apply, GLSL)

window.GAME = window.GAME || {};

GAME.glCam = {
  NEAR: 60, FAR: 4000,
  cx: 0, cy: 0, cz: 0, D: 800, s: 1, c: 0, w: 1, h: 1,

  // Code GLSL partagé par tous les programmes : position d'un point du monde dans l'écran
  GLSL:
    'uniform vec3 uC; uniform vec2 uK; uniform vec2 uS; uniform vec2 uZ;' +
    'vec4 camPos(vec3 p) {' +
    '  vec3 d = p - uC;' +
    '  float yc = -uS.x * d.y + uS.y * d.z;' +
    '  float zc = -uS.y * d.y - uS.x * d.z;' +
    '  return vec4(d.x * uK.x, yc * uK.y, uZ.x * zc + uZ.y, zc);' +
    '}',

  // Place la caméra : elle regarde le centre de l'écran de jeu, depuis le sud et en hauteur
  update: function (cam) {
    var cfg = GAME.config.render3d;
    var e = cfg.elevation * Math.PI / 180;
    this.s = Math.sin(e);
    this.c = Math.cos(e);
    this.D = cfg.cameraHeight;
    this.w = cam.w;
    this.h = cam.h;
    this.cx = cam.x + cam.w / 2;
    this.cy = cam.y + cam.h / 2 + this.D * this.c;
    this.cz = this.D * this.s;
  },

  // Point du monde (x, y, z) -> pixel d'écran
  project: function (x, y, z) {
    var dy = y - this.cy, dz = (z || 0) - this.cz;
    var yc = -this.s * dy + this.c * dz;
    var zc = -this.c * dy - this.s * dz;
    var k = this.D / zc;
    return { x: this.w / 2 + (x - this.cx) * k, y: this.h / 2 - yc * k };
  },

  // Pixel d'écran -> point du sol (z = 0), ou null si le doigt vise au-dessus du sol
  unproject: function (px, py) {
    var qy = py - this.h / 2;
    var dx = px - this.w / 2;
    var dy = -this.D * this.c + this.s * qy;
    var dz = -this.D * this.s - this.c * qy;
    if (dz >= 0) return null;
    var t = -this.cz / dz;
    return { x: this.cx + t * dx, y: this.cy + t * dy };
  },

  locations: function (gl, prog) {
    return {
      uC: gl.getUniformLocation(prog, 'uC'), uK: gl.getUniformLocation(prog, 'uK'),
      uS: gl.getUniformLocation(prog, 'uS'), uZ: gl.getUniformLocation(prog, 'uZ')
    };
  },

  apply: function (gl, L) {
    var n = this.NEAR, f = this.FAR;
    gl.uniform3f(L.uC, this.cx, this.cy, this.cz);
    gl.uniform2f(L.uK, this.D / (this.w / 2), this.D / (this.h / 2));
    gl.uniform2f(L.uS, this.s, this.c);
    gl.uniform2f(L.uZ, (f + n) / (f - n), -2 * f * n / (f - n));
  }
};
