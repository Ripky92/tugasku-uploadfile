import {
  listTugas,
  uploadTugas,
  deleteTugas,
  signIn,
  signOut,
  isSignedIn,
} from "./api.js";
import {
  validateTitle,
  validateFile,
  fileTypeLabel,
  formatDate,
} from "./utils.js";

const loginSection = document.getElementById("login");
const panelSection = document.getElementById("panel");

const loginForm = document.getElementById("login-form");
const loginBtn = document.getElementById("login-btn");
const loginNotice = document.getElementById("login-notice");

const uploadForm = document.getElementById("upload-form");
const uploadBtn = document.getElementById("upload-btn");
const uploadNotice = document.getElementById("upload-notice");
const judulInput = document.getElementById("judul");
const berkasInput = document.getElementById("berkas");

const logoutBtn = document.getElementById("logout-btn");
const adminList = document.getElementById("admin-list");

function showNotice(el, message, kind = "error") {
  el.textContent = message;
  el.className = `notice ${kind === "success" ? "notice-success" : "notice-error"}`;
  el.hidden = false;
}

function hideNotice(el) {
  el.hidden = true;
  el.textContent = "";
}

function showView(view) {
  if (view === "panel") {
    loginSection.hidden = true;
    panelSection.hidden = false;
  } else {
    panelSection.hidden = true;
    loginSection.hidden = false;
  }
}

function renderAdminRow(tugas) {
  const card = document.createElement("article");
  card.className = "card card-static";

  const info = document.createElement("div");
  info.className = "card-info";

  const title = document.createElement("h3");
  title.className = "card-title";
  title.textContent = tugas.judul;

  const meta = document.createElement("div");
  meta.className = "card-meta";

  const type = fileTypeLabel(tugas.file_path);
  const badge = document.createElement("span");
  badge.className = `badge ${type === "PDF" ? "badge-pdf" : "badge-word"}`;
  badge.textContent = type;

  const dateSpan = document.createElement("span");
  dateSpan.className = "card-date";
  dateSpan.textContent = `Diunggah ${formatDate(tugas.created_at)}`;

  meta.append(badge, dateSpan);
  info.append(title, meta);

  const actions = document.createElement("div");
  actions.className = "card-actions";

  const deleteBtn = document.createElement("button");
  deleteBtn.type = "button";
  deleteBtn.className = "btn btn-danger";
  deleteBtn.textContent = "Hapus";
  deleteBtn.addEventListener("click", async () => {
    if (!window.confirm("Hapus tugas ini?")) return;
    deleteBtn.disabled = true;
    deleteBtn.textContent = "Menghapus...";
    hideNotice(uploadNotice);
    try {
      await deleteTugas(tugas);
      await refreshList();
      showNotice(uploadNotice, "Tugas berhasil dihapus.", "success");
    } catch (err) {
      showNotice(uploadNotice, err.message || "Gagal menghapus tugas.");
      deleteBtn.disabled = false;
      deleteBtn.textContent = "Hapus";
    }
  });

  actions.appendChild(deleteBtn);
  card.append(info, actions);
  return card;
}

async function refreshList() {
  try {
    const items = await listTugas();
    if (!items.length) {
      adminList.replaceChildren();
      const empty = document.createElement("div");
      empty.className = "empty";
      empty.textContent = "Belum ada tugas yang diunggah.";
      adminList.appendChild(empty);
      return;
    }
    adminList.replaceChildren(...items.map(renderAdminRow));
  } catch (err) {
    adminList.replaceChildren();
    const errDiv = document.createElement("div");
    errDiv.className = "notice notice-error";
    errDiv.textContent = err.message || "Gagal memuat daftar tugas.";
    adminList.appendChild(errDiv);
  }
}

loginForm.addEventListener("submit", async (e) => {
  e.preventDefault();
  hideNotice(loginNotice);

  const email = document.getElementById("email").value.trim();
  const password = document.getElementById("password").value;
  if (!email || !password) {
    showNotice(loginNotice, "Email dan kata sandi wajib diisi.");
    return;
  }

  loginBtn.disabled = true;
  loginBtn.textContent = "Memeriksa...";
  try {
    await signIn(email, password);
    loginForm.reset();
    showView("panel");
    await refreshList();
  } catch (err) {
    const msg =
      err.message && err.message.includes("Supabase belum dikonfigurasi")
        ? err.message
        : "Email atau sandi salah.";
    showNotice(loginNotice, msg);
  } finally {
    loginBtn.disabled = false;
    loginBtn.textContent = "Masuk";
  }
});

uploadForm.addEventListener("submit", async (e) => {
  e.preventDefault();
  hideNotice(uploadNotice);

  const judul = judulInput.value;
  const file = berkasInput.files?.[0] ?? null;

  const titleErr = validateTitle(judul);
  if (titleErr) {
    showNotice(uploadNotice, titleErr);
    return;
  }

  const fileErr = validateFile(file);
  if (fileErr) {
    showNotice(uploadNotice, fileErr);
    return;
  }

  uploadBtn.disabled = true;
  uploadBtn.textContent = "Mengunggah...";
  try {
    await uploadTugas(judul, file);
    uploadForm.reset();
    showNotice(uploadNotice, "Tugas berhasil diunggah!", "success");
    await refreshList();
  } catch (err) {
    showNotice(uploadNotice, err.message || "Gagal mengunggah tugas.");
  } finally {
    uploadBtn.disabled = false;
    uploadBtn.textContent = "Unggah Tugas";
  }
});

logoutBtn.addEventListener("click", async () => {
  hideNotice(uploadNotice);
  try {
    await signOut();
  } catch (err) {
    console.error(err);
  }
  showView("login");
});

async function init() {
  const signedIn = await isSignedIn();
  if (signedIn) {
    showView("panel");
    await refreshList();
  } else {
    showView("login");
  }
}

init();
