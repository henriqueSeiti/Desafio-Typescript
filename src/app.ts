import express from 'express';
import cookieParser from 'cookie-parser';
import cors from 'cors';
import { router } from './routes/router'
import session from "express-session";
import swaggerUI from "swagger-ui-express";
import swaggerDocuments from "./swagger-autogen.json"


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
        this.server.use("/api-docs", swaggerUI.serve, swaggerUI.setup(swaggerDocuments));
        this.server.use(session({
            secret: "my-secret",
            resave: false,
            saveUninitialized: true,
            cookie: { secure: true }
        }));;
    }

    private router() {
        this.server.use(router);
    }
}