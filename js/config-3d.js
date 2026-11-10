// kyvorex-city/js/config-3d.js
// Rôle : réglages du monde en 3D (WebGL) : caméra, hauteurs, ombrage
// Dépend de : GAME.config (créé par config.js)
// Expose : GAME.config.render3d

window.GAME = window.GAME || {};

GAME.config.render3d = {
  enabled: true,        // false = on garde l'ancien affichage 2D
  cameraHeight: 900,    // distance caméra - voiture (plus grand = moins de perspective)
  elevation: 70,        // inclinaison : 90 = vue de dessus, 70 = un peu penchée, 55 = plus penchée

  shadowAlpha: 0.32,    // force des ombres des maisons (0 = aucune)
  shadowDir: { x: 0.55, y: 0.4 },   // l'ombre tombe vers la droite et vers le bas (soleil en haut à gauche)
  spriteZ: 4,           // hauteur des voitures et du marqueur (posés sur la route)

  sidewalkHeight: 3,    // hauteur du trottoir (bloc entier)
  interiorLift: 0.4,    // l'intérieur du bloc est à peine plus haut que le trottoir

  // Hauteur des maisons : heightMin + niveau * heightStep (niveau 0 à heightLevels-1)
  heightMin: 40,
  heightStep: 10,
  heightLevels: 5,

  // Maisons (toit à deux pentes) et bâtiments publics
  house: { wall: 22, ridge: 12, eave: 3 },   // hauteur des murs, hauteur du toit, débord du toit
  poi: { height: 54 },                        // hauteur des bâtiments publics

  // Ombrage (1 = couleur d'origine)
  wallBottomShade: 0.55,                           // bas des murs plus sombre
  faceShade: { n: 0.62, s: 0.78, e: 0.70, w: 0.55 }, // nord, sud, est, ouest
  roofLine: 0.6,                                   // trait du toit : couleur du toit x ce facteur

  // Brouillard : les choses lointaines (en haut de l'écran) se fondent dans la couleur du brouillard
  fog: { color: '#0e141c', start: 880, end: 1250, strength: 0.8 }   // strength 0 = aucun brouillard
};
