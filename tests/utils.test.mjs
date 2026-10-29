import test from "node:test";
import assert from "node:assert/strict";
import {
  validateTitle,
  validateFile,
  buildStoragePath,
  fileTypeLabel,
  formatDate,
} from "../js/utils.js";

const MB = 1024 * 1024;

test("validateFile menerima .PDF huruf besar", () => {
  assert.equal(validateFile({ name: "a.PDF", size: 1 }), null);
});
test("validateFile menerima .doc dan .docx", () => {
  assert.equal(validateFile({ name: "a.doc", size: 1 }), null);
  assert.equal(validateFile({ name: "a.docx", size: 10 * MB }), null);
});
test("validateFile menolak ekstensi ganda .pdf.exe", () => {
  assert.equal(typeof validateFile({ name: "a.pdf.exe", size: 1 }), "string");
});
test("validateFile menolak berkas kosong", () => {
  assert.equal(typeof validateFile({ name: "a.pdf", size: 0 }), "string");
});
test("validateFile menolak > 10 MB", () => {
  assert.equal(typeof validateFile({ name: "a.docx", size: 10 * MB + 1 }), "string");
});
test("validateFile menolak tanpa berkas", () => {
  assert.equal(typeof validateFile(null), "string");
});
test("validateTitle", () => {
  assert.equal(typeof validateTitle("   "), "string");
  assert.equal(typeof validateTitle(""), "string");
  assert.equal(validateTitle("Tugas 1"), null);
});
test("buildStoragePath aman dan unik", () => {
  assert.equal(buildStoragePath("Tugas Saya (1).PDF", 123), "123-tugas-saya-1.pdf");
  assert.notEqual(buildStoragePath("a.pdf", 1), buildStoragePath("a.pdf", 2));
});
test("buildStoragePath tetap valid untuk nama non-ASCII", () => {
  assert.match(buildStoragePath("日本語.docx", 5), /^5-[a-z0-9-]+\.docx$/);
});
test("fileTypeLabel", () => {
  assert.equal(fileTypeLabel("x.docx"), "Word");
  assert.equal(fileTypeLabel("x.doc"), "Word");
  assert.equal(fileTypeLabel("x.PDF"), "PDF");
});
test("formatDate memakai locale id-ID", () => {
  assert.match(formatDate("2026-10-28T10:00:00Z"), /28 Okt(?:ober)? 2026/);
});

