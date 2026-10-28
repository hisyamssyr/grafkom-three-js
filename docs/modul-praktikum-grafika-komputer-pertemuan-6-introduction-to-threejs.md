# Modul Praktikum Grafika Komputer — Pertemuan 6

## Introduction to Three.js — Mini 3D Scene

**Mata Kuliah:** EF234504 — Grafika Komputer  
**Pertemuan:** 6  
**Topik:** Introduction to Three.js  
**Dosen:** Dr. Darlis Herumurti  
**Departemen:** Teknik Informatika  

---

# 1. Deskripsi Praktikum

Pada Pertemuan 2–5, mahasiswa telah membangun grafika 3D secara langsung dengan WebGL. Banyak komponen harus dikelola secara manual:

```text
Vertex Data
↓
Buffer
↓
Shader
↓
Matrix
↓
Camera
↓
Lighting
↓
Texture
↓
Draw Call
```

Pada Pertemuan 6, konsep tersebut tidak dibuang. Kita menggunakan **Three.js** sebagai abstraction layer di atas WebGL agar pembangunan aplikasi 3D menjadi lebih ringkas dan terstruktur.

Secara konseptual:

```text
JavaScript Application
        ↓
      Three.js
        ↓
       WebGL
        ↓
        GPU
```

Praktikum ini membangun:

# Mini 3D Scene dengan Three.js

Scene akhir minimal berisi:

```text
Scene
├── PerspectiveCamera
├── Cube
├── Sphere
├── Ground
├── AmbientLight
└── DirectionalLight
        ↓
Animation Loop
        ↓
WebGLRenderer
        ↓
Canvas
```

Fitur akhir:

- Scene dan background;
- PerspectiveCamera;
- WebGLRenderer;
- BoxGeometry;
- SphereGeometry;
- PlaneGeometry;
- minimal dua jenis Material;
- Mesh;
- position, rotation, dan scale;
- AmbientLight;
- DirectionalLight;
- shadow;
- animation loop;
- delta time;
- responsive rendering;
- HUD sederhana;
- eksperimen material dan geometry.

---

# 2. Capaian Praktikum

Setelah menyelesaikan praktikum, mahasiswa mampu:

1. menjelaskan posisi Three.js terhadap WebGL;
2. membuat project Three.js dengan Node.js dan Vite;
3. membuat `Scene`;
4. membuat `PerspectiveCamera`;
5. menjelaskan FOV, aspect, near, dan far pada `PerspectiveCamera`;
6. membuat `WebGLRenderer`;
7. menggunakan built-in geometry;
8. menjelaskan hubungan `BufferGeometry` dengan vertex data WebGL;
9. menggunakan beberapa material dasar;
10. membentuk `Mesh` dari Geometry dan Material;
11. menambahkan Mesh ke Scene;
12. mengubah position, rotation, dan scale;
13. menjelaskan hubungan transform Three.js dengan Model Matrix;
14. menggunakan AmbientLight dan DirectionalLight;
15. menjelaskan material yang membutuhkan light dan yang tidak;
16. mengaktifkan shadow;
17. menjelaskan `castShadow` dan `receiveShadow`;
18. membuat animation loop;
19. menggunakan delta time untuk animasi;
20. membuat renderer dan camera responsif terhadap resize;
21. membangun mini 3D scene yang lengkap.

---

# 3. Hubungan Praktikum dengan WebGL

Three.js menyediakan abstraction.

| Konsep WebGL | Three.js |
|---|---|
| kumpulan object yang dikelola aplikasi | `Scene` |
| View + Projection | `Camera` |
| vertex/index buffer | `BufferGeometry` |
| shader + parameter render | `Material` |
| geometry yang dirender | `Mesh` |
| Model Matrix | `position`, `rotation`, `scale` |
| perhitungan lighting manual | `Light` + lighting material |
| draw call manual | `WebGLRenderer` |
| Canvas WebGL | `renderer.domElement` |

Contoh:

```javascript
const cube =
  new THREE.Mesh(
    geometry,
    material
  );
```

terlihat sederhana, tetapi di baliknya Three.js tetap mengelola:

```text
Vertex Attribute
Buffer
Shader Program
Matrix
GPU State
Draw Call
```

---

# 4. Target Aplikasi

Kita akan membuat scene seperti berikut:

```text
             Directional Light
                    ↘

               ┌────────┐
               │  Cube  │
               └────────┘

                         Sphere
                           ●

────────────────────────────────────
               Ground

                    ↑
                  Camera
```

Object memiliki material berbeda sehingga mahasiswa dapat membandingkan perilaku material terhadap light.

---

# 5. Software yang Dibutuhkan

Gunakan:

- browser modern;
- Node.js;
- npm;
- code editor;
- terminal.

Periksa instalasi:

```bash
node --version
npm --version
```

Jika kedua perintah menampilkan versi, environment siap digunakan.

---

# 6. Membuat Project dengan Vite

Buka terminal:

```bash
npm create vite@latest praktikum-threejs-06 -- --template vanilla
```

Masuk ke directory:

```bash
cd praktikum-threejs-06
```

Install dependency bawaan:

```bash
npm install
```

Install Three.js:

```bash
npm install three
```

Jalankan development server:

```bash
npm run dev
```

Buka URL yang ditampilkan Vite.

---

# 7. Mengapa Menggunakan Vite?

Materi menggunakan:

```text
Node.js
+
Vite
+
Three.js
```

Keuntungannya:

- ES Module dapat digunakan dengan mudah;
- `import` lebih rapi;
- development server tersedia;
- perubahan source cepat terlihat;
- dependency dikelola npm;
- struktur project mudah dikembangkan.

---

# 8. Struktur Project

Rapikan menjadi:

```text
praktikum-threejs-06/
├── index.html
├── package.json
├── package-lock.json
├── src/
│   ├── main.js
│   └── style.css
└── node_modules/
```

Untuk Pertemuan 6, sebagian besar logic sengaja ditempatkan pada satu `main.js` agar alur aplikasi mudah dipelajari.

---

# 9. Membersihkan `index.html`

Gunakan:

```html
<!doctype html>
<html lang="id">

<head>
  <meta charset="UTF-8" />

  <meta
    name="viewport"
    content="width=device-width, initial-scale=1.0"
  />

  <title>
    Three.js Mini 3D Scene
  </title>
</head>

<body>

  <div id="app">

    <div id="hud">
      <strong>
        Three.js Mini 3D Scene
      </strong>

      <span id="info">
        Loading...
      </span>
    </div>

  </div>

  <script
    type="module"
    src="/src/main.js">
  </script>

</body>

</html>
```

Canvas tidak dibuat manual.

Nanti Three.js menghasilkan Canvas melalui:

```javascript
renderer.domElement
```

---

# 10. Membuat `style.css`

```css
* {
  box-sizing: border-box;
}

html,
body {
  margin: 0;
  width: 100%;
  height: 100%;
  overflow: hidden;
}

body {
  background: #050816;

  font-family:
    Arial,
    sans-serif;
}

#app {
  position: relative;

  width: 100%;
  height: 100%;
}

canvas {
  display: block;

  width: 100%;
  height: 100%;
}

#hud {
  position: absolute;
  z-index: 10;

  top: 16px;
  left: 16px;

  display: grid;
  gap: 6px;

  padding: 12px 14px;

  color: white;

  background:
    rgba(
      8,
      15,
      30,
      0.78
    );

  border:
    1px solid
    rgba(
      56,
      189,
      248,
      0.4
    );

  border-radius: 8px;

  pointer-events: none;
}
```

---

# 11. Import Three.js

Pada `main.js`:

```javascript
import * as THREE
  from "three";

import "./style.css";
```

Dengan npm + Vite, kita tidak perlu menambahkan `<script>` Three.js dari CDN.

---

# 12. Urutan Pembangunan Aplikasi

Kita akan mengikuti urutan:

```text
1. Scene
2. Camera
3. Renderer
4. Geometry
5. Material
6. Mesh
7. Transform
8. Light
9. Shadow
10. Animation Loop
11. Responsive Rendering
```

Urutan ini sesuai arsitektur dasar Three.js.

---

# 13. Membuat Scene

```javascript
const scene =
  new THREE.Scene();
```

`Scene` adalah container utama object 3D.

Secara konseptual:

```text
Scene
├── Mesh
├── Light
├── Group
└── Object3D lainnya
```

---

# 14. Background Scene

```javascript
scene.background =
  new THREE.Color(
    0x0b1020
  );
```

Pada WebGL manual, kita biasa menggunakan:

```javascript
gl.clearColor(...);
```

Pada Three.js, background scene dapat ditetapkan melalui:

```javascript
scene.background
```

---

# 15. Membaca Ukuran Viewport

```javascript
const sizes = {
  width:
    window.innerWidth,

  height:
    window.innerHeight
};
```

Nilai ini digunakan oleh:

- camera aspect ratio;
- renderer size.

---

# 16. PerspectiveCamera

```javascript
const camera =
  new THREE.PerspectiveCamera(
    60,
    sizes.width /
      sizes.height,
    0.1,
    100
  );
```

Parameter:

```text
60
→ Field of View

width / height
→ Aspect Ratio

0.1
→ Near Plane

100
→ Far Plane
```

Konsep ini sama dengan Perspective Projection pada Pertemuan 4.

---

# 17. Camera Position

```javascript
camera.position.set(
  4,
  3,
  6
);
```

Camera berada di World Space.

Arahkan ke origin:

```javascript
camera.lookAt(
  0,
  0.5,
  0
);
```

Three.js mengelola View Matrix di belakang layar.

---

# 18. Menambahkan Camera ke Scene?

Untuk rendering dasar:

```javascript
renderer.render(
  scene,
  camera
);
```

camera dapat digunakan tanpa harus ditambahkan ke Scene.

Namun menambahkan camera ke Scene juga diperbolehkan jika camera perlu menjadi bagian hierarchy atau diberi child.

Untuk praktikum ini kita dapat menggunakan:

```javascript
scene.add(
  camera
);
```

agar struktur scene mudah dilihat secara konseptual.

---

# 19. Membuat WebGLRenderer

```javascript
const renderer =
  new THREE.WebGLRenderer({
    antialias: true
  });
```

`WebGLRenderer` mengelola banyak pekerjaan low-level:

```text
WebGL Context
Buffer
Shader
GPU State
Draw Call
Framebuffer
```

---

# 20. Renderer Size

```javascript
renderer.setSize(
  sizes.width,
  sizes.height
);
```

Batasi pixel ratio agar beban rendering tidak terlalu tinggi:

```javascript
renderer.setPixelRatio(
  Math.min(
    window.devicePixelRatio,
    2
  )
);
```

---

# 21. Menambahkan Canvas ke Halaman

```javascript
const app =
  document.getElementById(
    "app"
  );

app.appendChild(
  renderer.domElement
);
```

`renderer.domElement` adalah:

```text
HTMLCanvasElement
```

yang digunakan Three.js untuk rendering.

---

# 22. Render Pertama

Sebelum membuat object, kita sudah dapat mencoba:

```javascript
renderer.render(
  scene,
  camera
);
```

Hasilnya hanya background karena belum ada Mesh.

---

# 23. Geometry

Three.js menyediakan built-in geometry seperti:

```text
BoxGeometry
SphereGeometry
PlaneGeometry
CylinderGeometry
ConeGeometry
TorusGeometry
```

Pada praktikum ini kita menggunakan:

```text
BoxGeometry
SphereGeometry
PlaneGeometry
```

---

# 24. Membuat BoxGeometry

```javascript
const cubeGeometry =
  new THREE.BoxGeometry(
    1,
    1,
    1
  );
```

Parameter:

```text
width
height
depth
```

Walaupun API terlihat sederhana, geometry tetap menyimpan data vertex.

---

# 25. Memeriksa BufferGeometry

Tambahkan sementara:

```javascript
console.log(
  cubeGeometry
);
```

Kemudian:

```javascript
console.log(
  cubeGeometry.attributes
);
```

Amati attribute seperti:

```text
position
normal
uv
```

Ini menghubungkan Three.js dengan konsep Pertemuan 2–5.

---

# 26. Menghitung Jumlah Vertex

```javascript
console.log(
  "Cube position count:",
  cubeGeometry
    .attributes
    .position
    .count
);
```

Jika geometry indexed, tersedia:

```javascript
console.log(
  cubeGeometry.index
);
```

Tujuan:

> mahasiswa melihat bahwa `Geometry` bukan bentuk abstrak tanpa data; di dalamnya tetap terdapat vertex/index data.

---

# 27. Material Pertama — MeshBasicMaterial

```javascript
const basicMaterial =
  new THREE.MeshBasicMaterial({
    color: 0x00aaff
  });
```

Karakter penting:

```text
MeshBasicMaterial
→ tidak dipengaruhi Light
```

Ini sangat berguna untuk membandingkan material yang membutuhkan lighting.

---

# 28. Geometry + Material = Mesh

```javascript
const cube =
  new THREE.Mesh(
    cubeGeometry,
    basicMaterial
  );
```

Secara konseptual:

```text
Geometry
+
Material
=
Mesh
```

Geometry menjawab:

```text
bentuknya apa?
```

Material menjawab:

```text
permukaannya dirender bagaimana?
```

Mesh menggabungkan keduanya menjadi object yang dapat ditempatkan di Scene.

---

# 29. Menambahkan Cube ke Scene

```javascript
scene.add(
  cube
);
```

Sekarang render:

```javascript
renderer.render(
  scene,
  camera
);
```

Cube harus terlihat.

Jika tidak:

- periksa posisi camera;
- periksa Console;
- periksa object sudah `scene.add()`;
- periksa ukuran renderer.

---

# 30. Transform Object

Three.js menyediakan:

```text
position
rotation
scale
```

Semua berasal dari konsep transformasi yang sudah dipelajari.

Contoh:

```javascript
cube.position.set(
  -1.2,
  0.6,
  0
);
```

---

# 31. Rotation

```javascript
cube.rotation.y =
  Math.PI / 4;
```

Three.js menggunakan radian.

Contoh:

```text
π / 2
= 90°

π
= 180°
```

---

# 32. Scale

```javascript
cube.scale.set(
  1.2,
  1.2,
  1.2
);
```

Three.js mengelola Model Matrix dari transform tersebut.

Hubungannya dengan Pertemuan 3:

```text
position
rotation
scale
      ↓
Three.js
      ↓
Model Matrix
```

---

# 33. SphereGeometry

```javascript
const sphereGeometry =
  new THREE.SphereGeometry(
    0.7,
    32,
    16
  );
```

Parameter utama:

```text
radius
widthSegments
heightSegments
```

Semakin banyak segment:

```text
lebih halus
+
lebih banyak polygon
```

---

# 34. MeshPhongMaterial

```javascript
const sphereMaterial =
  new THREE.MeshPhongMaterial({
    color: 0x4488ff,
    shininess: 60
  });
```

`MeshPhongMaterial` merespons lighting dan menyediakan highlight specular-like.

Hubungkan dengan Pertemuan 5:

```text
Diffuse
+
Specular-like Highlight
```

---

# 35. Membuat Sphere Mesh

```javascript
const sphere =
  new THREE.Mesh(
    sphereGeometry,
    sphereMaterial
  );

sphere.position.set(
  1.4,
  0.75,
  0
);

scene.add(
  sphere
);
```

Pada tahap ini sphere mungkin gelap karena material membutuhkan light.

Ini adalah kondisi yang sengaja kita gunakan untuk memahami hubungan Material dan Light.

---

# 36. PlaneGeometry sebagai Ground

```javascript
const groundGeometry =
  new THREE.PlaneGeometry(
    10,
    10
  );
```

Plane default berada pada bidang XY.

Untuk menjadi ground horizontal, rotate:

```javascript
groundGeometry.rotateX(
  -Math.PI / 2
);
```

---

# 37. Material Ground

Gunakan material yang merespons light:

```javascript
const groundMaterial =
  new THREE.MeshLambertMaterial({
    color: 0x334155
  });
```

`MeshLambertMaterial` cocok untuk diffuse lighting sederhana.

---

# 38. Ground Mesh

```javascript
const ground =
  new THREE.Mesh(
    groundGeometry,
    groundMaterial
  );

ground.position.y =
  0;

scene.add(
  ground
);
```

Cube dan sphere harus berada sedikit di atas ground agar tidak menembus plane.

---

# 39. Material dan Kebutuhan Light

Bandingkan:

```text
MeshBasicMaterial
→ tidak dipengaruhi light

MeshLambertMaterial
→ membutuhkan light

MeshPhongMaterial
→ membutuhkan light
```

Jika object gelap:

> jangan langsung menganggap geometry atau camera salah. Periksa apakah material membutuhkan light.

---

# 40. AmbientLight

Tambahkan:

```javascript
const ambientLight =
  new THREE.AmbientLight(
    0xffffff,
    0.35
  );

scene.add(
  ambientLight
);
```

AmbientLight:

- tidak memiliki arah;
- memberi pencahayaan dasar;
- membantu sisi gelap tetap terlihat.

Konsepnya berkaitan dengan ambient lighting pada Pertemuan 5.

---

# 41. DirectionalLight

```javascript
const directionalLight =
  new THREE.DirectionalLight(
    0xffffff,
    2.0
  );

directionalLight
  .position
  .set(
    3,
    5,
    2
  );

scene.add(
  directionalLight
);
```

DirectionalLight merepresentasikan sumber cahaya jauh dengan arah yang relatif seragam.

---

# 42. Mengamati Pengaruh Light

Sekarang bandingkan:

```text
Cube
→ MeshBasicMaterial

Sphere
→ MeshPhongMaterial

Ground
→ MeshLambertMaterial
```

Pertanyaan:

1. object mana yang berubah ketika light ditambahkan?
2. mengapa cube BasicMaterial tidak bereaksi?
3. mengapa sphere menunjukkan perubahan shading lebih jelas?

---

# 43. Mengganti Cube Material

Setelah perbandingan awal, ganti cube ke:

```javascript
const cubeMaterial =
  new THREE.MeshLambertMaterial({
    color: 0x22d3ee
  });
```

Kemudian gunakan material tersebut ketika membuat cube:

```javascript
const cube =
  new THREE.Mesh(
    cubeGeometry,
    cubeMaterial
  );
```

Sekarang cube juga merespons light.

---

# 44. Shadow — Konsep

Shadow membantu menunjukkan:

```text
kedalaman
posisi object
hubungan object dengan ground
arah cahaya
```

Agar shadow bekerja, beberapa bagian harus diaktifkan.

---

# 45. Mengaktifkan Shadow Map Renderer

```javascript
renderer.shadowMap.enabled =
  true;
```

Tanpa ini, shadow tidak diproses oleh renderer.

---

# 46. Light Harus Cast Shadow

```javascript
directionalLight.castShadow =
  true;
```

Artinya DirectionalLight diperbolehkan menghasilkan shadow map.

---

# 47. Object Harus Cast Shadow

```javascript
cube.castShadow =
  true;

sphere.castShadow =
  true;
```

Object tersebut menjadi caster.

---

# 48. Ground Harus Receive Shadow

```javascript
ground.receiveShadow =
  true;
```

Ground menjadi receiver.

Benang merah:

```text
renderer.shadowMap.enabled
+
light.castShadow
+
object.castShadow
+
ground.receiveShadow
```

---

# 49. Mengatur Shadow Camera Dasar

Untuk scene kecil:

```javascript
directionalLight
  .shadow
  .camera
  .left = -5;

directionalLight
  .shadow
  .camera
  .right = 5;

directionalLight
  .shadow
  .camera
  .top = 5;

directionalLight
  .shadow
  .camera
  .bottom = -5;

directionalLight
  .shadow
  .camera
  .near = 0.5;

directionalLight
  .shadow
  .camera
  .far = 20;
```

Tujuannya bukan mendalami shadow mapping, tetapi memastikan area scene berada di dalam volume shadow camera.

---

# 50. Shadow Map Size

```javascript
directionalLight
  .shadow
  .mapSize
  .set(
    1024,
    1024
  );
```

Semakin besar map:

```text
potensi shadow lebih detail
+
biaya memory/render lebih besar
```

Pada Pertemuan 6 cukup gunakan ukuran moderat.

---

# 51. Animation Loop

Versi paling sederhana:

```javascript
function animate() {
  requestAnimationFrame(
    animate
  );

  cube.rotation.y +=
    0.01;

  renderer.render(
    scene,
    camera
  );
}

animate();
```

Namun kita akan menggunakan delta time agar kecepatan animasi lebih konsisten.

---

# 52. Mengapa Tetap `requestAnimationFrame()`?

Walaupun sekarang menggunakan Three.js, prinsip animasi browser tetap sama.

Gunakan:

```javascript
requestAnimationFrame()
```

karena animation loop visual sebaiknya diselaraskan dengan rendering browser.

Three.js tidak mengubah prinsip dasar ini.

---

# 53. Menggunakan `THREE.Clock`

Three.js menyediakan:

```javascript
const clock =
  new THREE.Clock();
```

Pada setiap frame:

```javascript
const delta =
  clock.getDelta();
```

`delta` adalah waktu sejak frame sebelumnya dalam detik.

---

# 54. Animasi Frame-Rate Independent

```javascript
const clock =
  new THREE.Clock();

function animate() {
  requestAnimationFrame(
    animate
  );

  const delta =
    Math.min(
      clock.getDelta(),
      0.05
    );

  cube.rotation.y +=
    0.8 * delta;

  sphere.rotation.y +=
    0.5 * delta;

  renderer.render(
    scene,
    camera
  );
}

animate();
```

Kecepatan:

```text
0.8 radian / second
```

lebih stabil dibanding menambah nilai tetap per frame.

---

# 55. Menambahkan Animasi Sphere

Selain rotation, buat sphere bergerak sedikit naik-turun.

```javascript
let elapsed =
  0;

function animate() {
  requestAnimationFrame(
    animate
  );

  const delta =
    Math.min(
      clock.getDelta(),
      0.05
    );

  elapsed +=
    delta;

  cube.rotation.y +=
    0.8 * delta;

  sphere.rotation.y +=
    0.5 * delta;

  sphere.position.y =
    0.75
    +
    Math.sin(
      elapsed * 2.0
    ) * 0.15;

  renderer.render(
    scene,
    camera
  );
}
```

---

# 56. Responsive Rendering

Saat ukuran window berubah, dua hal utama perlu diperbarui:

```text
Camera Aspect Ratio
Renderer Size
```

Jika hanya renderer yang diubah tetapi aspect camera tidak, object dapat terlihat terdistorsi.

---

# 57. Resize Event

```javascript
window.addEventListener(
  "resize",
  () => {
    sizes.width =
      window.innerWidth;

    sizes.height =
      window.innerHeight;

    camera.aspect =
      sizes.width /
      sizes.height;

    camera
      .updateProjectionMatrix();

    renderer.setSize(
      sizes.width,
      sizes.height
    );

    renderer.setPixelRatio(
      Math.min(
        window.devicePixelRatio,
        2
      )
    );
  }
);
```

---

# 58. Mengapa `updateProjectionMatrix()`?

Mengubah:

```javascript
camera.aspect
```

hanya mengubah parameter camera.

Projection Matrix harus dihitung ulang:

```javascript
camera.updateProjectionMatrix();
```

Konsepnya sama dengan Pertemuan 4:

```text
Aspect berubah
→ Projection Matrix harus berubah
```

---

# 59. HUD

Ambil element:

```javascript
const info =
  document.getElementById(
    "info"
  );
```

Update:

```javascript
function updateHUD() {
  info.textContent =
    `Objects: ${scene.children.length} | ` +
    `Camera: ` +
    `${camera.position.x.toFixed(1)}, ` +
    `${camera.position.y.toFixed(1)}, ` +
    `${camera.position.z.toFixed(1)}`;
}
```

Panggil pada animation loop.

HUD tidak wajib untuk Three.js, tetapi membantu debugging state scene.

---

# 60. Kode Baseline Terintegrasi

Berikut struktur `main.js` yang dapat digunakan setelah mahasiswa menyelesaikan setiap milestone.

```javascript
import * as THREE
  from "three";

import "./style.css";

const app =
  document.getElementById(
    "app"
  );

const info =
  document.getElementById(
    "info"
  );

// --------------------
// Scene
// --------------------

const scene =
  new THREE.Scene();

scene.background =
  new THREE.Color(
    0x0b1020
  );

// --------------------
// Sizes
// --------------------

const sizes = {
  width:
    window.innerWidth,

  height:
    window.innerHeight
};

// --------------------
// Camera
// --------------------

const camera =
  new THREE.PerspectiveCamera(
    60,
    sizes.width /
      sizes.height,
    0.1,
    100
  );

camera.position.set(
  4,
  3,
  6
);

camera.lookAt(
  0,
  0.5,
  0
);

scene.add(
  camera
);

// --------------------
// Renderer
// --------------------

const renderer =
  new THREE.WebGLRenderer({
    antialias: true
  });

renderer.setSize(
  sizes.width,
  sizes.height
);

renderer.setPixelRatio(
  Math.min(
    window.devicePixelRatio,
    2
  )
);

renderer.shadowMap.enabled =
  true;

app.appendChild(
  renderer.domElement
);

// --------------------
// Cube
// --------------------

const cubeGeometry =
  new THREE.BoxGeometry(
    1,
    1,
    1
  );

const cubeMaterial =
  new THREE.MeshLambertMaterial({
    color: 0x22d3ee
  });

const cube =
  new THREE.Mesh(
    cubeGeometry,
    cubeMaterial
  );

cube.position.set(
  -1.2,
  0.6,
  0
);

cube.castShadow =
  true;

scene.add(
  cube
);

// --------------------
// Sphere
// --------------------

const sphereGeometry =
  new THREE.SphereGeometry(
    0.7,
    32,
    16
  );

const sphereMaterial =
  new THREE.MeshPhongMaterial({
    color: 0x4488ff,
    shininess: 60
  });

const sphere =
  new THREE.Mesh(
    sphereGeometry,
    sphereMaterial
  );

sphere.position.set(
  1.4,
  0.75,
  0
);

sphere.castShadow =
  true;

scene.add(
  sphere
);

// --------------------
// Ground
// --------------------

const groundGeometry =
  new THREE.PlaneGeometry(
    10,
    10
  );

groundGeometry.rotateX(
  -Math.PI / 2
);

const groundMaterial =
  new THREE.MeshLambertMaterial({
    color: 0x334155
  });

const ground =
  new THREE.Mesh(
    groundGeometry,
    groundMaterial
  );

ground.receiveShadow =
  true;

scene.add(
  ground
);

// --------------------
// Lights
// --------------------

const ambientLight =
  new THREE.AmbientLight(
    0xffffff,
    0.35
  );

scene.add(
  ambientLight
);

const directionalLight =
  new THREE.DirectionalLight(
    0xffffff,
    2.0
  );

directionalLight
  .position
  .set(
    3,
    5,
    2
  );

directionalLight.castShadow =
  true;

directionalLight
  .shadow
  .mapSize
  .set(
    1024,
    1024
  );

directionalLight
  .shadow
  .camera
  .left = -5;

directionalLight
  .shadow
  .camera
  .right = 5;

directionalLight
  .shadow
  .camera
  .top = 5;

directionalLight
  .shadow
  .camera
  .bottom = -5;

directionalLight
  .shadow
  .camera
  .near = 0.5;

directionalLight
  .shadow
  .camera
  .far = 20;

scene.add(
  directionalLight
);

// --------------------
// Resize
// --------------------

window.addEventListener(
  "resize",
  () => {
    sizes.width =
      window.innerWidth;

    sizes.height =
      window.innerHeight;

    camera.aspect =
      sizes.width /
      sizes.height;

    camera
      .updateProjectionMatrix();

    renderer.setSize(
      sizes.width,
      sizes.height
    );

    renderer.setPixelRatio(
      Math.min(
        window.devicePixelRatio,
        2
      )
    );
  }
);

// --------------------
// Animation
// --------------------

const clock =
  new THREE.Clock();

let elapsed =
  0;

function animate() {
  requestAnimationFrame(
    animate
  );

  const delta =
    Math.min(
      clock.getDelta(),
      0.05
    );

  elapsed +=
    delta;

  cube.rotation.x +=
    0.35 * delta;

  cube.rotation.y +=
    0.8 * delta;

  sphere.rotation.y +=
    0.5 * delta;

  sphere.position.y =
    0.75
    +
    Math.sin(
      elapsed * 2
    ) * 0.15;

  info.textContent =
    `Objects: ${scene.children.length} | ` +
    `Camera: ` +
    `${camera.position.x.toFixed(1)}, ` +
    `${camera.position.y.toFixed(1)}, ` +
    `${camera.position.z.toFixed(1)}`;

  renderer.render(
    scene,
    camera
  );
}

animate();
```

---

# 61. Milestone 1 — Project Setup

Target:

```text
Vite berjalan
+
Three.js ter-install
+
tidak ada error Console
```

Checklist:

- [ ] `npm install` berhasil;
- [ ] `npm install three` berhasil;
- [ ] `npm run dev` berjalan;
- [ ] browser membuka project;
- [ ] `import * as THREE from "three"` berhasil.

---

# 62. Milestone 2 — Scene + Camera + Renderer

Buat:

```text
Scene
+
PerspectiveCamera
+
WebGLRenderer
```

Target:

> browser menampilkan background scene melalui Canvas Three.js.

---

# 63. Milestone 3 — Cube

Tambahkan:

```text
BoxGeometry
+
MeshBasicMaterial
+
Mesh
```

Target:

> satu cube terlihat tanpa Light.

Hal ini penting untuk menunjukkan:

```text
MeshBasicMaterial
→ tidak membutuhkan Light
```

---

# 64. Milestone 4 — Transform

Ubah:

```text
position
rotation
scale
```

Contoh:

```javascript
cube.position.x = -1;

cube.rotation.y =
  Math.PI / 4;

cube.scale.set(
  1.2,
  0.8,
  1.2
);
```

Hubungkan kembali dengan Model Matrix.

---

# 65. Milestone 5 — Sphere + Lighting Material

Tambahkan:

```text
SphereGeometry
+
MeshPhongMaterial
```

Sebelum Light ditambahkan, amati hasilnya.

Kemudian tambahkan Light.

---

# 66. Milestone 6 — Ground

Tambahkan:

```text
PlaneGeometry
+
MeshLambertMaterial
```

Rotate plane menjadi ground.

Target:

> scene mulai memiliki spatial reference.

---

# 67. Milestone 7 — Light

Tambahkan:

```text
AmbientLight
+
DirectionalLight
```

Target:

> sphere dan ground merespons lighting.

Kemudian ganti cube dari `MeshBasicMaterial` menjadi material yang merespons light.

---

# 68. Milestone 8 — Shadow

Aktifkan:

```text
Renderer Shadow
+
Light Cast Shadow
+
Mesh Cast Shadow
+
Ground Receive Shadow
```

Target:

> shadow cube/sphere terlihat pada ground.

---

# 69. Milestone 9 — Animation

Gunakan:

```text
requestAnimationFrame()
+
THREE.Clock
+
delta time
```

Target:

- cube berputar;
- sphere bergerak/berputar;
- animation speed tidak bergantung langsung pada jumlah frame.

---

# 70. Milestone 10 — Responsive Rendering

Tambahkan resize handler.

Target:

> scene tidak terdistorsi ketika ukuran browser berubah.

---

# 71. Eksperimen Wajib 1 — WebGL vs Three.js

Identifikasi kode Three.js untuk konsep berikut:

```text
Scene
Camera
Geometry
Material
Mesh
Transform
Light
Renderer
```

Kemudian tulis padanan konsep WebGL yang sudah dipelajari.

Tujuan:

> memahami bahwa Three.js adalah abstraction, bukan sistem grafika yang tidak berhubungan dengan WebGL.

---

# 72. Eksperimen Wajib 2 — Geometry Segment

Bandingkan:

```javascript
new THREE.SphereGeometry(
  0.7,
  8,
  6
);
```

dengan:

```javascript
new THREE.SphereGeometry(
  0.7,
  32,
  16
);
```

dan:

```javascript
new THREE.SphereGeometry(
  0.7,
  64,
  32
);
```

Amati:

- kehalusan bentuk;
- jumlah vertex;
- jumlah polygon secara relatif.

Gunakan:

```javascript
console.log(
  sphereGeometry
    .attributes
    .position
    .count
);
```

---

# 73. Eksperimen Wajib 3 — Material Tanpa Light

Gunakan pada cube:

```javascript
new THREE.MeshBasicMaterial(...)
```

Matikan atau hapus Light.

Kemudian bandingkan dengan:

```javascript
new THREE.MeshLambertMaterial(...)
```

Pertanyaan:

> mengapa hasil kedua material berbeda?

---

# 74. Eksperimen Wajib 4 — MeshNormalMaterial

Ganti sementara material sphere:

```javascript
const material =
  new THREE.MeshNormalMaterial();
```

Amati warna permukaan.

Hubungkan dengan konsep normal pada Pertemuan 5.

Pertanyaan:

> mengapa warna berubah mengikuti orientasi surface?

---

# 75. Eksperimen Wajib 5 — Lambert vs Phong

Bandingkan:

```text
MeshLambertMaterial
vs
MeshPhongMaterial
```

pada SphereGeometry yang sama.

Amati terutama highlight.

Hubungkan dengan:

```text
Diffuse
vs
Diffuse + Specular-like Highlight
```

---

# 76. Eksperimen Wajib 6 — Transform

Ubah object:

```javascript
cube.position.set(
  -2,
  0.7,
  0
);

cube.rotation.set(
  0.3,
  0.8,
  0
);

cube.scale.set(
  1.5,
  0.7,
  1.0
);
```

Jawab:

1. apakah vertex buffer perlu kita ubah manual?
2. siapa yang mengelola Model Matrix?
3. bagaimana konsep ini berhubungan dengan Pertemuan 3?

---

# 77. Eksperimen Wajib 7 — Light Intensity

Bandingkan DirectionalLight intensity:

```text
0.3
1.0
2.0
4.0
```

Amati perubahan scene.

Kemudian ubah AmbientLight intensity.

Jelaskan perbedaan kontribusi keduanya secara visual.

---

# 78. Eksperimen Wajib 8 — Shadow

Bandingkan:

```javascript
renderer.shadowMap.enabled =
  false;
```

dengan:

```javascript
renderer.shadowMap.enabled =
  true;
```

Kemudian coba:

```javascript
cube.castShadow =
  false;
```

dan:

```javascript
ground.receiveShadow =
  false;
```

Tujuan:

> memahami bahwa shadow membutuhkan konfigurasi pada renderer, light, caster, dan receiver.

---

# 79. Eksperimen Wajib 9 — Camera FOV

Bandingkan:

```text
35°
60°
90°
```

Contoh:

```javascript
camera.fov =
  35;

camera
  .updateProjectionMatrix();
```

Hubungkan hasil dengan materi Projection pada Pertemuan 4.

---

# 80. Eksperimen Wajib 10 — Responsive Rendering

Resize browser menjadi:

```text
lebar
sempit
tinggi
```

Pastikan object tidak terdistorsi.

Untuk eksperimen, comment sementara:

```javascript
camera
  .updateProjectionMatrix();
```

Resize lagi.

Amati kesalahan yang terjadi.

Setelah itu aktifkan kembali.

---

# 81. Eksperimen Wajib 11 — Delta Time

Bandingkan:

```javascript
cube.rotation.y +=
  0.01;
```

dengan:

```javascript
cube.rotation.y +=
  0.8 * delta;
```

Jelaskan:

> mengapa versi delta time lebih tepat untuk menyatakan kecepatan rotasi?

---

# 82. Tugas Utama

Bangun:

# Mini 3D Scene dengan Three.js

Requirement minimum:

- [ ] project menggunakan Node.js + Vite;
- [ ] dependency `three`;
- [ ] `Scene`;
- [ ] background scene;
- [ ] `PerspectiveCamera`;
- [ ] camera position;
- [ ] `camera.lookAt()`;
- [ ] `WebGLRenderer`;
- [ ] antialias;
- [ ] renderer size;
- [ ] pixel ratio dibatasi;
- [ ] minimal `BoxGeometry`;
- [ ] minimal `SphereGeometry`;
- [ ] `PlaneGeometry` sebagai ground;
- [ ] minimal dua jenis material;
- [ ] minimal satu material yang merespons light;
- [ ] `Mesh`;
- [ ] minimal tiga Mesh;
- [ ] penggunaan position;
- [ ] penggunaan rotation;
- [ ] penggunaan scale;
- [ ] `AmbientLight`;
- [ ] `DirectionalLight`;
- [ ] shadow aktif;
- [ ] minimal dua object `castShadow`;
- [ ] ground `receiveShadow`;
- [ ] animation loop;
- [ ] `requestAnimationFrame()`;
- [ ] delta time;
- [ ] responsive renderer;
- [ ] camera aspect diperbarui saat resize;
- [ ] `updateProjectionMatrix()`;
- [ ] HUD atau informasi scene sederhana;
- [ ] tidak ada error Console pada penggunaan normal;
- [ ] minimal dua challenge.

---

# 83. Challenge A — Tambah Geometry

Tambahkan minimal dua geometry:

```text
CylinderGeometry
ConeGeometry
TorusGeometry
```

Setiap geometry harus memiliki:

- material;
- transform;
- posisi yang tidak saling bertabrakan.

---

# 84. Challenge B — Material Gallery

Buat beberapa object dengan geometry sama tetapi material berbeda:

```text
MeshBasicMaterial
MeshNormalMaterial
MeshLambertMaterial
MeshPhongMaterial
```

Susun berjajar agar perbedaannya mudah dibandingkan.

---

# 85. Challenge C — OrthographicCamera

Buat mode camera kedua menggunakan:

```javascript
THREE.OrthographicCamera
```

Tambahkan tombol:

```text
P
```

untuk berpindah:

```text
Perspective
↔
Orthographic
```

Pastikan projection tetap responsif ketika window resize.

---

# 86. Challenge D — Light Animation

Buat DirectionalLight atau object visual penanda light bergerak.

Contoh:

```javascript
directionalLight
  .position
  .x =
    Math.cos(elapsed)
    * 4;

directionalLight
  .position
  .z =
    Math.sin(elapsed)
    * 4;
```

Amati perubahan shading dan shadow.

---

# 87. Challenge E — Shadow Quality

Bandingkan:

```text
512 × 512
1024 × 1024
2048 × 2048
```

untuk shadow map.

Jelaskan trade-off:

```text
quality
vs
resource cost
```

Tidak perlu menggunakan ukuran ekstrem.

---

# 88. Challenge F — Scene Information

Perluas HUD dengan:

```text
Camera Position
Object Count
Triangle Count
FPS sederhana
Material aktif
```

Untuk renderer statistics, eksplorasi:

```javascript
renderer.info
```

Challenge ini digunakan untuk menghubungkan abstraction Three.js dengan pekerjaan rendering di belakang layar.

---

# 89. Challenge G — Toggle Animation

Tambahkan event-based keyboard:

```text
Space
→ pause / resume animation
```

Gunakan state boolean:

```javascript
let animationEnabled =
  true;
```

Perubahan toggle cukup dilakukan sekali per key press.

---

# 90. Challenge H — Continuous Object Control

Tambahkan state-based keyboard input:

```text
Arrow
→ move cube

Q/E
→ rotate cube
```

Gunakan delta time.

Ini mengulang konsep input dari praktikum sebelumnya:

```text
Event-Based
→ toggle

State-Based
→ continuous movement
```

---

# 91. Debugging — Module Tidak Ditemukan

Jika muncul error seperti:

```text
Failed to resolve import "three"
```

periksa:

```bash
npm install
npm install three
```

Pastikan terminal berada di root project.

---

# 92. Debugging — Canvas Kosong

Periksa:

1. `scene` dibuat?
2. camera benar?
3. renderer sudah ditambahkan ke DOM?
4. geometry dibuat?
5. material dibuat?
6. mesh dibuat?
7. mesh sudah `scene.add()`?
8. camera menghadap object?
9. `renderer.render(scene,camera)` dipanggil?
10. Console memiliki error?

---

# 93. Debugging — Object Hitam

Jika menggunakan:

```text
MeshLambertMaterial
MeshPhongMaterial
```

periksa apakah Light sudah ada.

Bandingkan dengan:

```text
MeshBasicMaterial
```

Jika Basic terlihat tetapi Lambert/Phong tidak, kemungkinan masalah ada pada lighting.

---

# 94. Debugging — Ground Tidak Terlihat

PlaneGeometry default berada pada XY plane.

Untuk ground:

```javascript
groundGeometry.rotateX(
  -Math.PI / 2
);
```

Periksa juga camera dan posisi ground.

---

# 95. Debugging — Shadow Tidak Muncul

Periksa seluruh rantai:

```text
renderer.shadowMap.enabled
        ↓
light.castShadow
        ↓
mesh.castShadow
        ↓
ground.receiveShadow
```

Selain itu:

- material harus sesuai;
- object harus berada dalam shadow camera;
- light harus mengarah/berkontribusi pada scene.

---

# 96. Debugging — Scene Distorsi Saat Resize

Pastikan:

```javascript
camera.aspect =
  width / height;

camera
  .updateProjectionMatrix();

renderer.setSize(
  width,
  height
);
```

Ketiganya penting.

---

# 97. Debugging — Animasi Terlalu Cepat

Jika menggunakan:

```javascript
rotation += 0.01;
```

kecepatan dinyatakan per frame.

Gunakan:

```javascript
rotation +=
  speed * delta;
```

agar kecepatan dinyatakan per detik.

---

# 98. Debugging — Shadow Terpotong

Periksa batas:

```text
directionalLight.shadow.camera
```

Jika object berada di luar shadow camera, shadow dapat hilang.

Perbesar volume secara masuk akal.

---

# 99. Test Case

| No. | Pengujian | Hasil yang Diharapkan |
|---:|---|---|
| 1 | `npm run dev` | Project berjalan |
| 2 | Load scene | Canvas dan background tampil |
| 3 | Camera | Seluruh scene terlihat |
| 4 | Cube | Cube tampil |
| 5 | Sphere | Sphere tampil |
| 6 | Ground | Ground horizontal tampil |
| 7 | Transform | Position/rotation/scale bekerja |
| 8 | Basic Material | Tetap terlihat tanpa light |
| 9 | Lambert/Phong | Merespons light |
| 10 | AmbientLight | Pencahayaan dasar terlihat |
| 11 | DirectionalLight | Arah shading terlihat |
| 12 | Shadow | Shadow jatuh ke ground |
| 13 | Animation | Object bergerak kontinu |
| 14 | Delta time | Kecepatan stabil |
| 15 | Resize | Aspect tidak terdistorsi |
| 16 | Console | Tidak ada error normal |

---

# 100. Pertanyaan Pemahaman

Jawab menggunakan kalimat sendiri.

1. Apa hubungan Three.js dan WebGL?
2. Mengapa Three.js disebut high-level library?
3. Apakah Three.js menghilangkan konsep buffer dan shader?
4. Apa fungsi Scene?
5. Apa komponen minimum agar Mesh dapat terlihat?
6. Apa fungsi PerspectiveCamera?
7. Apa arti FOV?
8. Apa fungsi aspect ratio?
9. Apa fungsi near dan far?
10. Apa fungsi `camera.lookAt()`?
11. Apa fungsi WebGLRenderer?
12. Apa itu `renderer.domElement`?
13. Apa fungsi Geometry?
14. Apa hubungan BufferGeometry dengan vertex buffer?
15. Attribute apa yang umum tersedia pada BufferGeometry?
16. Apa fungsi Material?
17. Apa karakter `MeshBasicMaterial`?
18. Apa fungsi `MeshNormalMaterial`?
19. Apa karakter `MeshLambertMaterial`?
20. Apa karakter `MeshPhongMaterial`?
21. Apa hubungan Geometry + Material + Mesh?
22. Apa fungsi `scene.add()`?
23. Apa fungsi `position`?
24. Apa fungsi `rotation`?
25. Apa fungsi `scale`?
26. Bagaimana transform Three.js berhubungan dengan Model Matrix?
27. Apa itu `Object3D`?
28. Apa fungsi AmbientLight?
29. Apa fungsi DirectionalLight?
30. Mengapa material tertentu membutuhkan Light?
31. Apa fungsi shadow?
32. Apa arti `castShadow`?
33. Apa arti `receiveShadow`?
34. Mengapa renderer shadow map harus diaktifkan?
35. Apa fungsi animation loop?
36. Mengapa menggunakan `requestAnimationFrame()`?
37. Apa fungsi delta time?
38. Mengapa renderer harus responsif?
39. Mengapa camera aspect harus diperbarui saat resize?
40. Mengapa `updateProjectionMatrix()` diperlukan?

---

# 101. Pertanyaan Analisis

## A — Abstraction

Bandingkan kode WebGL manual untuk membuat cube dengan:

```javascript
new THREE.Mesh(
  geometry,
  material
);
```

Apa pekerjaan yang disederhanakan Three.js?

## B — Material

Mengapa:

```text
MeshBasicMaterial
```

dapat terlihat tanpa Light, sedangkan:

```text
MeshLambertMaterial
```

membutuhkan Light?

## C — Geometry

Mengapa meningkatkan segment SphereGeometry membuat object lebih halus tetapi juga menambah beban geometry?

## D — Transform

Ketika menulis:

```javascript
mesh.position.x = 2;
```

apakah vertex asli harus diubah satu per satu?

Jelaskan hubungannya dengan Model Matrix.

## E — Shadow

Mengapa shadow memerlukan konfigurasi lebih dari sekadar menambahkan Light?

## F — Responsive Rendering

Apa yang terjadi jika renderer resize tetapi aspect camera tidak diperbarui?

---

# 102. README

`README.md` minimal berisi:

```text
Nama
NRP
Judul Praktikum
Deskripsi Scene
Daftar Geometry
Daftar Material
Daftar Light
Konfigurasi Shadow
Animasi yang Dibuat
Challenge yang Dikerjakan
Cara Menjalankan
Kontrol Keyboard jika ada
Catatan Debugging
```

Contoh cara menjalankan:

```bash
npm install
npm run dev
```

---

# 103. Output Pengumpulan

Struktur minimum:

```text
praktikum-threejs-06/
├── index.html
├── package.json
├── package-lock.json
├── src/
│   ├── main.js
│   └── style.css
├── README.md
└── screenshot.png
```

Jangan mengumpulkan:

```text
node_modules/
```

karena dependency dapat di-install kembali dengan:

```bash
npm install
```

Jika diminta:

```text
demo.mp4
```

---

# 104. Checklist Sebelum Pengumpulan

Pastikan:

- [ ] project dapat dijalankan dari awal dengan `npm install`;
- [ ] `npm run dev` berhasil;
- [ ] Scene tampil;
- [ ] Camera benar;
- [ ] Renderer benar;
- [ ] minimal tiga Mesh;
- [ ] BoxGeometry;
- [ ] SphereGeometry;
- [ ] PlaneGeometry;
- [ ] minimal dua Material;
- [ ] transform digunakan;
- [ ] AmbientLight;
- [ ] DirectionalLight;
- [ ] shadow terlihat;
- [ ] animation loop berjalan;
- [ ] delta time digunakan;
- [ ] responsive rendering bekerja;
- [ ] tidak ada error Console;
- [ ] minimal dua challenge;
- [ ] README lengkap;
- [ ] screenshot tersedia.

---

# 105. Refleksi Praktikum

Tuliskan 5–7 kalimat mengenai:

1. perbedaan pengalaman menggunakan WebGL manual dan Three.js;
2. abstraction Three.js yang paling membantu;
3. hubungan Geometry dengan vertex data;
4. hubungan Material dengan shader/lighting;
5. konfigurasi shadow yang paling mudah terlupa;
6. manfaat delta time;
7. masalah debugging yang ditemukan.

---

# 106. Hubungan dengan Pertemuan Berikutnya

Pada Pertemuan 6 kita membangun struktur dasar:

```text
Scene
├── Camera
├── Mesh
│   ├── Geometry
│   └── Material
└── Light
       ↓
Renderer
```

Pertemuan berikutnya akan mengembangkan fondasi ini menjadi:

# Three.js Interactive 3D Application

Fokus akan bergeser dari sekadar membangun scene menuju aplikasi 3D yang lebih interaktif dan terstruktur.

---

# 107. Ringkasan Praktikum

Three.js menyederhanakan pekerjaan low-level WebGL tanpa menghapus konsep grafika komputer yang mendasarinya.

Benang merah:

```text
WebGL Fundamental
        ↓
Three.js Abstraction
        ↓
Scene
├── Camera
├── Mesh
│   ├── Geometry
│   └── Material
└── Light
        ↓
Animation Loop
        ↓
WebGLRenderer
        ↓
Canvas
```

Pada praktikum ini mahasiswa mengimplementasikan:

- project Node.js + Vite + Three.js;
- Scene;
- PerspectiveCamera;
- WebGLRenderer;
- BoxGeometry;
- SphereGeometry;
- PlaneGeometry;
- BufferGeometry inspection;
- MeshBasicMaterial;
- MeshLambertMaterial;
- MeshPhongMaterial;
- Mesh;
- position;
- rotation;
- scale;
- AmbientLight;
- DirectionalLight;
- shadow;
- animation loop;
- delta time;
- responsive rendering.

Aplikasi akhir:

# Mini 3D Scene dengan Three.js

menjadi fondasi untuk membangun aplikasi Three.js yang lebih interaktif pada Pertemuan 7.
