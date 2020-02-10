require('dotenv').config()

// Database
require('./configs/mongoose.config')

// Debugger
require('./configs/debugger.config')

//App
const express = require('express')
const app = express()

//Configs
require('./configs/middleware.config')(app)
require('./configs/preformatter.config')(app)
require('./configs/views.config')(app)
require('./configs/locals.config')(app)
require('./configs/passport.config')(app)

// Base URLS
app.use('/', require('./routes/index.routes'))

app.use('/', require('./routes/auth.routes'))
// app.use('/', require('./routes/roles.routes'))


module.exports = app