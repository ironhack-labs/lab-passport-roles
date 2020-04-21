require('dotenv').config()

// Database
require('./configs/mongoose.config')

// Debugger
require('./configs/debugger.config')

// App
const express = require('express')
const app = express()

// Configs
require('./configs/middleware.config')(app)
require('./configs/preformatter.config')(app)
require('./configs/views.configs')(app)
require('./configs/locals.config')(app)
require('./configs/session.config')(app)
require('./configs/passport.config')(app)

const authRoutes = require('./routes/auth.routes');
app.use('/', authRoutes);

const index = require('./routes/index.routes');
app.use('/', index);


module.exports = app;
