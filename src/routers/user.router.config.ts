import UsersController from '../controllers/user.controller';
import { Express } from 'express';
import { isAuthenticated } from '../middleware/authentication';

export default function routesConfig(app: Express) {
    // this router is different because we have to allow unauthenticated users to create an account and log in
    // therefore we need to pass the isAuthenticated middleware to all routes except the ones that create an account or log in

    app.get('/users/:userId', [isAuthenticated, UsersController.getById]);

    app.put('/users/', [isAuthenticated, UsersController.updateById]);
    app.put('/users/tags', [isAuthenticated, UsersController.updateTag]);

    app.post('/users', [UsersController.insert]);
    app.post('/users/login', [UsersController.login]);
    app.post('/users/refresh', [UsersController.refreshToken]);
    app.post('/users/tags', [isAuthenticated, UsersController.addTag]);

    //app.delete('/users', [UsersController.removeAll]); //only used for testing
    app.delete('/users/:userId', [isAuthenticated, UsersController.removeById]);
}
