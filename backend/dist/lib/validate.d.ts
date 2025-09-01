export declare class ValidationError extends Error {
    code: string;
    constructor(message: string, code?: string);
}
export declare function normalizeAndValidateUrl(urlString: string): string;
export declare function isUrlAccessible(url: string, timeout?: number): Promise<boolean>;
//# sourceMappingURL=validate.d.ts.map