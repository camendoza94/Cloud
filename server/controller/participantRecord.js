const db = require('../config/db');
const ParticipantRecords = db.participantRecords;

exports.findAll = (req, res, next) => {
    ParticipantRecords.findAll().then((contests) => {
        res.json({contests: contests});
    }).catch((err) => {
        return res.send(err.stack);
    });
};

exports.findById = (req, res, next) => {
    const {params:{id}} = req;
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


};
