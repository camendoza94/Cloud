const {setPassword, generateJWT, toAuthJSON} = require('../config/passport');
const db = require('../config/db');
const User = db.users;
const Contest = db.contests;
const passport = require('passport');
const uuidv4 = require('uuid/v4');


exports.registerUser = (req, res, next) => {
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
};

exports.logIn = (req, res, next) => {
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
};

exports.current = (req, res, next) => {
    const {payload: {id}} = req;

    User.findById(id).then((user) => {
                            res.json({user: toAuthJSON(user)});
                        }).catch((err) => {
                            return res.send(err.stack);
                        });
};

exports.getContests = (req, res, next) => {
    const userId = req.params.id;
    const {payload: {id}} = req;
    if(userId !== id) {
        return res.status(401).json({
            errors: {
                name: 'unauthorized',
            },
        });
    }

    Contest.findAll({ where: {userId: id}}).then((contests) => {
        res.json({contests: contests});
    }).catch((err) => {
        return res.send(err.stack);
    })
};

exports.addContests = (req, res, next) => {
    const userId = req.params.id;
    const {body: {contest}} = req;
    contest.userId = userId;

    const {payload: {id}} = req;
    if(userId !== id) {
        return res.status(401).json({
            errors: {
                name: 'unauthorized',
            },
        });
    }

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
};
