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

    console.log("Uploading:", file.originalname);

    const fileName = `${Date.now()}-${file.originalname}`;

    const { data, error } = await supabase.storage
      .from("images") // bucket name
      .upload(fileName, file.buffer, {
        contentType: file.mimetype,
      });

    if (error) {
      console.log(error);
      throw error;
    }

    // ✅ CORRECT WAY TO GET PUBLIC URL
    const { data: publicData } = supabase.storage
      .from("images")
      .getPublicUrl(fileName);
      console.log("Public URL:", publicData.publicUrl);

    res.json({ url: publicData.publicUrl });

  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});
module.exports = router;