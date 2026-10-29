import { listTugas } from "./api.js";
import { fileTypeLabel, formatDate } from "./utils.js";

const listEl = document.getElementById("list");
const countBadge = document.getElementById("count-badge");

function renderEmpty(message) {
  listEl.replaceChildren();
  const div = document.createElement("div");
  div.className = "empty";
  div.textContent = message;
  listEl.appendChild(div);
  if (countBadge) countBadge.hidden = true;
}

function renderNotice(message) {
  listEl.replaceChildren();
  const div = document.createElement("div");
  div.className = "notice notice-error";
  div.textContent = message;
  listEl.appendChild(div);
  if (countBadge) countBadge.hidden = true;
}

function createTugasCard(tugas) {
  const article = document.createElement("article");
  article.className = "card";

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

  const downloadLink = document.createElement("a");
  downloadLink.className = "btn";
  downloadLink.href = tugas.file_url;
  downloadLink.setAttribute("download", "");
  downloadLink.target = "_blank";
  downloadLink.rel = "noopener noreferrer";
  downloadLink.textContent = "⬇ Unduh";

  actions.appendChild(downloadLink);
  article.append(info, actions);
  return article;
}

async function init() {
  try {
    const items = await listTugas();
    if (!items.length) {
      renderEmpty("Belum ada tugas yang diunggah saat ini.");
      return;
    }

    listEl.replaceChildren(...items.map(createTugasCard));
    if (countBadge) {
      countBadge.textContent = `${items.length} Tugas`;
      countBadge.hidden = false;
    }
  } catch (err) {
    console.error(err);
    renderNotice("Gagal memuat tugas, coba muat ulang halaman.");
  }
}

init();
