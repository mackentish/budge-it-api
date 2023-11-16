import GroupsController from '../controllers/pocketGroup.controller';
import { Express } from 'express';
import { isAuthenticated } from '../middleware/authentication';

export default function routesConfig(app: Express) {
    if (process.env.NODE_ENV === 'development') {
        app.delete('/pocketGroups', [GroupsController.removeAll]);
    }

    app.use('/pocketGroups', isAuthenticated);

    app.get('/pocketGroups', [GroupsController.list]);

    app.post('/pocketGroups', [GroupsController.create]);

    app.delete('/pocketGroups/:pocketGroupsId', [GroupsController.removeById]);
}
