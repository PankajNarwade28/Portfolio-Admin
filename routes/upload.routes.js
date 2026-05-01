import express from 'express';
import { uploadImage, uploadPdf } from '../controller/upload.controller.js';
import multer from "multer";
const upload = multer();
const router = express.Router();

// ✅ UPLOAD IMAGE TO SUPABASE STORAGE
router.post("/image", upload.single("file"), uploadImage);
// ✅ UPLOAD PDF TO SUPABASE STORAGE
router.post("/pdf", upload.single("file"), uploadPdf);

export default router;