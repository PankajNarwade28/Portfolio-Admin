import express from "express";
import { getResumeLink } from "../controller/links.controller.js";

const router = express.Router();
router.get("/resume", getResumeLink);

export default router;