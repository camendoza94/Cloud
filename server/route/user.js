const {setPassword, generateJWT, toAuthJSON} = require('../config/passport');
const db = require('../config/db');
const User = db.users;
const auth = require('../config/auth');
const passport = require('passport');
const uuidv4 = require('uuid/v4');

// Users
module.exports = (app) => {
    app.post('/users', auth.optional, (req, res, next) => {
        const {body: {user}} = req;
        if (!user.email) {
            return res.status(422).json({
                errors: {
                    email: 'is required',
                },
            });
        }
        if (!user.password) {
            return res.status(422).json({
                errors: {
                    password: 'is required',
                },
            });
        }

        const finalUser = {email: user.email, hash: '', salt: ''};

        setPassword(finalUser, user.password);
        //TODO: Check if UUIDV4 for id is needed
        return User.create({
                firstname: user.firstname,
                lastname: user.lastname,
                email: finalUser.email,
                hash: finalUser.hash,
                salt: finalUser.salt
            }).then( (newUser) => {
                user.token = generateJWT(newUser);
                res.json({user: toAuthJSON(finalUser)});
            }).catch((err) => {
                return res.send(err.stack);
            });
    });

    app.post('/login', auth.optional, (req, res, next) => {
        const {body: {user}} = req;

        if (!user.email) {
            return res.status(422).json({
                errors: {
                    email: 'is required',
                },
            });
        }

        if (!user.password) {
            return res.status(422).json({
                errors: {
                    password: 'is required',
                },
            });
        }

        return passport.authenticate('local', {session: false}, (err, passportUser, info) => {
            if (err) {
                return next(err);
            }
            if (passportUser) {
                const user = passportUser;
                user.token = generateJWT(passportUser);

                return res.json({user: toAuthJSON(user)});
            }

            return res.sendStatus(400);
        })(req, res, next);
    });

    app.get('/current', auth.required, (req, res, next) => {
        const {payload: {id}} = req;

        User.findById(id).then((user) => {
                                res.json({user: toAuthJSON(user)});
                            }).catch((err) => {
                                return res.send(err.stack);
                            });
    });
};