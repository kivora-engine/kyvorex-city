// kyvorex-city/js/render3d/render3d.js
// Rôle : affichage WebGL du monde (sol, routes, maisons, ombres, voitures) derrière le canvas 2D ; repli 2D si WebGL indisponible
// Dépend de : GAME.geo, GAME.glCam, GAME.glUtil, GAME.sprites3d, GAME.world, GAME.camera, GAME.config.render3d
// Expose : GAME.render3d (enabled, init, resize, draw, project, unproject)

window.GAME = window.GAME || {};

(function () {

  var VERT = GAME.glCam.GLSL +
    'attribute vec3 aPos; attribute vec3 aCol; varying vec3 vCol; varying float vD;' +
    'void main() { gl_Position = camPos(aPos); vCol = aCol; vD = gl_Position.w; }';
  var FRAG =
    'precision mediump float; varying vec3 vCol; varying float vD;' +
    'uniform float uAlpha; uniform vec3 uFogC; uniform vec3 uFog;' +
    'void main() {' +
    '  float f = clamp((vD - uFog.x) / (uFog.y - uFog.x), 0.0, 1.0) * uFog.z;' +
    '  gl_FragColor = vec4(mix(vCol, uFogC, f), uAlpha);' +
    '}';

  var gl = null, cv = null, prog, L, uAlpha, uFogC, uFog, buf;
  var nMonde = 0, nOmbres = 0;

  function abandonner() {
    GAME.render3d.enabled = false;
    if (cv && cv.parentNode) cv.parentNode.removeChild(cv);
    var c2 = document.getElementById('game');
    if (c2) c2.style.background = '';
  }

  GAME.render3d = {
    enabled: false,

    init: function () {
      var cfg = GAME.config.render3d;
      if (!cfg || !cfg.enabled) return false;
      if (/[?&]2d(=|&|$)/.test(window.location.search)) return false; // ?2d : force l'ancien affichage

      try {
        var jeu = document.getElementById('game');
        cv = document.createElement('canvas');
        cv.style.cssText = 'position:fixed;left:0;top:0;display:block;pointer-events:none;';
        jeu.parentNode.insertBefore(cv, jeu);

        gl = cv.getContext('webgl', { alpha: false, antialias: false }) ||
             cv.getContext('experimental-webgl', { alpha: false, antialias: false });
        if (!gl) throw new Error('WebGL indisponible');

        prog = GAME.glUtil.program(gl, VERT, FRAG, ['aPos', 'aCol']);
        L = GAME.glCam.locations(gl, prog);
        uAlpha = gl.getUniformLocation(prog, 'uAlpha');
        uFogC = gl.getUniformLocation(prog, 'uFogC');
        uFog = gl.getUniformLocation(prog, 'uFog');

        var v = [];
        GAME.geo.world(v);
        GAME.geo.buildings(v);
        nMonde = v.length / 6;
        GAME.geo.shadows(v);
        nOmbres = v.length / 6 - nMonde;

        buf = gl.createBuffer();
        gl.bindBuffer(gl.ARRAY_BUFFER, buf);
        gl.bufferData(gl.ARRAY_BUFFER, new Float32Array(v), gl.STATIC_DRAW);
        gl.enableVertexAttribArray(0);
        gl.enableVertexAttribArray(1);

        GAME.sprites3d.init(gl);

        var f = GAME.geo.hex(GAME.config.colors.asphalt);
        gl.clearColor(f[0], f[1], f[2], 1);
        gl.enable(gl.DEPTH_TEST);

        cv.addEventListener('webglcontextlost', function (e) {
          e.preventDefault();
          abandonner();   // le jeu repasse tout seul en 2D
        });

        jeu.style.background = 'transparent';   // le canvas 2D devient transparent : on voit le monde 3D dessous
        this.enabled = true;
        this.resize(GAME.camera.w, GAME.camera.h);
        GAME.glCam.update(GAME.camera);
        return true;
      } catch (e) {
        abandonner();
        return false;
      }
    },

    resize: function (w, h) {
      if (!this.enabled) return;
      cv.width = w;
      cv.height = h;
      cv.style.width = w + 'px';
      cv.style.height = h + 'px';
      gl.viewport(0, 0, w, h);
    },

    draw: function () {
      var cfg = GAME.config.render3d;
      GAME.glCam.update(GAME.camera);

      gl.depthMask(true);
      gl.clear(gl.COLOR_BUFFER_BIT | gl.DEPTH_BUFFER_BIT);
      gl.useProgram(prog);
      GAME.glCam.apply(gl, L);
      gl.bindBuffer(gl.ARRAY_BUFFER, buf);
      gl.vertexAttribPointer(0, 3, gl.FLOAT, false, 24, 0);
      gl.vertexAttribPointer(1, 3, gl.FLOAT, false, 24, 12);

      var fg = cfg.fog;
      var fc = GAME.geo.hex(fg.color);
      gl.uniform3f(uFogC, fc[0], fc[1], fc[2]);
      gl.uniform3f(uFog, fg.start, fg.end, fg.strength);

      // 1) Sol, routes, maisons (opaques)
      gl.uniform1f(uAlpha, 1);
      gl.drawArrays(gl.TRIANGLES, 0, nMonde);

      // 2) Ombres des maisons (transparentes, sans toucher à la profondeur)
      if (cfg.shadowAlpha > 0 && nOmbres > 0) {
        gl.enable(gl.BLEND);
        gl.blendFunc(gl.SRC_ALPHA, gl.ONE_MINUS_SRC_ALPHA);
        gl.depthMask(false);
        gl.uniform1f(uAlpha, cfg.shadowAlpha);
        gl.drawArrays(gl.TRIANGLES, nMonde, nOmbres);
        gl.depthMask(true);
        gl.disable(gl.BLEND);
      }

      // 3) Voitures et marqueur, à plat sur la route
      GAME.sprites3d.draw();
    },

    // Point du sol -> pixel d'écran, et l'inverse (utilisés par la flèche et l'outil de grille)
    project: function (x, y, z) { return GAME.glCam.project(x, y, z); },
    unproject: function (px, py) { return GAME.glCam.unproject(px, py); }
  };
})();
