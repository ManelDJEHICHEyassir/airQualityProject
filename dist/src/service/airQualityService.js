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
exports.formFetchedDataToAirQualifyObject = exports.logPollution = exports.CronJobFrance = exports.mostPollutedTime = exports.createPollution = exports.getFetchData = void 0;
const cron = require("node-cron");
const fetch = require('node-fetch');
const airQualityModel_1 = require("../models/airQualityModel");
const getFetchData = (params) => __awaiter(void 0, void 0, void 0, function* () {
    let request = `https://api.airvisual.com/v2/nearest_city?lat=${params.latitude}&lon=${params.longitude}&key=85300751-a156-4f9c-ad61-9794a1903ec1`;
    return fetch(request, { method: 'get', headers: { 'Cache-Control': 'no-cache' } }).then((response) => __awaiter(void 0, void 0, void 0, function* () {
        const data = yield response.json();
        if (data.status == 'success') {
            let qualityAirResult;
            qualityAirResult = (0, exports.formFetchedDataToAirQualifyObject)(params, data.data);
            return qualityAirResult;
        }
        else
            return data.data.message;
    }));
});
exports.getFetchData = getFetchData;
const createPollution = (airQualityObject) => __awaiter(void 0, void 0, void 0, function* () {
    // get now time
    var now = new Date();
    const year = now.getFullYear();
    const month = now.getMonth();
    const day = now.getDate();
    const hour = now.getHours();
    const minute = now.getMinutes();
    const seconde = now.getSeconds();
    const nowDate = new Date(year, month, day, hour, minute, seconde);
    var newPollution = new airQualityModel_1.PollutionModel({
        latitude: airQualityObject.latitude,
        longitude: airQualityObject.longitude,
        country: airQualityObject.country,
        city: airQualityObject.city,
        createdAt: nowDate,
        ts: new Date(airQualityObject.ts),
        aqius: airQualityObject.aqius,
        mainus: airQualityObject.mainus,
        aqicn: airQualityObject.aqicn,
        maincn: airQualityObject.maincn,
    });
    let data = yield newPollution.save();
    let objectSaved;
    if (data) {
        objectSaved = {
            id: String(data._id),
            latitude: data.latitude,
            longitude: data.longitude,
            country: data.country,
            city: data.city,
            createdAt: data.createdAt,
            ts: data.ts,
            aqius: data.aqius,
            mainus: data.mainus,
            aqicn: data.aqicn,
            maincn: data.maincn,
        };
    }
    return objectSaved;
});
exports.createPollution = createPollution;
const mostPollutedTime = (country) => __awaiter(void 0, void 0, void 0, function* () {
    let listPollutionSortedByPollution = yield airQualityModel_1.PollutionModel.find({ country: country }).sort({ aqius: -1, mainus: -1, aqicn: -1, createdAt: 1, maincn: -1 });
    if (listPollutionSortedByPollution.length > 0) {
        return listPollutionSortedByPollution[0].ts.toString();
    }
    else {
        return '';
    }
});
exports.mostPollutedTime = mostPollutedTime;
const CronJobFrance = () => {
    // France params
    let params = {
        latitude: 48.856613,
        longitude: 2.352222
    };
    let country = "France";
    cron.schedule('* * * * *', () => __awaiter(void 0, void 0, void 0, function* () {
        try {
            console.log("\n--------------------------------------------------------------------------------------");
            console.log('* * * * *  we are going to get France pollution and save it every 1 minute * * * * * ');
            console.log("--------------------------------------------------------------------------------------");
            // get franche pollution
            let pollution = yield (0, exports.getFetchData)(params);
            if (typeof pollution != 'string') {
                console.log("++++ Get France Pollution object successufly \n", (0, exports.logPollution)(pollution));
                // save in database
                let saved = yield (0, exports.createPollution)(pollution);
                console.log("++++ Saved object in database successufly ");
                // get most polluted time in france
                let mostPolluted = yield (0, exports.mostPollutedTime)(country);
                console.log("++++ The most Polluted time in France is at >>> ", mostPolluted, " <<<");
            }
        }
        catch (error) {
            console.log("CRON STOPED BY ERROR ---- ", error.message);
        }
    }), { scheduled: true }).start();
};
exports.CronJobFrance = CronJobFrance;
const logPollution = (pollution) => {
    return `
        ts: ${pollution.ts} \t
        aqius: ${pollution.aqius} \t
        mainus: ${pollution.mainus} \t
        aqicn: ${pollution.aqicn} \t
        maincn: ${pollution.maincn} \t
        `;
};
exports.logPollution = logPollution;
// make a AirQualityObject from Responce API
const formFetchedDataToAirQualifyObject = (params, item) => {
    let qualityAirResult = {
        latitude: params.latitude,
        longitude: params.longitude,
        country: item.country,
        city: item.city,
        createdAt: item.current.pollution.createdAt,
        ts: item.current.pollution.ts,
        aqius: item.current.pollution.aqius,
        mainus: item.current.pollution.mainus,
        aqicn: item.current.pollution.aqicn,
        maincn: item.current.pollution.maincn,
    };
    return qualityAirResult;
};
exports.formFetchedDataToAirQualifyObject = formFetchedDataToAirQualifyObject;
