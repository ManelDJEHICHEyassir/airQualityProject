const fetch = require('node-fetch');
var cron = require('node-cron');
import { AIR_QUALITY_OBJECT, AIR_QUALITY_REQUEST } from "../../unit/unit.type";
import { Request, Response } from 'express';
import { PollutionModel } from "../models/airQualityModel";
import { createPollution, getFetchData, mostPollutedTime } from "../service/airQualityService";


// get AirQuality Data
export const getAirQualityNearCity = async (req: Request, res: Response) => {

    try {
        let params: AIR_QUALITY_REQUEST = req.body;

        if (params.latitude && params.longitude) {
        if(typeof params.latitude == 'number' && typeof params.longitude == 'number'){
            let resultFetch: AIR_QUALITY_OBJECT | string = await getFetchData(params)

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
                })
                
            } else {
                res.status(404).json({
                    message: resultFetch
                })
            }
        }else res.status(400).json({
            message: "please latitude and longitude are numbers not string"
        })
        } else res.status(400).json({
            message: "please add both latitude and longitude in parameters"
        })
    } catch (error) {
        console.log("ERROR  ", error);

        res.status(404).json({
            message: error.message
        })
    }
}

// save new Pollution object in the database
export const AddPollution = async (req: Request, res: Response) => {

    try {
        let airQualityObject: AIR_QUALITY_OBJECT = req.body;
        let savedPollution = await createPollution(airQualityObject)
        if (savedPollution) {
            res.status(200).json({
                data: savedPollution,
                message: 'operation has been done successfuly!'
            })
        } else {
            res.status(400).json({
                message: 'pollution object is not saved try again.'
            })
        }

    } catch (error) {
        console.log("ERROR  ", error);

        res.status(400).json({
            message: error.message
        })
    }

}

// get the most poluted time of a specific country
export const getMostPoluted = async (req: Request, res: Response) => {
    try {
        let country = "France";
        let date = await mostPollutedTime(country);
        res.status(200).json({
            data: date,
            message: "operation has been done successfuly!"
        })
    } catch (error) {
        console.log("ERROR  ", error);

        res.status(500).json({
            message: error.message
        })
    }
}

// get All polution object saved in database of a specific country
export const getAllPollutionByCountry = async (req: Request, res: Response) => {

    let country: string = req.body.country;

    try {
        if (country != undefined) {
            if (country != "") {
                let listPollutionByCountry = await PollutionModel.find({ country: country })
                res.status(200).json({
                    data: listPollutionByCountry,
                    message: "operation has been done successfuly!"
                })
            } else res.status(400).json({
                message: "country shouldn't be empty!"
            })
        } else res.status(400).json({
            message: "please add country in parameters!"
        })
    } catch (error) {
        console.log("ERROR  ", error);

        res.status(500).send({
            message: error.message
        })
    }
}

// get All polution object saved in database
export const getAllPollution = async (req: Request, res: Response) => {
    try {
        let listPollution = await PollutionModel.find();
        res.status(200).json({
            data: listPollution,
            message: "operation has been done successfuly!"
        })
    } catch (error) {
        console.log("ERROR  ", error);

        res.status(500).json({
            message: error.message
        })
    }
}

// delete all element in database
export const deleteAll = async (req: Request, res: Response) => {
    try {
        await PollutionModel.deleteMany();
        res.status(200).json({
            message: "all pollutions has been deleted successfuly!"
        })
    } catch (error) {
        console.log("ERROR  ", error);

        res.status(500).json({
            message: error.message
        })
    }
}


