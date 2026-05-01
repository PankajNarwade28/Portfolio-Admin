import express from "express";
import supabase from "../config/supabase.js";
import multer from "multer";
const upload = multer();
const router = express.Router();

/* ================= GET ================= */
const getAllCertificates = async (req, res) => {
  try {
    const { data, error } = await supabase
      .from("certifications")
      .select("*")
      .order("id", { ascending: true });

    if (error) throw error;
    res.json(data);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};

/* ================= CREATE ================= */
const createCertificate = async (req, res) => {
  try {
    const { data, error } = await supabase
      .from("certifications")
      .insert([req.body])
      .select()
      .single();

    if (error) throw error;
    res.json(data);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};

/* ================= UPDATE ================= */
const updateCertificate = async (req, res) => {
  try {
    const { data, error } = await supabase
      .from("certifications")
      .update(req.body)
      .eq("id", req.params.id)
      .select()
      .single();

    if (error) throw error;
    res.json(data);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};

/* ================= DELETE ================= */
const deleteCertificate = async (req, res) => {
  try {
    const { error } = await supabase
      .from("certifications")
      .delete()
      .eq("id", req.params.id);

    if (error) throw error;
    res.json({ message: "Deleted" });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};

/* ================= PDF UPLOAD ================= */
const uploadCertificatePdf = async (req, res) => {
  try {
    if (!req.file) {
      return res.status(400).json({ error: "No file uploaded" });
    }

    if (req.file.mimetype !== "application/pdf") {
      return res.status(400).json({ error: "Only PDF allowed" });
    }

    const file = req.file;
    const certId = req.params.id;

    const safeName = file.originalname
      .replaceAll(/\s+/g, "_")
      .replaceAll(/[^a-zA-Z0-9._-]/g, "");

    const filePath = `certificates/${Date.now()}-${safeName}`;

    // ✅ Upload
    const { error: uploadError } = await supabase.storage
      .from("PDF")
      .upload(filePath, file.buffer, {
        contentType: "application/pdf",
      });

    if (uploadError) throw uploadError;

    // ✅ Get URL
    const { data } = supabase.storage.from("PDF").getPublicUrl(filePath);

    const pdfUrl = data.publicUrl;

    // ✅ FIXED HERE
    const { error: updateError } = await supabase
      .from("certifications")
      .update({ pdf_link: pdfUrl }) // 🔥 FIXED
      .eq("id", certId);

    if (updateError) throw updateError;

    res.json({
      message: "Certificate uploaded ✅",
      url: pdfUrl,
    });
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: err.message });
  }
};

export {
  getAllCertificates,
  createCertificate,
  updateCertificate,
  deleteCertificate,
  uploadCertificatePdf,
};
