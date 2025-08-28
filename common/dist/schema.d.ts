import { z } from 'zod';
export declare const createLinkSchema: z.ZodObject<{
    longUrl: z.ZodURL;
}, z.core.$strip>;
export declare const linkResponseSchema: z.ZodObject<{
    shortId: z.ZodString;
    longUrl: z.ZodURL;
    clicks: z.ZodDefault<z.ZodNumber>;
    createdAt: z.ZodISODateTime;
    lastAccess: z.ZodOptional<z.ZodNullable<z.ZodISODateTime>>;
    expiresAt: z.ZodISODateTime;
}, z.core.$strip>;
export declare const statsResponseSchema: z.ZodObject<{
    shortId: z.ZodString;
    longUrl: z.ZodURL;
    clicks: z.ZodDefault<z.ZodNumber>;
    createdAt: z.ZodISODateTime;
    lastAccess: z.ZodOptional<z.ZodNullable<z.ZodISODateTime>>;
    expiresAt: z.ZodISODateTime;
    status: z.ZodEnum<{
        active: "active";
        expired: "expired";
    }>;
}, z.core.$strip>;
export declare const qrQuerySchema: z.ZodObject<{
    fmt: z.ZodDefault<z.ZodEnum<{
        png: "png";
        svg: "svg";
    }>>;
    size: z.ZodDefault<z.ZodNumber>;
    margin: z.ZodDefault<z.ZodNumber>;
}, z.core.$strip>;
export declare const errorResponseSchema: z.ZodObject<{
    error: z.ZodObject<{
        code: z.ZodString;
        message: z.ZodString;
    }, z.core.$strip>;
}, z.core.$strip>;
export declare const rateLimitErrorSchema: z.ZodObject<{
    error: z.ZodObject<{
        code: z.ZodString;
        message: z.ZodString;
    }, z.core.$strip>;
    retryAfter: z.ZodOptional<z.ZodNumber>;
}, z.core.$strip>;
//# sourceMappingURL=schema.d.ts.map