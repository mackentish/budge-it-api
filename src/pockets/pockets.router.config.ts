import PocketsController from './pockets.controller';
import { Express } from 'express';
import { isAuthenticated } from '../middleware/authentication';

export default function routesConfig(app: Express) {
    // routes at the top of the function are matched first
    app.use('/pockets', isAuthenticated);

    app.get('/pockets/:userId', [PocketsController.list]);
    app.get('/pockets/:pocketId', [PocketsController.getById]);

    app.put('/pockets/:pocketId', [PocketsController.updateById]);

    app.post('/pockets', [PocketsController.insert]);
    app.post('/pockets/many', [PocketsController.insertMany]);

    app.delete('/pockets/:userId', [PocketsController.removeAll]);
    app.delete('/pockets/:pocketId', [PocketsController.removeById]);
}
