import './style.css'
import * as THREE from 'three'
import { OrbitControls } from 'three/examples/jsm/controls/OrbitControls.js'
import * as dat from 'lil-gui'

/**
 * Base
 */
// Debug
const gui = new dat.GUI()

// Canvas
const canvas = document.querySelector('canvas.webgl')



// Scene
const scene = new THREE.Scene()

const fog=new THREE.Fog('#262837',1,6)
scene.fog=fog

/**
 * Textures
 */
const textureLoader = new THREE.TextureLoader()
const texturecolor=textureLoader.load('/textures/door/color.jpg')
const dooralpha=textureLoader.load('/textures/door/alpha.jpg')
const ambientocculsion=textureLoader.load('/textures/door/ambientOcclusion.jpg')
const heighttexture=textureLoader.load('/textures/door/height.jpg')

const bricksColorTexture = textureLoader.load('/textures/bricks/color.jpg')
const bricksAmbientOcclusionTexture = textureLoader.load('/textures/bricks/ambientOcclusion.jpg')
const bricksNormalTexture = textureLoader.load('/textures/bricks/normal.jpg')
const bricksRoughnessTexture = textureLoader.load('/textures/bricks/roughness.jpg')

const grassColorTexture = textureLoader.load('/textures/grass/color.jpg')
const grassAmbientOcclusionTexture = textureLoader.load('/textures/grass/ambientOcclusion.jpg')
const grassNormalTexture = textureLoader.load('/textures/grass/normal.jpg')
const grassRoughnessTexture = textureLoader.load('/textures/grass/roughness.jpg')
/**
 * House
 */
// Temporary sphere
// creating groups
const house=new THREE.Group()
scene.add(house)

//creating walll
const wall=new THREE.Mesh(
    new THREE.BoxBufferGeometry(4,2.5,4),
    new THREE.MeshStandardMaterial({ 
        map:bricksColorTexture,
        aoMap:bricksAmbientOcclusionTexture,
         normalMap:bricksNormalTexture,
         roughness:bricksRoughnessTexture
    })
)
wall.geometry.setAttribute(
    'uv2',
    new THREE.Float32BufferAttribute(wall.geometry.attributes.uv.array,2)
)
wall.position.y=1.25
house.add(wall)
// creating roof
const roof=new THREE.Mesh(
    new THREE.ConeBufferGeometry(3.5,1,4),
    new THREE.MeshStandardMaterial({ 
        map:bricksAmbientOcclusionTexture
     })
)
roof.position.y=2.5+0.5
roof.rotation.y=Math.PI*0.25
house.add(roof)
//gate
const gate=new THREE.Mesh(
    new THREE.PlaneBufferGeometry(2,2,100,100),
    new THREE.MeshStandardMaterial({
        map:texturecolor,
        transparent:true,
        alphaMap:dooralpha,
        aoMap:ambientocculsion,
        displacementScale:heighttexture,
        displacementScale:0.1
     })
)
gate.geometry.setAttribute(
    'uv2',
    new THREE.Float32BufferAttribute(gate.geometry.attributes.uv.array,2)
)
gate.position.y=1
gate.position.z=2+0.01
scene.add(gate)
//busshes
const bushgeometry=new THREE.SphereBufferGeometry(1,16,16)
const bushmaterial=new THREE.MeshStandardMaterial({color:'#89c854'})

const bush1=new THREE.Mesh(bushgeometry,bushmaterial)
bush1.scale.set(0.5,0.5,0.5)
bush1.position.set(0.8,0.2,2.5)
const bush2=new THREE.Mesh(bushgeometry,bushmaterial)
bush2.scale.set(0.3,0.3,0.3)
bush2.position.set(1.5,0.1,2.5)
scene.add(bush1,bush2)

const bush3=new THREE.Mesh(bushgeometry,bushmaterial)
bush3.scale.set(0.5,0.5,0.5)
bush3.position.set(-1,0.2,2.5)
const bush4=new THREE.Mesh(bushgeometry,bushmaterial)
bush4.scale.set(0.2,0.2,0.2)
bush4.position.set(-1.5,0.2,2.8)
scene.add(bush1,bush2,bush3,bush4)
// Floor
const floor = new THREE.Mesh(
    new THREE.PlaneGeometry(20, 20),
    new THREE.MeshStandardMaterial({ 
        map:grassColorTexture,
        aoMap:grassAmbientOcclusionTexture,
        normalMap:grassNormalTexture,
        roughnessMap:grassRoughnessTexture
     })
)
floor.geometry.setAttribute(
    'uv2',
    new THREE.Float32BufferAttribute(floor.geometry.attributes.uv.array,2)
)
//graves
floor.rotation.x = - Math.PI * 0.5
floor.position.y = 0
scene.add(floor)
const graves=new THREE.Group()
scene.add(graves)

const gravegeometry=new THREE.BoxBufferGeometry(0.6,0.8,0.2)
const gravematerial=new THREE.MeshStandardMaterial({
    map:bricksNormalTexture,
    
})
grassColorTexture.repeat.set(8, 8)
grassAmbientOcclusionTexture.repeat.set(8, 8)
grassNormalTexture.repeat.set(8, 8)
grassRoughnessTexture.repeat.set(8, 8)

grassColorTexture.wrapS = THREE.RepeatWrapping
grassAmbientOcclusionTexture.wrapS = THREE.RepeatWrapping
grassNormalTexture.wrapS = THREE.RepeatWrapping
grassRoughnessTexture.wrapS = THREE.RepeatWrapping

grassColorTexture.wrapT = THREE.RepeatWrapping
grassAmbientOcclusionTexture.wrapT = THREE.RepeatWrapping
grassNormalTexture.wrapT = THREE.RepeatWrapping
grassRoughnessTexture.wrapT = THREE.RepeatWrapping
for(let i=0;i<50;i++){
    const angle=Math.random()*Math.PI*2
    const radius=3+Math.random()*6
    const x=Math.sin(angle)*radius
    const z=Math.cos(angle)*radius
    const grave=new THREE.Mesh(gravegeometry,gravematerial)
    grave.position.set(x,0.3,z)
    grave.rotation.y=(Math.random()-0.5)*0.4
    grave.rotation.z=(Math.random()-0.5)*0.4
    graves.add(grave)
}
/**
 * Lights
 */
// Ambient light
const ambientLight = new THREE.AmbientLight('#b9d5ff', 0.12)
gui.add(ambientLight, 'intensity').min(0).max(1).step(0.001)
scene.add(ambientLight)
// Directional light
const moonLight = new THREE.DirectionalLight('#ffffff', 0.5)
moonLight.position.set(4, 5, - 2)
gui.add(moonLight, 'intensity').min(0).max(1).step(0.001)
gui.add(moonLight.position, 'x').min(- 5).max(5).step(0.001)
gui.add(moonLight.position, 'y').min(- 5).max(5).step(0.001)
gui.add(moonLight.position, 'z').min(- 5).max(5).step(0.001)
scene.add(moonLight)

//door light
const doorLight=new THREE.PointLight("#ff7d46",1,7)
doorLight.position.set(0,2.2,2.7)
house.add(doorLight)
/**
 * Sizes
 */
//ghos
const ghost1=new THREE.PointLight('#ff00ff',2,3)
const ghost2=new THREE.PointLight('#00ffff',2,3)
const ghost3=new THREE.PointLight('#ffff00',2,3)
scene.add(ghost1,ghost2,ghost3)
const sizes = {
    width: window.innerWidth,
    height: window.innerHeight
}

window.addEventListener('resize', () =>
{
    // Update sizes
    sizes.width = window.innerWidth
    sizes.height = window.innerHeight

    // Update camera
    camera.aspect = sizes.width / sizes.height
    camera.updateProjectionMatrix()

    // Update renderer
    renderer.setSize(sizes.width, sizes.height)
    renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2))
    renderer.setClearColor('#262837')
})

/**
 * Camera
 */
// Base camera
const camera = new THREE.PerspectiveCamera(75, sizes.width / sizes.height, 0.1, 100)
camera.position.x = 4
camera.position.y = 2
camera.position.z = 5
scene.add(camera)

// Controls
const controls = new OrbitControls(camera, canvas)
controls.enableDamping = true

/**
 * Renderer
 */
const renderer = new THREE.WebGLRenderer({
    canvas: canvas
})
renderer.setSize(sizes.width, sizes.height)
renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2))

/**
 * Animate
 */
const clock = new THREE.Clock()

const tick = () =>
{
    const elapsedTime = clock.getElapsedTime()
const ghostangle1=elapsedTime*0.5
ghost1.position.x=Math.cos(ghostangle1)*4
ghost1.position.z=Math.sin(ghostangle1)*4
ghost1.position.y=Math.sin(elapsedTime*3)
const ghostangle2=-elapsedTime*0.32
ghost2.position.x=Math.cos(ghostangle2)*4
ghost2.position.z=Math.sin(ghostangle2)*4
ghost2.position.y=Math.sin(elapsedTime*3)+Math.sin(elapsedTime*2.5)

const ghostangle3=-elapsedTime*0.18
ghost3.position.x=Math.cos(ghostangle3)*(7+Math.sin(elapsedTime*0.32))
ghost3.position.z=Math.sin(ghostangle3)*(7+Math.sin(elapsedTime*0.5))
ghost3.position.y=Math.sin(elapsedTime*5)+Math.sin(elapsedTime*2)
    // Update controls
    controls.update()

    // Render
    renderer.render(scene, camera)

    // Call tick again on the next frame
    window.requestAnimationFrame(tick)
}

tick()