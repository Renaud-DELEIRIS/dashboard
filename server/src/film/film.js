const axios = require("axios");

const url = "https://api.themoviedb.org/3"
const token = "eyJhbGciOiJIUzI1NiJ9.eyJhdWQiOiI1YzM4OGM0NTdhZGMyZTllMTBhZDhiM2QzODM1ZDYwMSIsInN1YiI6IjYxODkzMjBlMTYwZTczMDA0NDQyOTMwNyIsInNjb3BlcyI6WyJhcGlfcmVhZCJdLCJ2ZXJzaW9uIjoxfQ.NfpgeFizcceyB_YFsxDm6cHFvdbydyrvDGpWA0fBu1s"

module.exports = {
    getUpcomingMovie: async function (query) {
        let res = await axios({
            method:"GET",
            url : `${url}/movie/upcoming`,
            headers: {
                "content-type":"application/json",
                'Authorization':'Bearer ' + token
            }
        });
        return (res.data.results);
    },
    getTopratedMovie: async function (query) {
        let res = await axios({
            method:"GET",
            url : `${url}/movie/top_rated`,
            headers: {
                "content-type":"application/json",
                'Authorization':'Bearer ' + token
            }
        });
        return (res.data.results);
    },
    getPopularMovie: async function (query) {
        let res = await axios({
            method:"GET",
            url : `${url}/movie/popular`,
            headers: {
                "content-type":"application/json",
                'Authorization':'Bearer ' + token
            }
        });
        return (res.data.results);
    },
    movieSchema: `
        type Movie {
            original_title: String
            poster_path: String
            release_date: String
            overview: String
            vote_average: Float
            vote_count: Int
        }
    `
}