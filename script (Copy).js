let renderer_uni,
scene_uni,
camera_uni,
camera_text,
sphereBg,
nucleus,
stars,
controls_uni,
container = document.getElementById("canvas_container"),
timeout_Debounce,
noise = new SimplexNoise(),
cameraSpeed = 0,
i = 5000,
blobScale = 2;


init();
const myTimeout = setTimeout(animate, 2000);
/*animate();*/


function init() {
    scene_uni = new THREE.Scene();

    camera_uni = new THREE.PerspectiveCamera(55, window.innerWidth / window.innerHeight, 0.01, 5500)
    camera_uni.position.set(0,0,5000);

    const directionalLight = new THREE.DirectionalLight("#e75d0d", 3);
    directionalLight.position.set(0, 50, -20);
    scene_uni.add(directionalLight);

    let ambientLight = new THREE.AmbientLight("#ffffff", 2);
    ambientLight.position.set(0, 20, 20);
    scene_uni.add(ambientLight);

    renderer_uni = new THREE.WebGLRenderer({
        antialias: true,
        alpha: true
    });
    renderer_uni.setSize(container.clientWidth, container.clientHeight);
    renderer_uni.setPixelRatio(window.devicePixelRatio);
    container.appendChild(renderer_uni.domElement);

    //OrbitControl
    controls_uni = new THREE.OrbitControls(camera_uni, renderer_uni.domElement);
    controls_uni.autoRotate = true;
    controls_uni.autoRotateSpeed = 2;
    controls_uni.maxDistance = 5000;
    controls_uni.minDistance = 250;
    controls_uni.enablePan = false;

    const loader = new THREE.TextureLoader();
    const textureSphereBg = loader.load('https://i.ibb.co/4gHcRZD/bg3-je3ddz.jpg');
    //const textureSphereBg = loader.load('./assets/pexels-philippedonn-1169754.jpg');
    //const texturenucleus = loader.load('https://i.ibb.co/hcN2qXk/star-nc8wkw.jpg');
    const texturenucleus = loader.load('./assets/buack2-img-ilorangesun-poster(1).jpg');
    const textureStar = loader.load("https://i.ibb.co/ZKsdYSz/p1-g3zb2a.png");
    const texture1 = loader.load("https://i.ibb.co/F8by6wW/p2-b3gnym.png");  
    const texture2 = loader.load("https://i.ibb.co/yYS2yx5/p3-ttfn70.png");
    const texture4 = loader.load("https://i.ibb.co/yWfKkHh/p4-avirap.png");


    /*  Nucleus  */   
    texturenucleus.anisotropy = 16;
    let icosahedronGeometry = new THREE.IcosahedronGeometry(10, 10);
    let lambertMaterial = new THREE.MeshPhongMaterial({ map: texturenucleus });
    nucleus = new THREE.Mesh(icosahedronGeometry, lambertMaterial);
    scene_uni.add(nucleus);


    /*    Sphere  Background   */
    textureSphereBg.anisotropy = 16;
    let geometrySphereBg = new THREE.SphereBufferGeometry(200, 40, 40);
    let materialSphereBg = new THREE.MeshBasicMaterial({
        side: THREE.BackSide,
        map: textureSphereBg,
    });
    sphereBg = new THREE.Mesh(geometrySphereBg, materialSphereBg);
    scene_uni.add(sphereBg);


    /*    Moving Stars   */
    let starsGeometry = new THREE.Geometry();

    for (let i = 0; i < 50; i++) {
        let particleStar = randomPointSphere(150); 

        particleStar.velocity = THREE.MathUtils.randInt(20, 200);

        particleStar.startX = particleStar.x;
        particleStar.startY = particleStar.y;
        particleStar.startZ = particleStar.z;

        starsGeometry.vertices.push(particleStar);
    }
    let starsMaterial = new THREE.PointsMaterial({
        size: 5,
        color: "#ffffff",
        transparent: true,
        opacity: 0.8,
        map: textureStar,
        blending: THREE.AdditiveBlending,
    });
    starsMaterial.depthWrite = false;  
    stars = new THREE.Points(starsGeometry, starsMaterial);
    scene_uni.add(stars);


    /*    Fixed Stars   */
    function createStars(texture, size, total) {
        let pointGeometry = new THREE.Geometry();
        let pointMaterial = new THREE.PointsMaterial({
            size: size,
            map: texture,
            blending: THREE.AdditiveBlending,                      
        });

        for (let i = 0; i < total; i++) {
            let radius = THREE.MathUtils.randInt(149, 70); 
            let particles = randomPointSphere(radius);
            pointGeometry.vertices.push(particles);
        }
        return new THREE.Points(pointGeometry, pointMaterial);
    }
    scene_uni.add(createStars(texture1, 15, 20));   
    scene_uni.add(createStars(texture2, 5, 5));
    scene_uni.add(createStars(texture4, 7, 5));


    function randomPointSphere (radius) {
        let theta = 2 * Math.PI * Math.random();
        let phi = Math.acos(2 * Math.random() - 1);
        let dx = 0 + (radius * Math.sin(phi) * Math.cos(theta));
        let dy = 0 + (radius * Math.sin(phi) * Math.sin(theta));
        let dz = 0 + (radius * Math.cos(phi));
        return new THREE.Vector3(dx, dy, dz);
    }
}


function animate() {

    if ( i > 250){
        camera_uni.position.set(0,0,i);
        i -= 20;
    }

    //Stars  Animation
    stars.geometry.vertices.forEach(function (v) {
        v.x += (0 - v.x) / v.velocity;
        v.y += (0 - v.y) / v.velocity;
        v.z += (0 - v.z) / v.velocity;

        v.velocity -= 0.3;

        if (v.x <= 5 && v.x >= -5 && v.z <= 5 && v.z >= -5) {
            v.x = v.startX;
            v.y = v.startY;
            v.z = v.startZ;
            v.velocity = THREE.MathUtils.randInt(50, 300);
        }
    });


    //Nucleus Animation
    nucleus.geometry.vertices.forEach(function (v) {
        let time = Date.now();
        v.normalize();
        let distance = nucleus.geometry.parameters.radius + noise.noise3D(
            v.x + time * 0.00005,
            v.y + time * 0.00003,
            v.z + time * 0.0008
        ) * blobScale;
        v.multiplyScalar(distance);
    })
    nucleus.geometry.verticesNeedUpdate = true;
    nucleus.geometry.normalsNeedUpdate = true;
    nucleus.geometry.computeVertexNormals();
    nucleus.geometry.computeFaceNormals();
    nucleus.rotation.y += 0.002;


    //Sphere Beckground Animation
    sphereBg.rotation.x += 0.002;
    sphereBg.rotation.y += 0.002;
    sphereBg.rotation.z += 0.002;

    
    controls_uni.update();
    stars.geometry.verticesNeedUpdate = true;
    renderer_uni.render(scene_uni, camera_uni);
    requestAnimationFrame(animate);
}



/*     Resize     */
window.addEventListener("resize", () => {
    clearTimeout(timeout_Debounce);
    timeout_Debounce = setTimeout(onWindowResize, 80);
});
function onWindowResize() {
    camera_uni.aspect = container.clientWidth / container.clientHeight;
    camera_uni.updateProjectionMatrix();
    renderer_uni.setSize(container.clientWidth, container.clientHeight);
}



/*     Fullscreen btn     */
// let fullscreen;
// let fsEnter = document.getElementById('fullscr');
// fsEnter.addEventListener('click', function (e) {
//     e.preventDefault();
//     if (!fullscreen) {
//         fullscreen = true;
//         document.documentElement.requestFullscreen();
//         fsEnter.innerHTML = "Exit Fullscreen";
//     }
//     else {
//         fullscreen = false;
//         document.exitFullscreen();
//         fsEnter.innerHTML = "Go Fullscreen";
//     }
// });