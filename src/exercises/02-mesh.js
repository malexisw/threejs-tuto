/**
 * ÉTAPE 2 — Afficher un objet : géométrie + matériau
 *
 * L'étape 1 est déjà écrite pour toi. À toi de créer le cube.
 *
 * Bloqué ? Le panneau « À faire » ouvre un indice par clic, du cadrage à la
 * réponse. Un cran, puis retour au code.
 */
import * as THREE from 'three'

export function createScene(container) {
  const width = container.clientWidth
  const height = container.clientHeight

  const scene = new THREE.Scene()
  scene.background = new THREE.Color('#0f1117')

  const camera = new THREE.PerspectiveCamera(60, width / height, 0.1, 100)
  camera.position.set(4, 3, 5)
  camera.lookAt(0, 0, 0)

  const renderer = new THREE.WebGLRenderer({ antialias: true })
  renderer.setSize(width, height)
  renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2))
  container.appendChild(renderer.domElement)

  scene.add(new THREE.GridHelper(10, 10, '#3a3d4a', '#22242c'))

  // ---------------------------------------------------------------- à toi ----

  // TODO 1 — La forme : la géométrie d'un cube de 1.5 unité de côté.
  const geometry = null

  // TODO 2 — L'apparence : un matériau de couleur plate, qui ignore totalement
  //   les lumières (on ajoutera l'éclairage à l'étape suivante).
  const material = null

  // TODO 3 — Le mesh assemble la forme et l'apparence.
  const cube = null

  // TODO 4 — Pose le cube sur la grille : son centre doit monter de la moitié
  //   de sa hauteur, sinon il s'enfonce à moitié dans le sol.
  //   Puis fais-le pivoter un peu sur son axe vertical — attention, les
  //   rotations sont en radians, pas en degrés.

  // TODO 5 — Ajoute le cube à la scène. Un mesh non ajouté n'existe pas.

  // TODO 6 — Dessine l'image.

  // ---------------------------------------------------------------------------

  return {
    scene,
    camera,
    renderer,
    object: cube,
    dispose() {
      geometry?.dispose()
      material?.dispose()
      renderer.dispose()
    },
  }
}
