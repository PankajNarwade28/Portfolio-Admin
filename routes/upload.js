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

module.exports = router;