import TransactionsController from './transactions.controller';
import { Express } from 'express';
import { isAuthenticated } from '../middleware/authentication';

export default function routesConfig(app: Express) {
    if (process.env.NODE_ENV === 'development') {
        app.delete('/transactions', [TransactionsController.removeAll]);
    }
    // routes at the top of the function are matched first
    app.use('/transactions', isAuthenticated);

    app.get('/transactions', [TransactionsController.list]);
    app.get('/transactions/:transactionId', [TransactionsController.getById]);

    app.post('/transactions', [TransactionsController.create]);
}
