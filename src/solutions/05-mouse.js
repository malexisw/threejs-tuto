import * as THREE from 'three'

const LIMIT = 4

export function createScene(container) {
  const width = container.clientWidth
  const height = container.clientHeight

  const scene = new THREE.Scene()
  scene.background = new THREE.Color('#0f1117')

  const camera = new THREE.PerspectiveCamera(60, width / height, 0.1, 100)
  camera.position.set(0, 6, 8)
  camera.lookAt(0, 0, 0)

  const renderer = new THREE.WebGLRenderer({ antialias: true })
  renderer.setSize(width, height)
  renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2))
  renderer.shadowMap.enabled = true

  const canvas = renderer.domElement
  canvas.style.touchAction = 'none' // pour que ça marche aussi au doigt
  container.appendChild(canvas)

  const geometry = new THREE.BoxGeometry(1.5, 1.5, 1.5)
  const material = new THREE.MeshStandardMaterial({
    color: '#c084fc',
    roughness: 0.35,
    metalness: 0.1,
    emissive: '#c084fc',
    emissiveIntensity: 0,
  })
  const cube = new THREE.Mesh(geometry, material)
  cube.position.set(0, 0.75, 0)
  cube.castShadow = true
  scene.add(cube)

  const floorGeometry = new THREE.PlaneGeometry(12, 12)
  const floorMaterial = new THREE.MeshStandardMaterial({ color: '#1b1d25' })
  const floor = new THREE.Mesh(floorGeometry, floorMaterial)
  floor.rotation.x = -Math.PI / 2
  floor.receiveShadow = true
  scene.add(floor)

  scene.add(new THREE.GridHelper(12, 12, '#3a3d4a', '#22242c'))
  scene.add(new THREE.AmbientLight('#ffffff', 0.6))

  const sun = new THREE.DirectionalLight('#ffffff', 2.5)
  sun.position.set(3, 6, 4)
  sun.castShadow = true
  scene.add(sun)

  // Les outils du glisser-déposer, créés une seule fois pour ne rien allouer
  // dans les gestionnaires d'évènements.
  const raycaster = new THREE.Raycaster()
  const pointer = new THREE.Vector2()
  const dragPlane = new THREE.Plane()
  const planeNormal = new THREE.Vector3(0, 1, 0)
  const hit = new THREE.Vector3()
  const offset = new THREE.Vector3()

  let dragging = false
  let hovering = false

  // Coordonnées souris → repère normalisé de -1 à +1, attendu par le raycaster.
  function updatePointer(event) {
    const rect = canvas.getBoundingClientRect()
    pointer.x = ((event.clientX - rect.left) / rect.width) * 2 - 1
    pointer.y = -((event.clientY - rect.top) / rect.height) * 2 + 1
    raycaster.setFromCamera(pointer, camera)
  }

  function onPointerDown(event) {
    updatePointer(event)

    // Le rayon touche-t-il le cube ?
    if (raycaster.intersectObject(cube).length === 0) return

    // Plan horizontal passant par le cube : la surface de glissement.
    dragPlane.setFromNormalAndCoplanarPoint(planeNormal, cube.position)

    // Écart entre le point cliqué et le centre du cube, sinon le cube
    // saute sous le curseur au premier clic.
    if (raycaster.ray.intersectPlane(dragPlane, hit)) {
      offset.copy(hit).sub(cube.position)
    } else {
      offset.set(0, 0, 0)
    }

    dragging = true
    canvas.setPointerCapture(event.pointerId) // suit la souris hors du canvas
  }

  function onPointerMove(event) {
    updatePointer(event)

    if (!dragging) {
      // Pas de glissement en cours : on teste juste le survol, pour le curseur.
      hovering = raycaster.intersectObject(cube).length > 0
      canvas.style.cursor = hovering ? 'grab' : 'default'
      return
    }

    // Où le rayon croise-t-il le plan de glissement ?
    if (!raycaster.ray.intersectPlane(dragPlane, hit)) return

    hit.sub(offset)
    cube.position.x = THREE.MathUtils.clamp(hit.x, -LIMIT, LIMIT)
    cube.position.z = THREE.MathUtils.clamp(hit.z, -LIMIT, LIMIT)
  }

  function onPointerUp(event) {
    if (!dragging) return
    dragging = false
    canvas.style.cursor = 'grab'
    if (canvas.hasPointerCapture(event.pointerId)) {
      canvas.releasePointerCapture(event.pointerId)
    }
  }

  canvas.addEventListener('pointerdown', onPointerDown)
  canvas.addEventListener('pointermove', onPointerMove)
  canvas.addEventListener('pointerup', onPointerUp)
  canvas.addEventListener('pointercancel', onPointerUp)

  const clock = new THREE.Clock()
  let frameId = null

  function animate() {
    frameId = requestAnimationFrame(animate)

    const delta = clock.getDelta()
    if (!dragging) cube.rotation.y += delta * 0.4

    // Retour visuel du survol, directement sur le matériau.
    material.emissiveIntensity = hovering || dragging ? 0.35 : 0

    renderer.render(scene, camera)
  }

  animate()

  return {
    scene,
    camera,
    renderer,
    object: cube,
    dispose() {
      cancelAnimationFrame(frameId)
      canvas.removeEventListener('pointerdown', onPointerDown)
      canvas.removeEventListener('pointermove', onPointerMove)
      canvas.removeEventListener('pointerup', onPointerUp)
      canvas.removeEventListener('pointercancel', onPointerUp)
      geometry.dispose()
      material.dispose()
      floorGeometry.dispose()
      floorMaterial.dispose()
      renderer.dispose()
    },
  }
}
