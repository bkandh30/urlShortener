import express from 'express';
import cors from 'cors';
import helmet from 'helmet';
import morgan from 'morgan';
import { errorHandler } from './middlewares/error.js';

export function createApp() {
    const app = express();

    app.use(helmet());
    app.use(cors({
        origin: process.env.WEB_ORIGIN || 'http://localhost:3000',
        credentials: true
    }));
    app.use(express.json());
    app.use(morgan('dev'));

    app.get('/api/healthz', (req, res) => {
        res.json({ status: 'ok' });
    });

    app.use(errorHandler);

    return app;
}