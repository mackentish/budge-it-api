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
const pockets_model_1 = __importDefault(require("./pockets.model"));
const users_model_1 = __importDefault(require("../users/users.model"));
// GET
function list(req, res) {
    return __awaiter(this, void 0, void 0, function* () {
        return pockets_model_1.default.find({ user: req.params.userId })
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
        return pockets_model_1.default.findById(req.params.pocketId)
            .then((result) => {
            res.status(200).send(result);
        })
            .catch((err) => {
            res.status(500).send(err);
        });
    });
}
// PUT
function updateById(req, res) {
    return __awaiter(this, void 0, void 0, function* () {
        try {
            const newPocketData = req.body;
            const existingPocketData = yield pockets_model_1.default.findById(req.params.pocketId).exec();
            if (!existingPocketData) {
                res.status(404).send("Pocket not found");
                return;
            }
            const pocketUser = yield users_model_1.default.findById(existingPocketData.user).exec();
            if (!pocketUser) {
                res.status(404).send("User not found");
                return;
            }
            // add funds to pocket
            if (newPocketData.amount > existingPocketData.amount) {
                // validate that there is enough in unallocated to remove
                const amountChanged = newPocketData.amount - existingPocketData.amount;
                if (amountChanged > pocketUser.unallocated) {
                    res.status(400).send("Insufficient funds in unallocated");
                    return;
                }
                else {
                    // remove amountChanged from unallocated
                    pocketUser.unallocated -= amountChanged;
                    yield pocketUser.save();
                    // add amountChanged to pocket
                    existingPocketData.amount = newPocketData.amount;
                    yield existingPocketData.save();
                    res.status(201).send(existingPocketData);
                }
            }
            // remove funds from pocket
            else {
                // remove funds from pocket and add same amount to unallocated
                const amountChanged = existingPocketData.amount - newPocketData.amount;
                pocketUser.unallocated += amountChanged;
                yield pocketUser.save();
                existingPocketData.amount = newPocketData.amount;
                yield existingPocketData.save();
                res.status(201).send(existingPocketData);
            }
        }
        catch (err) {
            res.status(500).send(err);
        }
    });
}
// POST
function insert(req, res) {
    return __awaiter(this, void 0, void 0, function* () {
        const pocket = new pockets_model_1.default(req.body);
        return pocket
            .save()
            .then((result) => {
            res.status(201).send(result);
        })
            .catch((err) => {
            res.status(500).send(err);
        });
    });
}
function insertMany(req, res) {
    return __awaiter(this, void 0, void 0, function* () {
        return pockets_model_1.default.insertMany(req.body)
            .then((result) => {
            res.status(201).send(result);
        })
            .catch((err) => {
            res.status(500).send(err);
        });
    });
}
// DELETE
function removeAll(req, res) {
    return __awaiter(this, void 0, void 0, function* () {
        return pockets_model_1.default.deleteMany({ user: req.params.userId })
            .then((result) => {
            res.status(200).send("All pockets have been removed");
        })
            .catch((err) => {
            res.status(500).send(err);
        });
    });
}
function removeById(req, res) {
    return __awaiter(this, void 0, void 0, function* () {
        return pockets_model_1.default.findByIdAndDelete(req.params.pocketId)
            .then((result) => {
            res.status(200).send("Pocket has been removed");
        })
            .catch((err) => {
            res.status(500).send(err);
        });
    });
}
exports.default = {
    list,
    getById,
    updateById,
    insert,
    insertMany,
    removeAll,
    removeById,
};
