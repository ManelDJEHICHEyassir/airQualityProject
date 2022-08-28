import * as request from 'supertest';
import app from '../index';

describe("Test (1) ===========================  Endpoint getAirQualityNearCity", () => {
    test('>>> success responce', async () => {

        const res = await request(app).post('/getAirQualityNearCity').send({
            "latitude": 48.856613,
            "longitude": 2.352222
        })

        expect(res.status).toBe(200)
        expect(res.body).toHaveProperty("Result.pollution")
    });

    test('>>> verify if params are defined', async () => {

        const res: any = await request(app).post('/getAirQualityNearCity').send({
            "latitude": undefined,
            "longitude": undefined
        })
        expect(res.status).toBe(400)
        expect(res.body.message).toBe("please add both latitude and longitude in parameters")
    });

    test('>>> verify is params are number', async () => {

        const res: any = await request(app).post('/getAirQualityNearCity').send({
            "latitude": "48.856613",
            "longitude": "2.352222"
        })
        expect(res.status).toBe(400)
        expect(res.body.message).toBe("please latitude and longitude are numbers not string")
    });
})

describe("Test (2) ===========================  Endpoint createPollution", () => {
    test('>>> save a new object in mongoose database successfuly', async () => {

        const res = await request(app).post('/createPollution').send(
            {
                "latitude": 48.856613,
                "longitude": 2,
                "country": "France",
                "city": "Paris",
                "ts": "2022-08-27T06:00:00.000Z",
                "aqius": 30,
                "mainus": "p8",
                "aqicn": 30,
                "maincn": "p2"

            }
        )

        expect(res.status).toBe(200)
        expect(res.body).toHaveProperty("data.id")
        expect(res.body.message).toBe("operation has been done successfuly!")
    });

    test('>>> detect if an attribute or multiple ones are messing', async () => {

        // DELETE CITY AND COUNTRY
        const res = await request(app).post('/createPollution').send(
            {   
                "latitude": 48.856613,
                "longitude": 2,
                "ts": "2022-08-27T06:00:00.000Z",
                "aqius": 30,
                "mainus": "p8",
                "aqicn": 30,
                "maincn": "p2"
                    
            }
        )

        // describes what required attr is missing
        expect(res.status).toBe(400)
        expect(res.body.message).toBe("pollution validation failed: country: Path `country` is required., city: Path `city` is required.")
    });

})

describe("Test (3) ===========================  Endpoint getMostPolutedTimeFrance", () => {
    test('>>> success get of the the most polluted time in France', async () => {

        const res = await request(app).get('/getMostPolutedTimeFrance');

        expect(res.status).toBe(200)
        expect(res.body).toHaveProperty("data")
        expect(res.body.message).toBe("operation has been done successfuly!")
    });
})

// *** not required
describe("Test (4) ===========================  Endpoint getAllPollutionData", () => {
    test('>>> success get all pollution saved in database', async () => {

        const res = await request(app).get('/getAllPollutionData');

        expect(res.status).toBe(200)
        expect(res.body).toHaveProperty("data")
        expect(res.body.message).toBe("operation has been done successfuly!")
    });
});

// *** not required 
describe("Test (5) ===========================  Endpoint getAllPollutionDataByCountry", () => {
    test('>>> success get all pollution of a specific country', async () => {

        const res = await request(app).post('/getAllPollutionDataByCountry').send({
            "country": "France"
        })
        expect(res.status).toBe(200)
        expect(res.body).toHaveProperty("data")
        expect(res.body.message).toBe("operation has been done successfuly!")
    });

    test('>>> check if country params is defined', async () => {

        const res = await request(app).post('/getAllPollutionDataByCountry').send({
            "country": undefined
        })
        expect(res.status).toBe(400)
        expect(res.body.message).toBe("please add country in parameters!")
    });
})

// *** not required 
// I have built this endpoint to test, clean data and test again, you may need it while testing 
// so I drop it here
describe("Test (6) ===========================  Endpoint deleteAll", () => {
    test('>>> delete all the collection pollution from database', async () => {

        const res = await request(app).get('/deleteAll');
        expect(res.status).toBe(200)
        expect(res.body.message).toBe("all pollutions has been deleted successfuly!")
    });

  
})

// ***
// ABOUT CRON JOB, I did quick research, so I found that testing part of function called inside is the most important.
// I did just declare that functions separately not in the argument, and test them separetly.
// THE CRON JOB NEEDS TO GET POLLUTION OF FRANCE WHICH IS DONE IN: ++++++ TEST(1) ++++++
// THEN NEEDS TO SAVE THE OBJECT INTO DATABASE:                    ++++++ TEST(2) ++++++
// FINALY NEEDS TO GET THE MOST POLLUTED TIME OF FRANCE:           ++++++ TEST(3) ++++++
// ***

