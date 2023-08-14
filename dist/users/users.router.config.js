"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const users_controller_1 = __importDefault(require("./users.controller"));
const authentication_1 = require("../middleware/authentication");
function routesConfig(app) {
    // this router is different because we have to allow unauthenticated users to create an account and log in
    // therefore we need to pass the isAuthenticated middleware to all routes except the ones that create an account or log in
    app.get('/users', [authentication_1.isAuthenticated, users_controller_1.default.list]);
    app.get('/users/:userId', [authentication_1.isAuthenticated, users_controller_1.default.getById]);
    app.put('/users/:userId', [authentication_1.isAuthenticated, users_controller_1.default.updateById]);
    app.post('/users', [users_controller_1.default.insert]);
    app.post('/users/login', [users_controller_1.default.login]);
    app.post('/users/refresh', [users_controller_1.default.refreshToken]);
    //app.delete('/users', [UsersController.removeAll]); //only used for testing
    app.delete('/users/:userId', [authentication_1.isAuthenticated, users_controller_1.default.removeById]);
}
exports.default = routesConfig;
