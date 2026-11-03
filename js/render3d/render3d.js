// kyvorex-city/js/render3d/render3d.js
// Rôle : affichage WebGL du monde (sol, routes, maisons) derrière le canvas 2D ; repli 2D si WebGL indisponible
// Dépend de : GAME.geo, GAME.world, GAME.camera, GAME.config.render3d, GAME.config.colors
// Expose : GAME.render3d (enabled, init, resize, draw)

window.GAME = window.GAME || {};

(function () {

  var VERT =
    'attribute vec3 aPos; attribute vec3 aCol;' +
    'uniform vec2 uCam; uniform vec2 uSize; uniform float uHc;' +
    'varying vec3 vCol;' +
    'void main() {' +
    '  float k = uHc / (uHc - aPos.z);' +
    '  vec2 p = (aPos.xy - uCam) * k;' +
    '  gl_Position = vec4(p.x / (uSize.x * 0.5), -p.y / (uSize.y * 0.5), 0.9 - aPos.z / 500.0, 1.0);' +
    '  vCol = aCol;' +
    '}';
  var FRAG =
    'precision mediump float; varying vec3 vCol;' +
    'void main() { gl_FragColor = vec4(vCol, 1.0); }';

  var gl = null, cv = null, nb = 0;
  var uCam, uSize, uHc;

  function shader(type, src) {
    var s = gl.createShader(type);
    gl.shaderSource(s, src);
    gl.compileShader(s);
    if (!gl.getShaderParameter(s, gl.COMPILE_STATUS)) throw new Error(gl.getShaderInfoLog(s));
    return s;
  }

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

        var prog = gl.createProgram();
        gl.attachShader(prog, shader(gl.VERTEX_SHADER, VERT));
        gl.attachShader(prog, shader(gl.FRAGMENT_SHADER, FRAG));
        gl.linkProgram(prog);
        if (!gl.getProgramParameter(prog, gl.LINK_STATUS)) throw new Error('Programme WebGL invalide');
        gl.useProgram(prog);

        var v = [];
        GAME.geo.world(v);
        GAME.geo.buildings(v);
        nb = v.length / 6;

        gl.bindBuffer(gl.ARRAY_BUFFER, gl.createBuffer());
        gl.bufferData(gl.ARRAY_BUFFER, new Float32Array(v), gl.STATIC_DRAW);
        var aPos = gl.getAttribLocation(prog, 'aPos');
        var aCol = gl.getAttribLocation(prog, 'aCol');
        gl.enableVertexAttribArray(aPos);
        gl.enableVertexAttribArray(aCol);
        gl.vertexAttribPointer(aPos, 3, gl.FLOAT, false, 24, 0);
        gl.vertexAttribPointer(aCol, 3, gl.FLOAT, false, 24, 12);

        uCam = gl.getUniformLocation(prog, 'uCam');
        uSize = gl.getUniformLocation(prog, 'uSize');
        uHc = gl.getUniformLocation(prog, 'uHc');

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
      var cam = GAME.camera;
      gl.clear(gl.COLOR_BUFFER_BIT | gl.DEPTH_BUFFER_BIT);
      gl.uniform2f(uCam, cam.x + cam.w / 2, cam.y + cam.h / 2);
      gl.uniform2f(uSize, cam.w, cam.h);
      gl.uniform1f(uHc, GAME.config.render3d.cameraHeight);
      gl.drawArrays(gl.TRIANGLES, 0, nb);
    }
  };
})();
