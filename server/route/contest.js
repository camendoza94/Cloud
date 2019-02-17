const auth = require('../config/auth');
const Contest = require('../controller/contest');

// Contests
module.exports = (app) => {
    app.get('/contests', auth.optional, Contest.findAll);

    app.delete('/contests/:id', auth.required, Contest.delete);

    app.put('/contests/:id/', auth.required, Contest.update);

    app.get('/contests/:url', auth.optional, Contest.findByURL);

    app.post('/contests/:url/participantRecords', auth.optional, Contest.addParticipantRecord);
    
    app.get('/contests/:url/participantRecords', auth.optional, Contest.getParticipantRecords);

    app.post('/contests/:idContest/selectWinner/:idParticipantRecord', auth.required, Contest.setParticipantRecordWinner);

    app.get('/contests/:idContest/winner', auth.required, Contest.getParticipantRecordWinner);

};