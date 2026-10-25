// kyvorex-city/js/render/draw-car.js
// Rôle : dessine la voiture du joueur en code (+ feux de freinage)
// Dépend de : GAME.config, GAME.car, GAME.camera, GAME.input
// Expose : GAME.drawCar(ctx)

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

  GAME.drawCar = function (ctx) {

    var car = GAME.car;
    var cam = GAME.camera;
    var cfg = GAME.config.car;
    var col = GAME.config.colors;
    var w = cfg.width;
    var l = cfg.length;

    ctx.save();
    ctx.translate(car.x - cam.x, car.y - cam.y);
    ctx.rotate(car.angle);

    // Carrosserie
    ctx.fillStyle = col.body;
    rectArrondi(ctx, -w / 2, -l / 2, w, l, cfg.radius);
    ctx.fill();

    // Bandes latérales sombres
    ctx.fillStyle = col.bodyDark;
    ctx.fillRect(-w / 2 + 2, -l / 2 + 6, 3, l - 12);
    ctx.fillRect(w / 2 - 5, -l / 2 + 6, 3, l - 12);

    // Pare-brise
    ctx.fillStyle = col.glass;
    ctx.fillRect(-w / 2 + 4, -l / 2 + 9, w - 8, 9);

    // Lunette arrière
    ctx.fillRect(-w / 2 + 5, l / 2 - 15, w - 10, 7);

    // Phares avant
    ctx.fillStyle = col.light;
    ctx.fillRect(-w / 2 + 3, -l / 2 + 1, 6, 5);
    ctx.fillRect(w / 2 - 9, -l / 2 + 1, 6, 5);

    // Feux de freinage arrière si ▼ est pressé
    if (GAME.input.brake) {
      ctx.fillStyle = '#ff3030';
      ctx.fillRect(-w / 2 + 3, l / 2 - 4, 6, 3);
      ctx.fillRect(w / 2 - 9, l / 2 - 4, 6, 3);
    }

    ctx.restore();
  };
})();