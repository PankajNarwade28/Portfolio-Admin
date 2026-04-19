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

    const { data, error } = await supabase.from("skill_items").insert([
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

// REORDER SKILLS
router.put("/reorder", async (req, res) => {
  try {
    const { items } = req.body;

    if (!Array.isArray(items) || items.length === 0) {
      return res.status(400).json({
        success: false,
        error: "items must be a non-empty array",
      });
    }

    const seenOrderIndexes = new Set();
    for (const item of items) {
      if (!item?.id || typeof item.order_index !== "number") {
        return res.status(400).json({
          success: false,
          error: "Each item must have id and numeric order_index",
        });
      }

      if (seenOrderIndexes.has(item.order_index)) {
        return res.status(400).json({
          success: false,
          error: "order_index values must be unique",
        });
      }

      seenOrderIndexes.add(item.order_index);
    }

    // Two-phase update avoids unique(category_id, order_index) collisions.
    const tempBase = 2000000000;
    const tempUpdates = items.map((item, index) =>
      supabase
        .from("skill_items")
        .update({ order_index: tempBase + index })
        .eq("id", item.id)
        .select("id")
    );

    const tempResults = await Promise.all(tempUpdates);
    const tempError = tempResults.find((r) => r.error);

    if (tempError) {
      console.error("Supabase temporary reorder error:", tempError.error);
      return res.status(500).json({
        success: false,
        error: tempError.error.message,
      });
    }

    const updates = items.map((item) =>
      supabase
        .from("skill_items")
        .update({ order_index: item.order_index })
        .eq("id", item.id)
        .select("id, order_index")
    );

    const results = await Promise.all(updates);
    const firstError = results.find((r) => r.error);

    if (firstError) {
      console.error("Supabase reorder error:", firstError.error);
      return res.status(500).json({
        success: false,
        error: firstError.error.message,
      });
    }

    const missingRow = results.find((r) => !r.data || r.data.length === 0);
    if (missingRow) {
      return res.status(404).json({
        success: false,
        error: "One or more skills were not found",
      });
    }

    const data = results.map((r) => r.data[0]);

    return res.json({
      success: true,
      data,
    });
  } catch (err) {
    console.error("Reorder route error:", err);
    return res.status(500).json({ success: false, error: err.message });
  }
});

// ✏️ UPDATE SKILL
router.put("/:id", async (req, res) => {
  try {
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

    if (error) throw error;

    res.json(data);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

router.delete("/:id", async (req, res) => {
  try {
    const { data, error } = await supabase
      .from("skill_items")
      .delete()
      .eq("id", req.params.id)
      .select(); // ✅ IMPORTANT

    if (error) throw error;

    if (!data || data.length === 0) {
      return res.status(404).json({
        message: "No row deleted (check ID or RLS)",
      });
    }

    res.json({
      message: "Skill deleted ✅",
      deleted: data,
    });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

// GET ALL CATEGORIES WITH SKILLS
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
          order_index: skill.order_index,
        })),
    }));

    res.json(result);
  } catch (err) {
    console.log(err);
    res.status(500).json({ error: err.message });
  }
});

router.put("/test", (req, res) => {
  console.log("TEST HIT!");
  res.json({ message: "Backend is reachable" });
});
module.exports = router;
