
const express = require("express");
const router = express.Router();
const { createClient } = require("@supabase/supabase-js");

const supabase = createClient(
  process.env.REACT_APP_SUPABASE_URL,
  process.env.REACT_APP_SUPABASE_PUBLISHABLE_KEY
);

// ✅ Backend Health Check
router.get("/backend", (req, res) => {
  res.json({
    status: "ONLINE",
    timestamp: new Date(),
  });
});

// ✅ Database (Supabase) Health Check
router.get("/database", async (req, res) => {
  try {
    const { data, error } = await supabase
      .from("Status") // any table you already have
      .select("*")
      .limit(1);

    if (error) throw error;

    res.json({
      status: "CONNECTED",
      timestamp: new Date(),
    });
  } catch (err) {
    res.status(500).json({
      status: "DISCONNECTED",
      error: err.message,
    });
  }
});

module.exports = router;