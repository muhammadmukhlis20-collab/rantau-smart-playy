# RANTAU SMART PLAY
> **Smart Learning, Happy Classroom.**  
> Aplikasi Web Edukatif Berbasis Gamifikasi dan AI untuk **SDN 32 Rantau Bayur**.

---

## 1. Identitas Pengembang & Instansi

- **Instansi**: SDN 32 Rantau Bayur
- **Nama Pengembang**: Muhammad Mukhlis, S.Pd
- **Kontak Pengembang**: 082226859877
- **Target Pengguna**:
  - Guru kelas IV, V, dan VI sekolah dasar (Fasilitator dan Administrator Pembelajaran)
  - Siswa sekolah dasar kelas tinggi (Fase B & C Kurikulum Merdeka)

---

## 2. Fitur-Fitur Utama

1. **Dashboard Pembelajaran Terpadu**:
   - Ringkasan live statistik: Total kelas, jumlah siswa, paket bank soal, dan sesi permainan selesai.
   - Analisis otomatis: Materi & butir soal yang paling sering keliru (akurasi < 60%) untuk penguatan segera.
   - Peluncur langsung (Quick Launcher) untuk ketiga permainan edukatif.

2. **Manajemen Kelas & Siswa (Fase B & C)**:
   - Pengelolaan kelas IV, V, dan VI.
   - Manajemen siswa dengan pelacakan XP, level, dan lencana prestasi.
   - Pencarian siswa berdasarkan nama atau ID.
   - Impor daftar nama siswa dari file CSV dan ekspor rekap ke format CSV.

3. **AI Pembuat Soal Pembelajaran (Gemini)**:
   - Pembuatan draf soal otomatis berbasis kurikulum SD (Mata pelajaran: IPAS, Matematika, Bahasa Indonesia, Pendidikan Pancasila, dll.).
   - Pilihan format soal: Pilihan Ganda, Benar/Salah, Jawaban Singkat, Soal Cerita.
   - Tingkat kesulitan: Mudah, Sedang, Menantang (HOTS).
   - Editor interaktif untuk meninjau, menyunting kunci jawaban, menambah/menghapus soal sebelum disimpan.
   - Dukungan draf kurikulum offline cerdas jika kuota API habis atau server offline.

4. **Game Center (Pusat Permainan Edukatif)**:
   - **Quiz Adventure**: Kuis petualangan kartu dengan umpan balik ramah anak, audio denting gembira, penjelasan edukatif mendalam, dan akumulasi poin belajar (XP).
   - **Roda Tantangan Ceria**: Roda putar digital murni JavaScript dengan animasi putaran fisik, suara *tick*, dan kategori tantangan seru (Tantangan Cepat, Senam Otak, Tebak Kata, Kerja Sama Tim). Dilengkapi editor penambahan tantangan oleh guru.
   - **Match & Learn**: Permainan mencocokkan kartu istilah & definisi (Sains Bagian Tumbuhan, Pecahan Matematika, Nilai Karakter Pancasila) dengan efek memori visual.
   - 3 Mode Tampilan: **Mode Individu**, **Mode Kelompok**, dan **Mode Layar Proyektor Kelas**.

5. **Bank Soal & Kurikulum**:
   - Penyimpanan paket soal terstruktur dengan filter mata pelajaran dan kelas.
   - Pembuatan soal manual tanpa batasan.
   - Duplikasi paket soal dan ekspor/impor file JSON.

6. **Hasil & Analisis Pembelajaran**:
   - Rekap nilai per kelas dan per siswa.
   - Analisis persentase akurasi per butir soal.
   - Refleksi Pedagogis AI (`/api/analyze-learning`) yang memberikan rekomendasi empatik dan solutif tanpa memberi label negatif pada siswa.

7. **Diferensiasi Pembelajaran (Remedial & Pengayaan)**:
   - Perencanaan remedial konkret berbasis alat peraga nyata dan tutor sebaya.
   - Proyek pengayaan eksplorasi kreatif.
   - Penugasan fleksibel kepada siswa sasaran dan pencatatan status ketuntasan.

8. **Laporan & Ekspor**:
   - Filter lengkap: Kelas, Siswa, Mapel, dan Rentang waktu.
   - Ekspor laporan tabel ke **CSV (Excel)** dengan standar UTF-8.
   - Fasilitas **Cetak Dokumen / Simpan PDF** melalui layout khusus media cetak browser lengkap dengan kolom tanda tangan kepala sekolah dan guru pengampu.

9. **Sistem Gamifikasi Non-Hukuman**:
   - Poin pengalaman (XP), Level 1-5 (Pemula Cilik hingga Juara Rantau).
   - 6 Lencana Utama: *Penjelajah Ilmu*, *Ahli Numerasi*, *Pembaca Hebat*, *Pemecah Tantangan*, *Sahabat Tim*, dan *Pantang Menyerah*.
   - Papan peringkat opsional untuk melindungi kenyamanan psikologis anak.

10. **Efek Suara Web Audio Sintetis**:
    - Suara denting gembira, boop lembut penenang, tick roda, flip kartu, dan fanfare kemenangan dihasilkan langsung oleh Web Audio API peramban tanpa file eksternal MP3.

---

## 3. Cara Menjalankan Aplikasi

### Persyaratan Lingkungan
- Node.js versi 18 atau lebih tinggi
- npm atau pnpm

### Langkah Instalasi
1. Ekstrak atau unduh direktori proyek:
   ```bash
   cd rantau-smart-play
   ```
2. Instal dependensi yang diperlukan:
   ```bash
   npm install
   ```
3. Konfigurasi Kunci API Gemini:
   Salin file `.env.example` menjadi `.env`:
   ```bash
   cp .env.example .env
   ```
   Buka file `.env` dan masukkan API Key Anda:
   ```env
   GEMINI_API_KEY="AIzaSy..."
   GEMINI_MODEL="gemini-3.8-flash"
   ```
   *(Catatan: Jika dijalankan di Google AI Studio, `GEMINI_API_KEY` diinjeksi secara otomatis dari Secrets panel)*.

4. Jalankan Server Pengembangan:
   ```bash
   npm run dev
   ```
   Aplikasi akan berjalan pada port **3000** (`http://localhost:3000`).

5. Untuk Kompilasi Produksi:
   ```bash
   npm run build
   npm start
   ```

---

## 4. Struktur Proyek

```
/
├── index.html                  # Entry point HTML & font ramah anak
├── metadata.json               # Konfigurasi applet AI Studio
├── package.json                # Dependensi express, @google/genai, react, tailwind
├── server.ts                   # Backend Express (API AI Gemini & Vite middleware)
├── .env.example                # Template variabel lingkungan aman
├── src/
│   ├── main.tsx                # Mount React root
│   ├── App.tsx                 # Router & tata letak utama (Mode Guru & Siswa)
│   ├── index.css               # Desain Tailwind CSS & print media query
│   ├── types/
│   │   └── index.ts            # Definisi antarmuka TypeScript
│   ├── services/
│   │   ├── audio.ts            # Synthesizer Web Audio API offline
│   │   └── storage.ts          # Layanan localStorage & seed data SDN 32 Rantau Bayur
│   └── components/
│       ├── common/
│       │   ├── Header.tsx      # Header & penukar mode
│       │   └── Sidebar.tsx     # Navigasi 10 menu dashboard guru
│       ├── dashboard/          # Ringkasan analitik & peluncur cepat
│       ├── classes/            # Manajemen kelas, siswa, impor/ekspor CSV
│       ├── ai-generator/       # Pembuat soal Gemini & penyunting draf
│       ├── games/              # Quiz Adventure, Roda Tantangan, Match & Learn
│       ├── bank/               # Bank soal, pembuat manual, duplikasi, ekspor
│       ├── analytics/          # Analisis butir soal & refleksi pedagogis AI
│       ├── remedial/           # Program diferensiasi (remedial & pengayaan)
│       ├── reports/            # Laporan rekapitulasi, cetak print & ekspor CSV
│       ├── settings/           # Pengaturan sekolah & cadangan JSON
│       ├── about/              # Identitas SDN 32 Rantau Bayur & pengembang
│       └── arena/              # Arena bermain ceria khusus siswa
```

---

## 5. Hak Cipta & Dedikasi

Aplikasi ini didedikasikan untuk kemajuan proses belajar mengajar di **SDN 32 Rantau Bayur**.  
Dikembangkan oleh **Muhammad Mukhlis, S.Pd** (Kontak: `082226859877`).
