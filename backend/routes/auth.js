const express = require("express");
const jwt = require("jsonwebtoken");
const bcrypt = require("bcryptjs");
const router = express.Router();

// In production, store this in database with hashed password
// For now, using environment variables
const ADMIN_USERNAME = process.env.ADMIN_USERNAME ;
const ADMIN_PASSWORD_HASH = process.env.ADMIN_PASSWORD_HASH;

// Login route
router.post("/login", async (req, res) => {
  try {
    const { username, password } = req.body;

    // Validate input
    if (!username || !password) {
      return res.status(400).json({ message: "Username and password are required" });
    }

    // Check username
    if (username !== ADMIN_USERNAME) {
      return res.status(401).json({ message: "Invalid credentials" });
    }

    // Verify password
    const isValidPassword = await bcrypt.compare(password, ADMIN_PASSWORD_HASH);
    
    if (!isValidPassword) {
      return res.status(401).json({ message: "Invalid credentials" });
    }

    // Generate JWT token
    const token = jwt.sign(
      { 
        username: username,
        role: "admin" 
      }, 
      process.env.JWT_SECRET, 
      { expiresIn: "1h" }
    );

    res.json({ 
      token,
      user: {
        username: username,
        role: "admin"
      }
    });
  } catch (error) {
    console.error("Login error:", error);
    res.status(500).json({ message: "Internal server error" });
  }
});

// Verify token route (optional - for frontend to validate existing tokens)
router.post("/verify", (req, res) => {
  const token = req.headers["authorization"]?.split(" ")[1];
  
  if (!token) {
    return res.status(403).json({ valid: false, message: "No token provided" });
  }

  jwt.verify(token, process.env.JWT_SECRET, (err, decoded) => {
    if (err) {
      return res.status(401).json({ valid: false, message: "Invalid or expired token" });
    }
    res.json({ valid: true, user: decoded });
  });
});

// Logout route (optional - mainly for cleanup)
router.post("/logout", (req, res) => {
  // In a JWT system, logout is handled client-side by removing the token
  // This endpoint is here for completeness
  res.json({ message: "Logged out successfully" });
});

module.exports = router;
