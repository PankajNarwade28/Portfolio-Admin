
import supabase from "../config/supabase.js";
 

// ✅ GET ALL CATEGORIES + SKILLS
const getAllCategories = async (req, res) => {
  try {
    const { data, error } = await supabase
      .from("skill_categories")
      .select(`
        id,
        title,
        icon_url,
        order_index,
        skill_items (
          id,
          skill_name,
          percentage,
          emoji,
          print_statement,
          order_index
        )
      `)
      .order("order_index", { ascending: true })
      .order("order_index", { foreignTable: "skill_items" });

    if (error) throw error;

    res.json(data);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};


// ➕ CREATE CATEGORY (WITH ORDER SHIFT)
const createCategory = async (req, res) => {
  try {
    let { title, icon_url, order_index } = req.body;

    if (!title) {
      return res.status(400).json({ error: "Title is required" });
    }

    // default order
    if (!order_index) order_index = 1;

    // Shift existing categories
    await supabase.rpc("shift_category_order", {
      pos: order_index,
    });

    // Insert new category
    const { data, error } = await supabase
      .from("skill_categories")
      .insert([{ title, icon_url, order_index }]);

    if (error) throw error;

    res.json(data);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};


// ✏️ UPDATE CATEGORY
const updateCategory = async (req, res) => {
  try {
    const { title, icon_url } = req.body;

    const { data, error } = await supabase
      .from("skill_categories")
      .update({ title, icon_url })
      .eq("id", req.params.id);

    if (error) throw error;

    res.json(data);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
} ;


// ❌ DELETE CATEGORY (AUTO DELETE SKILLS via CASCADE)
const deleteCategory = async (req, res) => {
  try {
    const id = req.params.id;

    // 1️⃣ Get category first
    const { data: category, error: fetchError } = await supabase
      .from("skill_categories")
      .select("icon_url")
      .eq("id", id)
      .single();

    if (fetchError) throw fetchError;

    // 2️⃣ Extract file name from URL
    if (category?.icon_url) {
      const fileName = category.icon_url.split("/").pop();

      console.log("Deleting image:", fileName);

      // 3️⃣ Delete from storage
      const { error: storageError } = await supabase.storage
        .from("images")
        .remove([fileName]);

      if (storageError) {
        console.log("Storage delete error:", storageError);
      }
    }

    // 4️⃣ Delete category
    const { error: deleteError } = await supabase
      .from("skill_categories")
      .delete()
      .eq("id", id);

    if (deleteError) throw deleteError;

    res.json({ message: "Category + Image deleted successfully" });

  } catch (err) {
    console.log(err);
    res.status(500).json({ error: err.message });
  }
};

export { getAllCategories, createCategory, updateCategory, deleteCategory };