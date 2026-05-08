
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
    const {  error } = await supabase
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


// ✅ Get Availability Status
const getAvailabilityStatus = async (req, res) => {
  try {
    const { data, error } = await supabase
      .from("personal_info")
      .select("is_available")
      .single();

    if (error) throw error;

    res.status(200).json({
      success: true,
      is_available: data.is_available,
    });
  } catch (err) {
    res.status(500).json({
      success: false,
      message: "Failed to fetch availability status",
      error: err.message,
    });
  }
}; 

export { getBackendStatus, getDatabaseStatus , getAvailabilityStatus};