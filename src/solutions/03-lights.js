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

  // Les ombres coûtent cher : rien n'est activé par défaut.
  renderer.shadowMap.enabled = true
  container.appendChild(renderer.domElement)

  // MeshStandardMaterial réagit à la lumière : c'est ce qui donne le volume.
  const geometry = new THREE.BoxGeometry(1.5, 1.5, 1.5)
  const material = new THREE.MeshStandardMaterial({
    color: '#c084fc',
    roughness: 0.35,
    metalness: 0.1,
  })
  const cube = new THREE.Mesh(geometry, material)
  cube.position.y = 0.75
  cube.castShadow = true
  scene.add(cube)

  // Un sol, tourné à plat, pour recevoir l'ombre.
  const floorGeometry = new THREE.PlaneGeometry(12, 12)
  const floorMaterial = new THREE.MeshStandardMaterial({ color: '#1b1d25' })
  const floor = new THREE.Mesh(floorGeometry, floorMaterial)
  floor.rotation.x = -Math.PI / 2
  floor.receiveShadow = true
  scene.add(floor)

  // Lumière douce partout, pour qu'aucune face ne soit totalement noire.
  scene.add(new THREE.AmbientLight('#ffffff', 0.6))

  // Lumière directionnelle : comme le soleil, elle sculpte les faces.
  const sun = new THREE.DirectionalLight('#ffffff', 2.5)
  sun.position.set(3, 5, 2)
  sun.castShadow = true
  scene.add(sun)

  renderer.render(scene, camera)

  return {
    scene,
    camera,
    renderer,
    object: cube,
    dispose() {
      geometry.dispose()
      material.dispose()
      floorGeometry.dispose()
      floorMaterial.dispose()
      renderer.dispose()
    },
  }
}
