const {IN_PROGRESS, UPLOAD_PATH} = require('../constants');
const db = require('../config/db');
const Contest = db.contests;
const ParticipantRecords = db.participantRecords;

exports.findAll = (req, res, next) => {
    Contest.findAll().then((contests) => {
        res.json({contests: contests});
    }).catch((err) => {
        return res.send(err.stack);
    });
};

exports.findById = (req, res, next) => {
    const {params: {id}} = req;
    Contest.findById(id).then((contest) => {
        res.json({contest: contest});
    }).catch((err) => {
        return res.send(err.stack);
    });
};

exports.findByURL = (req, res, next) => {
    const {params: {url}} = req;
    Contest.findOne({where: {url: url}}).then((contest) => {
        res.json({contest: contest});
    }).catch((err) => {
        return res.send(err.stack);
    });
};

exports.delete = (req, res, next) => {
    const contestId = req.params.id;
    const userId = req.payload.id;

    Contest.destroy({
        where: {
            id: contestId,
            userId: userId
        }
    }).then((contest) => {
        res.json({contest: contest});
    }).catch((err) => {
        return res.send(err.stack);
    });
};

exports.update = (req, res, next) => {
    const {
        body: {contest},
        params: {id}
    } = req;
    const userId = req.payload.id;

    Contest.update(contest,
        {
            where: {
                id: id,
                userId: userId
            }
        }).then((contest) => {
        res.json({contest: contest});
    }).catch((err) => {
        return res.send(err.stack);
    });
};

exports.addParticipantRecord = (req, res, next) => {
    // TODO: add validations i.e closed contest
    const {body: {participantRecord}} = req;
    const contestId = req.params.id;

    if (Object.keys(req.files).length === 0) {
        res.status(422).json({
            error: {
                file: 'No files were uploaded.'
            }
        });
    }

    const fileAudio = req.files.audio;
    const savePath = `${UPLOAD_PATH}${fileAudio.name}`;

    participantRecord.contestId = contestId;
    participantRecord.originalFile = savePath;
    participantRecord.status = IN_PROGRESS;

    fileAudio.mv(savePath, (err) => {
        if (err) {
            res.send(err.stack);
        }
        ParticipantRecords.create(participantRecord)
            .then((participantRecord) => {
                res.json({participantRecord: participantRecord});
            }).catch((err) => {
            res.send(err.stack);
        });
    });
};

exports.getParticipantRecords = (req, res, next) => {
    const contestId = req.params.id;

    ParticipantRecords.findAll({where: {contestId}})
        .then((participantRecords) => {
            res.json({participantRecords: participantRecords});
        }).catch((err) => {
        res.send(err.stack);
    });
};

exports.setParticipantRecordWinner = (req, res, next) => {
    //Use Contest.setWinner
    const contestId = req.params.contestId;
    const participantRecordId = req.params.participantRecordId;
    const contest = Contest.build({id: contestId});

    contest.setWinner(participantRecordId)
        .then((participantRecord) => {
            res.json({participantRecord: participantRecord});
        }).catch((err) => {
        res.send(err.stack);
    });
};

exports.getParticipantRecordWinner = (req, res, next) => {
    //Use Contest.getWinner
    const contestId = req.params.contestId;
    const participantRecordId = req.params.participantRecordId;
    const contest = Contest.build({id: contestId});

    contest.getWinner(participantRecordId)
        .then((participantRecord) => {
            res.json({participantRecord: participantRecord});
        }).catch((err) => {
        res.send(err.stack);
    });
};
