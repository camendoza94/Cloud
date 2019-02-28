var AWS = require('aws-sdk');
// Set the region
AWS.config.update({region: 'us-east-1'});

// Function to send mail 'to'
exports.sendEmail = (to) => {
    const params = {
        Destination: {
            ToAddresses: [
                to
            ]
        },
        Message: {
            Body: {
                Html: {
                    Charset: "UTF-8",
                    Data: "Hi there, this email was automatically sent by us to tell you that your voice is now available for a new <b>audio contest</b>"
                },
                Text: {
                    Charset: "UTF-8",
                    Data: "Hi there, this email was automatically sent by us to tell you that your voice is now available for a new audio contest"
                }
            },
            Subject: {
                Charset: 'UTF-8',
                Data: 'Available contests voice'
            }
        },
        Source: 'clouddevelop2019@gmail.com',
        ReplyToAddresses: [
            'clouddevelop2019@gmail.com'
        ]
    };

    const sendPromise = new AWS.SES({apiVersion: '2010-12-01'}).sendEmail(params).promise();

    sendPromise.then(
        function(data) {
            console.log(data.MessageId);
        }).catch(
        function(err) {
            console.error(err, err.stack);
        });
};