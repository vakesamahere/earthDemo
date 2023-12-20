import * as THREE from './build/three.module.js'
//import {OrbitControls} from './build/OrbitControls.js';//???


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
sphere.rotation.set(0,0,0)
scene.add(sphere)

//赤道
const geometry = new THREE.PlaneGeometry(12, 12, 32, 32);
const material = new THREE.MeshBasicMaterial({
color: 0x112233,
side: THREE.DoubleSide
});
const plane = new THREE.Mesh(geometry, material);
plane.position.set(0, 0, 0);
plane.rotation.x = Math.PI / 2;
scene.add(plane);


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
        //sphere.rotation.y += deltaX * 0.001 * dragSensitive
        //sphere.rotation.x += deltaY * 0.001 * dragSensitive
        if(deltaY!=0){
            const k = Math.tan(deltaX,deltaY);
            rotateXZ(plane,k)
            rotateXZ(sphere,k)
            
        }else if(deltaX!=0){
            const k = deltaY/deltaX;
            rotateYZ(plane,k)
            rotateYZ(sphere,k)
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
    const fov = camera.fov + delta * 0.1;
    camera.fov = fov;
    camera.updateProjectionMatrix();
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

  function rotateXZ(self,k){
    return;//先别
    let dx = self.rotation.x * Math.cos(n) * Math.cos(n) + self.rotation.z * k * Math.sin(n) * Math.cos(n) - self.rotation.x;
    let dz = self.rotation.x * k * Math.sin(n) * Math.cos(n) + self.rotation.z * Math.cos(n) * Math.cos(n) - self.rotation.z;
    const mod = Math.sqrt(Math.pow(dx,2)+Math.pow(dz,2))
    dx/=mod;
    dz/=mod;
    console.log(k,dx,0,dz)
    self.rotation.x += dx * 0.001 * dragSensitive
    self.rotation.z += dz * 0.001 * dragSensitive
  }
  function rotateYZ(self,k){
    return;//先别
    let dy = self.rotation.y * Math.cos(n) * Math.cos(n) + self.rotation.z * k * Math.sin(n) * Math.cos(n) - self.rotation.y;
    let dz = -self.rotation.y * k * Math.sin(n) * Math.cos(n) + self.rotation.z * Math.cos(n) * Math.cos(n) - self.rotation.z;
    const mod = Math.sqrt(Math.pow(dy,2)+Math.pow(dz,2))
    dy/=mod;
    dz/=mod;
    console.log(k,0,dy,dz)
    self.rotation.y += dy * 0.001 * dragSensitive
    self.rotation.z += dz * 0.001 * dragSensitive
  }

//animate
//const controls = new THREE.OrbitControls(camera, renderer.domElement);
let time = performance.now();
function animate(){
    requestAnimationFrame(animate)
    //controls.update();
    const angle = -(performance.now()-time) * rotationSpeed;
    sphere.rotation.y -= angle;
    time=performance.now();
    renderer.render(scene,camera)
}
animate()