// Contests
module.exports = (app) => {
    app.get('/contests', auth.optional, (req, res) => {

    });

    app.delete('/contests/:id', auth.required, (req, res) => {

    });

    app.put('/contests/:id', auth.required, (req, res) => {
    
    });

    app.post('/contests/:url/participantRecords', auth.optional, (req, res) => {
    
    });
    
    app.get('/contests/:id/participantsRecords', auth.required, (req, res) => {
    
    });

    app.post('/contests/:idContest/selectWinner/:idParticipantRecord', auth.required, (req, res) => {
    
    });
};