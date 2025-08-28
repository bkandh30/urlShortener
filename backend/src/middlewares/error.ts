import type { Request, Response, NextFunction } from 'express';
import { ERROR_CODES } from '@bkandh30/common-url-shortener';
import { ZodError } from 'zod';
import { ValidationError } from '../lib/validate.js';

interface AppError extends Error {
    statusCode?: number;
    code?: string;
}

export function errorHandler(
    err: AppError | Error,
    _req: Request,
    res: Response,
    _next: NextFunction
) {
    let statusCode = 500;
    let code = ERROR_CODES.INTERNAL;
    let message = 'Internal server error';

    if (err instanceof ValidationError) {
        statusCode = 400;
        code = err.code || ERROR_CODES.INVALID_URL;
        message = err.message;
    } else if (err instanceof ZodError) {
        statusCode = 400;
        code = ERROR_CODES.INVALID_URL;
        message = err.issues[0]?.message || 'Validation failed';
    } else if ('code' in err && typeof (err as any).code === 'string' && (err as any).code.startsWith('P')) {
        if (err.code === 'P2002') {
            statusCode = 409;
            code = 'DUPLICATE';
            message = 'Resource already exists';
        } else if (err.code === 'P2025') {
            statusCode = 404;
            code = ERROR_CODES.NOT_FOUND;
            message = 'Resource not found';
        }
    } else if ('statusCode' in err && 'code' in err) {
        statusCode = err.statusCode || 500;
        code = err.code || ERROR_CODES.INTERNAL;
        message = err.message;
    }

    if (process.env.NODE_ENV !== 'production') {
        console.error('Error:', {
            name: err.name,
            message: err.message,
            stack: err.stack,
            code,
            statusCode,
        });
    }

    res.status(statusCode).json({
        error: {
            code,
            message,
        },
    });
}