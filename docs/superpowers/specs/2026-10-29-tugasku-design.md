# Tugasku — Design

## Intent
Situs pribadi untuk mengumpulkan tugas mata kuliah **Basis Data**. Pemilik: **M RIFKY ALAMSYAH**. Satu-satunya pembaca: dosen **Agung Santoso, M.Kom**. Dipakai sementara selama semester berjalan, lalu selesai. Alasan: dosen bisa membuka dan mengunduh tugas dari perangkat apa pun tanpa kirim file satu per satu.

## Goals
- Halaman publik berisi daftar tugas (terbaru di atas): judul, tanggal unggah, jenis file (PDF/Word), tombol Unduh.
- Judul halaman menampilkan nama situs "Tugasku", nama mahasiswa, mata kuliah, dan nama dosen (usulan builder-side, bukan permintaan eksplisit pengguna).
- Halaman admin khusus pemilik: login, unggah tugas (judul + file), hapus tugas.
- Gratis seluruhnya, online dengan subdomain gratis.

## Non-goals
- Dosen tidak login, tidak memberi nilai/komentar/unggah.
- Tidak ada multi-mahasiswa, multi-mata-kuliah, domain sendiri, atau notifikasi.

## Anti-goals
- Tugas hilang karena server restart/hosting menghapus file.
- Orang lain bisa mengunggah atau menghapus tugas.
- Biaya atau kartu kredit diperlukan.

## Constraints
- Format file: hanya `.pdf`, `.doc`, `.docx`.
- Halaman daftar & unduhan terbuka untuk siapa saja yang punya tautan (keputusan pengguna). Pengguna perlu tahu: jangan taruh data pribadi sensitif di file.
- Pengguna belum punya hosting/domain/akun; perlu membuat akun Supabase dan Netlify (atau Vercel) sendiri.
- Bahasa antarmuka: Indonesia.

## Approaches
- **A. Situs ringan + Supabase + Netlify/Vercel (dipilih pengguna).** HTML/CSS/JS biasa; Supabase untuk penyimpanan file, tabel daftar tugas, dan login admin. Trade-off: perlu dua akun; proyek Supabase gratis dapat dijeda bila lama tidak aktif (bisa diaktifkan lagi).
- B. Situs statis di GitHub Pages: paling sederhana, tapi tanpa halaman unggah (ditolak).
- C. Server Node.js di hosting gratis: file bisa hilang saat restart (ditolak).

## Decisions
- Pengguna memutuskan: pendekatan A; hanya pemilik yang mengunggah; dosen melihat/mengunduh; Word atau PDF; daftar terbuka untuk umum; wajib gratis; layout dua halaman seperti mockup yang disetujui (publik: header + kartu tugas dengan tombol Unduh; admin: form judul + pilih file + Unggah, daftar dengan tombol Hapus, tombol Keluar).
- Pengguna memutuskan: situs memakai HTML, JavaScript, **dan CSS** dengan tampilan menarik, tidak flat/monoton (gradasi warna, bayangan kartu, sudut membulat, efek hover, transisi halus, tampilan responsif di HP). Detail palet dan font diserahkan ke builder.
- Pilihan saya (builder-side): tanpa framework/build step (vanilla JS, Supabase JS via CDN); satu akun admin (email+sandi Supabase Auth); aturan keamanan Supabase (Row Level Security): baca publik, tulis/hapus hanya untuk pengguna login; bucket file publik untuk baca.

## Left to the builder
Struktur file, gaya visual rinci (warna, font), pesan error, batas ukuran file (usulan 10 MB), penamaan file di storage, cara deploy langkah demi langkah (panduan singkat untuk pemula, termasuk membuat akun Supabase dan membuat akun admin).

