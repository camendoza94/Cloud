const auth = require('../config/auth');
const ParticipantRecord = require('../controller/participantRecord');

// Participants Records
module.exports = (app) => {
    app.get('/participantRecords/', auth.optional, ParticipantRecord.findAll);

    app.get('/participantRecords/:id', auth.optional, ParticipantRecord.findById);

    app.get('/participantRecords/:id/originalFile', auth.optional, ParticipantRecord.originalFile);

    app.get('/participantRecords/:id/convertedFile', auth.optional, ParticipantRecord.convertedFile);

    app.get('/participantRecords/:id/originalFile/download', auth.optional, ParticipantRecord.originalFileDownload);

    app.get('/participantRecords/:id/convertedFile/download', auth.optional, ParticipantRecord.convertedFileDownload);
};