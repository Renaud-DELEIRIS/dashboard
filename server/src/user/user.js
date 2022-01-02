const { db, modifyUser, loginUser, createUser, getUser} = require('../database');
const { services } = require('../service')
const jwt = require('jsonwebtoken');
const {GraphQLJSON} = require('graphql-type-json');

const verifyToken = (token) => {
    try {
        jwt.verify(token, 'skurt')
    } catch (e) {
        return false;
    }
    return true
}

module.exports = {
    getUserInfo: async function(query, req, res) {
        const user = await getUser(req.headers.authorization)
        if (!verifyToken(req.headers.authorization))
            return {error: {message: "User token expire or not valid", status: 403}}
        if (user == null) {
            return {error: {message: 'User not found with auth token', status: 403}};
        }
        return user
    },
    userSchema: `
        scalar GraphQLJSON
        type User {
            email: String
            password: String
            accessToken: String
            spotifyToken: String
            firstName: String
            lastName: String
            dashboard: GraphQLJSON
            error: Error
        }
    `
}