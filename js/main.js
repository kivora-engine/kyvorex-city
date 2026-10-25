// kyvorex-city/js/main.js
// Rôle : canvas, redimensionnement, boucle de jeu, appel du rendu
// Dépend de : tous les autres scripts (chargés avant)
// Expose : rien (démarre le jeu)

(function () {

  var canvas = document.getElementById('game');
  var ctx = canvas.getContext('2d');

  var dernier = 0;
  var fps = 0;
  var cumulFps = 0;
  var images = 0;

  function redimensionner() {
    var dpr = Math.min(1, window.devicePixelRatio || 1);
    var w = window.innerWidth;
    var h = window.innerHeight;

    canvas.width = Math.floor(w * dpr);
    canvas.height = Math.floor(h * dpr);
    canvas.style.width = w + 'px';
    canvas.style.height = h + 'px';

    ctx.setTransform(dpr, 0, 0, dpr, 0, 0);

    GAME.camera.w = w;
    GAME.camera.h = h;
  }

  function boucle(temps) {
    var dt = dernier ? (temps - dernier) / 1000 : 0;
    dernier = temps;
    if (dt > 0.05) dt = 0.05;

    // --- Mise à jour (figée pendant le game over) ---
    if (GAME.game.state === 'playing') {
      GAME.car.update(dt);
      GAME.collision.resolve();
      GAME.police.update(dt);
      GAME.mission.update(dt);
    }
    GAME.game.update(dt);
    GAME.sound.update(dt);
    GAME.camera.follow(dt);

    // --- Rendu (toujours actif) ---
    GAME.drawGround(ctx);
    GAME.drawCity(ctx);
    GAME.mission.draw(ctx, 'world');
    GAME.police.draw(ctx);
    GAME.drawCar(ctx);
    GAME.mission.draw(ctx, 'overlay');
    GAME.drawHud(ctx, fps);
    GAME.police.drawHud(ctx);
    GAME.drawScoreHud(ctx);

    // --- Compteur FPS ---
    cumulFps += dt;
    images++;
    if (cumulFps >= 0.5) {
      fps = images / cumulFps;
      cumulFps = 0;
      images = 0;
    }

    requestAnimationFrame(boucle);
  }

  function demarrer() {
    redimensionner();

    GAME.cityMap.generate();
    GAME.car.reset();
    GAME.car.x = GAME.world.spawn.x;
    GAME.car.y = GAME.world.spawn.y;
    GAME.car.angle = GAME.world.spawn.angle;
    GAME.camera.snap();
    GAME.mission.init();
    GAME.police.init();
    GAME.game.init();
    GAME.sound.init();

    GAME.keyboard.init();
    GAME.touch.init();

    window.addEventListener('resize', redimensionner);
    window.addEventListener('orientationchange', function () {
      setTimeout(redimensionner, 250);
    });

    document.addEventListener('visibilitychange', function () {
      if (document.hidden) GAME.input.reset();
      dernier = 0;
    });

    requestAnimationFrame(boucle);
  }

  if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', demarrer);
  } else {
    demarrer();
  }
})();