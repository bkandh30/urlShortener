import express from 'express';
import cors from 'cors';
import helmet from 'helmet';
import morgan from 'morgan';
import { errorHandler } from './middlewares/error.js';
import linkRoutes from './routes/links.js';
import redirectRoutes from './routes/redirect.js';

export function createApp() {
    const app = express();

    app.use(helmet({
        crossOriginResourcePolicy: { policy: "cross-origin" },
    }));

    app.use(cors({
        origin: process.env.WEB_ORIGIN || 'http://localhost:3000',
        credentials: true
    }));

    app.use(express.json({
        limit: '10kb'
    }));

    app.use(express.urlencoded({
        extended: true,
        limit: '10kb'
    }));

    if (process.env.NODE_ENV !== 'production') {
        app.use(morgan('dev'));
    }

    app.use('/api', linkRoutes);

    app.use('/', redirectRoutes);

    app.use(errorHandler);

    return app;
}