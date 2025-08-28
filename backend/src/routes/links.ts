import { Router } from "express";
import { prisma } from '../lib/prisma.js';
import { asyncHandler } from '../middlewares/error.js';

const router = Router();

router.get('/healthz', (req, res) => {
    res.json({
        status: 'ok',
        timestamp: new Date().toISOString()
    });
});

router.get('/db-check', asyncHandler(async (req, res) => {
    const count = await prisma.link.count();
    res.json({
        status: 'connected',
        links: count
    });
}));

export default router;