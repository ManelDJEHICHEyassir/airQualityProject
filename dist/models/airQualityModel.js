"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.airQualifyModel = void 0;
const mongoose = require("mongoose");
const { Schema } = mongoose;
const schema = new Schema({
    zone: {
        type: String,
        required: true
    },
    createdAt: {
        type: Date,
        required: true
    },
    pollution: {
        aquis: {
            type: String,
            required: true
        },
        mainus: {
            type: String,
            required: true
        },
        aqicn: {
            type: String,
            required: true
        },
        maincn: {
            type: String,
            required: true
        }
    }
});
exports.airQualifyModel = new mongoose.Schema(schema);
