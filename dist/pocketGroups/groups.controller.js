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
const groups_model_1 = __importDefault(require("./groups.model"));
const users_model_1 = __importDefault(require("../users/users.model"));
const pockets_model_1 = __importDefault(require("../pockets/pockets.model"));
const authentication_1 = require("../middleware/authentication");
// GET
function list(req, res) {
    return __awaiter(this, void 0, void 0, function* () {
        let userEmail;
        try {
            userEmail = (0, authentication_1.extractEmailFromToken)(req);
        }
        catch (_a) {
            return res.status(401).json('Not authorized');
        }
        const user = yield users_model_1.default.findOne({ email: userEmail });
        if (!user) {
            return res.status(401).send('User not found');
        }
        return groups_model_1.default.find({ user: user._id })
            .populate('pockets')
            .then((result) => {
            res.status(200).send(result);
        })
            .catch((err) => {
            res.status(500).send(err);
        });
    });
}
function create(req, res) {
    return __awaiter(this, void 0, void 0, function* () {
        try {
            let userEmail;
            try {
                userEmail = (0, authentication_1.extractEmailFromToken)(req);
            }
            catch (_a) {
                return res.status(401).json('Not authorized');
            }
            const newGroupData = req.body;
            // validate data
            if (!newGroupData.name ||
                !newGroupData.pockets ||
                newGroupData.pockets.length === 0) {
                return res.status(400).send('Missing required fields');
            }
            // validate that pockets exist and belong to user
            // validate that pockets are not already in a group
            const user = yield users_model_1.default.findOne({ email: userEmail });
            if (!user) {
                return res.status(401).send('User not found');
            }
            // validate pocket ids
            const pockets = yield pockets_model_1.default.find({
                _id: { $in: newGroupData.pockets },
                user: user._id,
            });
            if (pockets.length !== newGroupData.pockets.length) {
                return res.status(400).send('One or more pocket ids are invalid');
            }
            // validate that pockets are not already in a group
            const pocketsInGroup = yield pockets_model_1.default.find({
                _id: { $in: newGroupData.pockets },
                groupId: { $ne: null },
            });
            if (pocketsInGroup.length > 0) {
                return res
                    .status(400)
                    .send('One or more pockets are already in a group');
            }
            // if all validations pass, create group and update pockets
            const newGroup = yield groups_model_1.default.create(Object.assign(Object.assign({}, newGroupData), { user: user._id }));
            yield pockets_model_1.default.updateMany({ _id: { $in: newGroupData.pockets } }, { groupId: newGroup._id });
            return res.status(201).send('Group created');
        }
        catch (err) {
            return res.status(500).send(err);
        }
    });
}
// DELETE
function removeAll(req, res) {
    return __awaiter(this, void 0, void 0, function* () {
        try {
            const { deletedCount } = yield groups_model_1.default.deleteMany({});
            const { matchedCount } = yield pockets_model_1.default.updateMany({ groupId: { $ne: undefined } }, { groupId: null });
            res.status(200).send(`Deleted ${deletedCount} groups and updated ${matchedCount} pockets`);
        }
        catch (err) {
            res.status(500).send(err);
        }
    });
}
exports.default = { list, create, removeAll };
