// kyvorex-city/js/render3d/sprite-batch.js
// Rôle : dessine en UN seul appel GPU tous les sprites du catalogue (civils, piétons, secours...)
// Dépend de : GAME.spriteArt, GAME.glCam, GAME.glUtil, GAME.sprites3d (VERT, FRAG)
// Expose : GAME.spriteBatch (sources, init, draw, lastMs, count)

window.GAME = window.GAME || {};

(function () {

  var gl, prog, L, buf, tex, data, max, A;
  var last = 0;

  GAME.spriteBatch = {
    sources: [],      // fonctions (add, dt) appelées à chaque image
    count: 0,         // sprites dessinés à la dernière image
    lastMs: 0,        // temps de préparation + envoi (ms)

    init: function (glContext) {
      gl = glContext;
      A = GAME.spriteArt;
      max = (GAME.config.render3d.sprites && GAME.config.render3d.sprites.max) || 160;
      data = new Float32Array(max * 30);

      var atlas = document.createElement('canvas');
      atlas.width = A.COLS * A.CELL;
      atlas.height = A.ROWS * A.CELL;
      A.build(atlas.getContext('2d'));

      prog = GAME.glUtil.program(gl, GAME.sprites3d.VERT, GAME.sprites3d.FRAG, ['aPos', 'aUv']);
      L = GAME.glCam.locations(gl, prog);
      L.uTex = gl.getUniformLocation(prog, 'uTex');
      buf = gl.createBuffer();
      tex = gl.createTexture();
      gl.bindTexture(gl.TEXTURE_2D, tex);
      gl.pixelStorei(gl.UNPACK_PREMULTIPLY_ALPHA_WEBGL, true);
      gl.texImage2D(gl.TEXTURE_2D, 0, gl.RGBA, gl.RGBA, gl.UNSIGNED_BYTE, atlas);
      gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_MIN_FILTER, gl.LINEAR);
      gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_MAG_FILTER, gl.LINEAR);
      gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_WRAP_S, gl.CLAMP_TO_EDGE);
      gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_WRAP_T, gl.CLAMP_TO_EDGE);
    },

    // À appeler après le monde, les ombres et les sprites v1
    draw: function () {
      var t0 = performance.now();
      var dt = last ? Math.min(0.05, (t0 - last) / 1000) : 0.016;
      last = t0;
      var z = GAME.config.render3d.spriteZ;
      var cx = GAME.camera.x + GAME.camera.w / 2, cy = GAME.camera.y + GAME.camera.h / 2;
      var n = 0, i, src = this.sources;
      var W = A.COLS * A.CELL, H = A.ROWS * A.CELL, e = 0.5;

      function add(kind, x, y, angle) {
        if (n >= max) return;
        var k = A.index[kind];
        if (k === undefined) return;
        if (Math.abs(x - cx) > 800 || Math.abs(y - cy) > 800) return;
        var h = A.size[kind] / 2, c = Math.cos(angle || 0), s = Math.sin(angle || 0);
        var u0 = ((k % A.COLS) * A.CELL + e) / W, u1 = ((k % A.COLS + 1) * A.CELL - e) / W;
        var v0 = (Math.floor(k / A.COLS) * A.CELL + e) / H, v1 = ((Math.floor(k / A.COLS) + 1) * A.CELL - e) / H;
        var ax = x + (-h) * c - (-h) * s, ay = y + (-h) * s + (-h) * c;   // haut-gauche
        var bx = x + h * c - (-h) * s,    by = y + h * s + (-h) * c;      // haut-droite
        var dx = x + h * c - h * s,       dy = y + h * s + h * c;         // bas-droite
        var ex = x + (-h) * c - h * s,    ey = y + (-h) * s + h * c;      // bas-gauche
        var q = [ax, ay, z, u0, v0,  bx, by, z, u1, v0,  dx, dy, z, u1, v1,
                 ax, ay, z, u0, v0,  dx, dy, z, u1, v1,  ex, ey, z, u0, v1];
        for (var j = 0; j < 30; j++) data[n * 30 + j] = q[j];
        n++;
      }

      for (i = 0; i < src.length; i++) src[i](add, dt);
      this.count = n;
      if (!n) { this.lastMs = 0; return; }

      gl.useProgram(prog);
      GAME.glCam.apply(gl, L);
      gl.activeTexture(gl.TEXTURE0);
      gl.bindTexture(gl.TEXTURE_2D, tex);
      gl.uniform1i(L.uTex, 0);
      gl.bindBuffer(gl.ARRAY_BUFFER, buf);
      gl.bufferData(gl.ARRAY_BUFFER, data.subarray(0, n * 30), gl.DYNAMIC_DRAW);
      gl.vertexAttribPointer(0, 3, gl.FLOAT, false, 20, 0);
      gl.vertexAttribPointer(1, 2, gl.FLOAT, false, 20, 12);
      gl.enable(gl.BLEND);
      gl.blendFunc(gl.ONE, gl.ONE_MINUS_SRC_ALPHA);
      gl.depthMask(false);
      gl.drawArrays(gl.TRIANGLES, 0, n * 6);
      gl.depthMask(true);
      gl.disable(gl.BLEND);
      this.lastMs = performance.now() - t0;
    }
  };
})();
