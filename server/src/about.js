const {services} = require('./service')
const ip = require('ip');

module.exports = {
    "client": {
        "host": ip.address()
    },
    "server": {
        "current_time": Date.now(),
        services
    }
}