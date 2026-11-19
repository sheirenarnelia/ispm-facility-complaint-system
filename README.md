# 🏢 Campus Facility Complaint and Service Request System

> **Information Systems Agile Project Management with DevOps (IS 2026)**  
> **Dosen Pengampu:** Eka Parima Saragih, S.Kom., M.Kom.  
> **Studi Kasus:** Case 4 - Facility Complaint and Service Request System  
> **Development Lead:** Sheiren Arnelia (NIM: Mahasiswa President University)

---

## 📌 1. Latar Belakang & Deskripsi Masalah

Pada pengelolaan fasilitas operasional kampus saat ini, proses pelaporan kerusakan sarana prasarana (AC mati, proyektor rusak, kran bocor, perabotan rusak) masih banyak dilakukan secara konvensional melalui pesan WhatsApp informal atau laporan lisan.

**Permasalahan yang dihadapi:**
1. **Pelapor (Mahasiswa / Dosen / Staf):** Tidak dapat memantau status tindak lanjut (*tracking progress*) dari laporan yang telah diajukan.
2. **Unit Pengelola Fasilitas Kampus:** Kesulitan dalam mengorganisasi antrean laporan, menentukan prioritas penanganan (urgensi), mendisposisikan teknisi, serta memantau rekapitulasi keluhan yang belum terselesaikan.

**Solusi Sistem:**
Aplikasi web terpadu untuk pencatatan keluhan fasilitas secara transparan dengan alur status terstruktur (*Submitted* ➔ *In Progress* ➔ *Resolved*), formulir digital dengan bukti foto fisik, dashboard status real-time, dan REST API yang siap diuji serta diintegrasikan ke pipeline CI/CD.

---

## 🛠️ 2. Tech Stack

Arsitektur aplikasi dirancang ringan, cepat dieksekusi, dan mudah dideploy tanpa overhead konfigurasi database eksternal:

| Layer | Teknologi | Alasan Pemilihan |
| :--- | :--- | :--- |
| **Frontend** | HTML5, Tailwind CSS (CDN), Vanilla JavaScript | Cepat dibangun, ringan, tanpa kompilasi rumit, responsif di semua perangkat. |
| **Backend** | Node.js + Express.js | Framework standar industri, performa tinggi, struktur routing REST API bersih. |
| **File Storage** | Multer Storage Engine | Penanganan upload foto fisik kerusakan fasilitas secara lokal/cloud. |
| **Data Layer** | Persistent JSON / In-Memory Mock Store | Siap dijalankan *out-of-the-box* untuk demo lokal, kompatibel migrasi ke Supabase/PostgreSQL. |
| **Automated Test**| Node.js Native Test Runner (`node:test`, `node:assert`) | Ringan, lulus instan, tanpa dependency berat untuk GitHub Actions CI. |
| **CI / DevOps** | GitHub Actions Pipeline | Otomatisasi pengujian linting/unit test pada branch `main` & `dev`. |

---

## 🚀 3. Sprint 1 Deliverables (Evaluasi Kelas 24 Nov 2026)

Untuk evaluasi perdana di kelas pada Selasa, 24 November 2026, sistem telah menyediakan:
- [x] **Formulir Pelaporan Keluhan Fasilitas:**
  - Input: Nama Pelapor, Email/Kontak, Lokasi/Gedung, Detail Ruangan, Kategori Kerusakan, Tingkat Urgensi, Deskripsi Kerusakan.
  - Upload Foto Fisik Kerusakan dengan fitur *live image preview*.
- [x] **Halaman Ringkasan & Daftar Laporan Masuk:**
  - KPI Dashboard Bar (Total Laporan, Submitted, In Progress, Resolved).
  - Tabel interaktif daftar keluhan dengan badge status dan prioritas.
  - Filter pencarian instan berdasarkan nomor tiket, pelapor, dan kategori.
  - Modal detail tiket lengkap dengan preview foto dan simulasi update status teknisi.
- [x] **REST API & Postman Collection:** Siap divalidasi oleh QA Lead (`postman/Facility_Complaint_API.postman_collection.json`).
- [x] **Automated Unit Tests & CI Action:** Siap diverifikasi oleh DevOps Lead (`.github/workflows/ci.yml`).

---

## 💻 4. Panduan Menjalankan Aplikasi Secara Lokal

### Prasyarat
- [Node.js](https://nodejs.org/) versi 18 atau lebih baru.
- [Git](https://git-scm.com/) terpasang di sistem operasi Anda.

### Langkah Instalasi
1. **Clone repositori:**
   ```bash
   git clone https://github.com/<username>/ispm-facility-complaint-system.git
   cd ispm-facility-complaint-system
   ```

2. **Install dependency:**
   ```bash
   npm install
   ```

3. **Jalankan Automated Test (Memastikan sistem normal):**
   ```bash
   npm test
   ```

4. **Jalankan Server Aplikasi:**
   ```bash
   npm start
   ```
   *Atau mode watch development:*
   ```bash
   npm run dev
   ```

5. **Buka di Web Browser:**
   Akses `http://localhost:3000` pada browser favorit Anda.

---

## 📡 5. Spesifikasi REST API Endpoint

| Method | Endpoint | Deskripsi |
| :--- | :--- | :--- |
| `GET` | `/api/health` | Health check status server (DevOps Monitoring) |
| `GET` | `/api/complaints/stats/summary` | Mengambil agregat statistik total keluhan & status |
| `GET` | `/api/complaints` | Mengambil seluruh daftar keluhan (mendukung query `?status=...&category=...&search=...`) |
| `GET` | `/api/complaints/:id` | Mengambil data detail keluhan berdasarkan ID Tiket |
| `POST`| `/api/complaints` | Mengirimkan formulir keluhan baru (mendukung upload file `photo`) |
| `PATCH`| `/api/complaints/:id/status`| Mengubah status pengerjaan tiket (*Submitted / In Progress / Resolved*) |

---

## 🌿 6. Git Branching Strategy & Aturan Kolaborasi Tim

Untuk menjaga kualitas kode dan kerapian repositori sesuai kaidah Agile & DevOps:

```
main   ------------------------------------------------------------> (Production / Demo Dosen)
          \                                                     /
dev        ----------------------------------------------------> (Integration Branch)
              \                       /       \             /
feature        --[feature/form-ui]----         --[qa/tests]--
```

### Aturan Wajib untuk Seluruh Anggota Tim:
1. **Dilarang keras melakukan `push` langsung ke branch `main`!**
2. Branch `main` hanya digunakan untuk versi stabil yang siap didemokan ke dosen saat evaluasi.
3. Seluruh pengerjaan fitur baru dibuat di branch baru dari `dev`:
   ```bash
   git checkout dev
   git pull origin dev
   git checkout -b feature/nama-fitur-kamu
   ```
4. Setelah pengerjaan selesai, push branch kamu ke GitHub dan ajukan **Pull Request (PR)** yang mengarah ke branch `dev`.
5. Pull Request wajib ditinjau dan lulus pengujian otomatis sebelum di-*merge*.

---

## 👥 7. Tim Pengembang (ISPM Project Team)

- **Development Lead (PIC):** Sheiren Arnelia
- **Product Owner / Business Analyst:** [Nama Anggota 1]
- **Scrum Master / Project Coordinator:** [Nama Anggota 2]
- **QA / UAT Lead:** [Nama Anggota 4]
- **DevOps / Release Coordinator:** [Nama Anggota 5]
