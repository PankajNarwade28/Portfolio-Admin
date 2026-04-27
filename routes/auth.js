import express from "express";
import jwt from "jsonwebtoken";

const router = express.Router();

const ADMIN_USERNAME = process.env.ADMIN_USERNAME;
const ADMIN_PASSWORD = process.env.ADMIN_PASSWORD;

// LOGIN
router.post("/login", (req, res) => {
  const { username, password } = req.body;

  if (username !== ADMIN_USERNAME || password !== ADMIN_PASSWORD) {
    return res.status(401).json({
      success: false,
      error: "Invalid credentials",
    });
  }

  const token = jwt.sign(
    { username, role: "admin" },
    process.env.JWT_SECRET,
    { expiresIn: "1h" }
  );

  res.json({
    success: true,
    token,
    user: {
      username,
      role: "admin",
    },
  });
});

// VERIFY TOKEN
router.post("/verify", (req, res) => {
  const token = req.headers.authorization?.split(" ")[1];

  if (!token) {
    return res.json({ valid: false });
  }

  try {
    jwt.verify(token, process.env.JWT_SECRET);
    res.json({ valid: true });
  } catch {
    res.json({ valid: false });
  }
});
 
// VERIFY PASSWORD
router.post("/verify-password", async (req, res) => {
  try {
    const token = req.headers.authorization?.split(" ")[1];
    const { password } = req.body;

    if (!token || !password) {
      return res.status(400).json({ valid: false });
    }

    // ✅ Verify token using Supabase
    const {
      data: { user },
      error: userError,
    } = await supabase.auth.getUser(token);

    if (userError || !user) {
      return res.json({ valid: false });
    }

    // ✅ Re-authenticate user
    const { data, error } = await supabase.auth.signInWithPassword({
      email: user.email,
      password,
    });

    if (error || !data.user) {
      return res.json({ valid: false });
    }

    return res.json({ valid: true });

  } catch (err) {
    console.error(err);
    return res.json({ valid: false });
  }
});
export default router;