"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const mongoose_1 = require("mongoose");
const userSchema = new mongoose_1.Schema({
    firstName: { type: String, required: true },
    lastName: { type: String, required: true },
    email: {
        type: String,
        required: true,
        unique: true,
    },
    password: { type: String, required: true },
    tags: { type: [String], required: true, default: [] },
}, { timestamps: true });
exports.default = (0, mongoose_1.model)('Users', userSchema);
