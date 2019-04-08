/* eslint-disable no-console */
const {setPassword, generateJWT, toAuthJSON} = require('../config/passport');
const {IMAGE_PATH, CLOUDFRONT} = require('../constants');
const passport = require('passport');
const uuid = require('uuid/v4');
//const fs = require('fs');
const {uploadFileS3} = require('../config/files');
const AWS = require('aws-sdk');

const ddb = new AWS.DynamoDB({apiVersion: '2012-08-10'});


exports.registerUser = (req, res) => {
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

    const params = {
        TableName: 'Users',
        Item: {
            'id': {S: uuid()},
            'firstName': {S: user.firstName},
            'lastName': {S: user.lastName},
            'email': {S: user.email},
            'pHash': {S: finalUser.hash},
            'salt': {S: finalUser.salt},
        },
        ConditionExpression: "email <> :e",
        ExpressionAttributeValues: {
            ":e": {"S": user.email}
        },
    };

    ddb.putItem(params, function (err) {
        if (err) {
            console.log("Error", err);
            return res.status(400).send({error: "User already exists."});
        } else {
            console.log("Success", params.Item);
            user.token = generateJWT(params.Item);
            res.json({user: toAuthJSON(params.Item)});
        }
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

    return passport.authenticate('local', {session: false}, (err, passportUser) => {
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

exports.getContests = (req, res) => {
    const userId = req.params.id;
    const {payload: {id}} = req;
    if (userId !== id) {
        return res.status(401).json({
            errors: {
                name: 'unauthorized',
            },
        });
    }

    const paginate = req.query.paginate || 50;
    const forward = req.query.forward || true;

    const params = {
        TableName: "Contests",
        IndexName: "UserIdIndex",
        KeyConditionExpression: "#usr = :user",
        ExpressionAttributeNames: {
            "#usr": "userId"
        },
        ExpressionAttributeValues: {
            ":user": {"S": id}
        },
        Limit: paginate,
        ScanIndexForward: !!forward
    };

    if (req.body.lek)
        params.ExclusiveStartKey = req.body.lek;

    ddb.query(params, (err, data) => {
        if (err) {
            console.log("Error", err);
            return res.send(err);
        } else {
            console.log("Success", data.Items);
            res.json({contests: data.Items, lek: data.LastEvaluatedKey});
        }
    });
};


exports.addContests = (req, res) => {
    req.setTimeout(0);
    const userId = req.params.id;
    const {body} = req;
    body.userId = userId;
    let uploadFile = req.files.file;

    const extension = uploadFile.name.split('.').pop();
    const uniqueFileName = `${uuid()}.${extension}`;
    const savePath = `${IMAGE_PATH}${uniqueFileName}`;

    const upload = uploadFileS3(savePath, uploadFile.data).promise();

    upload.then((data) => {
        console.log("Success: ", data.Location);
    }).catch((err) => {
        if (err) {
            return res.status(500).send(err)
        }
    });
    body.image = `${CLOUDFRONT}${savePath}`;
    const {payload: {id}} = req;
    if (userId !== id) {
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

    const params = {
        TableName: 'Contests',
        Item: {
            'name': {S: body.name},
            'image': {S: body.image},
            'url': {S: body.url},
            'startDate': {S: body.startDate},
            'endDate': {S: body.endDate},
            'payment': {N: body.payment},
            'text': {S: body.text},
            'recommendations': {S: body.recommendations},
            'userId': {S: body.userId}
        },
        ConditionExpression: "#u <> :uv",
        ExpressionAttributeNames: {
            "#u": "url"
        },
        ExpressionAttributeValues: {
            ":uv": {"S": body.url}
        }
    };

    ddb.putItem(params, function (err) {
        if (err) {
            console.log("Error", err);
            return res.status(400).send({error: "Contest with given URL already exists."});
        } else {
            console.log("Success", params.Item);
            res.json({contest: params.Item});

        }
    });
};