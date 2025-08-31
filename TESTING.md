# Testing Guide - Hash.ly URL Shortener

This is the complete testing guide for the URL shortener backend API using both Postman and curl commands.

## Table of Contents

- [Setup](#setup)
- [API Endpoints](#api-endpoints)
- [Test Scenarios](#test-scenarios)
- [Rate Limiting Tests](#rate-limiting-tests)
- [Error Handling Tests](#error-handling-tests)
- [Database Verification](#database-verification)

## Setup

### Prerequisites

- Backend server running on `http://localhost:8080`
- Frontend running on `http://localhost:3000` (for CORS testing)
- Postman or curl installed
- Database connection configured

### Start the Backend Server

```bash
cd backend
npm run dev
```

## API Endpoints

### 1. Health Check

**Postman:**

- Method: `GET`
- URL: `http://localhost:8080/api/healthz`
- Expected Status: `200 OK`

**curl:**

```bash
curl http://localhost:8080/api/healthz
```

**Expected Response:**

```json
{
  "status": "ok"
}
```

### 2. Create Short Link

**Postman:**

- Method: `POST`
- URL: `http://localhost:8080/api/links`
- Headers:
  - `Content-Type: application/json`
- Body (raw JSON):

```json
{
  "longUrl": "https://example.com/very-long-url-that-needs-shortening"
}
```

**curl:**

```bash
curl -X POST http://localhost:8080/api/links \
  -H "Content-Type: application/json" \
  -d '{"longUrl": "https://example.com/test-page"}'
```

**Expected Response (201 Created):**

```json
{
  "shortId": "abc1234",
  "longUrl": "https://example.com/test-page",
  "createdAt": "2024-01-01T12:00:00.000Z",
  "expiresAt": "2024-01-31T12:00:00.000Z"
}
```

### 3. Get Link Statistics

**Postman:**

- Method: `GET`
- URL: `http://localhost:8080/api/links/{shortId}`
- Replace `{shortId}` with actual short ID

**curl:**

```bash
curl http://localhost:8080/api/links/abc1234
```

**Expected Response (200 OK):**

```json
{
  "shortId": "abc1234",
  "longUrl": "https://example.com/test-page",
  "clicks": 5,
  "createdAt": "2024-01-01T12:00:00.000Z",
  "lastAccess": "2024-01-01T13:30:00.000Z",
  "expiresAt": "2024-01-31T12:00:00.000Z",
  "status": "active"
}
```

### 4. Redirect to Original URL

**Postman:**

- Method: `GET`
- URL: `http://localhost:8080/{shortId}`
- Settings: Turn off "Follow Redirects" to see 301 response

**curl:**

```bash
# See redirect without following
curl -v http://localhost:8080/abc1234

# Follow redirect
curl -L http://localhost:8080/abc1234
```

**Expected Response:**

- Status: `301 Moved Permanently`
- Location header: `https://example.com/test-page`

### 5. Generate QR Code

**Postman:**

- Method: `GET`
- URL: `http://localhost:8080/api/links/{shortId}/qr`
- Query Parameters (optional):
  - `fmt`: `png` or `svg`
  - `size`: `64` to `1024`
  - `margin`: `0` to `10`

**curl:**

```bash
# Get PNG QR code (default)
curl http://localhost:8080/api/links/abc1234/qr --output qr.png

# Get SVG QR code
curl "http://localhost:8080/api/links/abc1234/qr?fmt=svg" --output qr.svg

# Custom size
curl "http://localhost:8080/api/links/abc1234/qr?size=512&margin=4" --output qr-large.png
```

## Test Scenarios

### Scenario 1: Complete Link Lifecycle

1. **Create a new link:**

```bash
curl -X POST http://localhost:8080/api/links \
  -H "Content-Type: application/json" \
  -d '{"longUrl": "https://github.com/bkandh30/url-shortener"}'
```

Save the returned `shortId`.

2. **Check initial stats:**

```bash
curl http://localhost:8080/api/links/{shortId}
```

Verify `clicks` is 0 and `lastAccess` is null.

3. **Visit the short link:**

```bash
curl -L http://localhost:8080/{shortId}
```

4. **Check updated stats:**

```bash
curl http://localhost:8080/api/links/{shortId}
```

Verify `clicks` is 1 and `lastAccess` is populated.

5. **Generate QR code:**

```bash
curl http://localhost:8080/api/links/{shortId}/qr --output qr.png
```

### Scenario 2: URL Validation

**Test 1: URL with fragment (should be removed):**

```bash
curl -X POST http://localhost:8080/api/links \
  -H "Content-Type: application/json" \
  -d '{"longUrl": "https://example.com/page#section"}'
```

Response should show `longUrl` without `#section`.

**Test 2: URL normalization:**

```bash
curl -X POST http://localhost:8080/api/links \
  -H "Content-Type: application/json" \
  -d '{"longUrl": "  https://example.com/page  "}'
```

Response should show trimmed URL.

### Scenario 3: SSRF Protection

**Test blocked localhost:**

```bash
curl -X POST http://localhost:8080/api/links \
  -H "Content-Type: application/json" \
  -d '{"longUrl": "http://localhost:3000/admin"}'
```

**Expected Response (400 Bad Request):**

```json
{
  "error": {
    "code": "INVALID_URL",
    "message": "URL points to a blocked host"
  }
}
```

**Test blocked private IP:**

```bash
curl -X POST http://localhost:8080/api/links \
  -H "Content-Type: application/json" \
  -d '{"longUrl": "http://192.168.1.1/admin"}'
```

**Test invalid protocol:**

```bash
curl -X POST http://localhost:8080/api/links \
  -H "Content-Type: application/json" \
  -d '{"longUrl": "javascript:alert(1)"}'
```

## Rate Limiting Tests

### Test Rate Limiting

Run 25 requests quickly to trigger rate limiting:

**Bash script:**

```bash
for i in {1..25}; do
  curl -X POST http://localhost:8080/api/links \
    -H "Content-Type: application/json" \
    -d '{"longUrl": "https://example.com/test'$i'"}' &
done
wait
```

After 20 requests, you should receive:

```json
{
  "error": {
    "code": "RATE_LIMITED",
    "message": "Too many links created from this IP, please try again later."
  },
  "retryAfter": 60
}
```

Wait 60 seconds and try again to verify rate limit reset.

## Error Handling Tests

### 1. Invalid URL Format

**curl:**

```bash
curl -X POST http://localhost:8080/api/links \
  -H "Content-Type: application/json" \
  -d '{"longUrl": "not-a-url"}'
```

**Expected Response (400):**

```json
{
  "error": {
    "code": "INVALID_URL",
    "message": "Invalid URL"
  }
}
```

### 2. Missing URL

**curl:**

```bash
curl -X POST http://localhost:8080/api/links \
  -H "Content-Type: application/json" \
  -d '{}'
```

### 3. Non-existent Short ID

**curl:**

```bash
curl http://localhost:8080/api/links/notexist
```

**Expected Response (404):**

```json
{
  "error": {
    "code": "NOT_FOUND",
    "message": "Link not found"
  }
}
```

### 4. Expired Link

To test expired links:

1. Create a link
2. Manually update `expiresAt` in database to past date
3. Try to access the link

**curl:**

```bash
curl -v http://localhost:8080/{expiredShortId}
```

**Expected:** 410 Gone status with HTML error page

## Database Verification

### Using Prisma Studio

```bash
cd backend
npx prisma studio
```

Opens browser interface to:

- View all links
- Check click records
- Modify data for testing (e.g., set expiry dates)
- Verify IP hashing

### Direct Database Queries

Connect to your PostgreSQL database and run:

```sql
-- View all links
SELECT * FROM "Link" ORDER BY "createdAt" DESC;

-- View click records
SELECT * FROM "Click" ORDER BY "createdAt" DESC;

-- Check expired links
SELECT * FROM "Link" WHERE "expiresAt" < NOW();

-- Link statistics
SELECT
  "shortId",
  "longUrl",
  "clicks",
  "createdAt",
  "expiresAt",
  CASE
    WHEN "expiresAt" < NOW() THEN 'expired'
    ELSE 'active'
  END as status
FROM "Link";
```

## Performance Testing

### Load Testing with Apache Bench

```bash
# Test 100 requests with 10 concurrent connections
ab -n 100 -c 10 -p post_data.json -T application/json http://localhost:8080/api/links
```

Create `post_data.json`:

```json
{ "longUrl": "https://example.com/test" }
```

### Response Time Testing

```bash
# Measure response time
time curl http://localhost:8080/api/healthz

# Measure redirect time
time curl -L http://localhost:8080/{shortId}
```

## Debugging Tips

1. **Enable verbose logging:**

```bash
curl -v http://localhost:8080/api/links/{shortId}
```

2. **Check headers:**

```bash
curl -I http://localhost:8080/api/links/{shortId}/qr
```

3. **Monitor rate limit headers:**
   Look for `RateLimit-*` headers in responses

4. **Test CORS:**

```bash
curl -H "Origin: http://localhost:3000" \
     -H "Access-Control-Request-Method: POST" \
     -H "Access-Control-Request-Headers: Content-Type" \
     -X OPTIONS \
     http://localhost:8080/api/links
```

## Postman Collection

Import this collection into Postman for easy testing:

```json
{
  "info": {
    "name": "URL Shortener API",
    "schema": "https://schema.getpostman.com/json/collection/v2.1.0/collection.json"
  },
  "item": [
    {
      "name": "Health Check",
      "request": {
        "method": "GET",
        "url": "{{baseUrl}}/api/healthz"
      }
    },
    {
      "name": "Create Link",
      "request": {
        "method": "POST",
        "url": "{{baseUrl}}/api/links",
        "header": [
          {
            "key": "Content-Type",
            "value": "application/json"
          }
        ],
        "body": {
          "mode": "raw",
          "raw": "{\n  \"longUrl\": \"https://example.com/test\"\n}"
        }
      }
    },
    {
      "name": "Get Stats",
      "request": {
        "method": "GET",
        "url": "{{baseUrl}}/api/links/{{shortId}}"
      }
    },
    {
      "name": "Redirect",
      "request": {
        "method": "GET",
        "url": "{{baseUrl}}/{{shortId}}"
      }
    },
    {
      "name": "Get QR Code",
      "request": {
        "method": "GET",
        "url": "{{baseUrl}}/api/links/{{shortId}}/qr",
        "query": [
          {
            "key": "fmt",
            "value": "png"
          },
          {
            "key": "size",
            "value": "256"
          }
        ]
      }
    }
  ],
  "variable": [
    {
      "key": "baseUrl",
      "value": "http://localhost:8080",
      "type": "string"
    },
    {
      "key": "shortId",
      "value": "",
      "type": "string"
    }
  ]
}
```

## Environment Variables for Testing

Create a `.env.test` file for testing:

```env
DATABASE_URL=postgresql://test_user:test_pass@localhost:5432/test_db
WEB_ORIGIN=http://localhost:3000
RATE_LIMIT_WINDOW_MS=60000
RATE_LIMIT_MAX=5  # Lower for testing
IP_HASH_SALT=test_salt
SITE_BASE_URL=http://localhost:8080
PORT=8080
```

Run tests with test environment:

```bash
NODE_ENV=test npm run dev
```
