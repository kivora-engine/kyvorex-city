// kyvorex-city/js/police/police-car.js
// Rôle : création et mise à jour physique d'une voiture de police (IA)
// Dépend de : GAME.config.police, GAME.config.car, GAME.policeGraph, GAME.car, GAME.collision
// Expose : GAME.policeCars (tableau), GAME.policeCar (create, update)

window.GAME = window.GAME || {};

(function () {

  GAME.policeCars = GAME.policeCars || [];

  function create(x, y) {
    return {
      x: x, y: y,
      angle: 0,
      speed: 0,
      path: [],
      pathIndex: 0,
      repathTimer: 0,
      stuckTimer: 0
    };
  }

  function update(car, dt) {
    var c = GAME.config.police;
    var player = GAME.car;

    // --- Recalcul du chemin (BFS) toutes les repathInterval secondes ---
    car.repathTimer -= dt;
    if (car.repathTimer <= 0) {
      var from = GAME.policeGraph.nearestIndex(car.x, car.y);
      var to = GAME.policeGraph.nearestIndex(player.x, player.y);
      var nodes = GAME.policeGraph.bfs(from, to);
      car.path = [];
      for (var i = 1; i < nodes.length; i++) {
        car.path.push(GAME.policeGraph.centerOf(nodes[i].i, nodes[i].j));
      }
      car.path.push({ x: player.x, y: player.y });
      car.pathIndex = 0;
      car.repathTimer = c.repathInterval;
    }

    // --- Le dernier point suit le joueur en temps réel ---
    if (car.path.length > 0) {
      car.path[car.path.length - 1] = { x: player.x, y: player.y };
    }

    // --- Cible courante + avance dans le chemin ---
    var target = car.path[car.pathIndex] || { x: player.x, y: player.y };
    var dxT = target.x - car.x;
    var dyT = target.y - car.y;
    var distT = Math.sqrt(dxT * dxT + dyT * dyT);
    if (distT < c.nodeReach && car.pathIndex < car.path.length - 1) {
      car.pathIndex++;
      target = car.path[car.pathIndex];
      dxT = target.x - car.x;
      dyT = target.y - car.y;
    }

    // --- Orientation (angle 0 = vers le haut) ---
    var targetAngle = Math.atan2(dxT, -dyT);
    var diff = targetAngle - car.angle;
    while (diff > Math.PI) diff -= 2 * Math.PI;
    while (diff < -Math.PI) diff += 2 * Math.PI;
    var diffToTarget = diff; // mémorisé avant clamp pour le check cornerAngle
    var maxTurn = c.turnSpeed * dt;
    if (Math.abs(diff) > maxTurn) diff = maxTurn * Math.sign(diff);
    car.angle += diff;

    // --- a. Distance au joueur ---
    var dxP = player.x - car.x;
    var dyP = player.y - car.y;
    var distP = Math.sqrt(dxP * dxP + dyP * dyP);

    // --- b. Plafond de vitesse (cap) selon proximité et virage ---
    var cap = c.maxSpeed;
    if (distP < c.slowRadius) cap = c.slowSpeed;
    if (Math.abs(diffToTarget) > c.cornerAngle && cap > c.cornerSpeed) {
      cap = c.cornerSpeed;
    }

    // --- c. Ajustement progressif de la vitesse vers cap ---
    if (car.speed > cap) {
      car.speed = Math.max(cap, car.speed - c.brakeDecel * dt);
    } else {
      car.speed = Math.min(cap, car.speed + c.accel * dt);
    }

    // --- d. Déplacement ---
    car.x += Math.sin(car.angle) * car.speed * dt;
    car.y -= Math.cos(car.angle) * car.speed * dt;

    // --- e. Collision avec bâtiments et bords du monde ---
    GAME.collision.resolveEntity(car, c.hitFactor, c.slideFactor);

    // --- f. Anti-blocage : téléport au centre d'intersection si coincé ---
    if (car.speed < c.stuckSpeed && distP > c.slowRadius) {
      car.stuckTimer += dt;
    } else {
      car.stuckTimer = 0;
    }
    if (car.stuckTimer > c.stuckTime) {
      var idx = GAME.policeGraph.nearestIndex(car.x, car.y);
      var ctr = GAME.policeGraph.centerOf(idx.i, idx.j);
      car.x = ctr.x;
      car.y = ctr.y;
      car.speed = 0;
      car.stuckTimer = 0;
      car.repathTimer = 0;
    }
  }

  GAME.policeCar = { create: create, update: update };
})();