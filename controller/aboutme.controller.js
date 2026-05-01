import supabase from "../config/supabase.js";
const PROFILE_ID = "4fd12d4b-a1f8-47d4-9f5e-da9f1bd21437";

// 🟢 GET: Fetch the single profile
const getAboutMe = async (req, res) => {
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
};

// 🔵 UPDATE: Only update the existing record
const updateAboutMe = async (req, res) => {
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
    if (data.length === 0)
      return res.status(404).json({ error: "Record not found" });

    res.json({ success: true, data: data[0] });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};

// Professional Titles Endpoints
const getProfessionalTitles = async (req, res) => {
  try {
    const { data, error } = await supabase
      .from("personal_info")
      .select("professional_titles")
      .single();

    if (error) throw error;

    res.json(data.professional_titles || []);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};


// Add a new title to the array
const addProfessionalTitle = async (req, res) => {
  try {
    const { title } = req.body;

    const { data } = await supabase
      .from("personal_info")
      .select("professional_titles")
      .single();

    const updated = [...(data.professional_titles || []), title];

    await supabase
      .from("personal_info")
      .update({ professional_titles: updated })
      .eq("id", 1);

    res.json({ message: "Added ✅" });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};

// Delete a title by index
const deleteProfessionalTitle = async (req, res) => {
  try {
    const index = Number.parseInt(req.params.index);

    const { data } = await supabase
      .from("personal_info")
      .select("professional_titles")
      .single();

    const updated = data.professional_titles.filter((_, i) => i !== index);

    await supabase
      .from("personal_info")
      .update({ professional_titles: updated })
      .eq("id", 1);

    res.json({ message: "Deleted ✅" });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};


export {
  getAboutMe,
  updateAboutMe,
  getProfessionalTitles,
  addProfessionalTitle,
  deleteProfessionalTitle
};