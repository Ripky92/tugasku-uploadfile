import { createClient } from "https://esm.sh/@supabase/supabase-js@2";
import { SUPABASE_URL, SUPABASE_ANON_KEY } from "./config.js";
import { buildStoragePath } from "./utils.js";

const BUCKET = "tugas-files";

function ensureConfigured() {
  if (
    !SUPABASE_URL ||
    !SUPABASE_ANON_KEY ||
    SUPABASE_URL.startsWith("GANTI_DENGAN") ||
    SUPABASE_ANON_KEY.startsWith("GANTI_DENGAN")
  ) {
    throw new Error(
      "Supabase belum dikonfigurasi. Isi SUPABASE_URL dan SUPABASE_ANON_KEY di js/config.js."
    );
  }
}

let client = null;
function getClient() {
  ensureConfigured();
  if (!client) {
    client = createClient(SUPABASE_URL, SUPABASE_ANON_KEY);
  }
  return client;
}

export async function listTugas() {
  const supabase = getClient();
  const { data, error } = await supabase
    .from("tugas")
    .select("id, judul, file_path, created_at")
    .order("created_at", { ascending: false });

  if (error) throw new Error(error.message);

  return (data ?? []).map((row) => {
    const { data: pub } = supabase.storage.from(BUCKET).getPublicUrl(row.file_path);
    return {
      id: row.id,
      judul: row.judul,
      file_path: row.file_path,
      file_url: pub.publicUrl,
      created_at: row.created_at,
    };
  });
}

export async function uploadTugas(judul, file) {
  const supabase = getClient();
  const storagePath = buildStoragePath(file.name);

  const { error: uploadErr } = await supabase.storage
    .from(BUCKET)
    .upload(storagePath, file, {
      cacheControl: "3600",
      upsert: false,
    });

  if (uploadErr) {
    throw new Error(`Gagal mengunggah berkas: ${uploadErr.message}`);
  }

  const { error: insertErr } = await supabase
    .from("tugas")
    .insert({ judul: judul.trim(), file_path: storagePath });

  if (insertErr) {
    await supabase.storage.from(BUCKET).remove([storagePath]);
    throw new Error(`Gagal menyimpan data tugas: ${insertErr.message}`);
  }
}

export async function deleteTugas(tugas) {
  const supabase = getClient();

  const { error: storageErr } = await supabase.storage
    .from(BUCKET)
    .remove([tugas.file_path]);

  if (storageErr) {
    throw new Error(`Gagal menghapus berkas dari storage: ${storageErr.message}`);
  }

  const { error: dbErr } = await supabase
    .from("tugas")
    .delete()
    .eq("id", tugas.id);

  if (dbErr) {
    throw new Error(`Gagal menghapus data tugas: ${dbErr.message}`);
  }
}

export async function signIn(email, password) {
  const supabase = getClient();
  const { error } = await supabase.auth.signInWithPassword({ email, password });
  if (error) throw new Error(error.message);
}

export async function signOut() {
  const supabase = getClient();
  const { error } = await supabase.auth.signOut();
  if (error) throw new Error(error.message);
}

export async function isSignedIn() {
  try {
    const supabase = getClient();
    const { data, error } = await supabase.auth.getSession();
    if (error) return false;
    return Boolean(data?.session);
  } catch {
    return false;
  }
}
