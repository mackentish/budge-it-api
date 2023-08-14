"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.verifyRefresh = exports.isAuthenticated = void 0;
const jsonwebtoken_1 = __importDefault(require("jsonwebtoken"));
function isAuthenticated(req, res, next) {
    console.log('test', req.get('authorization'));
    try {
        let token = req.get('authorization');
        if (!token) {
            return res.status(404).json('Token not found');
        }
        token = token.split(' ')[1];
        const decoded = jsonwebtoken_1.default.verify(token, process.env.ACCESS_TOKEN_SECRET);
        req.email = decoded.email;
        next();
    }
    catch (error) {
        return res.status(401).json('Unauthorized access');
    }
}
exports.isAuthenticated = isAuthenticated;
function verifyRefresh(email, token) {
    try {
        const decoded = jsonwebtoken_1.default.verify(token, process.env.REFRESH_TOKEN_SECRET);
        return decoded.email === email;
    }
    catch (error) {
        return false;
    }
}
exports.verifyRefresh = verifyRefresh;
