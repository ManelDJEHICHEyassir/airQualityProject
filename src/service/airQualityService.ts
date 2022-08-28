import cron = require('node-cron');
const fetch = require('node-fetch');
import { AIR_QUALITY_OBJECT, AIR_QUALITY_REQUEST } from '../../unit/unit.type';
import { PollutionModel } from '../models/airQualityModel';


export const getFetchData = async (params: AIR_QUALITY_REQUEST): Promise<AIR_QUALITY_OBJECT | string> => {
    let request: string = `https://api.airvisual.com/v2/nearest_city?lat=${params.latitude}&lon=${params.longitude}&key=85300751-a156-4f9c-ad61-9794a1903ec1`
    return fetch(request, { method: 'get', headers: { 'Cache-Control': 'no-cache' } }).then(async response => {
        const data = await response.json();
        if (data.status == 'success') {
            let qualityAirResult: AIR_QUALITY_OBJECT;
            qualityAirResult = formFetchedDataToAirQualifyObject(params, data.data);
            return qualityAirResult;

        } else return data.data.message;
    });
}

export const createPollution = async (airQualityObject: AIR_QUALITY_OBJECT): Promise<AIR_QUALITY_OBJECT> => {
    // get now time
    var now = new Date();
    const year = now.getFullYear();
    const month = now.getMonth();
    const day = now.getDate();
    const hour = now.getHours();
    const minute = now.getMinutes();
    const seconde = now.getSeconds();
    const nowDate: Date = new Date(year, month, day, hour, minute, seconde);

    var newPollution = new PollutionModel({
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

    let data = await newPollution.save();
    let objectSaved: AIR_QUALITY_OBJECT;
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
        }

    }
    return objectSaved;

}

export const mostPollutedTime = async (country: string): Promise<string> => {
    let listPollutionSortedByPollution = await PollutionModel.find({ country: country }).sort({ aqius: -1, mainus: -1, aqicn: -1, createdAt: 1, maincn: -1 });
    if (listPollutionSortedByPollution.length > 0) {
        return listPollutionSortedByPollution[0].ts.toString();
    } else {
        return ''
    }
}

export const CronJobFrance = () => {

    // France params
    let params: AIR_QUALITY_REQUEST = {
        latitude: 48.856613,
        longitude: 2.352222
    }
    let country: string = "France";

    cron.schedule('* * * * *', async () => {
        try {
            console.log("\n--------------------------------------------------------------------------------------")
            console.log('* * * * *  we are going to get France pollution and save it every 1 minute * * * * * ');
            console.log("--------------------------------------------------------------------------------------")

            // get franche pollution
            let pollution: AIR_QUALITY_OBJECT | string = await getFetchData(params);
            if (typeof pollution != 'string') {
                console.log("++++ Get France Pollution object successufly \n", logPollution(pollution))

                // save in database
                let saved: AIR_QUALITY_OBJECT = await createPollution(pollution);
                console.log("++++ Saved object in database successufly ",)

                // get most polluted time in france
                let mostPolluted: string = await mostPollutedTime(country)
                console.log("++++ The most Polluted time in France is at >>> ", mostPolluted, " <<<")

            }
        } catch (error) {
            console.log("CRON STOPED BY ERROR ---- ", error.message);

        }

    }, { scheduled: true }).start();
}

export const logPollution = (pollution: AIR_QUALITY_OBJECT): string => {
    return `
        ts: ${pollution.ts} \t
        aqius: ${pollution.aqius} \t
        mainus: ${pollution.mainus} \t
        aqicn: ${pollution.aqicn} \t
        maincn: ${pollution.maincn} \t
        `;
}

// make a AirQualityObject from Responce API
export const formFetchedDataToAirQualifyObject = (params: AIR_QUALITY_REQUEST, item: any): AIR_QUALITY_OBJECT => {

    let qualityAirResult: AIR_QUALITY_OBJECT = {
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
    }

    return qualityAirResult;

}

