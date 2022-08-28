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
Object.defineProperty(exports, "__esModule", { value: true });
exports.deleteAll = exports.getAllPollution = exports.getAllPollutionByCountry = exports.getMostPoluted = exports.AddPollution = exports.getAirQualityNearCity = void 0;
const fetch = require('node-fetch');
var cron = require('node-cron');
const airQualityModel_1 = require("../models/airQualityModel");
const airQualityService_1 = require("../service/airQualityService");
// get AirQuality Data
const getAirQualityNearCity = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        let params = req.body;
        if (params.latitude && params.longitude) {
            if (typeof params.latitude == 'number' && typeof params.longitude == 'number') {
                let resultFetch = yield (0, airQualityService_1.getFetchData)(params);
                if (typeof resultFetch != 'string') { // no error
                    res.status(200).json({
                        Result: {
                            pollution: {
                                ts: resultFetch.ts,
                                aqius: resultFetch.aqius,
                                mainus: resultFetch.mainus,
                                aqicn: resultFetch.aqicn,
                                maincn: resultFetch.maincn
                            }
                        },
                        message: 'operation has been done successfuly!'
                    });
                }
                else {
                    res.status(404).json({
                        message: resultFetch
                    });
                }
            }
            else
                res.status(400).json({
                    message: "please latitude and longitude are numbers not string"
                });
        }
        else
            res.status(400).json({
                message: "please add both latitude and longitude in parameters"
            });
    }
    catch (error) {
        console.log("ERROR  ", error);
        res.status(404).json({
            message: error.message
        });
    }
});
exports.getAirQualityNearCity = getAirQualityNearCity;
// save new Pollution object in the database
const AddPollution = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        let airQualityObject = req.body;
        let savedPollution = yield (0, airQualityService_1.createPollution)(airQualityObject);
        if (savedPollution) {
            res.status(200).json({
                data: savedPollution,
                message: 'operation has been done successfuly!'
            });
        }
        else {
            res.status(400).json({
                message: 'pollution object is not saved try again.'
            });
        }
    }
    catch (error) {
        console.log("ERROR  ", error);
        res.status(400).json({
            message: error.message
        });
    }
});
exports.AddPollution = AddPollution;
// get the most poluted time of a specific country
const getMostPoluted = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        let country = "France";
        let date = yield (0, airQualityService_1.mostPollutedTime)(country);
        res.status(200).json({
            data: date,
            message: "operation has been done successfuly!"
        });
    }
    catch (error) {
        console.log("ERROR  ", error);
        res.status(500).json({
            message: error.message
        });
    }
});
exports.getMostPoluted = getMostPoluted;
// get All polution object saved in database of a specific country
const getAllPollutionByCountry = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    let country = req.body.country;
    try {
        if (country != undefined) {
            if (country != "") {
                let listPollutionByCountry = yield airQualityModel_1.PollutionModel.find({ country: country });
                res.status(200).json({
                    data: listPollutionByCountry,
                    message: "operation has been done successfuly!"
                });
            }
            else
                res.status(400).json({
                    message: "country shouldn't be empty!"
                });
        }
        else
            res.status(400).json({
                message: "please add country in parameters!"
            });
    }
    catch (error) {
        console.log("ERROR  ", error);
        res.status(500).send({
            message: error.message
        });
    }
});
exports.getAllPollutionByCountry = getAllPollutionByCountry;
// get All polution object saved in database
const getAllPollution = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        let listPollution = yield airQualityModel_1.PollutionModel.find();
        res.status(200).json({
            data: listPollution,
            message: "operation has been done successfuly!"
        });
    }
    catch (error) {
        console.log("ERROR  ", error);
        res.status(500).json({
            message: error.message
        });
    }
});
exports.getAllPollution = getAllPollution;
// delete all element in database
const deleteAll = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        yield airQualityModel_1.PollutionModel.deleteMany();
        res.status(200).json({
            message: "all pollutions has been deleted successfuly!"
        });
    }
    catch (error) {
        console.log("ERROR  ", error);
        res.status(500).json({
            message: error.message
        });
    }
});
exports.deleteAll = deleteAll;
