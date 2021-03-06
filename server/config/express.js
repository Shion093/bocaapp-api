const express = require('express');
const morgan = require('morgan');
const bodyParser = require('body-parser');
const compress = require('compression');
const helmet = require('helmet');
const cors = require('cors');

const routes = require('../api');
const { logs } = require('./constants');
const { handler, converter, notFound } = require('../middlewares/errors');
const { initialize, setJwtStrategy } = require('./passport');

const app = express();

app.use(morgan(logs));
app.use(bodyParser.json({limit: '50mb'}));
app.use(bodyParser.urlencoded({ extended: true }));
app.use(compress());
app.use(helmet());
app.use(cors());
initialize();
setJwtStrategy();

app.use('/v1', routes);

app.use(converter);
app.use(notFound);
app.use(handler);

module.exports = app;
