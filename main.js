import * as THREE from './build/three.module.js';

const earthSurfaceTexturePath = "./globe/earth0.27@32.jpg";
const earthMapTexturePath = "./globe/map.png";
const dragSensitive = 1
const n = 0.1
const fovDisplayPlane = 25
const rotationSpeed = 0.1/3600
let fovSet = 100

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

//地球
const earthGeometry = new THREE.SphereGeometry(5,100,100)
const earth = new THREE.Mesh(
        earthGeometry,
        new THREE.MeshBasicMaterial({
            map: new THREE.TextureLoader().load(earthSurfaceTexturePath)
        })
    )
earth.rotation.set(0.15,Math.PI*0.83,0)
scene.add(earth)
const mapGeometry = new THREE.SphereGeometry(5.01,100,100)
const earthMap = new THREE.Mesh(
        mapGeometry,
        new THREE.MeshBasicMaterial({
            map: new THREE.TextureLoader().load(earthMapTexturePath)
        })
    )
earth.rotation.set(0.15,Math.PI*0.83,0)
//scene.add(earthMap)


//赤道

const geometry = new THREE.TorusGeometry(6.3,0.03,1000,1000,20)
const material = new THREE.MeshBasicMaterial({
        color: 0xBB7777
        //side: THREE.DoubleSide
    });
const plane = new THREE.Mesh(geometry, material);
plane.position.set(0, 0, 0);
plane.rotation.x = earth.rotation.x + Math.PI / 2;
scene.add(plane);


camera.position.z = 10

let isDragging = false
let mousePos = {
    x: 0,
    y: 0
}
let shifting = false;

document.addEventListener('keydown', (event) => {
  if (event.key === 'Shift') {
    shifting = true;
  }
  if (event.key === 'Control') {
    scene.add(earthMap);
  }
});

document.addEventListener('keyup', (event) => {
  if (event.key === 'Shift') {
    shifting = false;
  }
  if (event.key === 'Control') {
    scene.remove(earthMap);
  }
});

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
		
        if(!shifting)earth.rotation.x += rotationX;
		earth.rotation.y += rotationY;
		
		mousePos.x = event.clientX;
        mousePos.y = event.clientY;

        if(earth.rotation.x>Math.PI/2){
            earth.rotation.x=Math.PI/2;
        }
        if(earth.rotation.x<-Math.PI/2){
            earth.rotation.x=-Math.PI/2;
        }
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

document.addEventListener('wheel', (event) => {
    const delta = event.deltaY;
    fovSet = fovSet + delta * 0.1;
    fovSet = Math.min(125,fovSet);
    fovSet = Math.max(15,fovSet);
  });



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
    }else{
        scene.add(plane);
    }
    try { 
        window.cefSharp.postMessage("scale:"+camera.fov)
    } catch (error) {
        
    }
}

//animate
let time = performance.now();
function animate(){
    requestAnimationFrame(animate)
    const angle = -(performance.now()-time) * rotationSpeed;
    if(!isDragging)earth.rotation.y -= angle;
    earthMap.rotation.x = earth.rotation.x;
    earthMap.rotation.y = earth.rotation.y;
    time=performance.now();
    //console.log(earth.rotation.x,earth.rotation.y)
    updateCamaraScale();
    renderer.render(scene,camera)
}
animate()