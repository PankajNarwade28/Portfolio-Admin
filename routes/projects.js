const express = require("express");
const supabase = require("../config/supabase");
const router = express.Router();

/* =========================
   🟢 GET ALL PROJECTS
========================= */
// Fetch all projects, ordered by 'order_index' for consistent display order on the frontend
router.get("/", async (req, res) => {
  try {
    const { data, error } = await supabase
      .from("projects")
      .select("*")
      .order("order_index", { ascending: true });

    if (error) throw error;

    res.json(data);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

/* =========================
   🟢 CREATE PROJECT
========================= */
router.post("/", async (req, res) => {
  try {
    const newProject = req.body;

    const { data, error } = await supabase
      .from("projects")
      .insert([newProject])
      .select();

    if (error) throw error;

    res.json({ success: true, data: data[0] });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});
 

/* =========================
   🔴 DELETE PROJECT
========================= */
router.delete("/:id", async (req, res) => {
  try {
    const { id } = req.params;

    const { error } = await supabase.from("projects").delete().eq("id", id);

    if (error) throw error;

    res.json({ success: true, message: "Deleted ✅" });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

/* =========================
   🟡 REORDER PROJECTS
========================= */ 
router.put("/reorder", async (req, res) => {
  try {
    const items = req.body;

    const { data, error } = await supabase
      .from("projects")
      .upsert(items, { onConflict: "id" });

    if (error) throw error;

    res.json({ success: true, data });
  } catch (err) {
    console.error("REORDER ERROR:", err);
    res.status(500).json({ error: err.message });
  }
});

/* =========================
   🔵 UPDATE PROJECT
========================= */
router.put("/:id", async (req, res) => {
  try {
    const { id } = req.params;

    const { data, error } = await supabase
      .from("projects")
      .update(req.body)
      .eq("id", id)
      .select();

    if (error) throw error;

    res.json({ success: true, data: data[0] });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

module.exports = router;
