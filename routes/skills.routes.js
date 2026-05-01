import express from 'express';
import { addSkill,
  reorderSkills,
  updateSkill,
  deleteSkill,
  getSkillsWithCategories,
   } from '../controller/skills.controller.js';
const router = express.Router();

// ✅ GET ALL CATEGORIES WITH SKILLS
router.get("/", getSkillsWithCategories);
// ➕ ADD SKILL
router.post("/", addSkill);
// 🔄 REORDER SKILLS
router.put("/reorder", reorderSkills);
// ✏️ UPDATE SKILL
router.put("/:id", updateSkill);
// ❌ DELETE SKILL
router.delete("/:id", deleteSkill); 

export default router;