/**
 * ÉTAPE 1 — La scène, la caméra, le renderer
 *
 * Objectif : afficher une grille et les trois axes de l'espace 3D.
 * Les consignes détaillées, les valeurs à utiliser et la doc sont dans le
 * navigateur, à droite du rendu.
 *
 * Complète le code, sauvegarde, la page se recharge.
 */
import * as THREE from 'three'

export function createScene(container) {
  const width = container.clientWidth
  const height = container.clientHeight

  // TODO 1 — La scène : le conteneur de tout ce qui existe en 3D.
  //   Bonus : donne-lui une couleur de fond.
  const scene = null

  // TODO 2 — La caméra : notre point de vue. Une caméra en perspective se règle
  //   avec un champ de vision, un ratio d'image et deux distances (la plus
  //   proche et la plus lointaine visibles).
  const camera = null

  // TODO 3 — Place la caméra en hauteur et en retrait, puis fais-la regarder
  //   l'origine. Sans ça elle reste en (0, 0, 0) et regarde vers -Z : rien ne
  //   sera visible.

  // TODO 4 — Le renderer : c'est lui qui dessine la scène dans un <canvas>.
  //   Active l'antialiasing pour éviter les bords en escalier.
  const renderer = null

  // TODO 5 — Donne au renderer la taille du conteneur, ajuste-le à la densité
  //   de pixels de l'écran, puis insère son canvas dans le container.

  // TODO 6 — Ajoute des repères visuels à la scène : une grille au sol et les
  //   trois axes colorés.

  // TODO 7 — Dessine une image. Sans cet appel, le canvas reste vide.

  // Ne touche pas à ce retour : le tuto s'en sert pour vérifier ton travail.
  return {
    scene,
    camera,
    renderer,
    dispose() {
      renderer?.dispose()
    },
  }
}
