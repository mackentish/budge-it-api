"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const mongoose_1 = require("mongoose");
const pocketSchema = new mongoose_1.Schema({
    name: { type: String, required: true },
    amount: { type: Number, required: true },
    user: { type: mongoose_1.Schema.Types.ObjectId, ref: "Users", required: true },
}, { timestamps: true });
exports.default = (0, mongoose_1.model)("Pockets", pocketSchema);
