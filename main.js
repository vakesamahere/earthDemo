import * as THREE from './build/three.module.js'

const dragSensitive = 1
const n = 0.1
const rotationSpeed = 0.1/1200

const scene = new THREE.Scene()
const camera = new THREE.PerspectiveCamera(
    75,
    innerWidth/innerHeight,
    0.1,
    1000
)
const renderer = new THREE.WebGLRenderer(
    {
        antialias:true
    }
)

renderer.setSize(innerWidth,innerHeight)
renderer.setPixelRatio(window.devicePixelRatio)
document.body.appendChild(renderer.domElement)

//create a sphere
const sphere = new THREE.Mesh(
        new THREE.SphereGeometry(5,50,50),
        new THREE.MeshBasicMaterial({
            map: new THREE.TextureLoader().load('./globe/earth@0.1.jpg')
        })
    )

scene.add(sphere)

camera.position.z = 10

let isDragging = false
let mousePos = {
    x: 0,
    y: 0
}

function onDocumentMouseDown(event) {
    mousePos = {
        x: event.clientX,
        y: event.clientY
    }

    if (event.button === 0) {
        isDragging = true
    }
}

function onDocumentMouseMove(event) {
    if (isDragging) {
    //    /*
        const deltaX = event.clientX - innerWidth/2 //mousePos.x
        const deltaY = event.clientY - innerHeight/2 //mousePos.y
        sphere.rotation.y += deltaX * 0.001 * dragSensitive
        sphere.rotation.x += deltaY * 0.001 * dragSensitive
        if(deltaY!=0){
            const k = Math.tan(deltaX,deltaY);
            let dx = sphere.rotation.x * Math.cos(n) * Math.cos(n) + sphere.rotation.z * k * Math.sin(n) * Math.cos(n) - sphere.rotation.x;
            let dz = sphere.rotation.x * k * Math.sin(n) * Math.cos(n) + sphere.rotation.z * Math.cos(n) * Math.cos(n) - sphere.rotation.z;
            const mod = Math.sqrt(Math.pow(dx,2)+Math.pow(dz,2))
            dx/=mod;
            dz/=mod;
            console.log(k,dx,0,dz)

            sphere.rotation.x += dx * 0.001 * dragSensitive
            sphere.rotation.z += dz * 0.001 * dragSensitive
        }else if(deltaX!=0){
            const k = deltaY/deltaX;
            let dy = sphere.rotation.y * Math.cos(n) * Math.cos(n) + sphere.rotation.z * k * Math.sin(n) * Math.cos(n) - sphere.rotation.y;
            let dz = -sphere.rotation.y * k * Math.sin(n) * Math.cos(n) + sphere.rotation.z * Math.cos(n) * Math.cos(n) - sphere.rotation.z;
            const mod = Math.sqrt(Math.pow(dy,2)+Math.pow(dz,2))
            dy/=mod;
            dz/=mod;
            console.log(k,0,dy,dz)
            sphere.rotation.y += dy * 0.001 * dragSensitive
            sphere.rotation.z += dz * 0.001 * dragSensitive
        }
    }
}

function onDocumentMouseUp(event) {
    isDragging = false
    
    mousePos = {
        x: event.clientX,
        y: event.clientY
    }
}


document.addEventListener('mousedown', onDocumentMouseDown)
document.addEventListener('mousemove', onDocumentMouseMove)
document.addEventListener('mouseup', onDocumentMouseUp)

document.addEventListener('wheel', (event) => {
    const delta = event.deltaY;
    const fov = camera.fov - delta * 0.1;
    camera.fov = fov;
    camera.updateProjectionMatrix();
  });

let time = performance.now();
function animate(){
    requestAnimationFrame(animate)
    const angle = (performance.now()-time) * rotationSpeed;
    sphere.rotation.y += angle;
    time=performance.now();
    renderer.render(scene,camera)
}
animate()
