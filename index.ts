import * as express from 'express'
import * as bodyParser from 'body-parser'
import * as mongoose from 'mongoose'
import airQualityRouter from './src/routes/airQualityRoute'
import { CronJobFrance } from './src/service/airQualityService'

import {HOST, PORT, MONGOOSE_USER, MONGOOSE_PASSWORD} from './config/env'

const app = express();

// database connexion
const dataConnexion = (user: string, pass: string): string => {
    return `mongodb+srv://${user}:${pass}@cluster0.cn52y.mongodb.net/?retryWrites=true&w=majority`;
}

let database: string = dataConnexion(MONGOOSE_USER, MONGOOSE_PASSWORD) ;
mongoose.connect(database, err => {
    if (err == null) {
        console.log("database connected successfuly");
        console.log("Cron JOB will start after 1 min from now ...");
    }
    else console.log("ERROR database ", err)
});

// bodyparser setup
app.use(bodyParser.urlencoded({ extended: true }))
app.use(bodyParser.json())

// Routes
app.use('/', airQualityRouter)

// server listening
app.listen(PORT, () => {
    console.log(`⚡️[server]: Server is running at https://${HOST}:${PORT}`);    
});

// CORN JOB that will get data of France then save it in database evry 1 min
CronJobFrance()

// server static file
app.use(express.static('public'))

export default app;
