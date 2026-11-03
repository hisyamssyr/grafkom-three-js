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

## Dokumentasi Eksperimen Wajib

Eksperimen Wajib 1–11 dikerjakan di atas kode baseline (Milestone 1–10). Perubahan kode yang bersifat sementara dikembalikan ke kondisi baseline setelah pengamatan, sehingga kode akhir tetap memakai konfigurasi awal: cube `MeshLambertMaterial`, sphere `MeshPhongMaterial`, ground `MeshLambertMaterial`, `SphereGeometry(0.7, 32, 16)`, FOV 60, shadow aktif, dan animasi berbasis delta time.

### Eksperimen Wajib 1 — WebGL vs Three.js

Tujuan: memetakan konsep Three.js pada project ini ke padanan WebGL.

| Konsep | Implementasi Three.js | Padanan WebGL |
|---|---|---|
| Scene | `new THREE.Scene()` | Tidak ada API tunggal; scene graph yang menentukan object mana yang digambar, matriks world, dan visibility |
| Camera | `new THREE.PerspectiveCamera(...)`, `camera.lookAt()` | Matriks view (lookAt) dan projection (perspective) yang dikirim sebagai uniform ke vertex shader, lalu perspektif dibagi `w` |
| Geometry | `BoxGeometry`, `SphereGeometry`, `PlaneGeometry` | VBO/VAO untuk atribut `position`, `normal`, `uv`; EBO untuk index; digambar dengan `drawElements()` |
| Material | `MeshLambertMaterial`, `MeshPhongMaterial`, `MeshBasicMaterial` | Program shader, uniform (warna, intensitas, tekstur), dan state render (depth test, cull, blend) |
| Mesh | `new THREE.Mesh(geometry, material)` | Satu draw call: bind VAO dan program, set uniform, lalu draw |
| Transform | `position`, `rotation`, `scale` | Model matrix (T × R × S) sebagai uniform; vertex diubah di vertex shader |
| Light | `AmbientLight`, `DirectionalLight` | Uniform data light (arah/posisi, warna, intensitas) yang dipakai perhitungan lighting di fragment shader |
| Renderer | `new THREE.WebGLRenderer()` | Konteks WebGL: kompilasi shader, viewport, clear buffer, framebuffer/shadow map, dan pemanggilan draw call |

Kesimpulan: Three.js tidak menghilangkan buffer dan shader. Three.js adalah abstraction yang membangkitkan dan mengelola VBO, program shader, uniform, serta draw call di balik API tingkat tinggi.

### Eksperimen Wajib 2 — Geometry Segment

Prosedur: nilai `SphereGeometry` diubah sementara, lalu jumlah vertex diukur dengan:

```javascript
console.log(sphereGeometry.attributes.position.count);
```

Hasil pengukuran untuk radius `0.7`:

| Segment (width × height) | Vertex (`position.count`) | Index | Triangle (`index.count / 3`) | Pengamatan visual |
|---|---:|---:|---:|---|
| 8 × 6 | 63 | 240 | 80 | Terlihat kasar/faceted, siluet sphere terlihat poligonal |
| 32 × 16 (baseline) | 561 | 2.880 | 960 | Cukup halus, bentuk sphere sudah meyakinkan |
| 64 × 32 | 2.145 | 11.904 | 3.968 | Sangat halus, tetapi jumlah vertex dan triangle jauh lebih besar |

Jumlah vertex mengikuti `(widthSegments + 1) × (heightSegments + 1)`. Jumlah triangle pada index buffer mengikuti `2 × widthSegments × (heightSegments − 1)`.

Jawaban: menambah segment membuat permukaan sphere lebih halus karena siluet dan interpolasi normal antar-vertex menjadi lebih rapat. Konsekuensinya, jumlah vertex, triangle, dan biaya pemrosesan juga meningkat. Peningkatan dari 32 × 16 ke 64 × 32 melipatgandakan detail, tetapi selisih visualnya tidak sebesar selisih biaya geometry-nya (diminishing returns).

### Eksperimen Wajib 3 — Material Tanpa Light

Prosedur: material cube diganti sementara menjadi:

```javascript
const cubeMaterial = new THREE.MeshBasicMaterial({
  color: 0x22d3ee,
});
```

Kemudian intensity kedua light dibuat nol:

```javascript
ambientLight.intensity = 0;
directionalLight.intensity = 0;
```

Hasil pengamatan:

- Cube dengan `MeshBasicMaterial` tetap terlihat berwarna cyan dan terang tanpa light.
- Cube dengan `MeshLambertMaterial` menjadi hitam saat tidak ada light.
- Jika hanya `AmbientLight` yang dinyalakan, cube Lambert terlihat rata tanpa shading arah.
- `MeshBasicMaterial` tidak terpengaruh arah cahaya dan tidak menerima shadow.

Jawaban: `MeshBasicMaterial` tidak melakukan perhitungan lighting; warnanya langsung dikeluarkan sebagai output. `MeshLambertMaterial` menghitung komponen diffuse dari normal permukaan dan arah light. Tanpa light, kontribusi diffuse bernilai nol sehingga permukaan menjadi hitam. Itulah sebabnya hasil kedua material berbeda.

### Eksperimen Wajib 4 — MeshNormalMaterial

Prosedur: material sphere diganti sementara menjadi:

```javascript
const sphereMaterial = new THREE.MeshNormalMaterial();
```

Hasil pengamatan: sphere menampilkan gradasi warna yang mengikuti orientasi permukaan. Arah normal yang berbeda menghasilkan warna berbeda, misalnya komponen sumbu X dominan tampak kemerahan, sumbu Y dominan kehijauan, dan sumbu Z dominan kebiruan. Material ini tetap terlihat tanpa light. Karena warna dihitung dari normal di view space, pola warna ikut berubah ketika camera diputar. Pada sphere yang simetris, memutar object tidak mengubah pola warna yang terlihat dari camera.

Jawaban: `MeshNormalMaterial` mengubah vektor normal tiap permukaan menjadi warna RGB (rentang normal −1..1 dipetakan ke 0..1). Orientasi surface menentukan arah normal, sehingga warna permukaan berubah mengikuti orientasi tersebut. Ini menghubungkan kembali konsep normal pada Pertemuan 5: normal adalah vektor tegak lurus permukaan yang menjadi dasar perhitungan shading.

### Eksperimen Wajib 5 — Lambert vs Phong

Prosedur: sphere yang sama diberi material `MeshLambertMaterial`, diamati, lalu dikembalikan ke `MeshPhongMaterial` dengan `shininess: 60`.

Hasil pengamatan:

- `MeshLambertMaterial`: permukaan tampak matte/diffuse, tidak ada highlight tajam.
- `MeshPhongMaterial`: terdapat highlight terang (specular) di area yang memantulkan light ke arah camera; ukuran dan ketajaman highlight dipengaruhi `shininess`.

Jawaban: Lambert hanya menghitung komponen diffuse, sehingga hasilnya rata dan tanpa kilau. Phong menghitung diffuse ditambah komponen specular (model Phong/Blinn-Phong) yang bergantung pada arah light, arah pandang, dan `shininess`. Karena itu Phong menghasilkan highlight, sedangkan Lambert tidak. Pada project ini sphere memakai Phong agar perbedaan tersebut terlihat, sedangkan cube dan ground memakai Lambert agar tampak matte.

### Eksperimen Wajib 6 — Transform

Prosedur: transform cube diubah sementara menjadi:

```javascript
cube.position.set(-2, 0.7, 0);
cube.rotation.set(0.3, 0.8, 0);
cube.scale.set(1.5, 0.7, 1.0);
```

Hasil pengamatan: cube berpindah ke sisi kiri, sedikit terangkat, tampak lebih lebar dan pipih, serta miring pada sumbu X dan Y. Sphere dan ground tidak berubah. Animasi tetap menambahkan rotasi pada sumbu Y setiap frame mulai dari orientasi awal tersebut.

Jawaban:

1. Vertex buffer tidak perlu diubah manual. `BoxGeometry` tetap menyimpan posisi vertex yang sama; yang berubah hanya transform object.
2. Model Matrix dikelola oleh `Object3D` milik Three.js. Nilai `position`, `rotation` (quaternion), dan `scale` dikomposisikan menjadi matriks lokal, lalu digabung dengan transform parent menjadi `matrixWorld` saat renderer memperbarui scene graph.
3. Konsep ini sama dengan materi transformasi pada Pertemuan 3: vertex lokal dipetakan ke world space melalui model matrix (urutan T × R × S) menggunakan koordinat homogen. Transformasi dilakukan sekali di GPU untuk seluruh vertex, bukan dengan mengubah data geometry satu per satu.

### Eksperimen Wajib 7 — Light Intensity

Prosedur: `DirectionalLight` intensity diubah bertahap, lalu `AmbientLight` juga diubah. Nilai baseline project adalah ambient `0.35` dan directional `2.0`.

Hasil pengamatan `DirectionalLight`:

| Intensity | Pengamatan |
|---:|---|
| 0.3 | Scene redup; sisi yang menghadap light hanya sedikit lebih terang; shadow samar |
| 1.0 | Pencahayaan sedang; shading arah dan shadow mulai jelas |
| 2.0 | Baseline; sisi terang cukup terang, kontras dengan area shadow terlihat jelas |
| 4.0 | Terlalu terang/overexposed; warna mendekati putih, highlight Phong membludak, kontras ekstrem |

Hasil pengamatan `AmbientLight`: menaikkan intensity ambient membuat seluruh object dan area shadow lebih terang serta menurunkan kontras. Menurunkan ambient membuat area shadow makin gelap. Ambient tidak menghasilkan arah shading maupun shadow baru.

Jawaban: `DirectionalLight` memberi pencahayaan berarah sehingga membentuk gradasi terang-gelap, highlight, dan shadow dengan kontras yang jelas. `AmbientLight` memberi pencahayaan dasar merata ke semua permukaan sehingga mengangkat area gelap dan mengurangi kontras. Kombinasi keduanya membuat scene tidak sepenuhnya hitam di area shadow, tetapi tetap memiliki arah cahaya.

### Eksperimen Wajib 8 — Shadow

Prosedur: konfigurasi shadow diubah satu per satu.

| Perubahan | Hasil |
|---|---|
| `renderer.shadowMap.enabled = false` | Semua shadow hilang |
| `renderer.shadowMap.enabled = true` | Shadow kembali tampil |
| `cube.castShadow = false` | Cube tidak lagi menimbulkan shadow; shadow sphere tetap ada |
| `ground.receiveShadow = false` | Tidak ada shadow yang tampil di ground, meskipun shadow map tetap dibuat |

Jawaban: shadow bukan efek yang otomatis muncul hanya karena ada light. Diperlukan konfigurasi pada empat pihak: renderer harus mengaktifkan shadow map, light harus memiliki `castShadow = true` dan shadow camera yang mencakup object, object harus memiliki `castShadow = true`, dan permukaan penerima harus memiliki `receiveShadow = true`. Jika salah satu konfigurasi tidak aktif, shadow tidak akan terlihat.

### Eksperimen Wajib 9 — Camera FOV

Prosedur: nilai `camera.fov` diubah sementara menjadi 35, 60, dan 90, lalu `camera.updateProjectionMatrix()` dipanggil setiap kali nilai diubah.

Hasil pengamatan:

| FOV | Pengamatan |
|---:|---|
| 35° | Pandangan menyempit seperti zoom; object tampak lebih besar; kedalaman terasa lebih padat |
| 60° | Baseline; keseimbangan antara luas pandangan dan distorsi perspektif |
| 90° | Pandangan sangat luas; object tampak lebih kecil; distorsi perspektif di tepi layar lebih kuat |

Jawaban: FOV menentukan sudut frustum vertikal pada projection matrix. FOV kecil memperbesar object pada layar dan mengurangi cakupan scene, sedangkan FOV besar menampilkan lebih banyak scene dengan distorsi perspektif yang lebih kuat. Perubahan FOV harus diikuti `updateProjectionMatrix()` karena projection matrix tidak dihitung ulang secara otomatis. Ini berhubungan dengan materi projection pada Pertemuan 4.

### Eksperimen Wajib 10 — Responsive Rendering

Prosedur: baris `camera.updateProjectionMatrix()` di dalam resize handler dinonaktifkan sementara, lalu browser di-resize ke ukuran lebar, sempit, dan tinggi.

Hasil pengamatan: canvas mengikuti ukuran window dan `camera.aspect` diperbarui, tetapi object menjadi terdistorsi (tertarik memanjang atau memipih) karena projection matrix masih memakai aspect lama. Setelah `updateProjectionMatrix()` diaktifkan kembali, proporsi object kembali normal pada berbagai ukuran window.

Jawaban: `camera.aspect` hanyalah nilai input. Projection matrix baru memperhitungkan nilai tersebut setelah `updateProjectionMatrix()` dipanggil. Tanpa pemanggilan itu, rasio aspect di layar dan rasio pada matrix tidak sama, sehingga scene tampak teregang. Karena itu resize handler harus memperbarui ukuran renderer, `camera.aspect`, dan memanggil `updateProjectionMatrix()`.

### Eksperimen Wajib 11 — Delta Time

Prosedur: rotasi cube dibandingkan antara penambahan tetap:

```javascript
cube.rotation.y += 0.01;
```

dengan versi delta time yang dipakai project:

```javascript
cube.rotation.y += 0.8 * delta;
```

Hasil pengamatan: dengan penambahan tetap, kecepatan rotasi bergantung pada frame rate. Pada 60 FPS kecepatannya sekitar `0.6 rad/detik`, sedangkan pada 144 FPS menjadi sekitar `1.44 rad/detik`. Dengan delta time, kecepatan rotasi tetap sekitar `0.8 rad/detik` pada frame rate berapa pun. Project ini juga membatasi delta dengan `Math.min(timer.getDelta(), 0.05)` agar object tidak melompat jauh setelah tab tidak aktif.

Jawaban: delta time menyatakan durasi frame dalam satuan detik. Dengan mengalikan kecepatan sudut (rad/detik) dengan delta, perubahan rotasi per frame menyesuaikan interval waktu yang benar-benar berlalu. Versi penambahan tetap menyatakan perubahan per frame, bukan per detik, sehingga kecepatan animasi berubah ketika frame rate berubah. Karena itu versi delta time lebih tepat untuk menyatakan kecepatan rotasi.

### Ringkasan

Seluruh eksperimen wajib 1–11 telah didokumentasikan. Temuan utama: Three.js adalah abstraction di atas WebGL; detail geometry, material, lighting, shadow, camera, dan animasi dikendalikan melalui API tingkat tinggi, tetapi konsep dasarnya (vertex buffer, shader, matriks transformasi, projection, dan delta time) tetap sama dengan materi WebGL dan grafika komputer sebelumnya.
