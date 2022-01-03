const {OAuth2Client} = require('google-auth-library');
const jwt = require('jsonwebtoken');
const { db, modifyUser, loginUser, createUser, getUser, logout} = require('./database');
const SECRET_KEY = 'skurt' //process.env.SECRET_KEY;
const GOOGLE_CLIENT_ID = '62135896722-pvlotgl8dp4dua90m71h1na87ou4hm3g.apps.googleusercontent.com'
//const SPOTIFY_CLIENT_ID = '1fb88675208449d6bc9c31d2fcc3dc93'
const services = require('./about')
const clientgoogle = new OAuth2Client(GOOGLE_CLIENT_ID)
//const clientspotiy = new OAuth2Client(SPOTIFY_CLIENT_ID)

module.exports = function(app) {
    let userProfile;

    app.get('/', function(req, res) {
        res.redirect('/about.json');
    });
    app.get('/about.json', function(req, res) {
        res.send(services)
    })
    app.get('/auth/google', async (req, res) => {
        console.log(req.headers.bearer)
        try {
            const ticket = await clientgoogle.verifyIdToken({
                idToken: req.headers.bearer,
                audience: GOOGLE_CLIENT_ID
            })
            userProfile = ticket.getPayload();
        } catch (e) {
            console.log(e)
            res.send({error: {message: 'Error in verify ticket', status: 403}});
            return;
        }
        userProfile = await createUser({
            email: userProfile.email,
            firstName: userProfile.given_name,
            lastName: userProfile.family_name,
            googleToken: req.headers.bearer,
        })
        if (userProfile.error != undefined) {
            res.send(userProfile);
            return;
        }
        res.redirect('/signin')
    });

    app.post('/auth/spotify', async (req, res) => {
        const user = await modifyUser({args1: {accessToken: req.headers.authorization}, args2: {spotifyToken: req.body.token}})
        res.send(user);
        return;
    });

    app.post('/auth/vanilla/signup', async (req, res) => {
        if (req.body.email == undefined) {
            res.status(403)
            res.send({error: {message: 'No user during /auth/vanilla/signup', status: 403}})
            return;
        }
        userProfile = await createUser({
            email: req.body.email,
            password: req.body.password,
            firstName: req.body.firstName,
            lastName: req.body.lastName,
        })
        if (userProfile.error != undefined) {
            res.send(userProfile);
            return;
        }
        res.redirect('/signin')
    })
    app.post('/auth/vanilla/signin', async (req, res) => {
        if (req.body.email == undefined) {
            res.status(403)
            res.send({error: {message: 'No user during /auth/vanilla/signin', status: 403}})
            return;
        }
        userProfile = await loginUser({
            email: req.body.email,
            password: req.body.password,
        })
        if (userProfile.error != undefined) {
            res.send(userProfile);
            return;
        }
        res.redirect('/signin')
    })
    app.get('/signin', (req, res) => {
        if (userProfile == undefined) {
            res.status(403);
            res.send({error: {message: 'No user during signin', status: 403}});
            return;
        }
        const token = jwt.sign({id: userProfile._id}, SECRET_KEY, {
            expiresIn: 24 * 60 * 60
        })
        modifyUser({args1: {email: userProfile.email}, args2: {accessToken: token}});
        res.status(200)
        res.send({success: token})
    })
    app.get('/logout', async (req, res) => {
        const user = await logout(req.headers.authorization)
        if (user == null) {
            res.status(403);
            res.send({error: {message: 'User not found with auth token', status: 403}})
            return;
        }
        res.status(200)
        res.send({success: {message: "User logged out", status: 200}})
    })
    app.post('/user/update', async (req, res) => {

        const user = await modifyUser({args1: {accessToken: req.headers.authorization}, args2:{dashboard: req.body}})
        res.send(user);
    })
}