"use strict";
var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.getUserFromToken = exports.verifyRefresh = exports.isAuthenticated = void 0;
const jsonwebtoken_1 = __importDefault(require("jsonwebtoken"));
const users_model_1 = __importDefault(require("../users/users.model"));
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
function getUserFromToken(req) {
    return __awaiter(this, void 0, void 0, function* () {
        let token = req.get('authorization');
        if (!token) {
            throw new Error('Token not found');
        }
        token = token.split(' ')[1];
        const decoded = jsonwebtoken_1.default.decode(token);
        const user = yield users_model_1.default.findOne({ email: decoded.email });
        if (!user) {
            throw new Error('User not found');
        }
        return user;
    });
}
exports.getUserFromToken = getUserFromToken;
