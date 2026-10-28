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
app.appendChild(renderer.domElement);

// Milestone 3 — Cube
const cubeGeometry = new THREE.BoxGeometry(1, 1, 1);
const cubeMaterial = new THREE.MeshBasicMaterial({
  color: 0x22d3ee,
});
const cube = new THREE.Mesh(cubeGeometry, cubeMaterial);

cube.position.set(0, 0.5, 0);
scene.add(cube);

// Render satu frame untuk Milestone 2–3.
renderer.render(scene, camera);
