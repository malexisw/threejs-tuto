/**
 * ÉTAPE 3 — Les lumières et les matériaux
 *
 * Le cube de l'étape 2 est là, mais tout plat. À toi de lui donner du volume.
 * Attention : dès que tu passes en MeshStandardMaterial, l'objet devient NOIR
 * tant qu'il n'y a pas de lumière dans la scène. C'est normal.
 */
import * as THREE from 'three'

export function createScene(container) {
  const width = container.clientWidth
  const height = container.clientHeight

  const scene = new THREE.Scene()
  scene.background = new THREE.Color('#0f1117')

  const camera = new THREE.PerspectiveCamera(60, width / height, 0.1, 100)
  camera.position.set(4, 3, 5)
  camera.lookAt(0, 0.5, 0)

  const renderer = new THREE.WebGLRenderer({ antialias: true })
  renderer.setSize(width, height)
  renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2))
  container.appendChild(renderer.domElement)

  // ---------------------------------------------------------------- à toi ----

  // TODO 1 — Active les ombres sur le renderer : elles coûtent cher, donc
  //   elles sont désactivées par défaut.

  const geometry = new THREE.BoxGeometry(1.5, 1.5, 1.5)

  // TODO 2 — Remplace ce MeshBasicMaterial par un matériau qui réagit à la
  //   lumière. Règle aussi sa rugosité (0 = miroir, 1 = mat) et son côté
  //   métallique.
  const material = new THREE.MeshBasicMaterial({ color: '#c084fc' })

  const cube = new THREE.Mesh(geometry, material)
  cube.position.y = 0.75
  scene.add(cube)

  // TODO 3 — Autorise le cube à projeter son ombre.

  // TODO 4 — Crée un sol pour recevoir l'ombre : un plan de 12 x 12, dans un
  //   matériau qui réagit lui aussi à la lumière. Un plan est vertical par
  //   défaut : il faut le coucher d'un quart de tour pour en faire un sol.
  //   Autorise-le à recevoir les ombres, puis ajoute-le à la scène.
  const floorGeometry = null
  const floorMaterial = null

  // TODO 5 — Une lumière d'ambiance : elle éclaire tout uniformément, pour
  //   qu'aucune face ne reste complètement noire. Elle ne crée aucun relief.

  // TODO 6 — Une lumière directionnelle : le "soleil". C'est elle qui sculpte
  //   les faces et projette les ombres. Place-la en hauteur, sur le côté, et
  //   n'oublie pas de l'autoriser à projeter des ombres.

  // ---------------------------------------------------------------------------

  renderer.render(scene, camera)

  return {
    scene,
    camera,
    renderer,
    object: cube,
    dispose() {
      geometry.dispose()
      material.dispose()
      floorGeometry?.dispose()
      floorMaterial?.dispose()
      renderer.dispose()
    },
  }
}
