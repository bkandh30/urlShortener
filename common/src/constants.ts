export const URL_PATTERNS = {
    SHORT_ID: /^[A-Za-z0-9_-]{5,12}$/,
    HTTP_HTTPS: /^https?:\/\//
};

export const ERROR_CODES = {
    INVALID_URL: 'INVALID_URL',
    NOT_FOUND: 'NOT_FOUND',
    EXPIRED: 'EXPIRED',
    RATE_LIMITED: 'RATE_LIMITED',
    INTERNAL: 'INTERNAL'
};

export const DEFAULTS = {
    EXPIRY_DAYS: 30,
    RATE_LIMIT_WINDOW_MS: 60000,
    RATE_LIMIT_MAX: 20,
    SHORT_ID_LENGTH: 7,
    MAX_COLLISION_RETRIES: 5
};

export const BLOCKED_HOSTS = [
    'localhost',
    '127.0.0.1',
    '0.0.0.0',
    '::1',
    '169.254.169.254'
];

export const PRIVATE_IP_RANGES = [
    /^10\./,
    /^172\.(1[6-9]|2[0-9]|3[0-1])\./,
    /^192\.168\./
]