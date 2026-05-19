import express from "express";
import cors from "cors";
import dotenv from "dotenv";
dotenv.config(); 
const PORT = process.env.PORT || 3000; 
const app = express();

// 2. Configure CORS - This is the MOST IMPORTANT PART
app.use(
  cors({
    origin: [
      "http://localhost:3000",
      "https://pankajnarwade.vercel.app",
      "https://pankajnarwade-i3hs5mpce-pankajnarwade28s-projects.vercel.app",
      "https://pankajnarwade-git-main-pankajnarwade28s-projects.vercel.app",
      "https://pankajnarwade-3e13xlkbd-pankajnarwade28s-projects.vercel.app/",
    ],
    methods: ["GET", "POST", "PUT", "DELETE"],
    allowedHeaders: ["Content-Type", "Authorization"],
    credentials: true,
  }),
);

app.use(express.json());

// ✅ Simple request logger (optional, but helpful for debugging)
app.use((req, res, next) => {
  console.log(`${req.method} request to ${req.url}`);
  next();
});
 
import { authenticate } from "./middleware/auth.js";

// Route imports
import authRoutes from "./routes/auth.routes.js";
import skillCategoryRoutes from "./routes/skillcategories.routes.js";
import uploadRoutes from "./routes/upload.routes.js";
import skillsRoutes from "./routes/skills.routes.js";
import aboutMeRoutes from "./routes/aboutme.routes.js";
import educationRoutes from "./routes/education.routes.js";
import personalInfoRoutes from "./routes/personalInfo.routes.js";
import achievementRoutes from "./routes/achievements.routes.js";
import projectsRoutes from "./routes/projects.routes.js";
import certificateRoutes from "./routes/certificates.routes.js";
import linksRoutes from "./routes/links.routes.js";
import dashboardRoutes from "./routes/dashboard.routes.js";
import statusRoutes from "./routes/status.routes.js";
 
// -------------------- Public Routes --------------------
app.get("/", (req, res) => {
  res.send(`Server is running on port ${PORT}`);
});

app.get("/api/status", (req, res) => {
  res.json({
    status: "OK",
    message: "Backend is running fine 🚀",
  });
});

// -------------------- Feature Routes --------------------
app.use("/api/auth", authRoutes);
app.use("/api/upload", uploadRoutes);
app.use("/api/categories", skillCategoryRoutes);
app.use("/api/skills", skillsRoutes);
app.use("/api/aboutme", aboutMeRoutes);
app.use("/api/education", educationRoutes);
app.use("/api/personal", personalInfoRoutes);
app.use("/api/achievements", achievementRoutes);
app.use("/api/projects", projectsRoutes);
app.use("/api/certificates", certificateRoutes);
app.use("/api/links", linksRoutes);
app.use("/api/dashboard", dashboardRoutes);
app.use("/api/status", statusRoutes); 
// -------------------- Protected Routes --------------------
app.get("/api/admin", authenticate, (req, res) => {
  res.json({
    message: "Welcome Admin!",
    user: req.user,
  });
});

// -------------------- Server Startup --------------------
app.listen(PORT, () => {
  console.log(`✅ Server is running at http://localhost:${PORT}`);
  console.log(`🌍 Environment: ${process.env.ENVIROMENT || "development"}`);
});
