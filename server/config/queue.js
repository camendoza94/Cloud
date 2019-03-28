const AWS = require('aws-sdk');
// Set the region
AWS.config.update({region: 'us-east-1'});

// Create an SQS service object
const sqs = new AWS.SQS({apiVersion: '2012-11-05'});
exports.sendMessage = (id, url) => {
    const params = {
        DelaySeconds: 10,
        MessageAttributes: {
            "ID": {
                DataType: "String",
                StringValue: id.toString()
            },
            "URL": {
                DataType: "String",
                StringValue: url.toString()
            }
        },
        MessageBody: `Participant record with id ${id} needs conversion. Contest URL: ${url}`,
        QueueUrl: "https://sqs.us-east-1.amazonaws.com/356893040219/ModeloC"
    };

    sqs.sendMessage(params, (err, data) => {
        if (err) {
            console.log("Error", err);
        } else {
            console.log("Success", data.MessageId);
        }
    });
};