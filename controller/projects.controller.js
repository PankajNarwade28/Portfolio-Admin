import supabase from "../config/supabase.js";
/* =========================
   🟢 GET ALL PROJECTS
========================= */
const getAllProjects = async (req, res) => {
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
};

/* =========================
   🟢 CREATE PROJECT
========================= */
const createProject = async (req, res) => {
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
};

/* =========================
   🔴 DELETE PROJECT
========================= */
const deleteProject = async (req, res) => {
  try {
    const { id } = req.params;

    const { error } = await supabase.from("projects").delete().eq("id", id);

    if (error) throw error;

    res.json({ success: true, message: "Deleted ✅" });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};

/* =========================
   🟡 REORDER PROJECTS
========================= */
const reorderProjects = async (req, res) => {
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
};

/* =========================
   🔵 UPDATE PROJECT
========================= */
const updateProject = async (req, res) => {
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
};

export {
  getAllProjects,
  createProject,
  deleteProject,
  reorderProjects,
  updateProject,
};
