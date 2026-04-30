import express from "express";
import cors from "cors";   
import dotenv from "dotenv"; 
dotenv.config(); 
import pool from "./config/db.js";
const PORT = process.env.PORT || 3000; 
const app = express(); 

// 2. Configure CORS - This is the MOST IMPORTANT PART
app.use(cors({
  origin: [
    'http://localhost:3000', 
    'https://pankajnarwade.vercel.app',
    'https://pankajnarwade-i3hs5mpce-pankajnarwade28s-projects.vercel.app',
    'https://pankajnarwade-git-main-pankajnarwade28s-projects.vercel.app'
  ],
  methods: ['GET', 'POST', 'PUT', 'DELETE'],
  allowedHeaders: ['Content-Type', 'Authorization'],
  credentials: true
}));

app.use(express.json());

app.use((req, res, next) => {
  console.log(`${req.method} request to ${req.url}`);
  next();
});

pool.query("SELECT NOW()", (err, res) => {
  if (err) {
    console.error("Database Error:", err);
  } else {
    console.log("Connected to DB:", res.rows);
  }
});


 
import authRoutes from "./routes/auth.js";
import { authenticate } from "./middleware/auth.js";
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
import categoryRoutes from "./routes/categories.js"; 
import uploadRoutes from "./routes/upload.js";
 
app.use("/api/upload", uploadRoutes);
app.use("/api/categories", categoryRoutes); 
import skillRoutes from "./routes/skills.js";
app.use('/api/skills', skillRoutes); 
import aboutMeRoutes from "./routes/aboutme.js";
app.use('/api/about-me', aboutMeRoutes); 
import educationRoutes from "./routes/education.js";
app.use("/api/education", educationRoutes);
import personalInfoRoutes from "./routes/personalInfo.js";
app.use("/api/personal", personalInfoRoutes);
import achievementRoutes from "./routes/achievements.js";
app.use("/api/achievements", achievementRoutes);
import projectRoutes from "./routes/projects.js";
app.use("/api/projects", projectRoutes); 
import certificateRoutes from "./routes/certificates.js";
app.use("/api/certificates", certificateRoutes);

// Protected routes (example)
app.get("/api/admin", authenticate, (req, res) => {
  res.json({ 
    message: "Welcome Admin!",
    user: req.user
  });

});

// routes
import statusRoutes from "./routes/status.js";
app.use("/api/status", statusRoutes);



app.listen(PORT, () => {
  console.log(`Server is running on port http://${process.env.ENVIROMENT}`);
});
