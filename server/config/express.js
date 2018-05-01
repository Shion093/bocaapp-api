const express = require('express');
const morgan = require('morgan');
const bodyParser = require('body-parser');
const compress = require('compression');
const helmet = require('helmet');
const cors = require('cors');

const routes = require('../api');
const { logs } = require('./constants');
const error = require('../middlewares/errors');
const passport = require('./passport');

const app = express();

app.use(morgan(logs));
app.use(bodyParser.json({limit: '50mb'}));
app.use(bodyParser.urlencoded({ extended: true }));
app.use(compress());
app.use(helmet());
app.use(cors());
app.use(passport.initialize());
passport.setJwtStrategy();

app.use('/v1', routes);

app.use(error.converter);
app.use(error.notFound);
app.use(error.handler);

module.exports = app;
