/* eslint-disable no-console */
const {IN_PROGRESS, UPLOAD_PATH, CONVERSION_FORMAT, CONVERTED, IMAGE_PATH, CLOUDFRONT} = require('../constants');
const uuid = require('uuid/v4');
//const fs = require('fs');
const {uploadFileS3} = require('../config/files');
const {sendMessage} = require('../config/queue');
const AWS = require('aws-sdk');
const { client } = require('../config/db'); 
const ddb = new AWS.DynamoDB({apiVersion: '2012-08-10'});

exports.findByURL = (req, res) => {
    const {params: {url}} = req;
    const params = {
        TableName: 'Contests',
        Key: {
            'url': {S: url}
        }
    };

    ddb.getItem(params, (err, data) => {
        if (err) {
            console.log("Error", err);
            return res.status(422).send(err);
        } else {
            if (data.Item) {
                console.log("Success", data.Item);
                client.zincrby('popular', 1, data.Item.url.S);
                res.json({contest: data.Item});
            } else
                return res.status(404).send("Not found");

        }
    });
};

exports.delete = (req, res) => {
    const url = req.params.id;

    const params = {
        TableName: 'Contests',
        Key: {
            'url': {S: url}
        },
        ReturnValues: "ALL_OLD"
    };

    ddb.deleteItem(params, (err, data) => {
        if (err) {
            console.log("Error", err);
            return res.status(422).send(err);
        } else {
            console.log("Success", data);
            const params = {
                TableName: "Records",
                IndexName: "ContestIdIndex",
                KeyConditionExpression: "contestId = :id",
                ExpressionAttributeValues: {":id": data.Attributes.url},
            };

            ddb.query(params, (err, data) => {
                if (err) {
                    console.log("Error", err);
                    return res.send(err);
                } else {
                    data.Items.forEach(item => {
                        let params = {
                            TableName: 'Records',
                            Key: {
                                'id': item.id
                            }
                        };

                        ddb.deleteItem(params, (err, data) => {
                            if (err) {
                                console.log("Error deleting record", err);
                                return res.status(422).send(err);
                            } else {
                                console.log("Success deleting record", data);
                            }
                        });
                    })
                }
            });
            return res.json({contest: data.Attributes});
        }
    });
};

exports.update = (req, res) => {
    const {
        body,
        params: {id}
    } = req;
    let uploadFile = req.files && req.files.file;
    if (uploadFile) {
        const extension = uploadFile.name.split('.').pop();
        const uniqueFileName = `${uuid()}.${extension}`;
        const savePath = `${IMAGE_PATH}${uniqueFileName}`;
        req.setTimeout(0);
        const upload = uploadFileS3(savePath, uploadFile.data).promise();
        body.image = `${CLOUDFRONT}${savePath}`;
        upload.then((data) => {
            console.log("Success: ", data.Location);
        }).catch((err) => {
            if (err) {
                console.log("Error: ", err);
                return res.status(500).send(err);
            }
        });
    }
    let updtExpression = "set #n = :n, startDate = :s, endDate = :e, payment = :p, #t = :t, recommendations = :r";
    let updtValues = {
        ":n": {"S": body.name},
        ":s": {"S": body.startDate},
        ":e": {"S": body.endDate},
        ":p": {"N": body.payment},
        ":t": {"S": body.text},
        ":r": {"S": body.recommendations},
    };

    if (body.image) {
        updtExpression = `${updtExpression}, image = :i`;
        updtValues[":i"] = body.image;
    }

    const params = {
        TableName: 'Contests',
        Key: {
            "url": {"S": id}
        },
        UpdateExpression: updtExpression,
        ExpressionAttributeValues: updtValues,
        ReturnValues: "ALL_NEW",
        ExpressionAttributeNames: {
            "#n": "name",
            "#t": "text"
        },
    };

    ddb.updateItem(params, (err, data) => {
        if (err) {
            console.log("Error", err);
            return res.status(400).send({error: "Contest with given URL already exists."});
        } else {
            if (id !== body.url) {
                const params = {
                    TableName: 'Contests',
                    Key: {
                        'url': {S: id}
                    }
                };
                console.log("Deletion");

                ddb.deleteItem(params, err => {
                        if (err) {
                            console.log("Error", err);
                            return res.status(422).send(err);
                        } else {
                            console.log("Deleted", data);
                            const params = {
                                TableName: "Contests",
                                Item: {
                                    'name': {S: data.Attributes.name.S},
                                    'image': {S: data.Attributes.image.S},
                                    'url': {S: body.url},
                                    'startDate': {S: data.Attributes.startDate.S},
                                    'endDate': {S: data.Attributes.endDate.S},
                                    'payment': {N: data.Attributes.payment.N},
                                    'text': {S: data.Attributes.text.S},
                                    'recommendations': {S: data.Attributes.recommendations.S},
                                    'userId': {S: data.Attributes.userId.S}
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

                        }
                    }
                );
            } else {
                res.json({contest: params.Item});
            }

        }
    });
};

exports.addParticipantRecord = (req, res) => {
    const participantRecord = req.body;
    const contestId = req.params.id;
    req.setTimeout(0);
    if (Object.keys(req.files).length === 0) {
        return res.status(422).json({
            error: {
                file: 'No files were uploaded.'
            }
        });
    }

    const fileAudio = req.files.originalFile;
    const extension = fileAudio.name.split('.').pop();
    const uniqueFileName = `${uuid()}.${extension}`;

    const savePath = `${UPLOAD_PATH}${uniqueFileName}`;

    participantRecord.contestId = contestId;
    participantRecord.originalFile = `${CLOUDFRONT}${savePath}`;
    participantRecord.state = IN_PROGRESS;

    if (extension === CONVERSION_FORMAT) {
        participantRecord.state = CONVERTED;
        participantRecord.convertedFile = `${CLOUDFRONT}${savePath}`;
    }

    const params = {
        TableName: 'Contests',
        Key: {
            'url': {S: contestId}
        }
    };

    ddb.getItem(params, (err, data) => {
        if (err) {
            console.log("Error", err);
            return res.status(422).send(err);
        } else {
            if (data.Item) {
                const endDate = new Date(data.Item.endDate.S);
                if (endDate < new Date()) {
                    return res.status(422).json({
                        error: {
                            contest: 'Contest already ended.'
                        }
                    });
                }

                const upload = uploadFileS3(savePath, fileAudio.data).promise();

                upload.then((data) => {
                    console.log("Success: ", data.Location);
                }).catch((err) => {
                    if (err) {
                        console.log("Error: ", err);
                        return res.status(422).send(err);
                    }
                });
                const params = {
                    TableName: 'Records',
                    Item: {
                        'id': {S: uuid()},
                        'contestId': {S: participantRecord.contestId},
                        'originalFile': {S: participantRecord.originalFile},
                        'state': {S: participantRecord.state},
                        'firstName': {S: participantRecord.firstName},
                        'lastName': {S: participantRecord.lastName},
                        'email': {S: participantRecord.email},
                        'observations': {S: participantRecord.observations},
                        'createdAt': {S: new Date().toISOString()}
                    }
                };

                if (extension === CONVERSION_FORMAT) {
                    params.Item.convertedFile = {S: participantRecord.convertedFile};
                }
                ddb.putItem(params, function (err) {
                    if (err) {
                        console.log("Error", err);
                        return res.status(422).send(err);
                    } else {
                        if (params.Item.state.S === IN_PROGRESS)
                            sendMessage(params.Item.id.S, `${process.env.FRONT_ROOT_URL}/contests/${data.Item.url.S}`);
                        return res.json({participantRecord: params.Item});

                    }
                });

            } else {
                console.log("Error", err);
                return res.status(422).send(err);
            }
        }
    });
};

exports.getParticipantRecords = (req, res) => {
    const contestId = req.params.id;
    const paginate = req.query.paginate || 50;
    const forward = req.query.forward || true;
    const where = req.payload ? "contestId = :id" : "contestId = :id AND #s =:cv";
    const whereValues = req.payload ? {":id": {"S": contestId}} : {":id": {"S": contestId}, ":cv": {"S": "Convertida"}};
    const params = {
        TableName: "Records",
        IndexName: "ContestIdIndex",
        KeyConditionExpression: where,
        ExpressionAttributeValues: whereValues,
        Limit: paginate,
        ScanIndexForward: !!forward
    };

    if (!req.payload)
        params.ExpressionAttributeNames = {"#s": "state"};
    if (req.body.lek)
        params.ExclusiveStartKey = req.body.lek;

    ddb.query(params, (err, data) => {
        if (err) {
            console.log("Error", err);
            return res.send(err);
        } else {
            console.log("Success", data.Items);
            res.json({participantRecords: data.Items});
        }
    });
};

exports.getPopularContests = (req, res) => {
    // Top 3 [0, 1, 2]
    client.ZREVRANGE('popular', 0, 2, 'withscores', (err, reply) => {
        if(err){
            console.log(err);
            return res.send(err);
        }
        let popularContests = {};
        popularContests = reply.reduce((result, value, index, array) => {
            if(index % 2 === 0){
                result[array[index]] = array[index + 1]
            }
            return result;
        }, {});
        return res.json(popularContests);
    });
};