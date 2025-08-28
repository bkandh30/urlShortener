import { z } from 'zod';
export const createLinkSchema = z.object({
    longUrl: z.url()
});
export const linkResponseSchema = z.object({
    shortId: z.string(),
    longUrl: z.url(),
    clicks: z.number().default(0),
    createdAt: z.iso.datetime(),
    lastAccess: z.iso.datetime().nullable().optional(),
    expiresAt: z.iso.datetime()
});
export const statsResponseSchema = linkResponseSchema.extend({
    status: z.enum(['active', 'expired'])
});
export const qrQuerySchema = z.object({
    fmt: z.enum(['png', 'svg']).default('png'),
    size: z.number().min(64).max(1024).default(256),
    margin: z.number().min(0).max(10).default(2)
});
export const errorResponseSchema = z.object({
    error: z.object({
        code: z.string(),
        message: z.string()
    })
});
export const rateLimitErrorSchema = errorResponseSchema.extend({
    retryAfter: z.number().optional()
});
//# sourceMappingURL=schema.js.map