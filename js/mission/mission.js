// kyvorex-city/js/mission/mission.js
// Rôle : état de la mission et règles (machine à états)
// Dépend de : GAME.config.mission, GAME.car, GAME.missionPoints, GAME.score, GAME.game
// Expose : GAME.missionState (state, newMission, update, getTarget, getMessage)

window.GAME = window.GAME || {};

GAME.missionState = {

  state: 'idle',        // 'pickup' | 'delivery' | 'done' | 'failed'
  pickupPt: null,
  deliveryPt: null,
  timeLeft: 0,
  endTimer: 0,
  pulse: 0,

  newMission: function () {
    this.pickupPt = GAME.missionPoints.pickPickup(GAME.car.x, GAME.car.y);
    this.deliveryPt = null;
    this.timeLeft = 0;
    this.endTimer = 0;
    this.state = 'pickup';
  },

  update: function (dt) {
    this.pulse += dt;
    var car = GAME.car;
    var mc = GAME.config.mission;
    var trig2 = mc.triggerRadius * mc.triggerRadius;

    if (this.state === 'pickup') {
      if (this.pickupPt) {
        var dx = car.x - this.pickupPt.x;
        var dy = car.y - this.pickupPt.y;
        if (dx * dx + dy * dy < trig2) {
          this.deliveryPt = GAME.missionPoints.pickDelivery(this.pickupPt);
          var ddx = this.deliveryPt.x - this.pickupPt.x;
          var ddy = this.deliveryPt.y - this.pickupPt.y;
          var dist = Math.sqrt(ddx * ddx + ddy * ddy);
          this.timeLeft = mc.baseTime + dist / mc.speedForTime;
          this.state = 'delivery';
        }
      }
    } else if (this.state === 'delivery') {
      this.timeLeft -= dt;
      if (this.timeLeft <= 0) {
        this.timeLeft = 0;
        this.state = 'failed';
        this.endTimer = mc.messageDuration;
        GAME.game.loseLife();
      } else {
        var dxl = car.x - this.deliveryPt.x;
        var dyl = car.y - this.deliveryPt.y;
        if (dxl * dxl + dyl * dyl < trig2) {
          GAME.score.onDelivered(this.timeLeft);
          this.state = 'done';
          this.endTimer = mc.messageDuration;
        }
      }
    } else if (this.state === 'done' || this.state === 'failed') {
      this.endTimer -= dt;
      if (this.endTimer <= 0) this.newMission();
    }
  },

  getTarget: function () {
    if (this.state === 'pickup') return this.pickupPt;
    if (this.state === 'delivery') return this.deliveryPt;
    return null;
  },

  getMessage: function () {
    switch (this.state) {
      case 'pickup': return { text: 'Va chercher le colis', color: '#ffe066' };
      case 'delivery': return { text: 'Livre le colis !', color: '#66ff99' };
      case 'done': return { text: 'Livré !', color: '#66ff99' };
      case 'failed': return { text: 'Trop tard !', color: '#ff6666' };
    }
    return { text: '', color: '#ffffff' };
  }
};