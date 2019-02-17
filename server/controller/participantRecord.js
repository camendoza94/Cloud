const db = require('../config/db');
const ParticipantRecords = db.participantRecords;
const sendEmail = require('../config/mailer');
const {IN_PROGRESS, CONVERTED, CONVERTED_PATH, CONVERSION_FORMAT} = require('../constants');

const ffmpeg = require('fluent-ffmpeg');
const path = require('path');
const ms = require('mediaserver');

exports.findAll = (req, res, next) => {
    ParticipantRecords.findAll().then((contests) => {
        res.json({contests: contests});
    }).catch((err) => {
        return res.send(err.stack);
    });
};

exports.findById = (req, res, next) => {
    const {params: {id}} = req;
    ParticipantRecords.findByPk(id).then((contest) => {
        res.json({contest: contest});
    }).catch((err) => {
        return res.send(err.stack);
    });
};

exports.originalFile = (req, res, next) => {
    const {params: {id}} = req;

    ParticipantRecords.findById(id).then((participantRecord) => {
        const originalFile = participantRecord.originalFile;
        if(originalFile){
            ms.pipe(req, res, originalFile);
        } else {
            return res.sendStatus(400);
        }
    }).catch((err) => {
        return res.send(err.stack);
    });
};

exports.convertedFile = (req, res, next) => {
    const {params: {id}} = req;

    ParticipantRecords.findById(id).then((participantRecord) => {
        const convertedFile = participantRecord.convertedFile;
        if(convertedFile){
            ms.pipe(req, res, convertedFile);
        } else {
            return res.sendStatus(400);
        }
    }).catch((err) => {
        return res.send(err.stack);
    });
};

exports.originalFileDownload = (req, res, next) => {
    const {params: {id}} = req;

    ParticipantRecords.findById(id).then((contest) => {
        const originalFile = contest.originalFile;
        res.download(originalFile, (err) => {
            if (err){
                return res.send(err.stack);
            }
        });
    }).catch((err) => {
        return res.send(err.stack);
    });
};

exports.convertedFileDownload = (req, res, next) => {
    const {params: {id}} = req;

    ParticipantRecords.findById(id).then((contest) => {
        const convertedFile = contest.convertedFile;
        if (convertedFile){
            res.download(convertedFile, (err) => {
                if (err){
                    return res.send(err.stack);
                }
            });
        } else {
            return res.sendStatus(400);
        }
    }).catch((err) => {
        return res.send(err.stack);
    });
};

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
