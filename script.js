import * as THREE from 'three';
import { OrbitControls } from "jsm/controls/OrbitControls.js";

const width = window.innerWidth, height = window.innerHeight;
let timeout_Debounce;
let i = 10000;

// init

const myTimeout = setTimeout(animate, 4000);

const scene = new THREE.Scene();

const camera = new THREE.PerspectiveCamera( 55, width / height, 0.01, 10000);
camera.position.set(0, 0, 10000);

const renderer = new THREE.WebGLRenderer( { 
    antialias: true,
    alpha: true
} );
renderer.setSize( width, height );
renderer.setPixelRatio(window.devicePixelRatio);
document.body.appendChild( renderer.domElement );

const orbitCtrl = new OrbitControls(camera, renderer.domElement);
orbitCtrl.autoRotate = true;
orbitCtrl.maxDistance = 5000;
orbitCtrl.minDistance = 200;
orbitCtrl.enablePan = false;


// Textures
const loader = new THREE.TextureLoader();
const textureSphereBg = loader.load('https://i.ibb.co/4gHcRZD/bg3-je3ddz.jpg');
const texturenucleus = loader.load('./assets/sun.jpg');
const textureStar = loader.load("https://i.ibb.co/ZKsdYSz/p1-g3zb2a.png");
const texture1 = loader.load("https://i.ibb.co/F8by6wW/p2-b3gnym.png");  
const texture2 = loader.load("https://i.ibb.co/yYS2yx5/p3-ttfn70.png");
const texture4 = loader.load("https://i.ibb.co/yWfKkHh/p4-avirap.png");

// Globe
textureSphereBg.anisotropy = 16;
const geo = new THREE.IcosahedronGeometry(200, 16);
const mat = new THREE.MeshBasicMaterial({
    side: THREE.BackSide,
    map: textureSphereBg,
});
const globe = new THREE.Mesh(geo, mat);
scene.add(globe);  

/*  Nucleus  */   
texturenucleus.anisotropy = 16;
const icosahedronGeometry = new THREE.IcosahedronGeometry(10, 10);
const lambertMaterial = new THREE.MeshBasicMaterial({ map: texturenucleus });
const sun = new THREE.Mesh(icosahedronGeometry, lambertMaterial);
scene.add(sun);


// Animation

function animate( time ) {

    if ( i > 200){
        camera.position.set(0,0,i);
        i -= 50;
    }

	globe.rotation.x = time / 8000;
	globe.rotation.y = time / 6000;

    sun.rotation.x = time / (-4000);
	sun.rotation.y = time / (-2000);
    
	renderer.render( scene, camera );
    requestAnimationFrame(animate);


}


/*     Resize     */
window.addEventListener("resize", () => {
    clearTimeout(timeout_Debounce);
    timeout_Debounce = setTimeout(onWindowResize, 80);
});

function onWindowResize() {
    camera.aspect = width / height;
    camera.updateProjectionMatrix();
    renderer.setSize(width, height);
}

