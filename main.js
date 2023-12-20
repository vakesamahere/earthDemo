import * as THREE from './build/three.module.js'

const dragSensitive = 10
const n = 0.1

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
        const deltaX = event.clientX - mousePos.x
        const deltaY = event.clientY - mousePos.y
        sphere.rotation.y += deltaX * 0.001 * dragSensitive
        sphere.rotation.x += deltaY * 0.001 * dragSensitive
        if(deltaY!=0){
            const k = -deltaX/deltaY;
            const newXAngle = sphere.rotation.x * Math.cos(n) * Math.cos(n) + sphere.rotation.z * k * Math.sin(n) * Math.cos(n);
            const newYAngle = sphere.rotation.y;
            const newZAngle = sphere.rotation.x * k * Math.sin(n) * Math.cos(n) + sphere.rotation.z * Math.cos(n) * Math.cos(n);
            console.log(newXAngle-sphere.rotation.x,newYAngle-sphere.rotation.y,newZAngle-sphere.rotation.z)
            const mod = Math.sqrt(newXAngle * newXAngle + newYAngle*newYAngle+newZAngle*newZAngle);
            const dx=newXAngle/mod;
            const dy=newYAngle/mod;
            const dz=newZAngle/mod;
            sphere.rotation.x += dx * 0.001 * dragSensitive
            sphere.rotation.y += dy * 0.001 * dragSensitive
            sphere.rotation.z += dz * 0.001 * dragSensitive
        }else if(deltaX!=0){
            const k = deltaY/deltaX;
            const newXAngle = sphere.rotation.x;
            const newYAngle = sphere.rotation.y * Math.cos(n) * Math.cos(n) + sphere.rotation.z * k * Math.sin(n) * Math.cos(n);
            const newZAngle = -sphere.rotation.y * k * Math.sin(n) * Math.cos(n) + sphere.rotation.z * Math.cos(n) * Math.cos(n);
            console.log(newXAngle-sphere.rotation.x,newYAngle-sphere.rotation.y,newZAngle-sphere.rotation.z)
            const mod = Math.sqrt(newXAngle * newXAngle + newYAngle*newYAngle+newZAngle*newZAngle);
            const dx=newXAngle/mod;
            const dy=newYAngle/mod;
            const dz=newZAngle/mod;
            sphere.rotation.x += dx * 0.001 * dragSensitive
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

function onMouseWheel(event) {
    const delta = event.deltaY
    camera.position.z += delta * 0.1
}

document.addEventListener('mousedown', onDocumentMouseDown)
document.addEventListener('mousemove', onDocumentMouseMove)
document.addEventListener('mouseup', onDocumentMouseUp)
document.addEventListener('wheel', onMouseWheel)

function animate(){
    requestAnimationFrame(animate)
    renderer.render(scene,camera)
}
animate()
