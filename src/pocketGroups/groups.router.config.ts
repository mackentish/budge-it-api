import GroupsController from './groups.controller';
import { Express } from 'express';
import { isAuthenticated } from '../middleware/authentication';

export default function routesConfig(app: Express) {
    if (process.env.NODE_ENV === 'development') {
        app.delete('/groups', [GroupsController.removeAll]);
    }

    app.use('/groups', isAuthenticated);

    app.get('/groups', [GroupsController.list]);

    app.post('/groups', [GroupsController.create]);
}
