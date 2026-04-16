const express = require("express");
const supabase = require("../config/supabase");
const router = express.Router();


// ➕ ADD SKILL (WITH ORDER SHIFT)
router.post("/", async (req, res) => {
  try {
    let {
      skill_name,
      percentage,
      emoji,
      print_statement,
      order_index,
      category_id,
    } = req.body;

    await supabase.rpc("shift_skill_order", {
      cat_id: category_id,
      pos: order_index,
    });

    const { data, error } = await supabase
      .from("skill_items")
      .insert([
        {
          skill_name,
          percentage,
          emoji: emoji || "💡",
          print_statement,
          order_index,
          category_id,
        },
      ]);

    if (error) throw error;

    res.json(data);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});


// ✏️ UPDATE SKILL
router.put("/:id", async (req, res) => {
  const { skill_name, percentage, emoji, print_statement } = req.body;

  const { data, error } = await supabase
    .from("skill_items")
    .update({
      skill_name,
      percentage,
      emoji,
      print_statement,
    })
    .eq("id", req.params.id);

  res.json(data);
});


// ❌ DELETE SKILL
router.delete("/:id", async (req, res) => {
  try {
    const { error } = await supabase
      .from("skill_items")
      .delete()
      .eq("id", req.params.id);

    if (error) throw error;

    res.json({ message: "Skill deleted" });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});


// 🔄 REORDER SKILLS (DRAG-DROP SUPPORT)
router.put("/reorder", async (req, res) => {
  try {
    const updates = req.body; 
    // [{id, order_index}]

    const promises = updates.map((item) =>
      supabase
        .from("skill_items")
        .update({ order_index: item.order_index })
        .eq("id", item.id)
    );

    await Promise.all(promises);

    res.json({ message: "Reordered successfully" });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

// ✅ GET SKILLS (FRONTEND FORMAT)
router.get("/", async (req, res) => {
  try {
    // 1️⃣ Fetch categories
    const { data: categories, error: catError } = await supabase
      .from("skill_categories")
      .select("*")
      .order("order_index", { ascending: true });

    if (catError) throw catError;

    // 2️⃣ Fetch skills
    const { data: skills, error: skillError } = await supabase
      .from("skill_items")
      .select("*")
      .order("order_index", { ascending: true });

    if (skillError) throw skillError;

    // 3️⃣ Map data (IMPORTANT 🔥)
    const result = categories.map((cat) => ({
      id: cat.id,
      title: cat.title,
      icon_url: cat.icon_url,
      skill_items: skills
        .filter((skill) => skill.category_id === cat.id)
        .map((skill) => ({
          id: skill.id,
          skill_name: skill.skill_name,
          percentage: skill.percentage,
          emoji: skill.emoji || "💡",
          print_statement: skill.print_statement,
        })),
    }));

    res.json(result);

  } catch (err) {
    console.log(err);
    res.status(500).json({ error: err.message });
  }
});


module.exports = router;