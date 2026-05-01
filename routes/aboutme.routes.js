import express from "express";
import {
  getAboutMe,
  updateAboutMe,
  getProfessionalTitles,
  addProfessionalTitle,
  deleteProfessionalTitle,
} from "../controller/aboutme.controller.js";
const router = express.Router();


// Route to get about me information
router.get("/", getAboutMe);
router.put("/", updateAboutMe);
router.get("/titles", getProfessionalTitles);
router.post("/titles", addProfessionalTitle);
router.delete("/titles/:index", deleteProfessionalTitle);

export default router;
