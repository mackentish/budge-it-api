"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const mongoose_1 = require("mongoose");
const pocketSchema = new mongoose_1.Schema({
    name: { type: String, required: true },
    amount: { type: Number, required: true },
    user: { type: String, required: true },
    note: { type: String, required: false },
    groupId: { type: String, required: false },
}, { timestamps: true });
exports.default = (0, mongoose_1.model)('Pockets', pocketSchema);
