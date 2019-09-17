require('dotenv').config()

const bodyParser = require('body-parser')
const cookieParser = require('cookie-parser')
const express = require('express')
const favicon = require('serve-favicon')
const hbs = require('hbs')
const mongoose = require('mongoose')
const logger = require('morgan')
const path = require('path')
const flash = require('connect-flash')
const passport = require('passport')
const session = require('express-session')

require('./configs/passport.config')
require('./configs/mongoose.config')

const app_name = require('./package.json').name
const debug = require('debug')(`${app_name}:${path.basename(__filename).split('.')[0]}`)

const app = express()

// Middleware Setup
app.use(logger('dev'))
app.use(bodyParser.json())
app.use(bodyParser.urlencoded({ extended: false }))
app.use(cookieParser())
app.use(
	session({
		secret: 'secretoPssprt',
		resave: true,
		saveUninitialized: true
	})
)

app.use(flash())

app.use(passport.initialize())
app.use(passport.session())
// Express View engine setup

app.use(
	require('node-sass-middleware')({
		src: path.join(__dirname, 'public'),
		dest: path.join(__dirname, 'public'),
		sourceMap: true
	})
)

app.set('views', path.join(__dirname, 'views'))
app.set('view engine', 'hbs')
app.use(express.static(path.join(__dirname, 'public')))
app.use(favicon(path.join(__dirname, 'public', 'images', 'favicon.ico')))

// default value for title local
app.locals.title = 'Ironhack'

const indexRoutes = require('./routes/index.routes')
app.use('/', indexRoutes)

const authRoutes = require('./routes/auth.routes')
app.use('/', authRoutes)

const rolesRoutes = require('./routes/roles.routes')
app.use('/', rolesRoutes)

const coursesRoutes = require('./routes/courses.routes')
app.use('/courses', coursesRoutes)

module.exports = app
