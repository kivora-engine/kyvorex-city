// kyvorex-city/js/render3d/sprites3d.js
// Rôle : voitures et marqueur de mission (dessins 2D existants) posés à plat dans la scène 3D, cachés par les maisons
// Dépend de : GAME.glCam, GAME.glUtil, GAME.drawCar, GAME.drawPolice, GAME.drawMission, GAME.car, GAME.policeCars, GAME.missionState
// Expose : GAME.sprites3d (init, draw, VERT, FRAG)

window.GAME = window.GAME || {};

(function () {

  var SZ = 96;                       // taille d'une case de l'atlas (px monde)
  var gl, prog, L, buf, tex, atlas, actx, nSlots, data;

  var VERT = GAME.glCam.GLSL +
    'attribute vec3 aPos; attribute vec2 aUv; varying vec2 vUv;' +
    'void main() { gl_Position = camPos(aPos); vUv = aUv; }';
  var FRAG =
    'precision mediump float; varying vec2 vUv; uniform sampler2D uTex;' +
    'void main() { gl_FragColor = texture2D(uTex, vUv); }';

  // Dessine un élément dans sa case : on décale la caméra 2D le temps du dessin (et on la remet)
  function dessiner(slot, e, fonction) {
    var cam = GAME.camera;
    var sx = cam.x, sy = cam.y, sw = cam.w, sh = cam.h;
    var x0 = slot * SZ;
    actx.save();
    actx.beginPath();
    actx.rect(x0, 0, SZ, SZ);
    actx.clip();
    cam.x = e.x - (x0 + SZ / 2);
    cam.y = e.y - SZ / 2;
    cam.w = atlas.width;
    cam.h = SZ;
    try { fonction(actx); } finally {
      cam.x = sx; cam.y = sy; cam.w = sw; cam.h = sh;
      actx.restore();
    }
  }

  function quad(n, slot, e, z) {
    var u0 = slot * SZ / atlas.width, u1 = (slot + 1) * SZ / atlas.width;
    var x0 = e.x - SZ / 2, x1 = e.x + SZ / 2, y0 = e.y - SZ / 2, y1 = e.y + SZ / 2;
    var q = [x0, y0, z, u0, 0,  x1, y0, z, u1, 0,  x1, y1, z, u1, 1,
             x0, y0, z, u0, 0,  x1, y1, z, u1, 1,  x0, y1, z, u0, 1];
    for (var i = 0; i < 30; i++) data[n * 30 + i] = q[i];
    return n + 1;
  }

  GAME.sprites3d = {
    VERT: VERT,
    FRAG: FRAG,

    init: function (glContext) {
      gl = glContext;
      nSlots = 2 + GAME.config.police.maxCars;   // joueur + marqueur + voitures de police
      atlas = document.createElement('canvas');
      atlas.width = nSlots * SZ;
      atlas.height = SZ;
      actx = atlas.getContext('2d');
      data = new Float32Array(nSlots * 30);

      prog = GAME.glUtil.program(gl, VERT, FRAG, ['aPos', 'aUv']);
      L = GAME.glCam.locations(gl, prog);
      L.uTex = gl.getUniformLocation(prog, 'uTex');
      buf = gl.createBuffer();
      tex = gl.createTexture();
      gl.bindTexture(gl.TEXTURE_2D, tex);
      gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_MIN_FILTER, gl.LINEAR);
      gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_MAG_FILTER, gl.LINEAR);
      gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_WRAP_S, gl.CLAMP_TO_EDGE);
      gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_WRAP_T, gl.CLAMP_TO_EDGE);
      if (GAME.spriteBatch) GAME.spriteBatch.init(gl);
    },

    // À appeler après le monde et les ombres : la caméra GL est déjà à jour
    draw: function () {
      var z = GAME.config.render3d.spriteZ;
      var ms = GAME.missionState;
      var n = 0, i;

      actx.clearRect(0, 0, atlas.width, SZ);

      // Case 0 : voiture du joueur
      dessiner(0, GAME.car, GAME.drawCar);
      n = quad(n, 0, GAME.car, z);

      // Cases 1... : voitures de police (une à la fois, la fonction 2D dessine toute la liste)
      var police = GAME.policeCars || [];
      for (i = 0; i < police.length && i < nSlots - 2; i++) {
        (function (pc) {
          dessiner(1 + i, pc, function (c) {
            var toutes = GAME.policeCars;
            GAME.policeCars = [pc];
            try { GAME.drawPolice(c); } finally { GAME.policeCars = toutes; }
          });
        })(police[i]);
        n = quad(n, 1 + i, police[i], z);
      }

      // Dernière case : marqueur de la mission
      var pt = ms && (ms.state === 'pickup' ? ms.pickupPt : (ms.state === 'delivery' ? ms.deliveryPt : null));
      if (pt) {
        dessiner(nSlots - 1, pt, GAME.drawMission);
        n = quad(n, nSlots - 1, pt, z);
      }

      gl.useProgram(prog);
      GAME.glCam.apply(gl, L);
      gl.activeTexture(gl.TEXTURE0);
      gl.bindTexture(gl.TEXTURE_2D, tex);
      gl.pixelStorei(gl.UNPACK_PREMULTIPLY_ALPHA_WEBGL, true);
      gl.texImage2D(gl.TEXTURE_2D, 0, gl.RGBA, gl.RGBA, gl.UNSIGNED_BYTE, atlas);
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

      if (GAME.spriteBatch) GAME.spriteBatch.draw();
    }
  };
})();
