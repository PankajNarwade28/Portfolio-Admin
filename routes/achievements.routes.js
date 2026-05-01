import express from 'express';
import { getAllAchievements, createAchievement, updateAchievement, deleteAchievement } from '../controller/achievements.controller.js';
const router = express.Router();

// Get all achievements
router.get("/", getAllAchievements);
// Create a new achievement
router.post("/", createAchievement);
// Update an achievement
router.put("/:id", updateAchievement);
// Delete an achievement
router.delete("/:id", deleteAchievement);

export default router;