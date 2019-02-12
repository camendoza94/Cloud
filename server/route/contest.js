const auth = require('../config/auth');
const Contest = require('../controller/contest');

// Contests
module.exports = (app) => {
    app.get('/contests', auth.optional, Contest.findAll);

    app.delete('/contests/:id', auth.required, Contest.findById);

    app.put('/contests/:id', auth.required, Contest.update);

    app.post('/contests/:url/participantRecords', auth.optional, Contest.addParticipantRecord);
    
    app.get('/contests/:id/participantsRecords', auth.required, Contest.getParticipantRecord);

    app.post('/contests/:idContest/selectWinner/:idParticipantRecord', auth.required, Contest.setParticipantRecordWinner);
};