const {IN_PROGRESS, UPLOAD_PATH, CONVERSION_FORMAT, CONVERTED} = require('../constants');
const db = require('../config/db');
const Contest = db.contests;
const ParticipantRecords = db.participantRecords;
const uuid = require('uuid/v4');
const fs = require('fs');

exports.findAll = (req, res, next) => {
    Contest.findAll().then((contests) => {
        res.json({contests: contests});
    }).catch((err) => {
        return res.status(422).send(err.stack);
    });
};

exports.findById = (req, res, next) => {
    const {params: {id}} = req;
    Contest.findById(id).then((contest) => {
        res.json({contest: contest});
    }).catch((err) => {
        return res.status(422).send(err.stack);
    });
};

exports.findByURL = (req, res, next) => {
    const {params: {url}} = req;
    Contest.findOne({where: {url: url}}).then((contest) => {
        res.json({contest: contest});
    }).catch((err) => {
        return res.status(422).send(err.stack);
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
        return res.status(422).send(err.stack);
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
            return res.status(422).send(err.stack);
        });
    };
    
exports.addParticipantRecord = (req, res, next) => {
    const participantRecord = req.body;
    const contestId = req.params.id;

    if (Object.keys(req.files).length === 0) {
    return res.status(422).json({
        error: { 
            file: 'No files were uploaded.' 
        }});
    }

    const fileAudio = req.files.originalFile;
    const extention = fileAudio.name.split('.').pop();
    const uniqueFileName = `${uuid.v4()}.${extention}`;

    const savePath = `${UPLOAD_PATH}${uniqueFileName}`;

    participantRecord.contestId = contestId;
    participantRecord.originalFile = savePath;
    participantRecord.state = IN_PROGRESS;

    if (extention === CONVERSION_FORMAT){
        participantRecord.state = CONVERTED;
        participantRecord.convertedFile = savePath;
    }
    
    Contest.findByPk(contestId).then((contest) => {
        const endDate = new Date(contest.endDate);
        if (endDate < new Date()){
            return res.status(422).json({
                error: { 
                    contest: 'Contest already ended.' 
                }});
            }

        fileAudio.mv(savePath, (err) => {
            if (err) {
                console.log(err);
                return res.status(422).send(err);
            }
            const stream = fs.createWriteStream(savePath, { encoding: 'utf8' });
            stream.once('open', () => {
                stream.write(fileAudio.data, writeErr => {
                    if (writeErr) {
                        return res.status(500).send(`Failed to write content ${savePath}.`);
                    }
                    stream.close();
                    console.log(`File ${fs.existsSync(savePath) ? 'exists' : 'does NOT exist'} under ${savePath}.`);
                })
            });
            ParticipantRecords.create(participantRecord)
            .then((participantRecord) => {
                return res.json({participantRecord: participantRecord});
            }).catch((err) => {
                return res.status(422).send(err.stack);
            });
        });
        }).catch((err)=>{
            return res.status(422).send(err.stack);
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
            