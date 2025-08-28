import rateLimit from "express-rate-limit";
import { ERROR_CODES } from "@bkandh30/common-url-shortener";

interface RateLimitConfig {
    windowMs ?: number;
    max?: number;
    message?: string;
    skipSuccessfulRequests?: boolean;
}

export function createRateLimiter(config: RateLimitConfig = {}) {
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
        handler: (req, res) => {
            res.status(429).json({
                error: {
                    code: ERROR_CODES.RATE_LIMITED,
                    message,
                },
                retryAfter: Math.ceil(windowMs / 1000),
            });
        },
        keyGenerator: (req) => {
            return req.headers['x-forwarded-for']?.toString().split(',')[0]?.trim() ||
                    req.socket.remoteAddress ||
                    'unknown';
        }
    });
};

export const linkCreationLimiter = createRateLimiter({
    windowMs: Number(process.env.RATE_LIMIT_WINDOW_MS) || 60000,
    max: Number(process.env.RATE_LIMIT_MAX) || 20,
    message: 'Too many links created from this IP, please try again later.'
});