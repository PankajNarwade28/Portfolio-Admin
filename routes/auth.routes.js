import express from 'express';
import { login, verifyToken, verifyPassword } from '../controller/auth.controller.js'; 
const router = express.Router();

router.post('/login', login);
router.post('/verify', verifyToken);
router.post('/verify-password', verifyPassword);

export default router;