import supabase from "../config/supabase.js";
const getResumeLink = async (req, res) => {
  try {
    const { data, error } = await supabase
      .from("personal_info")
      .select("resume_url");

    if (error) {
      console.error("Supabase Resume Error:", error);
      throw error;
    }

    res.json(data);
  } catch (err) {
    console.error("GET RESUME ERROR:", err);
    res.status(500).json({ error: "Failed to fetch resume link" });
  }
};

export { getResumeLink };