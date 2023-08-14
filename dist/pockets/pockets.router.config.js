"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const pockets_controller_1 = __importDefault(require("./pockets.controller"));
function routesConfig(app) {
    app.get('/pockets/:userId', [pockets_controller_1.default.list]);
    app.get('/pockets/:pocketId', [pockets_controller_1.default.getById]);
    app.put('/pockets/:pocketId', [pockets_controller_1.default.updateById]);
    app.post('/pockets', [pockets_controller_1.default.insert]);
    app.post('/pockets/many', [pockets_controller_1.default.insertMany]);
    app.delete('/pockets/:userId', [pockets_controller_1.default.removeAll]);
    app.delete('/pockets/:pocketId', [pockets_controller_1.default.removeById]);
}
exports.default = routesConfig;
