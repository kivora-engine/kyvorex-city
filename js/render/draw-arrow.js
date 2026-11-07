// kyvorex-city/js/render/draw-arrow.js
// Rôle : flèche directionnelle autour de la voiture, vers la cible
// Dépend de : GAME.missionState, GAME.car, GAME.camera
// Expose : GAME.drawArrow(ctx)

window.GAME = window.GAME || {};

(function () {

  var DISTANCE = 70; // pixels depuis le centre de la voiture

  // Point du monde -> pixel d'écran (3D inclinée si active, sinon décalage simple)
  function ecran(x, y, cam) {
    if (GAME.render3d && GAME.render3d.enabled) return GAME.render3d.project(x, y, 0);
    return { x: x - cam.x, y: y - cam.y };
  }

  GAME.drawArrow = function (ctx) {
    var ms = GAME.missionState;
    var cible = ms.getTarget();
    if (!cible) return;

    var car = GAME.car;
    var cam = GAME.camera;

    // Positions à l'écran (en 3D inclinée, la voiture n'est plus à x - cam.x)
    var a = ecran(car.x, car.y, cam);
    var b = ecran(cible.x, cible.y, cam);
    var angle = Math.atan2(b.y - a.y, b.x - a.x);

    // Position écran de la flèche
    var ax = a.x + Math.cos(angle) * DISTANCE;
    var ay = a.y + Math.sin(angle) * DISTANCE;

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