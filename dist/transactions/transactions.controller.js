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
const transactions_model_1 = __importDefault(require("./transactions.model"));
const authentication_1 = require("../middleware/authentication");
// POST
function create(req, res) {
    return __awaiter(this, void 0, void 0, function* () {
        try {
            const user = yield (0, authentication_1.getUserFromToken)(req);
            if (req.body.inflow === req.body.outflow) {
                return res
                    .status(400)
                    .send('Inflow and outflow cannot be the same');
            }
            const transaction = new transactions_model_1.default(Object.assign(Object.assign({}, req.body), { user: user._id }));
            yield transaction.save();
            return res.status(201).send(transaction);
        }
        catch (err) {
            return res.status(500).send(err);
        }
    });
}
// DELETE
function removeAll(req, res) {
    return __awaiter(this, void 0, void 0, function* () {
        return transactions_model_1.default.deleteMany({ user: req.params.userId })
            .then(() => {
            return res
                .status(200)
                .send('All transactions have been removed for this user');
        })
            .catch((err) => {
            return res.status(500).send(err);
        });
    });
}
exports.default = {
    create,
    removeAll,
};
