import * as crypto from 'crypto';

export function hashIP(ip: string): string {
    const salt = process.env.IP_HASH_SALT;

    return crypto
        .createHash('sha256')
        .update(ip + salt)
        .digest('hex');
}

export function getClientIP(req: any): string {
    const forwarded = req.headers['x-forwarded-for'];
    const ip = forwarded
        ? forwarded.toString().split(',')[0].trim()
        : req.socket?.remoteAddress || req.ip || 'unknown';

    return ip;
}
