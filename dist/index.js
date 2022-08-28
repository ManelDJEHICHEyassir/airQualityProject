"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const express = require("express");
const bodyParser = require("body-parser");
const mongoose = require("mongoose");
const airQualityRoute_1 = require("./src/routes/airQualityRoute");
const airQualityService_1 = require("./src/service/airQualityService");
const env_1 = require("./config/env");
const app = express();
// database connexion
const dataConnexion = (user, pass) => {
    return `mongodb+srv://${user}:${pass}@cluster0.cn52y.mongodb.net/?retryWrites=true&w=majority`;
};
let database = dataConnexion(env_1.MONGOOSE_USER, env_1.MONGOOSE_PASSWORD);
mongoose.connect(database, err => {
    if (err == null) {
        console.log("database connected successfuly");
        console.log("Cron JOB will start after 1 min from now ...");
    }
    else
        console.log("ERROR database ", err);
});
// bodyparser setup
app.use(bodyParser.urlencoded({ extended: true }));
app.use(bodyParser.json());
// Routes
app.use('/', airQualityRoute_1.default);
// server listening
app.listen(env_1.PORT, () => {
    console.log(`⚡️[server]: Server is running at https://${env_1.HOST}:${env_1.PORT}`);
});
// CORN JOB that will get data of France then save it in database evry 1 min
(0, airQualityService_1.CronJobFrance)();
// server static file
app.use(express.static('public'));
exports.default = app;
