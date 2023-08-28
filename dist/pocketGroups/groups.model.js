"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const mongoose_1 = require("mongoose");
const groupSchema = new mongoose_1.Schema({
    name: { type: String, required: true },
    note: { type: String, required: false },
    user: { type: String, required: true },
    pockets: [{ type: mongoose_1.Schema.Types.ObjectId, ref: 'Pockets' }],
}, { timestamps: true });
exports.default = (0, mongoose_1.model)('Groups', groupSchema);
