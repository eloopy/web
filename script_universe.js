import * as THREE from 'three';
import { OrbitControls } from 'three/addons/controls/OrbitControls.js';

const width = window.innerWidth, height = window.innerHeight;
let zoom = 10000;
let timeNow = 0;
let simplex = new SimplexNoise();


// Init
const myTimeout = setTimeout(animate, 2000);

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

// Orbit Control
const orbitCtrl = new OrbitControls(camera, renderer.domElement);
orbitCtrl.autoRotate = true;
orbitCtrl.maxDistance = 350;
orbitCtrl.minDistance = 100;
orbitCtrl.enablePan = false;


// Textures
const loaderTexture = new THREE.TextureLoader();
const textureUniverse = loaderTexture.load('./assets/universe.jpg');
const textureSun = loaderTexture.load('./assets/sun.jpg');
const texturePlanetEarth = loaderTexture.load("./assets/earth.jpg");
const texturePlanetMars = loaderTexture.load("./assets/martian.jpg");  
/*const texture2 = loader.load("https://i.ibb.co/yYS2yx5/p3-ttfn70.png");
const texture4 = loader.load("https://i.ibb.co/yWfKkHh/p4-avirap.png");*/

// Universe
textureUniverse.anisotropy = 16;
const UniverseGeometry = new THREE.IcosahedronGeometry(300, 16);
const UniverseMaterial = new THREE.MeshBasicMaterial({
    side: THREE.BackSide,
    map: textureUniverse,
});
const Universe = new THREE.Mesh(UniverseGeometry, UniverseMaterial);
scene.add(Universe);  


// Sun  
textureSun.anisotropy = 16;
const SunGeometry = new THREE.IcosahedronGeometry(30, 10);
const SunMaterial = new THREE.MeshBasicMaterial({ 
    map: textureSun
});

const sun = new THREE.Mesh(SunGeometry, SunMaterial);
scene.add(sun);


/* planet Earth */
const PlanetEarthGroup = new THREE.Group();
scene.add(PlanetEarthGroup);

texturePlanetEarth.anisotropy = 16;
const PlanetEarthGeometry = new THREE.IcosahedronGeometry(10, 10);
const planetEarthMaterial = new THREE.MeshBasicMaterial({ 
    map: texturePlanetEarth
});

const planetEarth = new THREE.Mesh(PlanetEarthGeometry, planetEarthMaterial);
planetEarth.position.set(60, 0, 0);
PlanetEarthGroup.add(planetEarth);


/* planet Mars */
const PlanetMarsGroup = new THREE.Group();
scene.add(PlanetMarsGroup);

texturePlanetMars.anisotropy = 16;
const PlanetMarsGeometry = new THREE.IcosahedronGeometry(10, 10);
const planetMarsMaterial = new THREE.MeshBasicMaterial({ 
    map: texturePlanetMars
});

const planetMars = new THREE.Mesh(PlanetMarsGeometry, planetMarsMaterial);
planetMars.position.set(100, 0, 0);
PlanetMarsGroup.add(planetMars);

const originalPositions = SunGeometry.attributes.position.array.slice();

// Animation

function animate( time ) {

    if ( zoom > 350){
        camera.position.set(0,0,zoom);
        zoom -= 50;
    }

	Universe.rotation.x = time / 80000;
	Universe.rotation.y = time / 60000;

    //sun.rotation.x = time / (-4000);
	sun.rotation.y = time / (-8000);

	PlanetEarthGroup.rotation.y = time / (2000);
    planetEarth.rotation.y = time / (3000);

    PlanetMarsGroup.rotation.y = time / (3000);
    planetMars.rotation.y = time / (3000);


    //Sun Noise Animation

    timeNow += 0.01;

    const positionAttribute = SunGeometry.attributes.position;
    const vertex = new THREE.Vector3();

    for (let i = 0; i < positionAttribute.count; i++) {
        vertex.fromBufferAttribute(positionAttribute, i);

        // Get the vertex's spherical coordinates
        const phi = Math.acos(vertex.y);
        const theta = Math.atan2(vertex.z, vertex.x);

        let noiseValue = simplex.noise3D(
            vertex.x * 0.2 + timeNow,
            vertex.y * 0.2 + timeNow,
            vertex.z * 0.2 + timeNow
        );

        noiseValue *= 1;

        // Reset to original position before applying noise
        vertex.fromArray(originalPositions, i * 3); // Important!

        vertex.add(vertex.clone().normalize().multiplyScalar(noiseValue));

        positionAttribute.setXYZ(i, vertex.x, vertex.y, vertex.z);
    }

    positionAttribute.needsUpdate = true;
    SunGeometry.computeVertexNormals();

	renderer.render( scene, camera );
    requestAnimationFrame(animate);
}


/*     Resize     */
window.addEventListener('resize', onWindowResize, false);

function onWindowResize() {
    camera.aspect = (window.innerWidth / window.innerHeight);
    camera.updateProjectionMatrix();
    renderer.setSize(window.innerWidth,window.innerHeight);

}