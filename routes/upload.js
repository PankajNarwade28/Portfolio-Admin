const multer = require("multer");
const express = require("express");
const supabase = require("../config/supabase");
const router = express.Router();
const upload = multer();

// ✅ UPLOAD IMAGE TO SUPABASE STORAGE
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
    // ❌ No file
    if (!req.file) {
      return res.status(400).json({ error: "No PDF file received" });
    }

    // ❌ Not PDF
    if (req.file.mimetype !== "application/pdf") {
      return res.status(400).json({ error: "Only PDF files are allowed" });
    }

    const file = req.file;
    const subfolder = req.body.folder || "resumes";

    console.log("Uploading new PDF:", file.originalname);

    // ===============================
    // ✅ STEP 1: GET OLD FILE FROM DB
    // ===============================
    const { data: existing, error: fetchError } = await supabase
      .from("personal_info")
      .select("resume_url")
      .eq("id", 1)
      .single();

    if (fetchError) {
      console.error("Fetch Error:", fetchError);
      throw fetchError;
    }

  // ===============================
// ✅ DELETE OLD FILE (FIXED)
// ===============================
if (existing?.resume_url) {
  try {
    const oldUrl = existing.resume_url;

    // ✅ Correct extraction using URL API
    const url = new URL(oldUrl);
    const fullPath = url.pathname;

    // Extract path after /public/PDF/
    const filePath = fullPath.split("/public/PDF/")[1];

    if (filePath) {
      console.log("Deleting old file:", filePath);

      const { error: deleteError } = await supabase.storage
        .from("PDF")
        .remove([filePath]); 

      if (deleteError) {
        console.error("Delete failed:", deleteError.message);
      } else {
        console.log("Old file deleted ✅");
      }
    } else {
      console.warn("File path extraction failed");
    }
  } catch (err) {
    console.error("Delete parsing error:", err.message);
  }
}

    // ===============================
    // ✅ STEP 3: UPLOAD NEW FILE
    // ===============================
    const newFilePath = `${subfolder}/${Date.now()}-${file.originalname}`;

    const { error: uploadError } = await supabase.storage
      .from("PDF")
      .upload(newFilePath, file.buffer, {
        contentType: "application/pdf",
        upsert: true, // safer
      });

    if (uploadError) {
      console.error("Upload Error:", uploadError);
      throw uploadError;
    }

    // ===============================
    // ✅ STEP 4: GET PUBLIC URL
    // ===============================
    const { data: publicData } = supabase.storage
      .from("PDF")
      .getPublicUrl(newFilePath);

    const newUrl = publicData.publicUrl;

    // ===============================
    // ✅ STEP 5: UPDATE DATABASE
    // ===============================
    const { error: updateError } = await supabase
      .from("personal_info")
      .update({ resume_url: newUrl })
      .eq("id", 1);

    if (updateError) {
      console.error("DB Update Error:", updateError);
      throw updateError;
    }

    // ===============================
    // ✅ SUCCESS RESPONSE
    // ===============================
    res.json({
      message: "Resume updated successfully ✅",
      url: newUrl,
    });

  } catch (err) {
    console.error("FINAL ERROR:", err);
    res.status(500).json({
      error: err.message || "Something went wrong",
    });
  }
});
 


module.exports = router;