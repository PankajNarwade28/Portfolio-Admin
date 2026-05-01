import express from "express";
import {
 getPersonalInfo,
  updatePersonalInfo,
  getSocialLinks,
  updateTech, 
  getTechInfo
} from "../controller/personalInfo.controller.js";
const router = express.Router();

// ✅ GET personal information
router.get("/info", getPersonalInfo);
// ✅ UPDATE personal information
router.put("/info", updatePersonalInfo);
// ✅ GET social links
router.get("/links", getSocialLinks);
// ✅ UPDATE one tech
router.put("/tech/:id", updateTech); 
// ✅ GET tech information
router.get("/tech", getTechInfo);

export default router;  