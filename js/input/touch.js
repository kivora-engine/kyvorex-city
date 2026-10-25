// kyvorex-city/js/input/touch.js
// Rôle : boutons tactiles multitouch écrivent dans GAME.input
// Dépend de : GAME.input, éléments [data-ctrl] (index.html)
// Expose : GAME.touch.init()

(function () {

  var actifs = {}; // pointerId -> élément pressé

  function ecrire(el, valeur) {
    var nom = el.getAttribute('data-ctrl');
    if (nom && GAME.input.hasOwnProperty(nom)) GAME.input[nom] = valeur;
    if (valeur) el.classList.add('presse');
    else el.classList.remove('presse');
  }

  function surBas(e) {
    e.preventDefault();
    var el = e.currentTarget;
    actifs[e.pointerId] = el;
    ecrire(el, true);
    // Capture : garantit que pointerup arrive même si le doigt glisse
    if (el.setPointerCapture) {
      try { el.setPointerCapture(e.pointerId); } catch (err) {}
    }
  }

  function surHaut(e) {
    var el = actifs[e.pointerId] || e.currentTarget;
    ecrire(el, false);
    delete actifs[e.pointerId];
  }

  // Relâche tous les boutons (sécurité)
  function relacherTout() {
    var boutons = document.querySelectorAll('[data-ctrl]');
    for (var i = 0; i < boutons.length; i++) ecrire(boutons[i], false);
    actifs = {};
  }

  GAME.touch = {
    init: function () {
      var boutons = document.querySelectorAll('[data-ctrl]');

      for (var i = 0; i < boutons.length; i++) {
        var b = boutons[i];
        b.addEventListener('pointerdown', surBas);
        b.addEventListener('pointerup', surHaut);
        b.addEventListener('pointercancel', surHaut);
        b.addEventListener('pointerleave', surHaut);
        // Pas de menu contextuel sur appui long
        b.addEventListener('contextmenu', function (e) { e.preventDefault(); });
      }

      // L'app passe en arrière-plan : aucun bouton ne doit rester enfoncé
      window.addEventListener('blur', relacherTout);
      document.addEventListener('visibilitychange', function () {
        if (document.hidden) relacherTout();
      });
    }
  };
})();