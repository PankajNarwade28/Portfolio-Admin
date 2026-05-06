import express from "express";
import { 
  getResumeLink, 
  getAllLinks, 
  updateLink 
} from "../controller/links.controller.js";

const router = express.Router();

// GET /api/personal/links/resume
router.get("/resume", getResumeLink);

// GET /api/personal/links (Fetched by MyLinks.jsx)
router.get("/", getAllLinks);

// PUT /api/personal/links/:id (Called by handleUpdate in MyLinks.jsx)
router.put("/:id", updateLink);

export default router;