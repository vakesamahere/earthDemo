import * as THREE from './build/three.module.js';

const earthSurfaceTexturePath = "./globe/earth0.27@32.jpg";
const imageMap = new Image();
imageMap.src = './globe/boundary.png';
const dragSensitive = 1
const n = 0.1
const fovDisplayPlane = 25
const rotationSpeed = 0.1/2400
const earthR = 5;

let high=true;
let fovSet = 100
const defaultCountry = "?"

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

//摄像机位置 
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


// 创建一个Raycaster对象
var raycaster = new THREE.Raycaster();
var intersectionPoint;
var intersects;
var mouse = new THREE.Vector2();
var latitude,longitude

//右键检测
document.addEventListener('mousedown', (event) => {
    if(event.button!=2)return;
    //计算经纬度
    mouse.x = ( event.clientX / window.innerWidth ) * 2 - 1;
    mouse.y = - ( event.clientY / window.innerHeight ) * 2 + 1;
    raycaster.setFromCamera( mouse, camera );
    intersects = raycaster.intersectObjects( scene.children );
    if ( intersects.length > 0 ) {
        intersectionPoint = intersects[0].point;
        // 计算纬度
        latitude = (Math.asin(intersectionPoint.y / earthR)+earth.rotation.x)/Math.PI*180;

        // 计算经度
        longitude = (Math.atan2(intersectionPoint.x, intersectionPoint.z)-earth.rotation.y)/Math.PI*180-90;
        while(longitude<-180)longitude+=360
        while(longitude>180)longitude-=360
        while(latitude>90)latitude-=180
        while(latitude>90)latitude-=180

        rotX=Math.asin(intersectionPoint.y / earthR)+earth.rotation.x
        rotY=earth.rotation.y-Math.atan2(intersectionPoint.x, intersectionPoint.z)

        if(rotX>Math.PI/2){
            rotX=Math.PI/2;
        }
        if(rotX<-Math.PI/2){
            rotX=-Math.PI/2;
        }

        console.log(intersectionPoint);
        console.log(`经度：${longitude}, 纬度：${latitude}`);
    }
    fovSet=fovDisplayPlane-10
    if(!high)displayRegion();
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
		
        if(!shifting)rotX += rotationX;
		rotY += rotationY;
		
		mousePos.x = event.clientX;
        mousePos.y = event.clientY;

        if(rotX>Math.PI/2){
            rotX=Math.PI/2;
        }
        if(rotX<-Math.PI/2){
            rotX=-Math.PI/2;
        }
        //强制更新
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
function updateL(){
    latitude = (earth.rotation.x)/Math.PI*180;
    longitude = (-earth.rotation.y)/Math.PI*180-90;
    while(longitude<-180)longitude+=360
    while(longitude>180)longitude-=360
    while(latitude>90)latitude-=180
    while(latitude>90)latitude-=180

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
    if(camera.fov>fovDisplayPlane&&!isDragging)rotY -= angle;
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
var showing = false;
function showText(text) {
    if(showing)return;
    showing = true;
    const div = document.createElement('div');
  
    div.style.position = 'fixed';
    div.style.top = '50%';
    div.style.left = '50%';
    div.style.transform = 'translate(-50%, -50%)';
    div.style.padding = '10px';
    div.style.background = 'rgba(0, 0, 0, 0.5)';
    div.style.color = '#fff';
    div.style.fontSize = '24px';
    div.style.opacity = 0;
  
    div.textContent = text;
  
    document.body.appendChild(div);
    const fadeInAnimation = div.animate([
      { opacity: 0 },
      { opacity: 1 }
    ], {
      duration: 750,
      easing: 'ease-in-out'
    });
 //   /*
    fadeInAnimation.onfinish = () => {
        const fadeOutAnimation = div.animate([
            { opacity: 1 },
            { opacity: 0 }
        ], {
            duration: 2500,
            easing: 'ease-in-out'
        });
        fadeOutAnimation.onfinish = () => {
            div.remove();
        };
    };
 //   */
    showing = false;
  }

var widthMap,heightMap,canvas,context
imageMap.onload = function() {
widthMap = imageMap.width;
heightMap = imageMap.height;
canvas = document.createElement('canvas');
canvas.width = widthMap;
canvas.height = heightMap;
context = canvas.getContext('2d');
context.drawImage(imageMap, 0, 0);
};

function displayRegion(){
    raycaster.setFromCamera( mouse, camera );
    //
    var x = (longitude+180)*widthMap/360
    var y = (90-latitude)*heightMap/180
    const pixelData = context.getImageData(x, y, 1, 1).data;
    const color = `#${pixelData[0].toString(16)}${pixelData[1].toString(16)}${pixelData[2].toString(16)}`;

    console.log(`Pixel color at (${x}, ${y}): ${color}`);
    //
    fetch('./globe/colorCountry.json')
    .then(response => {
        if (response.status === 200) {
        return response.json();
        }
    })
    .then(data => {
        var region;
        Object.keys(data).forEach(key => {
            //比对颜色
            if(key==color){
                region=data[key]
            }
        });
        if(region==null){
            region = defaultCountry;
        }
        console.log("<REGION>:"+region);
        showText(region)
    //mapDisplay c#
        try {
            window.cefSharp.postMessage(`@regionDisplay@${color};@country@${region};`)
        } catch (error) {
            //alert(error)
        }
    })
    .catch(error => {
        console.error('Error:', error);
    });



}

function distance2(x1,y1,x2,y2){
    let xx=parseFloat(x1)-parseFloat(x2),yy=parseFloat(y1)-parseFloat(y2)
    xx*=xx
    yy*=yy
    return xx+yy
}

//animate
let time = performance.now();
function animate(){
    requestAnimationFrame(animate)
    updateRot();
    //console.log(earth.rotation.x,earth.rotation.y)
    updateCamaraScale();
    renderer.render(scene,camera)
}
animate()