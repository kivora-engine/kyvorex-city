// kyvorex-city/js/game/gameover-ui.js
// Rôle : écran HTML de game over (affichage, masquage, bouton Rejouer)
// Dépend de : éléments #gameover (index.html), GAME.game.restart
// Expose : GAME.gameoverUi (init, show, hide, enableRestart)

window.GAME = window.GAME || {};

GAME.gameoverUi = {

  el: null,
  els: {},

  init: function () {
    if (this.el) return; // déjà branché
    this.el = document.getElementById('gameover');
    this.els.title = document.getElementById('go-title');
    this.els.reason = document.getElementById('go-reason');
    this.els.money = document.getElementById('go-money');
    this.els.deliveries = document.getElementById('go-deliveries');
    this.els.best = document.getElementById('go-best');
    this.els.restart = document.getElementById('go-restart');

    // pointerup (pas click) : évite les déclenchements pendant une glissade
    this.els.restart.addEventListener('pointerup', function (e) {
      e.preventDefault();
      GAME.game.restart();
    });
    this.els.restart.addEventListener('contextmenu', function (e) {
      e.preventDefault();
    });
  },

  show: function (stats) {
    this.els.title.textContent = 'GAME OVER';
    this.els.reason.textContent = stats.reason;
    this.els.money.textContent = 'Argent : $ ' + stats.money;
    this.els.deliveries.textContent = 'Livraisons : ' + stats.deliveries;
    var bestLine = 'Meilleur : $ ' + stats.best;
    if (stats.record) bestLine += '  —  NOUVEAU RECORD !';
    this.els.best.textContent = bestLine;
    this.els.restart.classList.add('disabled');
    this.el.style.display = 'flex';
  },

  hide: function () {
    this.el.style.display = 'none';
    this.els.restart.classList.remove('disabled');
  },

  enableRestart: function () {
    this.els.restart.classList.remove('disabled');
  }
};