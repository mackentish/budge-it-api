"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.verifyRefresh = exports.isAuthenticated = void 0;
const jsonwebtoken_1 = __importDefault(require("jsonwebtoken"));
function isAuthenticated(req, res, next) {
    try {
        let token = req.get('authorization');
        if (!token) {
            return res.status(404).json('Token not found');
        }
        token = token.split(' ')[1];
        jsonwebtoken_1.default.verify(token, process.env.ACCESS_TOKEN_SECRET);
        next();
    }
    catch (error) {
        return res.status(401).json('Unauthorized access');
    }
}
exports.isAuthenticated = isAuthenticated;
function verifyRefresh(token) {
    try {
        jsonwebtoken_1.default.verify(token, process.env.REFRESH_TOKEN_SECRET);
        return true;
    }
    catch (error) {
        return false;
    }
}
exports.verifyRefresh = verifyRefresh;
