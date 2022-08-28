import * as express from 'express';
import * as controllers  from '../controllers/airQualityController';


const airQualityRouter = express.Router();

// get Air Quality pollution object from the api AirQuality using latitude and longitude
airQualityRouter.post('/getAirQualityNearCity', controllers.getAirQualityNearCity);

// save pollution object in database 
airQualityRouter.post('/createPollution', controllers.AddPollution);

// get Most poluted time in France from database 
airQualityRouter.get('/getMostPolutedTimeFrance', controllers.getMostPoluted);

// get all pollution object in database by country 
airQualityRouter.post('/getAllPollutionDataByCountry', controllers.getAllPollutionByCountry);

// get all pollution object in databse 
airQualityRouter.get('/getAllPollutionData', controllers.getAllPollution);

// delete all element in database
airQualityRouter.get('/deleteAll', controllers.deleteAll);

export default airQualityRouter;