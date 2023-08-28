"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const groups_controller_1 = __importDefault(require("./groups.controller"));
const authentication_1 = require("../middleware/authentication");
function routesConfig(app) {
    if (process.env.NODE_ENV === 'development') {
        app.delete('/groups', [groups_controller_1.default.removeAll]);
    }
    app.use('/groups', authentication_1.isAuthenticated);
    app.get('/groups', [groups_controller_1.default.list]);
    app.post('/groups', [groups_controller_1.default.create]);
}
exports.default = routesConfig;
