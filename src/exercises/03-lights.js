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

  // TODO 1 — Active les ombres sur le renderer (désactivées par défaut).
  //   → renderer.shadowMap.enabled = true

  const geometry = new THREE.BoxGeometry(1.5, 1.5, 1.5)

  // TODO 2 — Remplace MeshBasicMaterial par un matériau qui réagit à la lumière.
  //   → new THREE.MeshStandardMaterial({
  //       color: '#c084fc',
  //       roughness: 0.35,  // 0 = miroir, 1 = mat
  //       metalness: 0.1,
  //     })
  const material = new THREE.MeshBasicMaterial({ color: '#c084fc' })

  const cube = new THREE.Mesh(geometry, material)
  cube.position.y = 0.75
  scene.add(cube)

  // TODO 3 — Autorise le cube à projeter son ombre.
  //   → cube.castShadow = true

  // TODO 4 — Crée un sol pour recevoir l'ombre : un plan de 12 x 12,
  //   couché à l'horizontale, en MeshStandardMaterial couleur '#1b1d25'.
  //   → const floorGeometry = new THREE.PlaneGeometry(12, 12)
  //   → const floorMaterial = new THREE.MeshStandardMaterial({ color: '#1b1d25' })
  //   → const floor = new THREE.Mesh(floorGeometry, floorMaterial)
  //   → floor.rotation.x = -Math.PI / 2   (un plan est vertical par défaut)
  //   → floor.receiveShadow = true
  //   → scene.add(floor)
  const floorGeometry = null
  const floorMaterial = null

  // TODO 5 — Une lumière d'ambiance, pour qu'aucune face ne soit toute noire.
  //   → scene.add(new THREE.AmbientLight('#ffffff', 0.6))

  // TODO 6 — Une lumière directionnelle : le "soleil". C'est elle qui crée
  //   le relief et les ombres. Pense à la placer et à activer son castShadow.
  //   → const sun = new THREE.DirectionalLight('#ffffff', 2.5)
  //   → sun.position.set(3, 5, 2)
  //   → sun.castShadow = true
  //   → scene.add(sun)

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
