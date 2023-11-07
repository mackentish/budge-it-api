import mongoose from 'mongoose';
import mysql from 'mysql';
import express, { Express, Request, Response } from 'express';
import dotenv from 'dotenv';
import bodyParser from 'body-parser';
import PocketsRouter from './pockets/pockets.router.config';
import UsersRouter from './users/users.router.config';
import GroupsRouter from './pocketGroups/groups.router.config';
import TransactionsRouter from './transactions/transactions.router.config';

// Connect to mysql database
const connection = mysql.createConnection({
    host: process.env.DB_HOST || 'localhost',
    port: (process.env.DB_PORT || 3306) as number,
    user: process.env.DB_USER,
    password: process.env.DB_PASSWORD,
    database: 'budge_it_DB',
});
connection.connect(function (err) {
    if (err) {
        console.error('error connecting: ' + err.stack);
        return;
    }

    console.log('connected as id ' + connection.threadId);
});

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
    GroupsRouter(app);
    TransactionsRouter(app);

    app.listen(PORT, function () {
        console.log('app listening at port %s', PORT);
    });
});
