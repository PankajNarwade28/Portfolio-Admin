import express from 'express';
import { getAllProjects, createProject, deleteProject, reorderProjects, updateProject } from '../controller/projects.controller.js';
const router = express.Router();

// ✅ GET ALL PROJECTS
router.get("/", getAllProjects);
// ➕ CREATE PROJECT
router.post("/", createProject);
// ❌ DELETE PROJECT
router.delete("/:id", deleteProject);
// 🔄 REORDER PROJECTS
router.put("/reorder", reorderProjects);
// ✏️ UPDATE PROJECT
router.put("/:id", updateProject);

export default router;