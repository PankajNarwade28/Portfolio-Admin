import express from "express";
import {
  getAllCertificates,
  createCertificate,
  updateCertificate,
  deleteCertificate,
  uploadCertificatePdf,
  reorderCertificates
} from "../controller/certificates.controller.js";
import multer from "multer";

// Limit file size to 5MB (adjust as needed)
const upload = multer({});
const router = express.Router();

/* ================= GET ================= */
router.get("/", getAllCertificates);
/* ================= CREATE ================= */
router.post("/", createCertificate);
/* ================= REORDER CERTIFICATES ================= */
router.put("/reorder", reorderCertificates);
/* ================= UPDATE ================= */
router.put("/:id", updateCertificate);
/* ================= DELETE ================= */
router.delete("/:id", deleteCertificate);
/* ================= UPLOAD PDF ================= */ 
router.put("/:id/upload-pdf", upload.single("file"), uploadCertificatePdf);

export default router;