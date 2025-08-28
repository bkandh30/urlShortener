import type { Request, Response, NextFunction } from 'express';
import { ERROR_CODES } from '@bkandh30/common-url-shortener';

interface AppError extends Error {
    statusCode?: number;
    code?: string;
}

export function errorHandler(
    err: unknown,
    _req: Request,
    res: Response,
    _next: NextFunction
) {
    let statusCode = 500;
    let code = ERROR_CODES.INTERNAL;
    let message = 'An unexpected internal server error occurred.';

    if (err instanceof Error) {
        const appError = err as AppError;
        statusCode = appError.statusCode || 500;
        code = appError.code || ERROR_CODES.INTERNAL;

        if (process.env.NODE_ENV !== 'production' || statusCode < 500) {
            message = appError.message || message;
        }
    }

    console.error('Error:', err);

    res.status(statusCode).json({
        error: {
            code,
            message
        }
    });
}