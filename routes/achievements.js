import express from "express";
import supabase from "../config/supabase.js";

const router = express.Router();

router.get("/", async (req, res) => {
  try {
    const { data, error } = await supabase.from("achievements").select("*");
    if (error) throw error;

    res.json(data);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

// CREATE
router.post("/", async (req, res) => {
  try {
    const achievementData = req.body;
    delete achievementData.id;
    delete achievementData.created_at;
    console.log("Creating achievement with data:", achievementData);
    const { data, error } = await supabase
      .from("achievements")
      .insert([achievementData])
      .select();
    if (error) throw error;

    res.status(201).json(data[0]);
  } catch (err) {
    res.status(400).json({ error: err.message });
  }
});

// UPDATE
router.put("/:id", async (req, res) => {
  try {
    const data = req.body;
    delete data.id;
    delete data.created_at;
    console.log("Updating achievement with ID:", req.params.id, "Data:", data);
    const { error } = await supabase
      .from("achievements")
      .update(data)
      .eq("id", req.params.id);

    if (error) throw error;
    res.json({ message: "Updated successfully" });
  } catch (err) {
    res.status(400).json({ error: err.message });
  }
});

// DELETE
router.delete("/:id", async (req, res) => {
  try {
    const { error } = await supabase
      .from("achievements")
      .delete()
      .eq("id", req.params.id);

    if (error) throw error;
    res.json({ message: "Deleted successfully" });
  } catch (err) {
    res.status(400).json({ error: err.message });
  }
});
export default router;
