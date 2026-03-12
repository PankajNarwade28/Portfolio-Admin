const express = require("express");
const cors = require("cors");
require("dotenv").config();
const PORT = process.env.PORT || 3000; 
const app = express();
app.use(cors());
app.use(express.json());

// Import routes
const authRoutes = require("./routes/auth");
const { authenticate } = require("./middleware/auth");

// Public routes
app.get("/", (req, res) => {
  res.send("Server is running on port 5000");
});

app.get("/api/status", (req, res) => {
  res.json({
    status: "OK",
    message: "Backend is running fine 🚀",
  });
});

// Auth routes
app.use("/api/auth", authRoutes);

// Protected routes (example)
app.get("/api/admin", authenticate, (req, res) => {
  res.json({ 
    message: "Welcome Admin!",
    user: req.user
  });
});

app.listen(PORT, () => {
  console.log(`Server is running on port http://${process.env.ENVIROMENT || 'localhost'}:${PORT}/`);
});
