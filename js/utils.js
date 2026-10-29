export const MAX_FILE_SIZE = 10 * 1024 * 1024;
const ALLOWED_EXT = ["pdf", "doc", "docx"];

function extOf(fileName) {
  const i = fileName.lastIndexOf(".");
  return i === -1 ? "" : fileName.slice(i + 1).toLowerCase();
}

export function validateTitle(title) {
  if (!title || !title.trim()) return "Judul tugas wajib diisi.";
  return null;
}

export function validateFile(file) {
  if (!file) return "Pilih berkas terlebih dahulu.";
  if (!ALLOWED_EXT.includes(extOf(file.name))) {
    return "Hanya berkas PDF atau Word (.pdf, .doc, .docx) yang diperbolehkan.";
  }
  if (file.size <= 0) return "Berkas kosong.";
  if (file.size > MAX_FILE_SIZE) return "Ukuran berkas maksimal 10 MB.";
  return null;
}

export function buildStoragePath(fileName, now = Date.now()) {
  const ext = extOf(fileName);
  const base = fileName.slice(0, fileName.length - (ext ? ext.length + 1 : 0));
  const safe =
    base
      .normalize("NFKD")
      .toLowerCase()
      .replace(/[^a-z0-9]+/g, "-")
      .replace(/^-+|-+$/g, "") || "tugas";
  return `${now}-${safe}.${ext}`;
}

export function fileTypeLabel(fileName) {
  return extOf(fileName) === "pdf" ? "PDF" : "Word";
}

export function formatDate(iso) {
  return new Date(iso).toLocaleDateString("id-ID", {
    day: "numeric",
    month: "short",
    year: "numeric",
  });
}

export function buildDownloadFilename(judul, filePath) {
  const ext = extOf(filePath) || "pdf";
  const cleaned = (judul || "tugas")
    .replace(/[–—]/g, "-")
    .replace(/[<>:"/\\|?*\x00-\x1F]+/g, "-")
    .replace(/\s+/g, " ")
    .replace(/[- ]+$/g, "")
    .trim();
  return `${cleaned || "tugas"}.${ext}`;
}

