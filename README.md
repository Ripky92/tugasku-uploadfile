# 📚 Tugasku — Pengumpulan Tugas Basis Data

Website pribadi untuk mengunggah dan mengumpulkan tugas mata kuliah **BASIS DATA**:
- **Mahasiswa:** M RIFKY ALAMSYAH
- **Dosen Pengampu:** Agung Santoso, M.Kom
- **Format berkas:** PDF atau Word (`.pdf`, `.doc`, `.docx`), maksimal 10 MB

Situs ini terdiri dari dua halaman:
1. **`index.html` (Halaman Dosen / Publik):** Menampilkan daftar tugas terbaru lengkap dengan tombol **Unduh** tanpa perlu login.
2. **`admin.html` (Halaman Admin — Khusus Anda):** Dilindungi login email & kata sandi untuk mengunggah tugas baru atau menghapus tugas.

---

## Panduan Setup & Online Gratis (Langkah demi Langkah)

Anda tidak perlu mengeluarkan biaya atau kartu kredit. Cukup ikuti 6 langkah berikut:

### Langkah 1: Buat Proyek Gratis di Supabase
1. Buka https://supabase.com lalu daftar / masuk (bisa memakai akun GitHub atau Google).
2. Klik **New project**.
3. Isi nama proyek bebas (misalnya `tugasku-basis-data`), buat *Database Password* (simpan baik-baik), pilih region terdekat (mis. **Southeast Asia (Singapore)**), lalu klik **Create new project**.
4. Tunggu sekitar 1–2 menit hingga proyek selesai disiapkan.

### Langkah 2: Buat Tabel & Penyimpanan File (SQL Editor)
1. Di menu sebelah kiri dashboard Supabase, klik **SQL Editor** → **New query**.
2. Buka file `supabase/setup.sql` dari folder proyek ini, salin seluruh isinya, lalu tempelkan ke kotak SQL Editor di Supabase.
3. Klik tombol **Run** (atau tekan `Ctrl + Enter`). Pastikan muncul pesan *Success*.

### Langkah 3: Buat Akun Admin Anda & Matikan Pendaftaran Umum
Agar hanya Anda yang bisa login dan mengunggah tugas:
1. Di menu kiri Supabase, buka **Authentication** → **Users**.
2. Klik **Add user** → **Create new user**.
3. Masukkan **Email** dan **Password** yang ingin Anda pakai untuk login di halaman Admin, centang **Auto Confirm User**, lalu klik **Create user**.
4. Masih di menu **Authentication**, klik **Sign In / Providers** (atau **Configuration → Auth**):
   - Matikan opsi **Allow new users to sign up** agar orang lain tidak bisa mendaftar akun baru, lalu klik **Save**.

### Langkah 4: Hubungkan Website dengan Supabase (`js/config.js`)
1. Di dashboard Supabase, klik **Project Settings** (ikon roda gigi di kiri bawah) → **API** (atau **Data API / API Keys**).
2. Salin dua nilai berikut:
   - **Project URL** (contoh: `https://abcdefghijklm.supabase.co`)
   - **anon / public key** (teks panjang yang diawali `eyJ...` atau `sb_publishable_...`)
3. Buka file `js/config.js` di komputer Anda, lalu ganti tulisannya menjadi milik Anda:
   ```js
   export const SUPABASE_URL = "https://xxxx.supabase.co";
   export const SUPABASE_ANON_KEY = "eyJhbGciOi...";
   ```
   > **Keamanan penting:** Kunci `anon` (`public`) memang dirancang untuk dipasang di kode website karena keamanan dijaga oleh aturan *Row Level Security* dari Langkah 2. **Jangan pernah** memakai kunci `service_role` / `secret` di dalam kode website!

### Langkah 5: Online-kan Website Secara Gratis di Netlify
1. Buka https://app.netlify.com lalu daftar / masuk gratis.
2. Di halaman utama (**Sites** / **Projects**), cari bagian **Add new site** → **Deploy manually** (atau buka langsung https://app.netlify.com/drop).
3. Siapkan folder yang berisi file website saja (`index.html`, `admin.html`, `css/`, dan `js/` yang sudah diisi `config.js` — atau langsung seret folder `tugasku` ini).
4. Tarik dan lepaskan (*drag and drop*) folder tersebut ke kotak di halaman Netlify.
5. Dalam beberapa detik website Anda langsung online!
6. Untuk merapikan alamat link: klik **Site configuration** → **Change site name**, lalu ketik misalnya `tugasku-rifky` sehingga alamatnya menjadi `https://tugasku-rifky.netlify.app`.

### Langkah 6: Uji Coba Sebelum Dikirim ke Dosen
1. Buka `https://alamat-netlify-anda.netlify.app/admin.html`.
2. Login memakai email dan sandi yang Anda buat di Langkah 3.
3. Unggah satu file PDF atau Word percobaan.
4. Buka alamat utama `https://alamat-netlify-anda.netlify.app` di HP Anda (atau mode penyamaran/incognito) dan pastikan file bisa diunduh dengan lancar.
5. Kirim tautan halaman utama tersebut kepada Bapak **Agung Santoso, M.Kom**.

---

## Catatan Penting Selama Pemakaian
- **Proyek Supabase Gratis Bisa Dijeda (Paused):** Pada paket gratis Supabase, jika website sama sekali tidak dibuka atau dipakai selama **7 hari berturut-turut**, proyek database dapat dijeda otomatis. Jangan khawatir, file tugas Anda **tidak hilang** — cukup buka dashboard Supabase dan klik tombol **Restore project** (aktif kembali dalam ~1 menit), terutama sebelum dosen memeriksa tugas.
- **Privasi Berkas:** Karena halaman daftar tugas sengaja dibuat terbuka tanpa sandi agar memudahkan dosen, siapa saja yang mengetahui link website Anda dapat mengunduh file tugas tersebut. Hindari menaruh data pribadi sensitif (seperti nomor KTP atau sandi pribadi) di dalam dokumen tugas.


