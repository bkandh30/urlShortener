import { Router } from "express";
import type { Request, Response } from "express";
import { prisma } from '../lib/prisma.js';
import { asyncHandler } from '../middlewares/error.js';
import { makeShortId } from "../lib/id.js";
import { linkCreationLimiter } from "../lib/rateLimit.js";
import { normalizeAndValidateUrl, ValidationError } from "../lib/validate.js";
import { createLinkSchema, ERROR_CODES, DEFAULTS } from "@bkandh30/common-url-shortener";

const router = Router();

router.get('/healthz', (req: Request, res: Response) => {
    res.json({
        status: 'ok',
        timestamp: new Date().toISOString()
    });
});

router.get('/db-check', asyncHandler(async (req: Request, res: Response) => {
    const count = await prisma.link.count();
    res.json({
        status: 'connected',
        links: count
    });
}));

router.post('/links', linkCreationLimiter, asyncHandler(async (req: Request, res: Response) => {
    const validationResult = createLinkSchema.safeParse(req.body);

    if (!validationResult.success) {
        return res.status(400).json({
            error: {
                code: ERROR_CODES.INVALID_URL,
                message: validationResult.error.issues[0]?.message || 'Invalid request body'
            }
        });
    }

    const { longUrl } = validationResult.data;
    
    let normalizedUrl: string;
    try {
        normalizedUrl = normalizeAndValidateUrl(longUrl);
    } catch (error) {
        if (error instanceof ValidationError) {
            return res.status(400).json({
                error: {
                    code: error.code || ERROR_CODES.INVALID_URL,
                    message: error.message
                }
            });
        }
        throw error;
    }

    const shortId = await makeShortId(async (id) => {
        const existing = await prisma.link.findUnique({
            where: { shortId: id }
        });
        return existing !== null;
    });

    const expiresAt = new Date();
    expiresAt.setDate(expiresAt.getDate() + DEFAULTS.EXPIRY_DAYS);

    const link = await prisma.link.create({
        data: {
            shortId,
            longUrl: normalizedUrl,
            expiresAt,
            clicks: 0
        },
        select: {
            shortId: true,
            longUrl: true,
            createdAt: true,
            expiresAt: true
        }
    });


    res.status(201).json({
        shortId: link.shortId,
        longUrl: link.longUrl,
        createdAt: link.createdAt.toISOString(),
        expiresAt: link.expiresAt.toISOString()
    });
}));


export default router;