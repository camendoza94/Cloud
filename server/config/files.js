const {BUCKET} = require('../constants');
const AWS = require('aws-sdk');
// Set the region
AWS.config.update({region: 'us-east-1'});

// Create an S3 service object
const s3 = new AWS.S3({apiVersion: '2012-11-05'});

exports.uploadFileS3 = (key, fileData) => {
    const params = {
        Bucket: BUCKET,
        Key: key, // file will be saved as BUCKET/<key>
        Body: fileData,
        ACL: 'public-read',
        ContentDisposition: 'attachment'
    };
    console.log(params);
    return s3.upload(params);

};