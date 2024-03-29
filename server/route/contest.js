const auth = require('../config/auth');
const Contest = require('../controller/contest');

// Contests
module.exports = (app) => {
    app.delete('/contests/:id', auth.required, Contest.delete);

    app.put('/contests/:id/', auth.required, Contest.update);

    app.get('/contests/:url', auth.optional, Contest.findByURL);

    app.post('/contests/:id/participantRecords', auth.optional, Contest.addParticipantRecord);

    app.get('/contests/:id/participantRecords', auth.optional, Contest.getParticipantRecords);

    app.get('/popular', auth.optional, Contest.getPopularContests);

    app.get('/testD', auth.optional, Contest.testD);

};