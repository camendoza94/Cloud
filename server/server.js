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
const ParticipatRecords = db.participantRecords;
const {IN_PROGRESS} = require('./constants');

// force: true will drop the table if it already exists
db.sequelize.sync({force: true}).then(() => {
  console.log('Drop and Resync with { force: true }');
});

// Routes
require('./route/base.js')(app);
require('./route/user.js')(app);
require('./route/contest.js')(app);
require('./route/participantRecord.js')(app);

// For now sends an email
cron.schedule('59 12 * * *', () => {
  console.log("---------------------");
  console.log("Running Cron Job");
  ParticipantRecords.findAll({where: {status: IN_PROGRESS}}).then((records)=>{
          records.map((record) => {
            //TODO Convert file
            const participantEmail = record.email;
            const mail = {
              from: 'clouddevelop2019@gmail.com',
              to: participantEmail,
              subject: 'Available contests voice',
              text: 'Hi there, this email was automatically sent by us to tell you that your voice is know available for a new audio contest',
              html: 'Hi there, this email was automatically sent by us to tell you that your voice is know available for a new <b>audio contest</b>'
            };
            console.log(mail);
            Emails.send(mail);
          });

  }).catch((err) => {
      console.log(err.stack);
  });
});

let listener = app.listen(process.env.PORT || 8081, function () {
    console.log('App running on http://localhost:' + listener.address().port);
});