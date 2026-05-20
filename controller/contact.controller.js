const axios = require("axios");

const sendContactEmail = async (req, res) => {
  const { first_name, last_name, user_email, message } = req.body;

  // Simple backend validation sanity check
  if (!first_name || !last_name || !user_email || !message) {
    return res.status(400).json({ error: "All fields are required." });
  }

  try {
    // Send request to EmailJS REST API
    const response = await axios.post(
      "https://api.emailjs.com/api/v1.0/email/send",
      {
        service_id: process.env.EMAILJS_SERVICE_ID,
        template_id: process.env.EMAILJS_TEMPLATE_ID,
        user_id: process.env.EMAILJS_PUBLIC_KEY,
        accessToken: process.env.EMAILJS_PRIVATE_KEY, // Kept hidden from client browser
        template_params: {
          first_name,
          last_name,
          user_email,
          message,
        },
      }
    );

    return res.status(200).json({
      success: true,
      message: "Message sent successfully!",
    });
  } catch (error) {
    console.error("EmailJS Server Error:", error.response?.data || error.message);
    
    // Fallback message extraction if EmailJS rejects it
    const descriptiveError = typeof error.response?.data === "string" 
      ? error.response.data 
      : "Failed to dispatch email via background server.";

    return res.status(500).json({
      error: descriptiveError,
    });
  }
};

module.exports = { sendContactEmail };