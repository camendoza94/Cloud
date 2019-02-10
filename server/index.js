const {setPassword, generateJWT, toAuthJSON} = require('./config/passport');
const pool = require('./db');
const auth = require('./config/auth');
const passport = require('passport');
const uuidv4 = require('uuid/v4');

module.exports = (app) => {
    //Users
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

        const query = 'INSERT INTO users(id, email, hash, salt) VALUES($1, $2, $3, $4) RETURNING *';
        const values = [uuidv4(), finalUser.email, finalUser.hash, finalUser.salt];

        return pool.query(query, values, (err, resp) => {
            if (err) {
                return res.send(err.stack);
            }
            user.token = generateJWT(resp.rows[0]);
            res.json({user: toAuthJSON(finalUser)});
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

        return pool.query('SELECT * FROM users WHERE id = $1', [id],(err, resp) => {
                if (err) {
                    return res.sendStatus(400);
                }

                return res.json({user: toAuthJSON(resp.rows[0])});
            });
    });
};