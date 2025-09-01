import type { Request, Response, NextFunction } from 'express';

export async function linkCreationLimiter(req: Request, res: Response, next: NextFunction) {
    const rateLimit = (await import('express-rate-limit')).default;
    const { ERROR_CODES } = await import('@bkandh30/common-url-shortener');

    const limiter = rateLimit({
        windowMs: Number(process.env.RATE_LIMIT_WINDOW_MS) || 60000,
        max: Number(process.env.RATE_LIMIT_MAX) || 20,
        message: 'Too many links created from this IP, please try again later.',
        standardHeaders: true,
        legacyHeaders: false,
        handler: (req, res) => {
            res.status(429).json({
                error: {
                    code: ERROR_CODES.RATE_LIMITED,
                    message: 'Too many links created from this IP, please try again later.',
                }
            });
        },
        keyGenerator: (req) => {
            return req.headers['x-forwarded-for']?.toString().split(',')[0]?.trim() ||
                    req.socket.remoteAddress ||
                    'unknown';
        }
    });

    limiter(req, res, next);
}