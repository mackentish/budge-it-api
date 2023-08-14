import mongoose from 'mongoose';
import express, { Express, Request, Response } from 'express';
import dotenv from 'dotenv';
import bodyParser from 'body-parser';
import PocketsRouter from './pockets/pockets.router.config';
import UsersRouter from './users/users.router.config';

// Connect to MongoDB database
mongoose.connect('mongodb://localhost:27017/budge-it-DB').then(() => {
    const jsonErrorHandler = (
        err: any,
        req: Request,
        res: Response,
        next: any
    ) => {
        res.status(500).send({ error: err });
    };

    dotenv.config();

    const app: Express = express();
    const PORT = process.env.PORT || 3001;
    app.use(bodyParser.json());
    app.use(jsonErrorHandler);
    app.use(express.json());

    PocketsRouter(app);
    UsersRouter(app);

    app.listen(PORT, function () {
        console.log('app listening at port %s', PORT);
    });
});
