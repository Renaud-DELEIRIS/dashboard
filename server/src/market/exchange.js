const axios = require("axios");
const {GraphQLJSON} = require('graphql-type-json');
const url = "https://pro-api.coinmarketcap.com"
const token = "fcb35661-49f2-4ba2-aac0-227447c7ff1d"

module.exports = {
    getExchangeRate: async function (query) {
        const res = await axios({
            method:"GET",
            url : `${url}/v1/tools/price-conversion?symbol=${query.symbol}&amount=${query.amount}&convert=${query.convert}`,
            headers: {
                "Accept":"application/json",
                'X-CMC_PRO_API_KEY': token,
                "content-type":"application/json"
            },
        });
        return (res.data);
    },
    exchangeSchema: `
        scalar GraphQLJSON
        type Exchange {
            data: GraphQLJSON
            status: GraphQLJSON
        }
    `
}