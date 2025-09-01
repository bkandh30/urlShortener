import { ERROR_CODES } from '@bkandh30/common-url-shortener';
import { ZodError } from 'zod';
import { ValidationError } from '../lib/validate.js';
export function errorHandler(err, _req, res, _next) {
    let statusCode = 500;
    let code = ERROR_CODES.INTERNAL;
    let message = 'Internal server error';
    if (err instanceof ValidationError) {
        statusCode = 400;
        code = err.code || ERROR_CODES.INVALID_URL;
        message = err.message;
    }
    else if (err instanceof ZodError) {
        statusCode = 400;
        code = ERROR_CODES.INVALID_URL;
        message = err.issues[0]?.message || 'Validation failed';
    }
    else if ('code' in err && typeof err.code === 'string' && err.code.startsWith('P')) {
        if (err.code === 'P2002') {
            statusCode = 409;
            code = 'DUPLICATE';
            message = 'Resource already exists';
        }
        else if (err.code === 'P2025') {
            statusCode = 404;
            code = ERROR_CODES.NOT_FOUND;
            message = 'Resource not found';
        }
    }
    else if ('statusCode' in err && 'code' in err) {
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
export function asyncHandler(fn) {
    return (req, res, next) => {
        Promise.resolve(fn(req, res, next)).catch(next);
    };
}
//# sourceMappingURL=error.js.map