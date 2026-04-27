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

// ✅ UPDATE personal information
router.get("/tech", async (req, res) => {
  try {
    const { data, error } = await supabase
      .from("tech_stack")
      .select("*");

      if(error) {
        console.error("Supabase Tech Stack Error:", error);
        throw error;
      }

    res.json(data);
  } catch (err) {
    console.error("GET TECH STACK ERROR:", err);
    res.status(500).json({ error: "Failed to fetch tech stack information" });
  }
});

// ✅ UPDATE one tech
router.put("/tech/:id", async (req, res) => {
  try {
    const { id } = req.params;
    const { name, icon_symbol, hex_color, code_example } = req.body;
    console.log("Updating Tech ID:", id, "with data:", req.body);
    const { data, error } = await supabase
      .from("tech_stack")
      .update({
        name,
        icon_symbol,
        hex_color,
        code_example,
      })
      .eq("id", id)
      .select();

    if (error) throw error;

    res.json({
      message: "Updated ✅",
      data,
    });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

// ✅ GET social links
router.get("/links", async (req, res) => {
  try {
    const { data, error } = await supabase
      .from("social_links")
      .select("*");

    if (error) {
      console.error("Supabase Social Links Error:", error);
      throw error;
    }
    res.json(data);
  }
    catch (err) {
      console.error("GET SOCIAL LINKS ERROR:", err);
      res.status(500).json({ error: "Failed to fetch social links" });
    }
});

 export default router;