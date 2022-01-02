const express = require('express');
const {graphqlHTTP} = require('express-graphql');
const { makeExecutableSchema } = require('@graphql-tools/schema');
const { getWeather, weatherSchema } = require('./src/meteo/meteo');
const { getUpcomingMovie, getPopularMovie, getTopratedMovie, movieSchema } = require('./src/film/film');
const session = require('express-session');
const bodyParser = require('body-parser');
const { userSchema, getUserInfo } = require('./src/user/user');
const cors = require('cors')
const {getExchangeRate, exchangeSchema} = require('./src/market/exchange')
const {getRandomRecipe, recipeSchema} = require('./src/recipe/recipe')

const Query = `
type Query {
    weather(name: String): City
    movieUpcoming: [Movie]
    movieToprated: [Movie]
    moviePopular: [Movie]
    getUser: User
    getExchangeRate(symbol: String!, amount: Int!, convert: String!): Exchange
    getRandomRecipe(tags: String): Recipe
}
`;

const baseSchema = `
type Error {
  message: String
  status: Int
}
`

const schema = makeExecutableSchema({
    typeDefs: [Query, baseSchema, weatherSchema, movieSchema, userSchema, exchangeSchema, recipeSchema]
});

const root = {
    weather: getWeather,
    movieUpcoming: getUpcomingMovie,
    moviePopular: getPopularMovie,
    movieToprated: getTopratedMovie,
    getUser: getUserInfo,
    getExchangeRate: getExchangeRate,
    getRandomRecipe: getRandomRecipe
};

const app = express();

app.use(/\/((?!graphql).)*/, bodyParser.urlencoded({ extended: true }));
app.use(/\/((?!graphql).)*/, bodyParser.json());

app.use(cors());

app.use(session({
  resave: false,
  saveUninitialized: true,
  secret: 'SECRET'
}));

app.use('/graphql', (req, res) => graphqlHTTP({
    schema: schema,
    rootValue: root,
    graphiql: true
})(req, res));

app.listen(8081, () => console.log('Express GraphQL Server Now Running On localhost:8081/graphql'));

const passport = require('passport');

app.use(passport.initialize());
app.use(passport.session());

require('./src/routes.js')(app);