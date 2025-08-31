import dotenv from 'dotenv';
dotenv.config({ path: '.env.lcoal' });

import { createApp } from '../src/app';

const app = createApp();

export default app;