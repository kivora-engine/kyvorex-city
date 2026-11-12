// kyvorex-city/js/render3d/sprite-stress.js
// Rôle : test de charge (local uniquement) : voitures et piétons factices pour mesurer les FPS du téléphone
// Dépend de : GAME.spriteBatch, GAME.config.render3d.stress
// Expose : GAME.spriteStress.start(nombre)

window.GAME = window.GAME || {};

(function () {

  var PITCH = 448, ROAD = 64;      // route i : centre à 64 + 448*i
  var actifs = [], nb = 0, info, frames = 0, t0 = 0;

  function creer(i) {
    var voiture = i % 3 !== 0;
    var route = Math.floor(Math.random() * 6);
    var horiz = Math.random() < 0.5;
    var sens = Math.random() < 0.5 ? 1 : -1;
    var decal = voiture ? 18 : 72 * (Math.random() < 0.5 ? 1 : -1);
    return {
      v: voiture, h: horiz, s: sens, d: decal,
      c: ROAD + PITCH * route,
      p: Math.random() * 2368,
      k: voiture ? 'car' + (i % 6) : 'ped' + (i % 4),
      ph: Math.random() * 6
    };
  }

  function maj(add, dt) {
    for (var i = 0; i < actifs.length; i++) {
      var a = actifs[i], vit = a.v ? 120 : 30;
      a.p += a.s * vit * dt;
      if (a.p > 2368) a.p -= 2368;
      if (a.p < 0) a.p += 2368;
      a.ph += dt * 8;
      var off = a.c + a.d * a.s * (a.v ? 1 : 1);
      var x = a.h ? a.p : off, y = a.h ? off : a.p;
      var ang = a.h ? (a.s > 0 ? Math.PI / 2 : -Math.PI / 2) : (a.s > 0 ? Math.PI : 0);
      var kind = a.k;
      if (!a.v) kind += (Math.floor(a.ph) % 2 ? 'w0' : 'w1');
      add(kind, x, y, ang);
    }
    frames++;
    var t = performance.now();
    if (t - t0 > 1000) {
      if (info) info.textContent = 'STRESS ' + nb + ' | sprites ' + GAME.spriteBatch.count +
        ' | ' + Math.round(frames * 1000 / (t - t0)) + ' FPS | batch ' + GAME.spriteBatch.lastMs.toFixed(1) + ' ms';
      frames = 0; t0 = t;
    }
  }

  GAME.spriteStress = {
    start: function (nombre) {
      nb = nombre;
      actifs = [];
      for (var i = 0; i < nombre; i++) actifs.push(creer(i));
      if (!info) {
        info = document.createElement('div');
        info.style.cssText = 'position:fixed;left:6px;bottom:6px;z-index:99;background:rgba(0,0,0,.7);' +
          'color:#0f0;font:12px monospace;padding:3px 6px;border-radius:4px;pointer-events:none';
        document.body.appendChild(info);
        GAME.spriteBatch.sources.push(maj);
      }
      t0 = performance.now(); frames = 0;
    }
  };

  var local = !/github\.io$/.test(location.hostname);
  var n = GAME.config.render3d && GAME.config.render3d.stress;
  if (local && n > 0) window.addEventListener('load', function () { GAME.spriteStress.start(n); });
})();
