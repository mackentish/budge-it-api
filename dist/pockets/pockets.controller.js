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
const groups_model_1 = __importDefault(require("../pocketGroups/groups.model"));
const authentication_1 = require("../middleware/authentication");
// GET
function list(req, res) {
    return __awaiter(this, void 0, void 0, function* () {
        const user = yield (0, authentication_1.getUserFromToken)(req);
        return pockets_model_1.default.find({ user: user._id })
            .then((result) => {
            return res.status(200).send(result);
        })
            .catch((err) => {
            return res.status(500).send(err);
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
            const user = yield (0, authentication_1.getUserFromToken)(req);
            const newPocketData = req.body;
            const existingPocketData = yield pockets_model_1.default.findOne({
                _id: req.params.pocketId,
                user: user._id,
            }).exec();
            if (!existingPocketData) {
                return res.status(404).send('Pocket not found');
            }
            // update pocket
            existingPocketData.name = newPocketData.name;
            if (newPocketData.groupId) {
                existingPocketData.groupId = newPocketData.groupId;
                // update group
                const existingGroup = yield groups_model_1.default.findOne({
                    _id: newPocketData.groupId,
                    user: user._id,
                }).exec();
                if (!existingGroup) {
                    return res.status(404).send('Group not found');
                }
                existingGroup.pockets.push(existingPocketData);
                yield existingGroup.save();
            }
            yield existingPocketData.save();
            return res.status(202).send(existingPocketData);
        }
        catch (err) {
            return res.status(500).send(err);
        }
    });
}
// POST
function create(req, res) {
    return __awaiter(this, void 0, void 0, function* () {
        try {
            const user = yield (0, authentication_1.getUserFromToken)(req);
            const pocket = new pockets_model_1.default(Object.assign(Object.assign({}, req.body), { user: user._id }));
            yield pocket.save();
            res.status(201).send(pocket);
        }
        catch (err) {
            res.status(500).send(err);
        }
    });
}
// DELETE
function removeAll(req, res) {
    return __awaiter(this, void 0, void 0, function* () {
        return pockets_model_1.default.deleteMany({ user: req.params.userId })
            .then(() => {
            res.status(200).send('All pockets have been removed');
        })
            .catch((err) => {
            res.status(500).send(err);
        });
    });
}
function removeById(req, res) {
    return __awaiter(this, void 0, void 0, function* () {
        const user = yield (0, authentication_1.getUserFromToken)(req);
        return pockets_model_1.default.findOneAndDelete({ _id: req.params.pocketId, user: user._id })
            .then((result) => {
            res.status(202).send(result);
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
    create,
    removeAll,
    removeById,
};
