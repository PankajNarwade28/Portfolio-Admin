import supabase from "../config/supabase.js";

// ✅ GET personal information
const getPersonalInfo = async (req, res) => {
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
};

// ✅ UPDATE one tech
const updateTech = async (req, res) => {
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
};

// ✅ GET social links
const getSocialLinks = async (req, res) => {
  try {
    const { data, error } = await supabase.from("social_links").select("*");

    if (error) {
      console.error("Supabase Social Links Error:", error);
      throw error;
    }
    res.json(data);
  } catch (err) {
    console.error("GET SOCIAL LINKS ERROR:", err);
    res.status(500).json({ error: "Failed to fetch social links" });
  }
};

// ✅ UPDATE one social link  Personal_Info Table
const updatePersonalInfo = async (req, res) => {
  try {
    const {
      current_company,
      designation,
      is_available,
      profile_img,
      resume_url,
      professional_titles,
    } = req.body;

    const { data, error } = await supabase
      .from("personal_info")
      .update({
        current_company,
        designation,
        is_available,
        profile_img,
        resume_url,
        professional_titles,
      })
      .eq("id", 1)
      .select()
      .single();

    if (error) throw error;

    res.json({
      message: "Updated successfully ✅",
      data,
    });
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: err.message });
  }
}; 

// ✅ GET tech information
const getTechInfo = async (req, res) => { 
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
};
export {
  getPersonalInfo,
  updatePersonalInfo,
  getSocialLinks,
  updateTech, 
  getTechInfo
};

