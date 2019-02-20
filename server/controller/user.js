const {setPassword, generateJWT, toAuthJSON} = require('../config/passport');
const {IMAGE_PATH} = require('../constants');
const db = require('../config/db');
const User = db.users;
const Contest = db.contests;
const passport = require('passport');
const uuid = require('uuid/v4');
const fs = require('fs');


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
    return User.create({
            firstName: user.firstName,
            lastName: user.lastName,
            email: user.email,
            hash: finalUser.hash,
            salt: finalUser.salt
        }).then( (newUser) => {
            user.token = generateJWT(newUser);
            res.json({user: toAuthJSON(newUser)});
        }).catch(() => {
            return res.status(400).send({ error: "User already exists." });
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

    User.findByPk(id).then((user) => {
                            res.json({user: toAuthJSON(user)});
                        }).catch((err) => {
                            return res.send(err.stack);
                        });
};

exports.getContests = (req, res, next) => {
    const userId = req.params.id;
    const {payload: {id}} = req;
    if(parseInt(userId) !== parseInt(id)) {
        return res.status(401).json({
            errors: {
                name: 'unauthorized',
            },
        });
    }

    const page = req.query.page || 1;
    const paginate = req.query.paginate || 50;

    Contest.paginate({ where: {userId: id}, page: page, paginate: paginate}).then((contests) => {
        res.json({contests: contests});
    }).catch((err) => {
        return res.send(err.stack);
    })
};

exports.addContests = (req, res, next) => {
    const userId = req.params.id;
    const {body} = req;
    body.userId = userId;
    let uploadFile = req.files.file;

    const extension = uploadFile.name.split('.').pop();
    const uniqueFileName = `${uuid.v4()}.${extension}`;
    const savePath = `${IMAGE_PATH}${uniqueFileName}`;

    uploadFile.mv(savePath,
        function (err) {
            if (err) {
                return res.status(500).send(err)
            }
            const stream = fs.createWriteStream(savePath, { encoding: 'utf8' });
            stream.once('open', () => {
                stream.write(uploadFile.data, writeErr => {
                    if (writeErr) {
                        return res.status(500).send(`Failed to write content ${savePath}.`);
                    }
                    stream.close();
                    console.log(`File ${fs.existsSync(savePath) ? 'exists' : 'does NOT exist'} under ${savePath}.`);
                })
            });
            console.log("Moved");
        },
    );


    const {payload: {id}} = req;
    if(parseInt(userId) !== parseInt(id)) {
        return res.status(401).json({
            errors: {
                name: 'unauthorized',
            },
        });
    }

    if (!body.name) {
        return res.status(422).json({
            errors: {
                name: 'is required',
            },
        });
    }

    if (!body.url) {
        return res.status(422).json({
            errors: {
                url: 'is required',
            },
        });
    }

    if (!req.files.file) {
        return res.status(422).json({
            errors: {
                file: 'is required',
            },
        });
    }

    if (!body.startDate) {
        return res.status(422).json({
            errors: {
                startDate: 'is required',
            },
        });
    }

    const startDate = new Date(body.startDate);

    if (!body.endDate) {
        return res.status(422).json({
            errors: {
                endDate: 'is required',
            },
        });
    }

    const endDate = new Date(body.endDate);

    if (endDate < startDate) {
        return res.status(422).json({
            errors: {
                date: 'startDate after endDate',
            },
        });
    }

    if (!body.payment) {
        return res.status(422).json({
            errors: {
                payment: 'is required',
            },
        });
    }

    if (!body.text) {
        return res.status(422).json({
            errors: {
                text: 'is required',
            },
        });
    }
    body.image = uniqueFileName;
    Contest.create(body).then((contest) => {
        res.json({contest: contest});
    }).catch((err) => {
        return res.send(err.stack);
    })
};
