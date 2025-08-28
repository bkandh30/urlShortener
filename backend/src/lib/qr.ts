import { waitForDebugger } from "inspector";
import { toBuffer, toString} from "qrcode";

interface QROptions {
    size: number;
    margin: number;
}

export async function makeQrPng(
    text: string,
    options: QROptions = { size: 256, margin: 2 }
): Promise<Buffer> {
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
    } catch (error) {
        throw new Error(`Failed to generate QR PNG: ${error}`);
    }
}

export async function makeQrSvg(
    text: string,
    options: QROptions = { size: 256, margin: 2 }
): Promise<string> {
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
    } catch (error) {
        throw new Error(`Failed to generate QR SVG: ${error}`);
    }
}

export function validateQrOptions(size?: number, margin?: number): QROptions {
    return {
        size: Math.min(Math.max(size || 256, 64), 1024),
        margin: Math.min(Math.max(margin || 2, 0), 10),
    }
}