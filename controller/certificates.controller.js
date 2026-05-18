import express from "express";
import supabase from "../config/supabase.js";
import multer from "multer";
const upload = multer({
  limits: {
    fileSize: 10 * 1024 * 1024,
  },
});
const router = express.Router();

/* ================= GET ================= */
const getAllCertificates = async (req, res) => {
  try {
    const { data, error } = await supabase
      .from("certifications")
      .select("*")
      .order("order_index", { ascending: true });

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

// REORDER CERTIFICATES
const reorderCertificates = async (req, res) => {
  try {
    const { items } = req.body;

    // Validation
    if (!Array.isArray(items) || items.length === 0) {
      return res.status(400).json({
        success: false,
        error: "Items must be a non-empty array",
      });
    }

    console.log("Received reorder items:", items);

    // STEP 1 → Temporary negative indexes
    for (const item of items) {
      const tempIndex = -Math.abs(Number(item.order_index));

      const { error } = await supabase
        .from("certifications")
        .update({
          order_index: tempIndex,
        })
        .eq("id", item.id);

      if (error) {
        console.error("Temporary update error:", error);

        return res.status(500).json({
          success: false,
          error: error.message,
        });
      }
    }

    // STEP 2 → Final indexes
    const updatedRows = [];

    for (const item of items) {
      const finalIndex = Number(item.order_index);

      const { data, error } = await supabase
        .from("certifications")
        .update({
          order_index: finalIndex,
        })
        .eq("id", item.id)
        .select();

      if (error) {
        console.error("Final update error:", error);

        return res.status(500).json({
          success: false,
          error: error.message,
        });
      }

      if (data?.length) {
        updatedRows.push(data[0]);
      }
    }

    return res.status(200).json({
      success: true,
      data: updatedRows,
    });
  } catch (error) {
    console.error("Reorder certificates error:", error);

    return res.status(500).json({
      success: false,
      error: error.message,
    });
  }
};

export {
  getAllCertificates,
  createCertificate,
  updateCertificate,
  deleteCertificate,
  reorderCertificates,
  uploadCertificatePdf,
};
