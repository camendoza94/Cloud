const passport = require('passport');
require('dotenv').config();
const Cors = require('cors');
const bodyParser = require('body-parser');
const express = require('express');

const routes = require('./index');

let app = express();

require('./config/passport');

app.use(Cors());
app.use(bodyParser.json());
app.use(passport.initialize());

routes(app);


let listener = app.listen(process.env.PORT || 8081, function () {
    console.log('App running on http://localhost:' + listener.address().port);
});