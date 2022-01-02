module.exports = {
    services: {
        "services": [
        {
            "name": "meteo",
            "widgets": [{
                "name": "city_temperature",
                "description": "Display temperature for a city",
                "params": [{
                    "name": "city",
                    "type": "string"
                }]
            }]
        }, {
            "name": "film",
            "widgets": [{
                "name": "movie",
                "description": "Display movie with filter",
                "params": [{
                    "name": "filter",
                    "type": "string"
                }]
            }]
        }, {
            "name": "market",
            "widgets": [{
                "name": "exchange",
                "description": "price converter",
                "params": [{
                    "name": "right_coin",
                    "type": "string"
                }, {
                    "name": "left_coin",
                    "type": "string"
                }, {
                    "name": "amount",
                    "type": "int"
                }]
            }, {
                "name": "bullish",
                "description": "price tendance",
                "params": [{
                    "name": "coin",
                    "type": "string"
                }]
            }, {
                "name": "ticker",
                "description": "coin ticker",
                "params": [{
                    "name": "coin",
                    "type": "string"
                }]
            }]
        }, {
            "name": "recipe",
            "widgets": [{
                "name": "random",
                "description": "give a random recipe depends on tags",
                "params": [{
                    "name": "tags",
                    "type": "string"
                }]
            }]
        }, {
            "name": "spotify",
            "widgets": [{
                "name": "player",
                "description": "spotify player",
                "params": [{
                    "name": "song",
                    "type": "string"
                }]
            }]
        }
        ]
    }
}