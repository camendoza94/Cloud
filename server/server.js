const passport = require('passport');
require('dotenv').config();
const Cors = require('cors');
const bodyParser = require('body-parser');
const express = require('express');
const fileUpload = require('express-fileupload');
const cron = require('node-cron');
const Emails = require('./config/mailer');

let app = express();

require('./config/passport');

app.use(Cors());
app.use(bodyParser.json());
app.use(passport.initialize());
app.use(fileUpload());

const db = require('./config/db.js');
  
// force: true will drop the table if it already exists
db.sequelize.sync({force: true}).then(() => {
  console.log('Drop and Resync with { force: true }');
});

const {UPLOAD_PATH} = require('./constants');
console.log(UPLOAD_PATH);

// Routes
require('./route/base.js')(app);
require('./route/user.js')(app);
require('./route/contest.js')(app);
require('./route/participantRecord.js')(app);

// TODO: Cron to convert file
// For now sends and email
cron.schedule('* 0 * * Wednesday', () => {
  console.log("---------------------");
  console.log("Running Cron Job");
  const mail = {
    from: 'clouddevelop2019@gmail.com',
    to: 'clouddevelop2019@gmail.com',
    subject: 'A new voice contest',
    text: 'Hi there, this email was automatically sent by us for a new audio contest',
    html: 'Hi there, this email was automatically sent by us for a new <b>audio contest</b>'
  };
  Emails.send(mail);
});

let listener = app.listen(process.env.PORT || 8081, function () {
    console.log('App running on http://localhost:' + listener.address().port);
});