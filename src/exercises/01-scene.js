/**
 * ÉTAPE 1 — La scène, la caméra, le renderer
 *
 * Objectif : afficher une grille et les trois axes de l'espace 3D.
 * Les consignes détaillées sont dans le navigateur, à droite du rendu.
 *
 * Remplace chaque `null` par le bon appel, sauvegarde, la page se recharge.
 */
import * as THREE from 'three'

export function createScene(container) {
  const width = container.clientWidth
  const height = container.clientHeight

  // TODO 1 — La scène contient tout ce qui existe en 3D.
  //   → new THREE.Scene()
  //   Bonus : donne-lui un fond avec scene.background = new THREE.Color('#0f1117')
  const scene = null

  // TODO 2 — La caméra est notre point de vue.
  //   → new THREE.PerspectiveCamera(fov, aspect, near, far)
  //   Essaie : 60 degrés de champ de vision, width / height comme ratio,
  //   0.1 et 100 comme distances min/max visibles.
  const camera = null

  // TODO 3 — Place la caméra puis fais-la regarder l'origine.
  //   → camera.position.set(4, 3, 5)
  //   → camera.lookAt(0, 0, 0)
  //   Sans ça la caméra est en (0, 0, 0) et regarde vers -Z : on ne voit rien.

  // TODO 4 — Le renderer dessine la scène dans un <canvas>.
  //   → new THREE.WebGLRenderer({ antialias: true })
  const renderer = null

  // TODO 5 — Dimensionne le renderer et branche son canvas dans la page.
  //   → renderer.setSize(width, height)
  //   → renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2))
  //   → container.appendChild(renderer.domElement)

  // TODO 6 — Ajoute des repères visuels à la scène.
  //   → scene.add(new THREE.GridHelper(10, 10, '#3a3d4a', '#22242c'))
  //   → scene.add(new THREE.AxesHelper(2))

  // TODO 7 — Dessine une image. Sans cet appel, le canvas reste vide.
  //   → renderer.render(scene, camera)

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
