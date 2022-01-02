const axios = require("axios");
const {getUser} = require('./database');
const url = "https://api.spotify.com"
const token = await getUser('window.localStorage.token').spotifyToken;
const user = this.getUserName().id;

module.exports = {
    getUserName: async function (query) {
        let res = await axios({
            method:"GET",
            url : `${url}/v1/me`,
            headers: {
                'Accept':"application/json",
                "content-type":"application/json",
                'Authorization':'Bearer ' + token
            }
        });
        return (res.data.results);
    },
    getPlaylist: async function (query) {
        let res = await axios({
            method:"GET",
            url : `${url}/v1/users/${user}/playlists`,
            headers: {
                'Accept':"application/json",
                "content-type":"application/json",
                'Authorization':'Bearer ' + token
            }
        });
        return (res.data.results);
    },
    playerSchema: `
        type User {
            id: Id
            display_name: Display_name
        }
    `
}