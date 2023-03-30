import express from 'express';
import cookieParser from 'cookie-parser';
import cors from 'cors';
import { router } from './routes/router'

export default class App {
    server: express.Application;

    constructor() {
        this.server = express();
        this.middleware();
        this.router();
    }

    private middleware() {
        this.server.use(cors());
        this.server.use(express.json())
        this.server.use(cookieParser());
    }

    private router() {
        this.server.use(router);
    }
}