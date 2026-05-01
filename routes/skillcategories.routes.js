import express from 'express';
import { getAllCategories , 
    createCategory,
    updateCategory,
    deleteCategory
 } from '../controller/skillcategories.controller.js';
const router = express.Router();

// ✅ GET ALL CATEGORIES + SKILLS
router.get("/", getAllCategories);
// ➕ CREATE CATEGORY (WITH ORDER SHIFT)
router.post("/", createCategory);
// ✏️ UPDATE CATEGORY
router.put("/:id", updateCategory);
// ❌ DELETE CATEGORY (AUTO DELETE SKILLS via CASCADE)
router.delete("/:id", deleteCategory);

export default router;