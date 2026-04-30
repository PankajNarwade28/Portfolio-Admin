const express = require("express");
const supabase = require("../config/supabase"); 
const router = express.Router();

/* ================= GET DASHBOARD SUMMARY ================= */
router.get("/summary", async (req, res) => {
  try {
    // 1. Run all aggregate queries at the exact same time (parallel fetching)
    const [
      certsCountObj,
      projectsCountObj,
      messagesCountObj,
      recentCertsObj
    ] = await Promise.all([
      // Count Certifications
      supabase.from("certifications").select("*", { count: "exact", head: true }),
      
      // Count Projects (Assuming you have a projects table, change if needed)
      supabase.from("projects").select("*", { count: "exact", head: true }),
      
      // Count Messages/Contact Inquiries
      supabase.from("messages").select("*", { count: "exact", head: true }),
      
      // Fetch the 5 most recent certifications for the activity table
      supabase.from("certifications")
        .select("id, title, issuer, date, type")
        .order("id", { ascending: false })
        .limit(5)
    ]);

    // Check if any of the queries threw an error
    if (recentCertsObj.error) throw recentCertsObj.error;

    // 2. Format and send the response
    res.json({
      counts: {
        certifications: certsCountObj.count || 0,
        projects: projectsCountObj.count || 0,
        messages: messagesCountObj.count || 0,
      },
      recentActivity: recentCertsObj.data || []
    });

  } catch (err) {
    console.error("Dashboard Summary Error:", err);
    res.status(500).json({ error: err.message });
  }
});

module.exports = router;