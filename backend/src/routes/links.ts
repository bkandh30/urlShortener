import { Router } from "express";
import type { Request, Response } from "express";
import { prisma } from '../lib/prisma.js';
import { asyncHandler } from '../middlewares/error.js';
import { makeShortId } from "../lib/id.js";
import { normalizeAndValidateUrl, ValidationError } from "../lib/validate.js";
// import { createLinkSchema, ERROR_CODES, DEFAULTS } from "@bkandh30/common-url-shortener";
import { makeQrPng, makeQrSvg } from "../lib/qr.js";

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

router.post('/links', require("../lib/rateLimit.js").linkCreationLimiter, asyncHandler(async (req: Request, res: Response) => {
    const { createLinkSchema, ERROR_CODES, DEFAULTS } = await import('@bkandh30/common-url-shortener');
    
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
        normalizedUrl = await normalizeAndValidateUrl(longUrl);
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

router.get('/links/:shortId', asyncHandler(async (req: Request, res: Response) => {
    const { ERROR_CODES } = await import('@bkandh30/common-url-shortener');
    const { shortId } = req.params;

    if (!shortId) {
        return res.status(404).json({
            error: {
                code: ERROR_CODES.NOT_FOUND,
                message: 'Link not found'
            }
        });
    }

    const link = await prisma.link.findUnique({
        where: { shortId }
    });

    if (!link) {
        return res.status(404).json({
            error: {
                code: ERROR_CODES.NOT_FOUND,
                message: 'Link not found'
            }
        });
    }

    res.json({
        shortId: link.shortId,
        longUrl: link.longUrl,
        clicks: link.clicks,
        createdAt: link.createdAt.toISOString(),
        lastAccess: link.lastAccess?.toISOString() || null,
        expiresAt: link.expiresAt.toISOString(),
        status: new Date() > link.expiresAt ? 'expired' : 'active'
    });
}));

router.get('/links/:shortId/qr', asyncHandler(async (req: Request, res: Response) => {
    const { ERROR_CODES } = await import('@bkandh30/common-url-shortener');
    const { shortId } = req.params;

    if (!shortId) {
        return res.status(404).json({
            error: {
                code: ERROR_CODES.NOT_FOUND,
                message: 'Link not found'
            }
        });
    }

    const fmt = (req.query.fmt as string) || 'png';
    const size = parseInt(req.query.size as string) || 256;
    const margin = parseInt(req.query.margin as string) || 2;

    if (!['png', 'svg'].includes(fmt)) {
        return res.status(400).json({
            error: {
                code: ERROR_CODES.INVALID_URL,
                message: 'Invalid format. Use png or svg'
            }
        });
    }
    
    const validSize = Math.min(Math.max(size, 64), 1024);

    const validMargin = Math.min(Math.max(margin, 0), 10);

    const link = await prisma.link.findUnique({
        where: { shortId },
        select: { shortId: true }
    });

    if (!link) {
        return res.status(404).json({
            error: {
                code: ERROR_CODES.NOT_FOUND,
                message: 'Link not found'
            }
        });
    }

    const siteBaseUrl = process.env.SITE_BASE_URL || `http://localhost:${process.env.PORT || 8080}`;
    const fullShortUrl = `${siteBaseUrl}/${shortId}`;

    try {
        if (fmt === 'png') {
            const qrBuffer = await makeQrPng(fullShortUrl, {
                size: validSize,
                margin: validMargin
            });

            res.setHeader('Content-Type', 'image/png');
            res.setHeader('Cache-Control', 'public, max-age=300');
            res.send(qrBuffer);
        } else {
            const qrSvg = await makeQrSvg(fullShortUrl, {
                size: validSize,
                margin: validMargin
            });

            res.setHeader('Content-Type', 'image/svg+xml');
            res.setHeader('Cache-Control', 'public, max-age=300');
            res.send(qrSvg);
        }
    } catch (error) {
        console.error('QR generation error:', error);
        res.status(500).json({
            error: {
                code: ERROR_CODES.INTERNAL,
                message: 'Failed to generate QR code'
            }
        });
    }
}));

export default router;