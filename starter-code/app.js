require('dotenv').config();

const express = require('express');
const path = require('path')
const app = express();

require('./configs/mongoose.config')
require('./configs/middlewares.config')(app)
require('./configs/passport.config')(app)

const app_name = require('./package.json').name;
const debug = require('debug')(`${app_name}:${path.basename(__filename).split('.')[0]}`);

//---DEFAULT LOCAL TITLE---//
app.locals.title = 'Express - Generated with IronGenerator';

//---BASE URL---//
app.use('/', require('./routes/index.routes'))
app.use('/', require('./routes/auth.routes'))
app.use('/', require('./routes/edit.routes'))


module.exports = app;