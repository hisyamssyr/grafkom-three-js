# Three.js Mini 3D Scene

## Identitas

- Nama: Hisyam Syafa Raditya
- NRP: 5025241130
- Mata kuliah: EF234504 — Grafika Komputer
- Pertemuan: 6

## Deskripsi

Project ini merupakan implementasi bertahap mini 3D scene menggunakan Node.js, Vite, dan Three.js.

Implementasi saat ini mencakup:

- `Scene` dan background;
- `PerspectiveCamera`;
- `WebGLRenderer`;
- `BoxGeometry`;
- `MeshLambertMaterial` pada cube;
- satu cube yang ditambahkan ke scene;
- `SphereGeometry`;
- `MeshPhongMaterial` pada sphere;
- satu sphere yang ditambahkan ke scene;
- `PlaneGeometry` sebagai ground;
- `MeshLambertMaterial` pada ground;
- `AmbientLight`;
- `DirectionalLight`;
- shadow map pada renderer;
- cube dan sphere sebagai shadow caster;
- ground sebagai shadow receiver;
- animation loop dengan `requestAnimationFrame()`;
- `THREE.Timer` dan delta time;
- rotasi cube/sphere dan gerakan naik-turun sphere.
- responsive rendering saat ukuran viewport berubah;
- HUD dengan jumlah object, posisi camera, viewport, FPS, dan status shadow.

## Cara Menjalankan

```bash
npm install
npm run dev
```

## Struktur Project

```text
praktikum-threejs-06/
├── index.html
├── package.json
├── package-lock.json
├── README.md
├── docs/
│   └── modul-praktikum-grafika-komputer-pertemuan-6-introduction-to-threejs.md
└── src/
    ├── main.js
    └── style.css
```
