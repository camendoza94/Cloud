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
app.use('/audio', express.static(path.join('/Data/Github/Grupo01/', '/audio')));
app.use('/images', express.static(path.join('/Data/Github/Grupo01/', '/images')));


const db = require('./config/db.js');

db.createTables();

// Routes
require('./route/base.js')(app);
require('./route/user.js')(app);
require('./route/contest.js')(app);
require('./route/participantRecord.js')(app);

let listener = app.listen(process.env.PORT || 8081, function () {
    console.log('App running on http://localhost:' + listener.address().port);
});
