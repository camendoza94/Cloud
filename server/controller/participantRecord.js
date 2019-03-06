const db = require('../config/db');
const ParticipantRecords = db.participantRecords;

const ms = require('mediaserver');

exports.findAll = (req, res) => {
    ParticipantRecords.findAll().then((contests) => {
        res.json({contests: contests});
    }).catch((err) => {
        return res.send(err.stack);
    });
};

exports.findById = (req, res) => {
    const {params: {id}} = req;
    ParticipantRecords.findByPk(id).then((contest) => {
        res.json({contest: contest});
    }).catch((err) => {
        return res.send(err.stack);
    });
};

exports.originalFile = (req, res) => {
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

exports.convertedFile = (req, res) => {
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

exports.originalFileDownload = (req, res) => {
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

exports.convertedFileDownload = (req, res) => {
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
