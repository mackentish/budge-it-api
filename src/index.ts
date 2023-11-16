import express, { Express, Request, Response } from 'express';
import bodyParser from 'body-parser';
import PocketsRouter from './routers/pocket.router.config';
import UsersRouter from './routers/user.router.config';
import GroupsRouter from './routers/pocketGroup.router.config';
import TransactionsRouter from './routers/transaction.router.config';
import SyncModels, { sequelize, Pocket, User } from './models';

SyncModels()
    .then(() => {
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
    })
    .catch(async (error) => {
        console.error('Error connecting/syncing with database:', error);
        await sequelize.close();
    });
