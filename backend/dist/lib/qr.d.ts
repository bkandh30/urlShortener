interface QROptions {
    size: number;
    margin: number;
}
export declare function makeQrPng(text: string, options?: QROptions): Promise<Buffer>;
export declare function makeQrSvg(text: string, options?: QROptions): Promise<string>;
export declare function validateQrOptions(size?: number, margin?: number): QROptions;
export {};
//# sourceMappingURL=qr.d.ts.map