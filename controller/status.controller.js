
import supabase from "../config/supabase.js";
 
// ✅ Backend Health Check
const getBackendStatus = (req, res) => {
  res.json({
    status: "ONLINE",
    timestamp: new Date(),
  });
};

// ✅ Database (Supabase) Health Check
const getDatabaseStatus = async (req, res) => {
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
};

export { getBackendStatus, getDatabaseStatus };