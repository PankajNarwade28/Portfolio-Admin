const multer = require("multer");
const express = require("express");
const supabase = require("../config/supabase");
const router = express.Router();
const upload = multer();

router.post("/image", upload.single("file"), async (req, res) => {
  try {
    if (!req.file) {
      return res.status(400).json({ error: "No file received" });
    }

    const file = req.file;
    // Capture the folder name from the request body (sent from frontend)
    // or default to a generic folder
    const subfolder = req.body.folder || "general";

    console.log(`Uploading to ${subfolder}:`, file.originalname);

    // ✅ PREPEND THE FOLDER NAME TO THE PATH
    // This creates/uses the folder 'About_images/12345-image.png'
    const filePath = `${subfolder}/${Date.now()}-${file.originalname}`;

    const { data, error } = await supabase.storage
      .from("images") // bucket name
      .upload(filePath, file.buffer, {
        contentType: file.mimetype,
        upsert: false // Set to true if you want to overwrite existing files
      });

    if (error) {
      console.log("Supabase Upload Error:", error);
      throw error;
    }

    // ✅ GET PUBLIC URL USING THE FULL PATH
    const { data: publicData } = supabase.storage
      .from("images")
      .getPublicUrl(filePath);

    console.log("Public URL:", publicData.publicUrl);

    res.json({ url: publicData.publicUrl });

  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

router.post("/pdf", upload.single("file"), async (req, res) => {
  try {
    if (!req.file) {
      return res.status(400).json({ error: "No PDF file received" });
    }

    // Ensure only PDFs are uploaded
    if (req.file.mimetype !== 'application/pdf') {
      return res.status(400).json({ error: "Only PDF files are allowed" });
    }

    const file = req.file;
    const subfolder = req.body.folder || "resumes";

    console.log(`Uploading PDF to ${subfolder}:`, file.originalname);

    // Create unique file path
    const filePath = `${subfolder}/${Date.now()}-${file.originalname}`;

    const { data, error } = await supabase.storage
      .from("PDF") // Target your PDF bucket name
      .upload(filePath, file.buffer, {
        contentType: "application/pdf",
        upsert: false
      });

    if (error) {
      console.error("Supabase PDF Upload Error:", error);
      throw error;
    }

    // Generate the public URL
    const { data: publicData } = supabase.storage
      .from("PDF")
      .getPublicUrl(filePath);

    res.json({ 
      message: "PDF uploaded successfully",
      url: publicData.publicUrl 
    });

  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});
module.exports = router;