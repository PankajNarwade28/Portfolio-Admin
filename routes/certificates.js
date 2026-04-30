const express = require("express");
const supabase = require("../config/supabase");
const multer = require("multer");
const upload = multer();
const router = express.Router();

/* ================= GET ================= */
router.get("/", async (req, res) => {
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
});

/* ================= CREATE ================= */
router.post("/", async (req, res) => {
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
});

/* ================= UPDATE ================= */
router.put("/:id", async (req, res) => {
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
});

/* ================= DELETE ================= */
router.delete("/:id", async (req, res) => {
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
});

/* ================= PDF UPLOAD ================= */
router.post("/:id/upload-pdf", upload.single("file"), async (req, res) => {
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
      .replace(/\s+/g, "_")
      .replace(/[^a-zA-Z0-9._-]/g, "");

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
});

module.exports = router;
