// Participants Records
module.exports = (app) => {
    app.get('/participantRecords/', auth.optional, (req, res) => {
    
    });

    app.get('/participantRecords/:id', auth.optional, (req, res) => {
    
    });

    app.get('/participantRecords/:id/originalFile', auth.optional, (req, res) => {
    
    });

    app.get('/participantRecords/:id/convertedFile', auth.optional, (req, res) => {
    
    });
};