import UsersController from './users.controller';
import { Express } from 'express';

export default function routesConfig(app: Express) {
    app.get('/users', [UsersController.list]);
    app.get('/users/:userId', [UsersController.getById]);

    app.put('/users/:userId', [UsersController.updateById]);

    app.post('/users', [UsersController.insert]);
    app.post('/users/many', [UsersController.insertMany]);
    app.post('/users/login', [UsersController.login]);

    app.delete('/users', [UsersController.removeAll]);
    app.delete('/users/:userId', [UsersController.removeById]);
}
