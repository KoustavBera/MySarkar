import express from 'express';
import { saveUserInteraction } from '../controllers/scheme.controller.js';
import { authenticateToken } from '../middleware/auth.middleware.js';

const router = express.Router();

router.post('/interaction', authenticateToken, saveUserInteraction);

export default router;