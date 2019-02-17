const db = require('../config/db');
const ParticipantRecords = db.participantRecords;
const sendEmail = require('../config/mailer');
const {IN_PROGRESS, CONVERTED, CONVERTED_PATH, CONVERSION_FORMAT} = require('../constants');

const ffmpeg = require('fluent-ffmpeg');
const path = require('path');

exports.findAll = (req, res, next) => {
    ParticipantRecords.findAll().then((contests) => {
        res.json({contests: contests});
    }).catch((err) => {
        return res.send(err.stack);
    });
};

exports.findById = (req, res, next) => {
    const {params: {id}} = req;
    ParticipantRecords.findById(id).then((contest) => {
        res.json({contest: contest});
    }).catch((err) => {
        return res.send(err.stack);
    });
};

exports.originalFile = (req, res, next) => {
    const {params: {id}} = req;

    ParticipantRecords.findById(id).then((contest) => {
        const originalFile = contest.originalFile;
        res.sendFile(originalFile);
    }).catch((err) => {
        return res.send(err.stack);
    });
};

exports.convertedFile = (req, res, next) => {
    // TODO: has to manage the status of the
    // participantRecord and check if there
    // is a convertedFile
    const {params: {id}} = req;

    ParticipantRecords.findById(id).then((contest) => {
        const convertedFile = contest.convertedFile;
        res.sendFile(convertedFile);
    }).catch((err) => {
        return res.send(err.stack);
    });

    exports.convertFiles = () => {
        ParticipantRecords.findAll({where: {state: IN_PROGRESS}}).then((records) => {
            records.map((record) => {
                //Convert file
                const fileName = path.basename(record.convertedFile);
                const convertedFile = `${CONVERTED_PATH}${fileName}`;
                ffmpeg(record.originalFile).toFormat(CONVERSION_FORMAT)
                    .on('end', (result) => {
                        console.log(`End: ${result}`);
                        // Change state of participantRecord
                        ParticipantRecords.update({state: CONVERTED, convertedFile: convertedFile, where: {id: record.id}})
                            .then((record) => {
                                console.log(`Status change for record ${record.id}`);
                                // Email
                                const participantEmail = record.email;
                                sendEmail(participantEmail);
                            })
                            .catch((err) => {
                                console.log(err.stack);
                            });
                    })
                    .on('error', (err) => {
                        console.log(`Error: ${err.message}`);
                    })
                    .save(convertedFile);
            });
        }).catch((err) => {
            console.log(err.stack);
        });
    }

};
