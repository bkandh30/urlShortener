import { prisma } from "../lib/prisma.js";
import { Router } from "express";
import type { Request, Response } from "express";
import { asyncHandler } from "../middlewares/error.js";
import { hashIP, getClientIP } from "../lib/hash.js";
import { DEFAULTS } from "@bkandh30/common-url-shortener";

const router = Router();

router.get('/:shortId', asyncHandler(async (req: Request, res: Response) => {
    const { shortId } = req.params;

    if (!shortId) {
        return res.status(404).send('Link not found');
    }

    const link = await prisma.link.findUnique({
        where: { shortId }
    });

    if (!link) {
        return res.status(404).send(`
        <!DOCTYPE html>
        <html>
            <head>
            <title>404 - Link Not Found</title>
            <style>
                body { 
                font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', sans-serif;
                display: flex;
                justify-content: center;
                align-items: center;
                height: 100vh;
                margin: 0;
                background: #f5f5f5;
                }
                .container {
                text-align: center;
                padding: 2rem;
                background: white;
                border-radius: 8px;
                box-shadow: 0 2px 4px rgba(0,0,0,0.1);
                }
                h1 { color: #333; margin-bottom: 0.5rem; }
                p { color: #666; margin-top: 0.5rem; }
            </style>
            </head>
            <body>
            <div class="container">
                <h1>404</h1>
                <p>Link not found</p>
            </div>
            </body>
        </html>
        `);
    }

    if (new Date() > link.expiresAt) {
        return res.status(410).send(`
        <!DOCTYPE html>
        <html>
            <head>
            <title>410 - Link Expired</title>
            <style>
                body { 
                font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', sans-serif;
                display: flex;
                justify-content: center;
                align-items: center;
                height: 100vh;
                margin: 0;
                background: #f5f5f5;
                }
                .container {
                text-align: center;
                padding: 2rem;
                background: white;
                border-radius: 8px;
                box-shadow: 0 2px 4px rgba(0,0,0,0.1);
                }
                h1 { color: #333; margin-bottom: 0.5rem; }
                p { color: #666; margin-top: 0.5rem; }
                .expired { color: #d73a49; font-weight: 500; }
            </style>
            </head>
            <body>
            <div class="container">
                <h1>410</h1>
                <p class="expired">This link has expired</p>
                <p>Links expire after ${DEFAULTS.EXPIRY_DAYS} days</p>
            </div>
            </body>
        </html>
        `);
    }

    const clientIP = getClientIP(req);
    const ipHash = clientIP !== 'unknown' ? hashIP(clientIP) : null;
    const rawUserAgent = req.headers['user-agent'];
    const rawReferer = req.headers['referer'];

    const userAgent = Array.isArray(rawUserAgent) ? rawUserAgent[0] : rawUserAgent;
    const referer = Array.isArray(rawReferer) ? rawReferer[0] : rawReferer;

    await prisma.link.update({
        where: { id: link.id },
        data: {
            clicks: { increment: 1 },
            lastAccess: new Date()
        }
    });
    
    prisma.click.create({
        data: {
            linkId: link.id,
            ipHash,
            userAgent: userAgent ? userAgent.substring(0, 255) : null,
            referrer: referer ? referer.substring(0, 255) : null
        }
    }).catch(error => {
        console.error('Telemetry error:', error);
    });

    res.redirect(301, link.longUrl);
}));

export default router;