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

  // La forme : un cube de 1.5 unité de côté.
  const geometry = new THREE.BoxGeometry(1.5, 1.5, 1.5)

  // L'apparence : une couleur plate, qui ignore les lumières.
  const material = new THREE.MeshBasicMaterial({ color: '#c084fc' })

  // Le mesh : la forme + l'apparence, prêt à être placé dans la scène.
  const cube = new THREE.Mesh(geometry, material)
  cube.position.set(0, 0.75, 0)
  cube.rotation.y = Math.PI / 5
  scene.add(cube)

  renderer.render(scene, camera)

  return {
    scene,
    camera,
    renderer,
    object: cube,
    dispose() {
      geometry.dispose()
      material.dispose()
      renderer.dispose()
    },
  }
}
