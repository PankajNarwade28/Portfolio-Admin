const express = require("express");
const supabase = require("../config/supabase");
const router = express.Router();

// ✅ GET all education (sorted latest first)
router.get("/", async (req, res) => {
  try {
    const { data, error } = await supabase
      .from("education")
      .select("*")
      .order("order_index", { ascending: true });

    if (error) throw error;

    res.json(data);
  } catch (err) {
    console.error("GET EDUCATION ERROR:", err);
    res.status(500).json({ error: "Failed to fetch education" });
  }
});

// ✅ ADD education
router.post("/", async (req, res) => {
  try {
    const { data, error } = await supabase
      .from("education")
      .insert([req.body])
      .select();

    if (error) throw error;

    res.json(data);
  } catch (err) {
    console.error("ADD EDUCATION ERROR:", err);
    res.status(500).json({ error: "Failed to add education" });
  }
});

// ✅ UPDATE education
router.put("/:id", async (req, res) => {
  const { id } = req.params;

  const { data, error } = await supabase
    .from("education")
    .update(req.body)
    .eq("id", id)
    .select();

  if (error) {
    return res.status(500).json({ error });
  }

  res.json(data);
});

module.exports = router;