const AWS = require('aws-sdk');

const ddb = new AWS.DynamoDB({apiVersion: '2012-08-10'});

exports.originalFileDownload = (req, res) => {
    const {params: {id}} = req;

    const params = {
        TableName: 'Records',
        Key: {
            'id': {S: id}
        }
    };

    ddb.getItem(params, (err, data) => {
        if (err) {
            console.log("Error", err);
            return res.send(err);
        } else {
            const convertedFile = data.Item.originalFile;
            if (convertedFile) {
                res.download(convertedFile, (err) => {
                    if (err) {
                        return res.send(err);
                    }
                });
            } else {
                return res.sendStatus(400);
            }
        }
    });
};

exports.convertedFileDownload = (req, res) => {
    const {params: {id}} = req;

    const params = {
        TableName: 'Records',
        Key: {
            'id': {S: id}
        }
    };

    ddb.getItem(params, (err, data) => {
        if (err) {
            console.log("Error", err);
            return res.send(err);
        } else {
            const convertedFile = data.Item.convertedFile;
            if (convertedFile) {
                res.download(convertedFile, (err) => {
                    if (err) {
                        return res.send(err);
                    }
                });
            } else {
                return res.sendStatus(400);
            }
        }
    });
};
