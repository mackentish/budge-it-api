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
const users_model_1 = __importDefault(require("./users.model"));
const bcrypt_1 = __importDefault(require("bcrypt"));
const jsonwebtoken_1 = __importDefault(require("jsonwebtoken"));
const authentication_1 = require("../middleware/authentication");
// GET
function list(req, res) {
    return __awaiter(this, void 0, void 0, function* () {
        return users_model_1.default.find()
            .then((result) => {
            res.status(200).send(result);
        })
            .catch((err) => {
            res.status(500).send(err);
        });
    });
}
function getById(req, res) {
    return __awaiter(this, void 0, void 0, function* () {
        try {
            const user = yield users_model_1.default.findById(req.params.userId).exec();
            if (user) {
                res.status(200).send(user);
            }
            else {
                res.status(401).send('User not found');
            }
        }
        catch (err) {
            res.status(500).send(err);
        }
    });
}
// PUT
function updateById(req, res) {
    return __awaiter(this, void 0, void 0, function* () {
        return users_model_1.default.findByIdAndUpdate(req.params.userId, req.body, { new: true })
            .then((result) => {
            res.status(200).send(result);
        })
            .catch((err) => {
            res.status(500).send(err);
        });
    });
}
// POST
function insert(req, res) {
    return __awaiter(this, void 0, void 0, function* () {
        const user = new users_model_1.default(Object.assign(Object.assign({}, req.body), { password: yield bcrypt_1.default.hash(req.body.password, process.env.SALT) }));
        return user
            .save()
            .then((user) => {
            res.status(201).send({
                user: user,
                tokens: generateTokens(user.email),
            });
        })
            .catch((err) => {
            res.status(500).send(err);
        });
    });
}
function login(req, res) {
    return __awaiter(this, void 0, void 0, function* () {
        try {
            const { email, password } = req.body;
            const hashedPassword = yield bcrypt_1.default.hash(password, process.env.SALT);
            const user = yield users_model_1.default.findOne({
                email: email,
                password: hashedPassword,
            });
            if (user) {
                res.status(200).send({
                    user: user,
                    tokens: generateTokens(email),
                });
            }
            else {
                res.status(401).send('User not found');
            }
        }
        catch (err) {
            res.status(500).send(err);
        }
    });
}
function refreshToken(req, res) {
    const { email, refreshToken } = req.body;
    const isValid = (0, authentication_1.verifyRefresh)(refreshToken);
    if (!isValid) {
        return res.status(401).send('Invalid token, try login again');
    }
    const tokens = generateTokens(email);
    return res.status(200).json(Object.assign({ success: true }, tokens));
}
// DELETE
function removeAll(req, res) {
    return __awaiter(this, void 0, void 0, function* () {
        return users_model_1.default.deleteMany()
            .then(() => {
            res.status(200).send('All users have been removed');
        })
            .catch((err) => {
            res.status(500).send(err);
        });
    });
}
function removeById(req, res) {
    return __awaiter(this, void 0, void 0, function* () {
        return users_model_1.default.findByIdAndDelete(req.params.pocketId)
            .then(() => {
            res.status(200).send('User has been removed');
        })
            .catch((err) => {
            res.status(500).send(err);
        });
    });
}
// Helpers
function generateTokens(email) {
    const accessToken = jsonwebtoken_1.default.sign({ email: email }, process.env.ACCESS_TOKEN_SECRET, {
        expiresIn: '2m',
    });
    const refreshToken = jsonwebtoken_1.default.sign({ email: email }, process.env.REFRESH_TOKEN_SECRET, {
        expiresIn: '10m',
    });
    return { accessToken, refreshToken };
}
exports.default = {
    list,
    getById,
    updateById,
    insert,
    login,
    removeAll,
    removeById,
    refreshToken,
};
