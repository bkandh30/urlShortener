import { z } from 'zod';
import {
    createLinkSchema,
    linkResponseSchema,
    statsResponseSchema,
    qrQuerySchema,
    errorResponseSchema
} from './schema.js';

export type CreateLinkDto = z.infer<typeof createLinkSchema>;
export type LinkResponse = z.infer<typeof linkResponseSchema>;
export type StatsResponse = z.infer<typeof statsResponseSchema>;
export type QrQuery = z.infer<typeof qrQuerySchema>;
export type ErrorResponse = z.infer<typeof errorResponseSchema>;

export interface Link {
    id: string;
    shortId: string;
    longUrl: string;
    clicks: number;
    createdAt: Date;
    lastAccess: Date | null;
    expiresAt: Date;
}

export interface Click {
    id: string;
    linkId: string;
    createdAt: Date;
    ipHash: string | null;
    userAgent: string | null;
    referrer: string | null;
}