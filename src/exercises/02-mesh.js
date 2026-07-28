/**
 * ÉTAPE 2 — Afficher un objet : géométrie + matériau
 *
 * L'étape 1 est déjà écrite pour toi. À toi de créer le cube.
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

  // TODO 1 — La forme : un cube de 1.5 unité de côté.
  //   → new THREE.BoxGeometry(1.5, 1.5, 1.5)
  const geometry = null

  // TODO 2 — L'apparence : une couleur plate, qui ignore les lumières.
  //   → new THREE.MeshBasicMaterial({ color: '#c084fc' })
  const material = null

  // TODO 3 — Le mesh assemble la forme et l'apparence.
  //   → new THREE.Mesh(geometry, material)
  const cube = null

  // TODO 4 — Pose le cube sur la grille, puis fais-le pivoter un peu.
  //   → cube.position.set(0, 0.75, 0)   (la moitié de sa hauteur)
  //   → cube.rotation.y = Math.PI / 5   (en radians, pas en degrés !)

  // TODO 5 — Ajoute le cube à la scène. Un mesh non ajouté n'existe pas.
  //   → scene.add(cube)

  // TODO 6 — Dessine l'image.
  //   → renderer.render(scene, camera)

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
