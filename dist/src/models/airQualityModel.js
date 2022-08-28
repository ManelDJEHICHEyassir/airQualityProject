"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.PollutionModel = void 0;
const mongoose = require("mongoose");
const { Schema } = mongoose;
const pollution = new Schema({
    latitude: {
        type: Number,
        required: true
    },
    longitude: {
        type: Number,
        required: true
    },
    country: {
        type: String,
        required: true
    },
    city: {
        type: String,
        required: true
    },
    ts: {
        type: Date,
        required: true
    },
    createdAt: {
        type: Date,
        required: true
    },
    aqius: {
        type: Number,
        required: true
    },
    mainus: {
        type: String,
        required: true
    },
    aqicn: {
        type: Number,
        required: true
    },
    maincn: {
        type: String,
        required: true
    }
});
exports.PollutionModel = mongoose.model('pollution', pollution, 'Pollutions');
