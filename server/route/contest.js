// Contests
module.exports = (app) => {
    app.get('/contests', auth.optional, (res, req) => {

    });

    app.post('/contests/:url/participantRecords', auth.optional, (res, req) => {

    });

    app.delete('/contests/:id', auth.required, (res, req) => {

    });

    app.put('/contests/:id', auth.required, (res, req) => {
    
    });
    
    app.get('/contests/:id/participantsRecords', auth.required, (res, req) => {
        
    });
};