import { waitForDebugger } from "inspector";
import { toBuffer, toString } from "qrcode";
export async function makeQrPng(text, options = { size: 256, margin: 2 }) {
    try {
        const buffer = await toBuffer(text, {
            type: 'png',
            width: options.size,
            margin: options.margin,
            errorCorrectionLevel: 'M',
            color: {
                dark: '#000000',
                light: '#FFFFFF',
            },
        });
        return buffer;
    }
    catch (error) {
        throw new Error(`Failed to generate QR PNG: ${error}`);
    }
}
export async function makeQrSvg(text, options = { size: 256, margin: 2 }) {
    try {
        const svg = await toString(text, {
            type: 'svg',
            width: options.size,
            margin: options.margin,
            errorCorrectionLevel: 'M',
            color: {
                dark: '#000000',
                light: '#FFFFFF',
            },
        });
        return svg;
    }
    catch (error) {
        throw new Error(`Failed to generate QR SVG: ${error}`);
    }
}
export function validateQrOptions(size, margin) {
    return {
        size: Math.min(Math.max(size || 256, 64), 1024),
        margin: Math.min(Math.max(margin || 2, 0), 10),
    };
}
//# sourceMappingURL=qr.js.map