import * as THREE from './build/three.module.js';

const earthSurfaceTexturePath = "./globe/earth0.1.jpg";
const dragSensitive = 1
const n = 0.1
const rotationSpeed = 0.1/2400
const earthR = 5;

let high=true;
let fovSet = 80

let scene = new THREE.Scene()
scene.background = new THREE.Color(0x434343);
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

//地球
const earthGeometry = new THREE.SphereGeometry(earthR,100,100)
const earth = new THREE.Mesh(
        earthGeometry,
        new THREE.MeshBasicMaterial({
            map: new THREE.TextureLoader().load(earthSurfaceTexturePath)
        })
    )
earth.rotation.set(0.15,Math.PI*0.83,0)
scene.add(earth)

//摄像机位置 
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
		const deltaX = event.clientX - mousePos.x;
        const deltaY = event.clientY - mousePos.y;
		const rotationY = (deltaX / window.innerWidth) * Math.PI * 2;
        const rotationX = (deltaY / window.innerHeight) * Math.PI * 2;
		rotY += rotationY;
		mousePos.x = event.clientX;
        mousePos.y = event.clientY;
        if(rotX>Math.PI/2){
            rotX=Math.PI/2;
        }
        if(rotX<-Math.PI/2){
            rotX=-Math.PI/2;
        }
        earth.rotation.x=rotX;
        earth.rotation.y=rotY;
        plane.rotation.x=earth.rotation.x-Math.PI/2;
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
window.addEventListener('resize', () => {
    // 重新填充窗口
    resizeRenderer();
  });
  
  // 重新填充窗口
  function resizeRenderer() {
    // 获取当前显示窗口的大小
    const width = window.innerWidth;
    const height = window.innerHeight;
  
    // 设置渲染器的大小
    renderer.setSize(width, height);
  
    // 更新相机的宽高比
    camera.aspect = width / height;
  
    // 更新相机的投影矩阵
    camera.updateProjectionMatrix();
  }

function updateCamaraScale(){
    if(camera.fov==fovSet)return;
    let rate = Math.abs(fovSet-camera.fov)/30;
    let delta = 0.01 + 0.49*rate;
    let fov = camera.fov+delta*(camera.fov>fovSet?-1:1);
    if(fov>=fovSet!=camera.fov>=fovSet){
        camera.fov = fovSet;
    }else{
        camera.fov = fov;
    }
    camera.updateProjectionMatrix();
    if(camera.fov<=fovDisplayPlane){
        scene.remove(plane);
        if(high){
            high=false;
            updateL();
            displayRegion();
        }
    }else{
        scene.add(plane);
        if(!high){
            high=true;
        }
    }
    try { 
        //window.cefSharp.postMessage("scale:"+camera.fov)
    } catch (error) {
        
    }
}
var rotX=earth.rotation.x,rotY=earth.rotation.y
function updateRot(){
    const angle = -(performance.now()-time) * rotationSpeed;
    rotY -= angle;
    time=performance.now();
    if(earth.rotation.x!=rotX){
        let rate = Math.abs(rotX-earth.rotation.x)/30;
        let delta = 0.01 + 0.01*rate;
        let rot = earth.rotation.x+delta*(earth.rotation.x>rotX?-1:1);
        if(rot>=rotX!=earth.rotation.x>=rotX){
            earth.rotation.x = rotX;
        }else{
            earth.rotation.x = rot;
        }
        plane.rotation.x=earth.rotation.x-Math.PI/2;
    }
    if(earth.rotation.y!=rotY){
        let rate = Math.abs(rotY-earth.rotation.y)/30;
        let delta = 0.01 + 0.01*rate;
        let rot = earth.rotation.y+delta*(earth.rotation.y>rotY?-1:1);
        if(rot>=rotY!=earth.rotation.y>=rotY){
            earth.rotation.y = rotY;
        }else{
            earth.rotation.y = rot;
        }
    }
}

//animate
let time = performance.now();
function animate(){
    requestAnimationFrame(animate)
    updateRot();
    updateCamaraScale();
    renderer.render(scene,camera)
}
animate()