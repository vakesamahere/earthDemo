import * as THREE from './build/three.module.js';


const dragSensitive = 1
const n = 0.1
const rotationSpeed = 0.1/3600

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

//create an earth
const earthGeometry = new THREE.SphereGeometry(5,50,50)
const earth = new THREE.Mesh(
        earthGeometry,
        new THREE.MeshBasicMaterial({
            map: new THREE.TextureLoader().load('./globe/earth@0.1.jpg')
        })
    )
earth.rotation.set(0.15,Math.PI*0.83,0)
scene.add(earth)

//赤道

const geometry = new THREE.TorusGeometry(6.3,0.03,1000,1000,20)
const material = new THREE.MeshBasicMaterial({
color: 0xBB7777,
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
});

document.addEventListener('keyup', (event) => {
  if (event.key === 'Shift') {
    shifting = false;
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
    let fov = camera.fov + delta * 0.1;
    fov=Math.min(125,fov);
    fov=Math.max(12.5,fov);
    camera.fov = fov;
    console.log(fov)
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

//animate
let time = performance.now();
function animate(){
    requestAnimationFrame(animate)
    const angle = -(performance.now()-time) * rotationSpeed;
    if(!isDragging)earth.rotation.y -= angle;
    time=performance.now();
    //console.log(earth.rotation.x,earth.rotation.y)
    renderer.render(scene,camera)
}
animate()