const passport = require('passport');
require('dotenv').config();
const Cors = require('cors');
const bodyParser = require('body-parser');
const express = require('express');
const fileUpload = require('express-fileupload');
const cron = require('node-cron');


let app = express();

require('./config/passport');

app.use(Cors());
app.use(bodyParser.json());
app.use(passport.initialize());
app.use(fileUpload());

const db = require('./config/db.js');
const ParticipantRecord = require('./controller/participantRecord');

// force: true will drop the table if it already exists
db.sequelize.sync({force: false}).then(() => {
  console.log('Drop and Resync with { force: true }');
});

// Routes
require('./route/base.js')(app);
require('./route/user.js')(app);
require('./route/contest.js')(app);
require('./route/participantRecord.js')(app);

// Task to convert files
cron.schedule('59 12 * * *', () => {
  console.log("---------------------");
  console.log("Running Cron Job");
  ParticipantRecord.convertFiles();
});

let listener = app.listen(process.env.PORT || 8081, function () {
    console.log('App running on http://localhost:' + listener.address().port);
});