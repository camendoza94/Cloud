const db = require('../config/db');
const User = db.users;
const passport = require('passport');
const LocalStrategy = require('passport-local');
const crypto = require('crypto');
const jwt = require('jsonwebtoken');

passport.use(new LocalStrategy({
    usernameField: 'user[email]',
    passwordField: 'user[password]',
}, (email, password, done) => {

    User.findOne({
        where: {
            email: email
        }
    }).then((user) => {
        if (!validatePassword(user, password)) {
            done(null, false, {errors: {'email or password': 'is invalid'}});
        }
        done(null, user);
    }).catch((err) => {
        done(null, false, {errors: {'email or password': 'is invalid'}});
    });

}));


function validatePassword(user, password) {
    const hash = crypto.pbkdf2Sync(password, user.salt, 10000, 512, 'sha512').toString('hex');
    return user.hash === hash;
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
        email: user.email,
        id: user.id,
        exp: parseInt(expirationDate.getTime() / 1000, 10),
    }, 'secret');
}

function toAuthJSON(user) {
    return {
        id: user.id,
        email: user.email,
        token: generateJWT(user),
    };
}

module.exports = {setPassword, generateJWT, toAuthJSON};