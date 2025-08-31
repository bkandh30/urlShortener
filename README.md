# Hash.ly - Modern URL Shortener

A production-ready URL shortener with QR code generation, analytics, and automatic expiration. Built with Next.js, Node.js, Express, TypeScript and TailwindCSS

## Features

**Core Features**

- Short link generation with Base62 encoding
- Click analytics and tracking
- 30-day automatic link expiration
- QR code generation (PNG/SVG formats)
- Rate limiting (20 requests/minute per IP)
- SSRF protection and URL validation
- Local dashboard with localStorage persistence

## Tech Stack

**Frontend**

- Next.js 14 (App Router)
- TypeScript
- Tailwind CSS
- Local storage for link management

**Backend**

- Express.js with TypeScript
- Prisma ORM
- PostgreSQL (Aiven)
- QR code generation with `qrcode`
- Rate limiting with `express-rate-limit`

**Shared**

- `@bkandh30/common-url-shortener` - Shared types and validation schemas

**Note**: You can find this shared package on `npm`

```bash
https://www.npmjs.com/package/@bkandh30/common-url-shortener
```

## Prerequisites

- Node.js 18+
- PostgreSQL database (Aiven, Neon, or Supabase)
- npm account (for publishing common package)

## Installation

### 1. Clone the Repository

```bash
git clone https://github.com/bkandh30/urlShortener.git
cd urlShortener
```

### 2. Install Dependencies

```bash
# Install all workspace dependencies
npm install

cd backend
npm install

cd ..
cd frontend
npm install
```

### 3. Setup Common Package

```bash
cd common
npm run build
npm publish --access public
cd ..
```

### 4. Configure Environment Variables

**Backend** (`backend/.env.local`):

```env
DATABASE_URL=postgresql://user:pass@host:5432/database
WEB_ORIGIN=http://localhost:3000
RATE_LIMIT_WINDOW_MS=60000
RATE_LIMIT_MAX=20
IP_HASH_SALT=your_random_salt_here
SITE_BASE_URL=http://localhost:8080
PORT=8080
```

**Frontend** (`frontend/.env.local`):

```env
NEXT_PUBLIC_API_URL=http://localhost:8080
```

### 5. Setup Database

```bash
cd backend
npx prisma generate
npx prisma migrate deploy
cd ..
```

## Development

### Start Backend Server

```bash
cd backend
npm run dev
# Server runs on http://localhost:8080
```

### Start Frontend Server

```bash
cd frontend
npm run dev
# App runs on http://localhost:3000
```

## API Endpoints

### Create Short Link

`POST /api/links`

```json
{
  "longUrl": "https://example.com/very-long-url"
}
```

### Get Link Statistics

`GET /api/links/:shortId`

### Redirect to Original URL

`GET /:shortId`

### Generate QR Code

`GET /api/links/:shortId/qr?fmt=png&size=256`

### Health Check

`GET /api/healthz`

## Testing

For comprehensive testing documentation including Postman collections and curl commands, see [TESTING.md](./TESTING.md).

## Security Features

- **SSRF Protection**: Blocks requests to localhost and private IP ranges
- **Rate Limiting**: Prevents abuse with configurable limits
- **IP Hashing**: Privacy-focused analytics with salted IP hashing
- **Input Validation**: Comprehensive URL validation and sanitization
- **CORS Configuration**: Restricted to frontend origin

## Performance Considerations

- **Serverless Ready**: Optimized for Vercel's serverless functions
- **Database Pooling**: Connection pooling support for production
- **Caching**: QR codes cached for 5 minutes
- **Efficient Queries**: Indexed database lookups

## Author

**bkandh30**

- GitHub: [@bkandh30](https://github.com/bkandh30)
- npm: [@bkandh30](https://www.npmjs.com/~bkandh30)
