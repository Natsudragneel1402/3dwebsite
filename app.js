// Set up the scene, camera, and renderer
const scene = new THREE.Scene();
const camera = new THREE.PerspectiveCamera(75, window.innerWidth / window.innerHeight, 0.1, 1000);
const renderer = new THREE.WebGLRenderer();
renderer.setSize(window.innerWidth, window.innerHeight);
document.body.appendChild(renderer.domElement);

// Create a starfield background
const starGeometry = new THREE.BufferGeometry();
const starMaterial = new THREE.PointsMaterial({color: 0xFFFFFF});

const starVertices = [];
for (let i = 0; i < 10000; i++) {
    const x = (Math.random() - 0.5) * 2000;
    const y = (Math.random() - 0.5) * 2000;
    const z = -Math.random() * 2000;
    starVertices.push(x, y, z);
}

starGeometry.setAttribute('position', new THREE.Float32BufferAttribute(starVertices, 3));
const stars = new THREE.Points(starGeometry, starMaterial);
scene.add(stars);

// Create planets
function createPlanet(radius, color, position) {
    const geometry = new THREE.SphereGeometry(radius, 32, 32);
    const material = new THREE.MeshPhongMaterial({color: color});
    const planet = new THREE.Mesh(geometry, material);
    planet.position.set(position.x, position.y, position.z);
    scene.add(planet);
    return planet;
}

const sun = createPlanet(5, 0xFFFF00, {x: 0, y: 0, z: -20});
const earth = createPlanet(1, 0x0000FF, {x: 10, y: 0, z: -20});
const mars = createPlanet(0.8, 0xFF0000, {x: -8, y: 2, z: -18});

// Add ambient light
const ambientLight = new THREE.AmbientLight(0x404040);
scene.add(ambientLight);

// Add point light (sun)
const pointLight = new THREE.PointLight(0xFFFFFF, 1, 100);
pointLight.position.set(0, 0, -20);
scene.add(pointLight);

// Position camera
camera.position.z = 15;

// Animation loop
function animate() {
    requestAnimationFrame(animate);

    // Rotate planets
    earth.rotation.y += 0.01;
    mars.rotation.y += 0.008;

    // Orbit planets
    const time = Date.now() * 0.001;
    earth.position.x = Math.cos(time * 0.3) * 10;
    earth.position.z = Math.sin(time * 0.3) * 10 - 20;
    mars.position.x = Math.cos(time * 0.2) * 8;
    mars.position.z = Math.sin(time * 0.2) * 8 - 18;

    renderer.render(scene, camera);
}

animate();

// Handle window resizing
window.addEventListener('resize', onWindowResize, false);

function onWindowResize() {
    camera.aspect = window.innerWidth / window.innerHeight;
    camera.updateProjectionMatrix();
    renderer.setSize(window.innerWidth, window.innerHeight);
}

// Basic interactivity
const raycaster = new THREE.Raycaster();
const mouse = new THREE.Vector2();

function onMouseMove(event) {
    mouse.x = (event.clientX / window.innerWidth) * 2 - 1;
    mouse.y = -(event.clientY / window.innerHeight) * 2 + 1;

    raycaster.setFromCamera(mouse, camera);

    const intersects = raycaster.intersectObjects(scene.children);

    for (let i = 0; i < scene.children.length; i++) {
        if (scene.children[i].type === "Mesh") {
            scene.children[i].material.emissive.setHex(0x000000);
        }
    }

    for (let i = 0; i < intersects.length; i++) {
        if (intersects[i].object.type === 'Mesh') {
            intersects[i].object.material.emissive.setHex(0x555555);
        }
    }
}

window.addEventListener('mousemove', onMouseMove, false);