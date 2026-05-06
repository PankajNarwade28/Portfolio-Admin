import supabase from "../config/supabase.js";

// Get only the resume URL
const getResumeLink = async (req, res) => {
  try {
    const { data, error } = await supabase
      .from("personal_info")
      .select("resume_url")
      .single(); // Assuming only one record for personal info

    if (error) throw error;
    res.json(data);
  } catch (err) {
    console.error("GET RESUME ERROR:", err);
    res.status(500).json({ error: "Failed to fetch resume link" });
  }
};

// Get all social/contact links for MyLinks.jsx
const getAllLinks = async (req, res) => {
  try {
    const { data, error } = await supabase
      .from("social_links") // Assuming you have a table named 'social_links'
      .select("*")
      .order("id", { ascending: true }); // ✅ Sorts by ID in ascending order

    if (error) {
      // This will show you exactly what Supabase doesn't like
      console.error("Supabase Error Details:", error.message, error.hint); 
      return res.status(400).json({ error: error.message });
    }

    res.json(data);
  } catch (err) {
    res.status(500).json({ error: "Server crashed" });
  }
};

// Update a specific link (Used by handleUpdate in MyLinks.jsx)
const updateLink = async (req, res) => {
  try {
    const { id } = req.params;
    const { display_text, link_url, logo_image_url } = req.body;

    const { data, error } = await supabase
      .from("social_links")
      .update({ display_text, link_url, logo_image_url })
      .eq("id", id)
      .select();

    if (error) throw error;
    res.json({ message: "Link updated successfully", data });
  } catch (err) {
    console.error("UPDATE LINK ERROR:", err);
    res.status(500).json({ error: "Failed to update link" });
  }
};

export { getResumeLink, getAllLinks, updateLink };