"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const pockets_controller_1 = __importDefault(require("./pockets.controller"));
const authentication_1 = require("../middleware/authentication");
function routesConfig(app) {
    if (process.env.NODE_ENV === 'development') {
        app.delete('/pockets', [pockets_controller_1.default.removeAll]);
    }
    // routes at the top of the function are matched first
    app.use('/pockets', authentication_1.isAuthenticated);
    app.get('/pockets', [pockets_controller_1.default.list]);
    app.get('/pockets/:pocketId', [pockets_controller_1.default.getById]);
    app.put('/pockets/:pocketId', [pockets_controller_1.default.updateById]);
    app.post('/pockets', [pockets_controller_1.default.create]);
    app.delete('/pockets/:pocketId', [pockets_controller_1.default.removeById]);
}
exports.default = routesConfig;
