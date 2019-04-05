const passport = require('passport');
const LocalStrategy = require('passport-local');
const crypto = require('crypto');
const jwt = require('jsonwebtoken');
const AWS = require('aws-sdk');

passport.use(new LocalStrategy({
    usernameField: 'user[email]',
    passwordField: 'user[password]',
}, (email, password, done) => {

    const ddb = new AWS.DynamoDB({apiVersion: '2012-08-10'});

    const params = {
        TableName: 'Users',
        Key: {
            'email': {S: email}
        }
    };

    ddb.getItem(params, (err, data) => {
        if (err) {
            done(null, false, {errors: {'email or password': 'is invalid'}});
        } else {
            const user = data.Item;
            if (!validatePassword(user, password)) {
                done(null, false, {errors: {'email or password': 'is invalid'}});
            }
            done(null, user);
        }
    });
}));


function validatePassword(user, password) {
    const hash = crypto.pbkdf2Sync(password, user.salt.S, 10000, 512, 'sha512').toString('hex');
    return user.pHash.S === hash;
}

function setPassword(user, password) {
    user.salt = crypto.randomBytes(16).toString('hex');
    user.hash = crypto.pbkdf2Sync(password, user.salt, 10000, 512, 'sha512').toString('hex');
}

function generateJWT(user) {
    const today = new Date();
    const expirationDate = new Date(today);
    expirationDate.setDate(today.getDate() + 60);
    return jwt.sign({
        email: user.email.S,
        id: user.id.S,
        exp: parseInt(expirationDate.getTime() / 1000, 10),
    }, 'secret');
}

function toAuthJSON(user) {
    return {
        id: user.id.S,
        email: user.email.S,
        token: generateJWT(user),
    };
}

module.exports = {setPassword, generateJWT, toAuthJSON};