"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const mongoose_1 = require("mongoose");
const transactionSchema = new mongoose_1.Schema({
    user: { type: String, required: true },
    name: { type: String, required: true },
    amount: { type: Number, required: true },
    date: { type: Date, required: true },
    inflow: { type: String, required: true },
    outflow: { type: String, required: true },
    tags: { type: [String], required: false, default: [] },
    note: { type: String, required: false },
}, { timestamps: false });
exports.default = (0, mongoose_1.model)('Transactions', transactionSchema);
