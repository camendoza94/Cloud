const passport = require('passport');
require('dotenv').config();
const Cors = require('cors');
const bodyParser = require('body-parser');
const express = require('express');

let app = express();

require('./config/passport');

app.use(Cors());
app.use(bodyParser.json());
app.use(passport.initialize());

const db = require('./config/db.js');
  
// force: true will drop the table if it already exists
db.sequelize.sync({force: true}).then(() => {
  console.log('Drop and Resync with { force: true }');
});

// Routes
require('./route/base.js')(app);
require('./route/user.js')(app);
require('./route/competition.js')(app);


let listener = app.listen(process.env.PORT || 8081, function () {
    console.log('App running on http://localhost:' + listener.address().port);
});