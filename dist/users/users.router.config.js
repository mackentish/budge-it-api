"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const users_controller_1 = __importDefault(require("./users.controller"));
function routesConfig(app) {
    app.get('/users', [users_controller_1.default.list]);
    app.get('/users/:userId', [users_controller_1.default.getById]);
    app.put('/users/:userId', [users_controller_1.default.updateById]);
    app.post('/users', [users_controller_1.default.insert]);
    app.post('/users/many', [users_controller_1.default.insertMany]);
    app.post('/users/login', [users_controller_1.default.login]);
    app.delete('/users', [users_controller_1.default.removeAll]);
    app.delete('/users/:userId', [users_controller_1.default.removeById]);
}
exports.default = routesConfig;
