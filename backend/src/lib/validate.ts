import { URL } from "url";
import { BLOCKED_HOSTS, PRIVATE_IP_RANGES } from "@bkandh30/common-url-shortener";

export class ValidationError extends Error {
    constructor(message: string, public code: string = 'INVALID_URL') {
        super(message);
        this.name = 'ValidationError';
    }
};

export function normalizeAndValidateUrl(urlString: string): string {
    urlString = urlString.trim();

    let url: URL;
    try {
        url = new URL(urlString);
    } catch (error) {
        throw new ValidationError('Invalid URL format');
    }

    if (!['http:', 'https:'].includes(url.protocol)) {
        throw new ValidationError('Only HTTP and HTTPS URLs are allowed');
    }

    const hostname = url.hostname.toLowerCase();

    if (BLOCKED_HOSTS.includes(hostname)) {
        throw new ValidationError('URL points to a blocked host');
    }

    const ipPattern = /^(\d{1,3}\.){3}\d{1,3}$/;
    if (ipPattern.test(hostname)) {
        const isPrivate = PRIVATE_IP_RANGES.some(range => range.test(hostname));
        if (isPrivate) {
            throw new ValidationError('URL points to a private IP address');
        }
    }

    if (hostname === '::1' || hostname === '[::]' || hostname === '[::1]') {
        throw new ValidationError('URL points to a blocked host');
    }

    url.hash = '';

    return url.toString();
};

export async function isUrlAccessible(url: string, timeout: number = 5000): Promise<boolean> {
    try {
        const controller = new AbortController();
        const timeoutId = setTimeout(() => controller.abort(), timeout);

        const response = await fetch(url, {
            method: 'HEAD',
            signal: controller.signal,
            redirect: 'follow',
        });

        clearTimeout(timeoutId);
        return response.ok;
    } catch (error) {
        return false;
    }
};