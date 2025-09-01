interface RateLimitConfig {
    windowMs?: number;
    max?: number;
    message?: string;
    skipSuccessfulRequests?: boolean;
}
export declare function createRateLimiter(config?: RateLimitConfig): import("express-rate-limit").RateLimitRequestHandler;
export declare const linkCreationLimiter: import("express-rate-limit").RateLimitRequestHandler;
export {};
//# sourceMappingURL=rateLimit.d.ts.map