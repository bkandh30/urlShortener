import dotenv from 'dotenv';
dotenv.config({ path: '.env.local' });

import { createApp } from './app.js';

const PORT = process.env.PORT || 8080;

const app = createApp();

app.listen(PORT, () => {
    console.log(`Server running on http://localhost:${PORT}`);
    console.log(`Health check: http://localhost:${PORT}/api/healthz`);
})