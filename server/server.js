const passport = require('passport');
require('dotenv').config();
const Cors = require('cors');
const bodyParser = require('body-parser');
const express = require('express');
const fileUpload = require('express-fileupload');

let app = express();

app.use(Cors());
app.use(bodyParser.json());
app.use(passport.initialize());
require('./config/passport');
app.use(fileUpload());


const db = require('./config/db.js');

db.createTables();

// Routes
require('./route/base.js')(app);
require('./route/user.js')(app);
require('./route/contest.js')(app);

let listener = app.listen(process.env.PORT || 8081, function () {
    console.log('App running on http://localhost:' + listener.address().port);
});
