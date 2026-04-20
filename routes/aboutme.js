const express = require("express");
const supabase = require("../config/supabase");
const router = express.Router();

const PROFILE_ID = "4fd12d4b-a1f8-47d4-9f5e-da9f1bd21437";

// 🟢 GET: Fetch the single profile
router.get("/", async (req, res) => {
  try {
    const { data, error } = await supabase
      .from("portfolio_profiles")
      .select("*")
      .eq("id", PROFILE_ID)
      .single();
    console.log("Fetched profile:", data, "Error:", error);
    if (error) throw error;
    res.json(data);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

// 🔵 UPDATE: Only update the existing record
router.put("/", async (req, res) => {
  try {
    const updateData = req.body;
    
    // Remove ID and created_at from body if present to prevent errors
    delete updateData.id;
    delete updateData.created_at;

    const { data, error } = await supabase
      .from("portfolio_profiles")
      .update(updateData)
      .eq("id", PROFILE_ID)
      .select();

    if (error) throw error;
    if (data.length === 0) return res.status(404).json({ error: "Record not found" });

    res.json({ success: true, data: data[0] });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

module.exports = router;