import express from 'express';   
import { getBackendStatus, getDatabaseStatus , getAvailabilityStatus } from '../controller/status.controller.js';
const router = express.Router();

// ✅ Backend Health Check
router.get("/backend", getBackendStatus);
// ✅ Database (Supabase) Health Check
router.get("/database", getDatabaseStatus);

router.get("/availability", getAvailabilityStatus);

export default router;