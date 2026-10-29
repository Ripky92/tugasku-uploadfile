-- Skema Tabel dan Storage untuk aplikasi Tugasku
-- Jalankan seluruh isi file ini di Supabase SQL Editor

-- 1. Buat tabel tugas
create table if not exists public.tugas (
  id uuid primary key default gen_random_uuid(),
  judul text not null,
  file_path text not null,
  created_at timestamptz not null default now()
);

-- 2. Aktifkan Row Level Security (RLS) pada tabel tugas
alter table public.tugas enable row level security;

-- Kebijakan: Siapa saja (dosen / pengunjung) boleh melihat daftar tugas
drop policy if exists "Publik boleh membaca daftar tugas" on public.tugas;
create policy "Publik boleh membaca daftar tugas"
  on public.tugas
  for select
  to anon, authenticated
  using (true);

-- Kebijakan: Hanya admin yang login boleh menambah tugas
drop policy if exists "Admin boleh menambah tugas" on public.tugas;
create policy "Admin boleh menambah tugas"
  on public.tugas
  for insert
  to authenticated
  with check (true);

-- Kebijakan: Hanya admin yang login boleh menghapus tugas
drop policy if exists "Admin boleh menghapus tugas" on public.tugas;
create policy "Admin boleh menghapus tugas"
  on public.tugas
  for delete
  to authenticated
  using (true);

-- 3. Buat bucket Storage publik bernama 'tugas-files'
insert into storage.buckets (id, name, public)
values ('tugas-files', 'tugas-files', true)
on conflict (id) do update set public = true;

-- Kebijakan Storage: Siapa saja boleh membaca/mengunduh file di bucket 'tugas-files'
drop policy if exists "Publik boleh mengunduh file tugas" on storage.objects;
create policy "Publik boleh mengunduh file tugas"
  on storage.objects
  for select
  to anon, authenticated
  using (bucket_id = 'tugas-files');

-- Kebijakan Storage: Hanya admin yang login boleh mengunggah file ke 'tugas-files'
drop policy if exists "Admin boleh mengunggah file tugas" on storage.objects;
create policy "Admin boleh mengunggah file tugas"
  on storage.objects
  for insert
  to authenticated
  with check (bucket_id = 'tugas-files');

-- Kebijakan Storage: Hanya admin yang login boleh menghapus file di 'tugas-files'
drop policy if exists "Admin boleh menghapus file tugas" on storage.objects;
create policy "Admin boleh menghapus file tugas"
  on storage.objects
  for delete
  to authenticated
  using (bucket_id = 'tugas-files');
