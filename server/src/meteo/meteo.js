const axios = require("axios");

const url = "http://api.weatherstack.com"
const token = "9b075dd5b6f382881745fbf4d23815c7"

module.exports = {
    getWeather: async function (query) {
        if (query.name == null)
            query.name = "Lyon"
        let res = await axios({
            method:"GET",
            url : `${url}/current?access_key=${token}&query=${query.name}`,
            headers: {
                "content-type":"application/json",
            }
        });
        return (res.data);
    },
    weatherSchema: `
        type City {
            location: Location
            current: Current
        }
        type Location {
            name: String
            country: String
            region: String
            localtime: String
        }
        type Current {
            observation_time: String
            temperature: Int
            feelslikes: Int
            weather_icons: [String]
            weather_descriptions: [String]
        }
    `
}