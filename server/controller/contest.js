/* eslint-disable no-console */
const {IN_PROGRESS, UPLOAD_PATH, CONVERSION_FORMAT, CONVERTED, IMAGE_PATH} = require('../constants');
const uuid = require('uuid/v4');
const fs = require('fs');
const {sendMessage} = require('../config/queue');
const AWS = require('aws-sdk');

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
        }
    };

    ddb.delete(params, (err, data) => {
        if (err) {
            console.log("Error", err);
            return res.status(422).send(err);
        } else {
            console.log("Success", data.Item);
            res.json({contest: data.Item});
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

        uploadFile.mv(savePath,
            function (err) {
                if (err) {
                    return res.status(500).send(err)
                }
                const stream = fs.createWriteStream(savePath, {encoding: 'utf8'});
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
        body.image = uniqueFileName;
    }
    const params = {
        TableName: 'Contests',
        Item: {
            'id': {S: id},
            'name': {S: body.name},
            'image': {S: body.image},
            'url': {S: body.url},
            'startDate': {S: body.startDate},
            'endDate': {S: body.endDate},
            'payment': {N: body.payment},
            'text': {S: body.text},
            'recommendations': {S: body.recommendations},
            'userId': {S: body.userId}
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

exports.addParticipantRecord = (req, res) => {
    const participantRecord = req.body;
    const contestId = req.params.id;

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
    participantRecord.originalFile = savePath;
    participantRecord.state = IN_PROGRESS;

    if (extension === CONVERSION_FORMAT) {
        participantRecord.state = CONVERTED;
        participantRecord.convertedFile = savePath;
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
                fileAudio.mv(savePath, (err) => {
                    if (err) {
                        console.log(err);
                        return res.status(422).send(err);
                    }
                    const stream = fs.createWriteStream(savePath, {encoding: 'utf8'});
                    stream.once('open', () => {
                        stream.write(fileAudio.data, writeErr => {
                            if (writeErr) {
                                return res.status(500).send(`Failed to write content ${savePath}.`);
                            }
                            stream.close();
                            console.log(`File ${fs.existsSync(savePath) ? 'exists' : 'does NOT exist'} under ${savePath}.`);
                        })
                    });
                    const params = {
                        TableName: 'Records',
                        Item: {
                            'id': {S: uuid()},
                            'contestId': {S: participantRecord.name},
                            'originalFile': {S: participantRecord.originalFile},
                            'state': {S: participantRecord.state},
                            'convertedFile': {S: participantRecord.convertedFile},
                            'firstName': {S: participantRecord.first},
                            'lastName': {S: participantRecord.lastName},
                            'email': {S: participantRecord.email},
                            'observations': {S: participantRecord.observations},
                            'createdAt': {S: participantRecord.createdAt}
                        }
                    };

                    ddb.putItem(params, function (err) {
                        if (err) {
                            console.log("Error", err);
                            return res.status(422).send(err);
                        } else {
                            console.log("Success", params.Item);
                            if (participantRecord.state === IN_PROGRESS)
                                sendMessage(participantRecord.id, `${process.env.REACT_APP_ROOT_URL}/${data.Item.url.S}`);
                            return res.json({participantRecord: params.Item});

                        }
                    });
                });
            } else
                console.log("Error", err);
                return res.status(422).send(err);
        }
    });
};

exports.getParticipantRecords = (req, res) => {
    const contestId = req.params.id;
    const paginate = req.query.paginate || req.payload ? 50 : 20;
    const where = req.payload ? "contestId = :id" : "contestId = :id AND #s =:cv";
    const whereValues = req.payload ? {":id": {"S": contestId}} : {":id": {"S": contestId}, ":cv": {"S": "Convertida"}};
    //TODO paginate
    const params = {
        TableName: "Records",
        IndexName: "ContestIdIndex",
        KeyConditionExpression: where,
        ExpressionAttributeValues: whereValues,
        Limit: paginate
    };
    
    if(!req.payload)
      params.ExpressionAttributeNames = {"#s" : "state"};

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