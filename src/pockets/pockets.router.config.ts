import PocketsController from './pockets.controller';
import { Express } from 'express';
import { isAuthenticated } from '../middleware/authentication';

export default function routesConfig(app: Express) {
    if (process.env.NODE_ENV === 'development') {
        app.delete('/pockets', [PocketsController.removeAll]);
    }
    // routes at the top of the function are matched first
    app.use('/pockets', isAuthenticated);

    app.get('/pockets', [PocketsController.list]);
    app.get('/pockets/:pocketId', [PocketsController.getById]);

    app.put('/pockets/:pocketId', [PocketsController.updateById]);

    app.post('/pockets', [PocketsController.create]);

    app.delete('/pockets/:pocketId', [PocketsController.removeById]);
}
