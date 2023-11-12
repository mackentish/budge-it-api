import mysql from 'mysql';
import { Sequelize } from 'sequelize';
import express, { Express, Request, Response } from 'express';
import dotenv from 'dotenv';
import bodyParser from 'body-parser';
import PocketsRouter from './pockets/pockets.router.config';
import UsersRouter from './users/users.router.config';
import GroupsRouter from './pocketGroups/groups.router.config';
import TransactionsRouter from './transactions/transactions.router.config';
import DefineModels from './models';

async function initializeDatabase() {
    dotenv.config();

    const HOST = process.env.DB_HOST || 'localhost';
    const DB_PORT = (process.env.DB_PORT || 3306) as number;
    const USER = process.env.DB_USER!;
    const PASSWORD = process.env.DB_PASSWORD!;
    const DATABASE = 'budge-it';

    // Connect to mysql database using sequelize
    const sequelize = new Sequelize(DATABASE, USER, PASSWORD, {
        host: HOST,
        port: DB_PORT,
        dialect: 'mysql',
    });
    try {
        await sequelize.authenticate();
        console.log('Connection has been established successfully.');
        await DefineModels(sequelize);
        await sequelize.close();
    } catch (error) {
        console.error('Unable to connect to the database:', error);
    }
}
initializeDatabase();

/*
    const jsonErrorHandler = (
        err: any,
        req: Request,
        res: Response,
        next: any
    ) => {
        res.status(500).send({ error: err });
    };

    const app: Express = express();
    const APP_PORT = process.env.PORT || 3001;
    app.use(bodyParser.json());
    app.use(jsonErrorHandler);
    app.use(express.json());

    PocketsRouter(app);
    UsersRouter(app);
    GroupsRouter(app);
    TransactionsRouter(app);

    app.listen(APP_PORT, function () {
        console.log('app listening at port %s', APP_PORT);
    });
    */
