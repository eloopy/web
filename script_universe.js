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
orbitCtrl.maxDistance = 400;
orbitCtrl.minDistance = 100;
orbitCtrl.enablePan = false;


// Textures
const loaderTexture = new THREE.TextureLoader();
const textureUniverse = loaderTexture.load('./assets/universe.jpg');
const textureSun = loaderTexture.load('./assets/sun.jpg');
const texturePlanetMercury = loaderTexture.load("./assets/mercury.jpg"); 
const texturePlanetVenus = loaderTexture.load("./assets/venus.jpg"); 
const texturePlanetEarth = loaderTexture.load("./assets/earth.jpg");
const texturePlanetMars = loaderTexture.load("./assets/mars.jpg");  
const texturePlanetJupiter = loaderTexture.load("./assets/jupiter.jpg");  

// Universe
textureUniverse.anisotropy = 16;
const UniverseGeometry = new THREE.IcosahedronGeometry(400, 16);
const UniverseMaterial = new THREE.MeshBasicMaterial({
    side: THREE.BackSide,
    map: textureUniverse,
});
const Universe = new THREE.Mesh(UniverseGeometry, UniverseMaterial);
scene.add(Universe);  


// Sun  
textureSun.anisotropy = 16;
const SunGeometry = new THREE.IcosahedronGeometry(40, 10);
const SunMaterial = new THREE.MeshBasicMaterial({ 
    map: textureSun
});

const sun = new THREE.Mesh(SunGeometry, SunMaterial);
scene.add(sun);

/* planet Mercury */
const PlanetMercuryGroup = new THREE.Group();
scene.add(PlanetMercuryGroup);

texturePlanetMercury.anisotropy = 16;
const PlanetMercuryGeometry = new THREE.IcosahedronGeometry(8, 10);
const planetMercuryMaterial = new THREE.MeshBasicMaterial({ 
    map: texturePlanetMercury
});

const planetMercury = new THREE.Mesh(PlanetMercuryGeometry, planetMercuryMaterial);
planetMercury.position.set(60, 0, 0);
PlanetMercuryGroup.add(planetMercury);

/* planet Venus */
const PlanetVenusGroup = new THREE.Group();
scene.add(PlanetVenusGroup);

texturePlanetVenus.anisotropy = 16;
const PlanetVennusGeometry = new THREE.IcosahedronGeometry(10, 10);
const planetVenusMaterial = new THREE.MeshBasicMaterial({ 
    map: texturePlanetVenus
});

const planetVenus = new THREE.Mesh(PlanetVennusGeometry, planetVenusMaterial);
planetVenus.position.set(100, 0, 0);
PlanetVenusGroup.add(planetVenus);


/* planet Earth */
const PlanetEarthGroup = new THREE.Group();
scene.add(PlanetEarthGroup);

texturePlanetEarth.anisotropy = 16;
const PlanetEarthGeometry = new THREE.IcosahedronGeometry(10, 10);
const planetEarthMaterial = new THREE.MeshBasicMaterial({ 
    map: texturePlanetEarth
});

const planetEarth = new THREE.Mesh(PlanetEarthGeometry, planetEarthMaterial);
planetEarth.position.set(140, 0, 0);
PlanetEarthGroup.add(planetEarth);


/* planet Mars */
const PlanetMarsGroup = new THREE.Group();
scene.add(PlanetMarsGroup);

texturePlanetMars.anisotropy = 16;
const PlanetMarsGeometry = new THREE.IcosahedronGeometry(9, 10);
const planetMarsMaterial = new THREE.MeshBasicMaterial({ 
    map: texturePlanetMars
});

const planetMars = new THREE.Mesh(PlanetMarsGeometry, planetMarsMaterial);
planetMars.position.set(180, 0, 0);
PlanetMarsGroup.add(planetMars);


/* planet Jupiter */
const PlanetJupiterGroup = new THREE.Group();
scene.add(PlanetJupiterGroup);

texturePlanetJupiter.anisotropy = 16;
const PlanetJupiterGeometry = new THREE.IcosahedronGeometry(25, 10);
const planetJupiterMaterial = new THREE.MeshBasicMaterial({ 
    map: texturePlanetJupiter
});

const planetJupiter = new THREE.Mesh(PlanetJupiterGeometry, planetJupiterMaterial);
planetJupiter.position.set(250, 0, 0);
PlanetJupiterGroup.add(planetJupiter);

const originalPositions = SunGeometry.attributes.position.array.slice();

// Animation

function animate( time ) {

    if ( zoom > 400){
        camera.position.set(0,0,zoom);
        zoom -= 50;
    }

	Universe.rotation.x = time / 80000;
	Universe.rotation.y = time / 60000;

    //sun.rotation.x = time / (-4000);
	sun.rotation.y = time / (-8000);

    PlanetMercuryGroup.rotation.y = time / 1000;
    planetMercury.rotation.y = time / 8000;

    PlanetVenusGroup.rotation.y = time / 2000;
    planetVenus.rotation.y = time / 15000;

	PlanetEarthGroup.rotation.y = time / 3000;
    planetEarth.rotation.y = time / 3000;

    PlanetMarsGroup.rotation.y = time / 4000;
    planetMars.rotation.y = time / 3000;

    PlanetJupiterGroup.rotation.y = time / 4000;
    planetJupiter.rotation.y = time / 3000;


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

        noiseValue *= 1.2;

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