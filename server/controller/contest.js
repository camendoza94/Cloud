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
    const {params:{id}} = req;
    Contest.findById(id).then((contest) => {
                            res.json({contest: contest});
                        }).catch((err) => {
                            return res.send(err.stack);
    });
};

exports.delete = (req, res, next) => {
    const contestId = req.params.id;
    const userId = req.payload.id;

    Contest.destroy({where: {id: contestId,
                             userId: userId}}).then((contest) => {
                                    res.json({contest: contest});
                                }).catch((err) => {
                                    return res.send(err.stack);
    });
};

exports.update = (req, res, next) => {
    const {body: {contest},
           params: {id}} = req;
    const userId = req.payload.id;

    Contest.update(contest,
                   {where: {id: id,
                            userId: userId}}).then((contest) => {
                                    res.json({contest: contest});
                                }).catch((err) => {
                                    return res.send(err.stack);
                                });
};

exports.addParticipantRecord = (req, res, next) => {
    // TODO handle file
    const {body: {participantRecord},
           params: {id}} = req;
    
};

exports.getParticipantRecords = (req, res, next) => {
    
};

exports.setParticipantRecordWinner = (req, res, next) => {
    //Use Contest.setWinner
};
