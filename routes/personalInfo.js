import express from "express";
import supabase from "../config/supabase.js";
const router = express.Router();

// ✅ GET personal information
router.get("/info", async (req, res) => {
  try {
    const { data, error } = await supabase
      .from("personal_info")
      .select("*")
      .single(); // Use .single() because there is only one user profile

    if (error) {
      console.error("Supabase Personal Info Error:", error);
      throw error;
    }

    res.json(data);
  } catch (err) {
    console.error("GET PERSONAL INFO ERROR:", err);
    res.status(500).json({ error: "Failed to fetch personal information" });
  }
});

 export default router;