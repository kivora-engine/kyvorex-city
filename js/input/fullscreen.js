// kyvorex-city/js/input/fullscreen.js
// Rôle : bouton plein écran (API Fullscreen) ; masqué si le navigateur ne la gère pas
// Dépend de : élément #plein (index.html) ; aucun fichier du jeu
// Expose : rien

(function () {
  var btn = document.getElementById('plein');
  if (!btn) return;

  var racine = document.documentElement;
  var peut = document.fullscreenEnabled || document.webkitFullscreenEnabled;
  if (!peut || !(racine.requestFullscreen || racine.webkitRequestFullscreen)) return; // ex. iPhone : bouton caché

  var ICONE_ENTRER =
    '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.5" stroke-linecap="round" stroke-linejoin="round">' +
    '<path d="M4 9V4h5M15 4h5v5M20 15v5h-5M9 20H4v-5"/></svg>';
  var ICONE_SORTIR =
    '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.5" stroke-linecap="round" stroke-linejoin="round">' +
    '<path d="M9 4v5H4M20 9h-5V4M15 20v-5h5M4 15h5v5"/></svg>';

  function element() {
    return document.fullscreenElement || document.webkitFullscreenElement || null;
  }

  function majIcone() {
    btn.innerHTML = element() ? ICONE_SORTIR : ICONE_ENTRER;
    // Le jeu recalcule sa taille quand la fenêtre change
    setTimeout(function () { window.dispatchEvent(new Event('resize')); }, 300);
  }

  function basculer() {
    try {
      if (element()) {
        if (document.exitFullscreen) document.exitFullscreen();
        else if (document.webkitExitFullscreen) document.webkitExitFullscreen();
      } else {
        var p = racine.requestFullscreen ? racine.requestFullscreen() : racine.webkitRequestFullscreen();
        if (p && p.catch) p.catch(function () {});
      }
    } catch (e) {}
  }

  btn.classList.add('dispo');
  majIcone();
  btn.addEventListener('click', function (e) {
    e.preventDefault();
    basculer();
  });
  btn.addEventListener('contextmenu', function (e) { e.preventDefault(); });
  document.addEventListener('fullscreenchange', majIcone);
  document.addEventListener('webkitfullscreenchange', majIcone);
})();
