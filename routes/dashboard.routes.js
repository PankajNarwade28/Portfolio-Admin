import express from "express";
import { getDashboardSummary } from "../controller/dashboard.controller.js";
const router = express.Router();

// Route to get dashboard summary
router.get('/summary', getDashboardSummary);
export default router;