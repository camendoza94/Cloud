const AWS = require('aws-sdk');

const contest = require('../model/contest');
const participantRecord = require('../model/participantRecord');
const user = require('../model/user');

AWS.config.update({region: 'us-east-1'});

const ddb = new AWS.DynamoDB({apiVersion: '2012-08-10'});

exports.createTables = () => {
    ddb.createTable(contest, (err, data) => {
        if (err) {
            console.log("Already created", err);
        } else {
            console.log("Table Created", data);
        }
    });
    ddb.createTable(participantRecord, (err, data) => {
        if (err) {
            console.log("Already created", err);
        } else {
            console.log("Table Created", data);
        }
    });
    ddb.createTable(user, (err, data) => {
        if (err) {
            console.log("Already created", err);
        } else {
            console.log("Table Created", data);
        }
    });
};