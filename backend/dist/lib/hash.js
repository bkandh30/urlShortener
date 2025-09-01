import * as crypto from 'crypto';
export function hashIP(ip) {
    const salt = process.env.IP_HASH_SALT;
    return crypto
        .createHash('sha256')
        .update(ip + salt)
        .digest('hex');
}
export function getClientIP(req) {
    const forwarded = req.headers['x-forwarded-for'];
    const ip = forwarded
        ? forwarded.toString().split(',')[0].trim()
        : req.socket?.remoteAddress || req.ip || 'unknown';
    return ip;
}
//# sourceMappingURL=hash.js.map