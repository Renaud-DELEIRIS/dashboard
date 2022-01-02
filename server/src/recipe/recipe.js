const axios = require("axios");
const url = "https://api.spoonacular.com/recipes"
const token = "a4c4d57f91674990be97d7195d6df609"

module.exports = {
    getRandomRecipe: async function (query) {
        const request = (query.tags == null ? `${url}/random?number=1&apiKey=${token}` : `${url}/random?number=1&tags=${query.tags}&apiKey=${token}`)
        const res = await axios({
            method:"GET",
            url : request,
            headers: {
                "Accept":"application/json",
                "content-type":"application/json"
            },
        });
        const image = await axios({
            method:"GET",
            url: `${url}/${res.data.recipes[0].id}/card?apiKey=${token}`,
        });
        return (image.data);
    },
    recipeSchema: `
        type Recipe {
            url: String
            status: String
        }
    `
}