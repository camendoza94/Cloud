const {setPassword, generateJWT, toAuthJSON} = require('../config/passport');
const db = require('../config/db');
const User = db.users;
const Contest = db.contests; 
const auth = require('../config/auth');
const passport = require('passport');
const uuidv4 = require('uuid/v4');

// Users
module.exports = (app) => {
    
    // User registration
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
                firstName: user.firstName,
                lastName: user.lastName,
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

    // User login
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

    // Current user
    app.get('/current', auth.required, (req, res, next) => {
        const {payload: {id}} = req;

        User.findById(id).then((user) => {
                                res.json({user: toAuthJSON(user)});
                            }).catch((err) => {
                                return res.send(err.stack);
                            });
    });

    // Contest of the user with id :id
    app.get('/users/:id/contests', auth.required, (req, res) => {
        const {params: {id}} = req;

        Contest.findAll({ where: {userId: id}}).then((contests) => {
            res.json({contests: contests});
        }).catch((err) => {
            return res.send(err.stack);
        })
    });

    // Create contests for the user with id :id
    app.post('/users/:id/contests', auth.required, (req, res) => {
        const {params: {id}} = req;
        const {body: {contest}} = req;
        
        contest.userId = id;
        
        if (!contest.name) {
            return res.status(422).json({
                errors: {
                    name: 'is required',
                },
            });
        }

        if (!contest.url) {
            return res.status(422).json({
                errors: {
                    url: 'is required',
                },
            });
        }

        if (!contest.image) {
            return res.status(422).json({
                errors: {
                    image: 'is required',
                },
            });
        }

        if (!contest.startDate) {
            return res.status(422).json({
                errors: {
                    startDate: 'is required',
                },
            });
        }

        const startDate = new Date(contest.startDate);
       
        if (!contest.endDate) {
            return res.status(422).json({
                errors: {
                    endDate: 'is required',
                },
            });
        }

        const endDate = new Date(contest.endDate);
       
        //TODO: Validate the dates
        if (endDate < startDate) {
            return res.status(422).json({
                errors: {
                    date: 'startDate after endDate',
                },
            });
        }

        if (!contest.payment) {
            return res.status(422).json({
                errors: {
                    payment: 'is required',
                },
            });
        }

        if (!contest.text) {
            return res.status(422).json({
                errors: {
                    text: 'is required',
                },
            });
        }

        Contest.Create(contest).then((contest) => {
            res.json({contest: contest});
        }).catch((err) => {
            return res.send(err.stack);
        })
    });
    
};