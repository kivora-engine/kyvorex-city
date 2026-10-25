// kyvorex-city/js/render/draw-police.js
// Rôle : dessine les voitures de police (avec culling et clignotement)
// Dépend de : GAME.policeCars, GAME.wanted, GAME.camera, GAME.config.car
// Expose : GAME.drawPolice(ctx)

window.GAME = window.GAME || {};

(function () {

  function rectArrondi(ctx, x, y, w, h, r) {
    ctx.beginPath();
    ctx.moveTo(x + r, y);
    ctx.lineTo(x + w - r, y);
    ctx.arcTo(x + w, y, x + w, y + r, r);
    ctx.lineTo(x + w, y + h - r);
    ctx.arcTo(x + w, y + h, x + w - r, y + h, r);
    ctx.lineTo(x + r, y + h);
    ctx.arcTo(x, y + h, x, y + h - r, r);
    ctx.lineTo(x, y + r);
    ctx.arcTo(x, y, x + r, y, r);
    ctx.closePath();
  }

  function drawOne(ctx, cam, car) {
    var cfg = GAME.config.car;
    var w = cfg.width, l = cfg.length;
    var sx = car.x - cam.x;
    var sy = car.y - cam.y;

    // Culling
    if (sx + l < 0 || sx - l > cam.w) return;
    if (sy + l < 0 || sy - l > cam.h) return;

    // Clignotement de fuite : visible 1 phase sur 2
    if (GAME.wanted.fleeingTimer > 0) {
      if (Math.floor(GAME.wanted.fleeBlink * 5) % 2 !== 0) return;
    }

    ctx.save();
    ctx.translate(sx, sy);
    ctx.rotate(car.angle);

    // Carrosserie bleu foncé
    ctx.fillStyle = '#1b2c5c';
    rectArrondi(ctx, -w / 2, -l / 2, w, l, cfg.radius);
    ctx.fill();

    // Bandes blanches
    ctx.fillStyle = '#f0f0f0';
    ctx.fillRect(-w / 2 + 2, -l / 2 + 12, 5, l - 24);
    ctx.fillRect(w / 2 - 7, -l / 2 + 12, 5, l - 24);

    // Pare-brise
    ctx.fillStyle = '#1e2b38';
    ctx.fillRect(-w / 2 + 4, -l / 2 + 9, w - 8, 9);

    // Barre lumineuse sur le toit (rouge / bleu, 0.2 s)
    var roofBlink = Math.floor(performance.now() / 200) % 2 === 0;
    ctx.fillStyle = roofBlink ? '#ff3333' : '#3366ff';
    ctx.fillRect(-w / 2 + 3, -6, w - 6, 6);

    // Phares
    ctx.fillStyle = '#ffe9a8';
    ctx.fillRect(-w / 2 + 3, -l / 2 + 1, 6, 5);
    ctx.fillRect(w / 2 - 9, -l / 2 + 1, 6, 5);

    ctx.restore();
  }

  GAME.drawPolice = function (ctx) {
    if (!GAME.policeCars) return;
    var cam = GAME.camera;
    for (var i = 0; i < GAME.policeCars.length; i++) {
      drawOne(ctx, cam, GAME.policeCars[i]);
    }
  };
})();