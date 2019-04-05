const auth = require('../config/auth');
const ParticipantRecord = require('../controller/participantRecord');

// Participants Records
module.exports = (app) => {
    app.get('/participantRecords/:id/originalFile/download', auth.optional, ParticipantRecord.originalFileDownload);

    app.get('/participantRecords/:id/convertedFile/download', auth.optional, ParticipantRecord.convertedFileDownload);
};