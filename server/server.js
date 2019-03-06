const passport = require('passport');
require('dotenv').config();
const Cors = require('cors');
const bodyParser = require('body-parser');
const express = require('express');
const fileUpload = require('express-fileupload');
const path = require('path');

let app = express();

require('./config/passport');

app.use(Cors());
app.use(bodyParser.json());
app.use(passport.initialize());
app.use(fileUpload());
app.use('/audio', express.static(path.join(__dirname, '/audio')));
app.use('/images', express.static(path.join(__dirname, '/images')));


const db = require('./config/db.js');

// force: true will drop the table if it already exists
db.sequelize.sync({force: false}).then(() => {
    console.log('Drop and Resync with { force: true }');
});

// Routes
require('./route/base.js')(app);
require('./route/user.js')(app);
require('./route/contest.js')(app);
require('./route/participantRecord.js')(app);

let listener = app.listen(process.env.PORT || 8081, function () {
    console.log('App running on http://localhost:' + listener.address().port);
});