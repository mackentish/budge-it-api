"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const mongoose_1 = __importDefault(require("mongoose"));
const express_1 = __importDefault(require("express"));
const dotenv_1 = __importDefault(require("dotenv"));
const body_parser_1 = __importDefault(require("body-parser"));
const pockets_router_config_1 = __importDefault(require("./pockets/pockets.router.config"));
const users_router_config_1 = __importDefault(require("./users/users.router.config"));
// Connect to MongoDB database
mongoose_1.default.connect('mongodb://localhost:27017/budge-it-DB').then(() => {
    const jsonErrorHandler = (err, req, res, next) => {
        res.status(500).send({ error: err });
    };
    dotenv_1.default.config();
    const app = (0, express_1.default)();
    const PORT = process.env.PORT || 3001;
    app.use(body_parser_1.default.json());
    app.use(jsonErrorHandler);
    app.use(express_1.default.json());
    (0, pockets_router_config_1.default)(app);
    (0, users_router_config_1.default)(app);
    app.listen(PORT, function () {
        console.log('app listening at port %s', PORT);
    });
});
