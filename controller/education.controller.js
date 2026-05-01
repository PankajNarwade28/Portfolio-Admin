import supabase from "../config/supabase.js";

// ✅ GET all education (sorted latest first)
const getAllEducation = async (req, res) => {
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
};

// ✅ ADD education
const addEducation = async (req, res) => {
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
};

// ✅ UPDATE education
const updateEducation = async (req, res) => {
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
};

export { getAllEducation, addEducation, updateEducation };
