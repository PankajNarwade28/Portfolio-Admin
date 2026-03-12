const express = require("express");
const cors = require("cors");
require("dotenv").config();
const PORT = process.env.PORT || 3000; 
const app = express();

// CORS configuration
const corsOptions = {
  origin: function (origin, callback) {
    // Allow requests with no origin (like mobile apps or curl requests)
    if (!origin) return callback(null, true);
    
    const allowedOrigins = [
      'http://localhost:3000',
      'http://localhost:5173',
      'http://localhost:5174',
      process.env.FRONTEND_URL
    ].filter(Boolean); // Remove undefined values
    
    if (allowedOrigins.indexOf(origin) !== -1) {
      callback(null, true);
    } else {
      callback(null, true); // Allow all origins in development
    }
  },
  credentials: true,
  methods: ['GET', 'POST', 'PUT', 'DELETE', 'PATCH', 'OPTIONS'],
  allowedHeaders: ['Content-Type', 'Authorization'],
  exposedHeaders: ['Content-Length', 'X-Request-Id'],
  maxAge: 86400 // 24 hours
};

app.use(cors(corsOptions));
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
