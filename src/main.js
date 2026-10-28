import * as THREE from "three";

import "./style.css";

const app = document.querySelector("#app");

// Milestone 2 — Scene
const scene = new THREE.Scene();
scene.background = new THREE.Color(0x0b1020);

// Milestone 2 — Camera
const sizes = {
  width: window.innerWidth,
  height: window.innerHeight,
};

const camera = new THREE.PerspectiveCamera(
  60,
  sizes.width / sizes.height,
  0.1,
  100,
);

camera.position.set(4, 3, 6);
camera.lookAt(0, 0.5, 0);
scene.add(camera);

// Milestone 2 — Renderer
const renderer = new THREE.WebGLRenderer({
  antialias: true,
});

renderer.setSize(sizes.width, sizes.height);
renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2));
// Milestone 8 — Shadow renderer
renderer.shadowMap.enabled = true;
app.appendChild(renderer.domElement);

// Milestone 3 — Cube
const cubeGeometry = new THREE.BoxGeometry(1, 1, 1);
const cubeMaterial = new THREE.MeshLambertMaterial({
  color: 0x22d3ee,
});
const cube = new THREE.Mesh(cubeGeometry, cubeMaterial);

// Milestone 4 — Transform
cube.position.set(-1, 0.5, 0);
cube.rotation.y = Math.PI / 4;
cube.scale.set(1.2, 0.8, 1.2);
cube.castShadow = true;
scene.add(cube);

// Milestone 5 — Sphere + Lighting Material
const sphereGeometry = new THREE.SphereGeometry(0.7, 32, 16);
const sphereMaterial = new THREE.MeshPhongMaterial({
  color: 0x4488ff,
  shininess: 60,
});
const sphere = new THREE.Mesh(sphereGeometry, sphereMaterial);

sphere.position.set(1.4, 0.75, 0);
sphere.castShadow = true;
scene.add(sphere);

// Milestone 6 — Ground
const groundGeometry = new THREE.PlaneGeometry(10, 10);
groundGeometry.rotateX(-Math.PI / 2);

const groundMaterial = new THREE.MeshLambertMaterial({
  color: 0x334155,
});
const ground = new THREE.Mesh(groundGeometry, groundMaterial);

ground.position.y = 0;
ground.receiveShadow = true;
scene.add(ground);

// Milestone 7 — Light
const ambientLight = new THREE.AmbientLight(0xffffff, 0.35);
scene.add(ambientLight);

const directionalLight = new THREE.DirectionalLight(0xffffff, 2.0);
directionalLight.position.set(3, 5, 2);
directionalLight.castShadow = true;
directionalLight.shadow.mapSize.set(1024, 1024);
directionalLight.shadow.camera.left = -5;
directionalLight.shadow.camera.right = 5;
directionalLight.shadow.camera.top = 5;
directionalLight.shadow.camera.bottom = -5;
directionalLight.shadow.camera.near = 0.5;
directionalLight.shadow.camera.far = 20;
scene.add(directionalLight);

// Milestone 10 — Responsive Rendering
window.addEventListener("resize", () => {
  sizes.width = window.innerWidth;
  sizes.height = window.innerHeight;

  camera.aspect = sizes.width / sizes.height;
  camera.updateProjectionMatrix();

  renderer.setSize(sizes.width, sizes.height);
  renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2));
});

// Milestone 9 — Animation
const timer = new THREE.Timer();
timer.connect(document);
let elapsed = 0;

function animate(timestamp) {
  requestAnimationFrame(animate);

  timer.update(timestamp);

  const delta = Math.min(timer.getDelta(), 0.05);
  elapsed += delta;

  cube.rotation.y += 0.8 * delta;

  sphere.rotation.y += 0.5 * delta;
  sphere.position.y = 0.75 + Math.sin(elapsed * 2) * 0.15;

  renderer.render(scene, camera);
}

animate();
