// kyvorex-city/js/game/score.js
// Rôle : argent, nombre de livraisons, meilleur score
// Dépend de : GAME.config.game, GAME.save
// Expose : GAME.score (money, deliveries, best, lastGain, reset, onDelivered, commitBest)

window.GAME = window.GAME || {};

GAME.score = {

  money: 0,
  deliveries: 0,
  best: 0,
  lastGain: 0,   // dernier gain affiché à côté de "Livré !"

  reset: function () {
    this.money = 0;
    this.deliveries = 0;
    this.lastGain = 0;
  },

  // Appelé à chaque livraison réussie
  onDelivered: function (timeLeft) {
    var g = GAME.config.game;
    var gain = Math.floor(g.baseReward + timeLeft * g.bonusPerSecond);
    this.money += gain;
    this.deliveries += 1;
    this.lastGain = gain;
    return gain;
  },

  // Met à jour le record si nécessaire. Renvoie true si nouveau record
  commitBest: function () {
    if (this.money > this.best) {
      this.best = this.money;
      GAME.save.store(this.money);
      return true;
    }
    return false;
  }
};