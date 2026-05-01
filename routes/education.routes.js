import express from 'express';
import { getAllEducation, addEducation, updateEducation} from '../controller/education.controller.js';

const router = express.Router();

// ✅ GET all education (sorted latest first)
router.get("/", getAllEducation);
// ✅ ADD education
router.post("/", addEducation);
// ✅ UPDATE education
router.put("/:id", updateEducation);
export default router;