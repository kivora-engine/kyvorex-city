// kyvorex-city/js/render/draw-arrow.js
// Rôle : flèche directionnelle autour de la voiture, vers la cible
// Dépend de : GAME.missionState, GAME.car, GAME.camera
// Expose : GAME.drawArrow(ctx)

window.GAME = window.GAME || {};

(function () {

  var DISTANCE = 70; // pixels depuis le centre de la voiture

  GAME.drawArrow = function (ctx) {
    var ms = GAME.missionState;
    var cible = ms.getTarget();
    if (!cible) return;

    var car = GAME.car;
    var cam = GAME.camera;

    // Direction monde -> écran, angle de la flèche
    var dx = cible.x - car.x;
    var dy = cible.y - car.y;
    var angle = Math.atan2(dy, dx);

    // Position écran de la flèche
    var ax = (car.x - cam.x) + Math.cos(angle) * DISTANCE;
    var ay = (car.y - cam.y) + Math.sin(angle) * DISTANCE;

    // Couleur de la flèche = couleur du marqueur ciblé
    var couleur = ms.state === 'pickup' ? '#ffe066' : '#66ff99';

    ctx.save();
    ctx.translate(ax, ay);
    ctx.rotate(angle);

    ctx.beginPath();
    ctx.moveTo(14, 0);
    ctx.lineTo(-8, -9);
    ctx.lineTo(-8, 9);
    ctx.closePath();
    ctx.fillStyle = couleur;
    ctx.fill();

    // Contour pour la lisibilité sur fond clair
    ctx.strokeStyle = 'rgba(0,0,0,0.6)';
    ctx.lineWidth = 2;
    ctx.stroke();

    ctx.restore();
  };
})();