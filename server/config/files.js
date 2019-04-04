const {BUCKET} = require('../constants');
const AWS = require('aws-sdk');
// Set the region
AWS.config.update({region: 'us-east-1'});

// Create an SQS service object
const s3 = new AWS.S3({apiVersion: '2012-11-05'});

exports.uploadFileS3 = (key, fileData, callback) => {
    const params = {
        Bucket: BUCKET,
        Key: key, // file will be saved as BUCKET/<key>
        Body: fileData,
        ACL:'public-read'
     };
    s3.upload(params, callback);

};