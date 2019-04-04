const auth = require('../config/auth');
const ParticipantRecord = require('../controller/participantRecord');

// Participants Records
module.exports = (app) => {
    app.get('/participantRecords/', auth.optional, ParticipantRecord.findAll);

    app.get('/participantRecords/:id', auth.optional, ParticipantRecord.findById);

};