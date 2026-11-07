// kyvorex-city/js/render3d/gl-util.js
// Rôle : compile un programme WebGL (vertex + fragment) avec l'ordre des attributs imposé
// Dépend de : rien
// Expose : GAME.glUtil.program(gl, vertex, fragment, attributs)

window.GAME = window.GAME || {};

GAME.glUtil = {
  program: function (gl, vsSrc, fsSrc, attribs) {
    function shader(type, src) {
      var s = gl.createShader(type);
      gl.shaderSource(s, src);
      gl.compileShader(s);
      if (!gl.getShaderParameter(s, gl.COMPILE_STATUS)) throw new Error(gl.getShaderInfoLog(s));
      return s;
    }
    var p = gl.createProgram();
    gl.attachShader(p, shader(gl.VERTEX_SHADER, vsSrc));
    gl.attachShader(p, shader(gl.FRAGMENT_SHADER, fsSrc));
    for (var i = 0; i < attribs.length; i++) gl.bindAttribLocation(p, i, attribs[i]);
    gl.linkProgram(p);
    if (!gl.getProgramParameter(p, gl.LINK_STATUS)) throw new Error('Programme WebGL invalide');
    return p;
  }
};
