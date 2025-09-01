import type { Request, Response } from 'express';
import type { RateLimitRequestHandler } from 'express-rate-limit';

let createRateLimiter: (config?: RateLimitConfig) => RateLimitRequestHandler;
export let linkCreationLimiter: RateLimitRequestHandler;

interface RateLimitConfig {
    windowMs?: number;
    max?: number;
    message?: string;
    skipSuccessfulRequests?: boolean;
}

(async () => {
    const rateLimit = (await import('express-rate-limit')).default;
    const { ERROR_CODES } = await import('@bkandh30/common-url-shortener');

    createRateLimiter = (config: RateLimitConfig = {}) => {
        const {
            windowMs = Number(process.env.RATE_LIMIT_WINDOW_MS) || 60000,
            max = Number(process.env.RATE_LIMIT_MAX) || 20,
            message = 'Too many requests from this IP, please try again later.',
            skipSuccessfulRequests = false
        } = config;

        return rateLimit({
            windowMs,
            max,
            message,
            skipSuccessfulRequests,
            standardHeaders: true,
            legacyHeaders: false,
            handler: (req: Request, res: Response) => {
                res.status(429).json({
                    error: {
                        code: ERROR_CODES.RATE_LIMITED,
                        message,
                    },
                    retryAfter: Math.ceil(windowMs / 1000),
                });
            },
            keyGenerator: (req: Request) => {
                return req.headers['x-forwarded-for']?.toString().split(',')[0]?.trim() ||
                        req.socket.remoteAddress ||
                        'unknown';
            }
        });
    };

    linkCreationLimiter = createRateLimiter({
        windowMs: Number(process.env.RATE_LIMIT_WINDOW_MS) || 60000,
        max: Number(process.env.RATE_LIMIT_MAX) || 20,
        message: 'Too many links created from this IP, please try again later.'
    });
})();