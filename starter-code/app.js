require('dotenv').config()

const express = require('express')
const path = require('path')
const app = express()

require('./configs/mongoose.config')
require('./configs/passport.config')(app)
require('./configs/middlewares.config')(app)
require('./configs/locals.config')(app)

const app_name = require('./package.json').name;
const debug = require('debug')(`${app_name}:${path.basename(__filename).split('.')[0]}`);

app.use('/', require('./routes/index.routes'))
app.use('/', require('./routes/auth.routes'))

module.exports = app;
