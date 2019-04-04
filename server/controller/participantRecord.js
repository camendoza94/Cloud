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
