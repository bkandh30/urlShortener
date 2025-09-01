import type { Request, Response, NextFunction } from 'express';
interface AppError extends Error {
    statusCode?: number;
    code?: string;
}
export declare function errorHandler(err: AppError | Error, _req: Request, res: Response, _next: NextFunction): void;
export declare function asyncHandler(fn: (req: Request, res: Response, next: NextFunction) => Promise<any>): (req: Request, res: Response, next: NextFunction) => void;
export {};
//# sourceMappingURL=error.d.ts.map