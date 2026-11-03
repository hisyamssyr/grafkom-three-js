import * as THREE from "three";

import "./style.css";

const app = document.querySelector("#app");
const info = document.querySelector("#info");

// Milestone 2 — Scene
const scene = new THREE.Scene();
scene.background = new THREE.Color(0x0b1020);

// Milestone 2 — Camera
const sizes = {
  width: window.innerWidth,
  height: window.innerHeight,
};

const frustumHeight = 8;
const minOrthoWidth = 12;
const aspect = sizes.width / sizes.height;

const camera = new THREE.PerspectiveCamera(60, aspect, 0.1, 100);

camera.position.set(4, 3, 6);
camera.lookAt(0, 0.5, 0);
scene.add(camera);

const initialOrthoWidth = Math.max(minOrthoWidth, frustumHeight * aspect);
const initialOrthoHeight = initialOrthoWidth / aspect;

const orthographicCamera = new THREE.OrthographicCamera(
  -initialOrthoWidth / 2,
  initialOrthoWidth / 2,
  initialOrthoHeight / 2,
  -initialOrthoHeight / 2,
  0.1,
  100,
);

orthographicCamera.position.set(4, 3, 6);
orthographicCamera.lookAt(0, 0.5, 0);
scene.add(orthographicCamera);

let activeCamera = camera;

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

const cylinderGeometry = new THREE.CylinderGeometry(0.4, 0.4, 1.4, 32);
const cylinderMaterial = new THREE.MeshLambertMaterial({
  color: 0xf59e0b,
});
const cylinder = new THREE.Mesh(cylinderGeometry, cylinderMaterial);

cylinder.position.set(-2.8, 0.7, 1.2);
cylinder.castShadow = true;
scene.add(cylinder);

const coneGeometry = new THREE.ConeGeometry(0.55, 2, 32);
const coneMaterial = new THREE.MeshPhongMaterial({
  color: 0x22c55e,
  shininess: 40,
});
const cone = new THREE.Mesh(coneGeometry, coneMaterial);

cone.position.set(-2.4, 1, -2);
cone.castShadow = true;
scene.add(cone);

const torusGeometry = new THREE.TorusGeometry(0.6, 0.2, 16, 48);
const torusMaterial = new THREE.MeshLambertMaterial({
  color: 0xa855f7,
});
const torus = new THREE.Mesh(torusGeometry, torusMaterial);

torus.position.set(2.6, 0.2, 1.8);
torus.rotation.x = Math.PI / 2;
torus.castShadow = true;
scene.add(torus);

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

let animationEnabled = true;
const keys = {};
const moveSpeed = 2.5;
const turnSpeed = Math.PI;
const groundLimit = 4.5;

// Milestone 10 — Responsive Rendering
window.addEventListener("resize", () => {
  sizes.width = window.innerWidth;
  sizes.height = window.innerHeight;

  const nextAspect = sizes.width / sizes.height;

  camera.aspect = nextAspect;
  camera.updateProjectionMatrix();

  const orthoWidth = Math.max(minOrthoWidth, frustumHeight * nextAspect);
  const orthoHeight = orthoWidth / nextAspect;

  orthographicCamera.left = -orthoWidth / 2;
  orthographicCamera.right = orthoWidth / 2;
  orthographicCamera.top = orthoHeight / 2;
  orthographicCamera.bottom = -orthoHeight / 2;
  orthographicCamera.updateProjectionMatrix();

  renderer.setSize(sizes.width, sizes.height);
  renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2));
});

window.addEventListener("keydown", (event) => {
  keys[event.code] = true;

  if (event.code === "Space") {
    event.preventDefault();

    if (!event.repeat) {
      animationEnabled = !animationEnabled;
    }
  }

  if (event.code === "KeyP" && !event.repeat) {
    activeCamera = activeCamera === camera ? orthographicCamera : camera;
  }

  if (event.code.startsWith("Arrow")) {
    event.preventDefault();
  }
});

window.addEventListener("keyup", (event) => {
  keys[event.code] = false;
});

window.addEventListener("blur", () => {
  for (const code in keys) {
    keys[code] = false;
  }
});

// Milestone 9 — Animation
const timer = new THREE.Timer();
timer.connect(document);
let elapsed = 0;
let fpsElapsed = 0;
let frameCount = 0;
let fps = 0;

function animate(timestamp) {
  requestAnimationFrame(animate);

  timer.update(timestamp);

  const delta = Math.min(timer.getDelta(), 0.05);
  fpsElapsed += delta;
  frameCount += 1;

  if (fpsElapsed >= 0.5) {
    fps = Math.round(frameCount / fpsElapsed);
    fpsElapsed = 0;
    frameCount = 0;
  }

  if (animationEnabled) {
    elapsed += delta;

    cube.rotation.y += 0.8 * delta;

    sphere.rotation.y += 0.5 * delta;
    sphere.position.y = 0.75 + Math.sin(elapsed * 2) * 0.15;

    if (keys.ArrowLeft) {
      cube.position.x -= moveSpeed * delta;
    }

    if (keys.ArrowRight) {
      cube.position.x += moveSpeed * delta;
    }

    if (keys.ArrowUp) {
      cube.position.z -= moveSpeed * delta;
    }

    if (keys.ArrowDown) {
      cube.position.z += moveSpeed * delta;
    }

    if (keys.KeyQ) {
      cube.rotation.y += turnSpeed * delta;
    }

    if (keys.KeyE) {
      cube.rotation.y -= turnSpeed * delta;
    }

    cube.position.x = THREE.MathUtils.clamp(
      cube.position.x,
      -groundLimit,
      groundLimit,
    );

    cube.position.z = THREE.MathUtils.clamp(
      cube.position.z,
      -groundLimit,
      groundLimit,
    );
  }

  const cameraLabel =
    activeCamera === camera ? "Perspective" : "Orthographic";

  info.textContent =
    `Meshes: ${scene.children.filter((child) => child.isMesh).length} | ` +
    `Camera: ${cameraLabel} (` +
    `${activeCamera.position.x.toFixed(1)}, ` +
    `${activeCamera.position.y.toFixed(1)}, ` +
    `${activeCamera.position.z.toFixed(1)}) | ` +
    `Viewport: ${sizes.width} × ${sizes.height} | ` +
    `FPS: ${fps} | ` +
    `Anim: ${animationEnabled ? "ON" : "OFF"} | ` +
    `Shadow: ${renderer.shadowMap.enabled ? "ON" : "OFF"}`;

  renderer.render(scene, activeCamera);
}

animate();
