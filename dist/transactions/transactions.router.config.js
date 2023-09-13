"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const transactions_controller_1 = __importDefault(require("./transactions.controller"));
const authentication_1 = require("../middleware/authentication");
function routesConfig(app) {
    if (process.env.NODE_ENV === 'development') {
        app.delete('/transactions', [transactions_controller_1.default.removeAll]);
    }
    // routes at the top of the function are matched first
    app.use('/transactions', authentication_1.isAuthenticated);
    app.post('/transactions', [transactions_controller_1.default.create]);
}
exports.default = routesConfig;
