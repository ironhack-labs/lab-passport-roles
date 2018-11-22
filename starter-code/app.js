//require('dotenv').config();
//https://github.com/kerimdzhanov/dotenv-flow#files-under-version-control
require('dotenv-flow').config({ default_node_env: 'local' });

const bodyParser = require('body-parser');
const cookieParser = require('cookie-parser');
const express = require('express');
const favicon = require('serve-favicon');
const hbs = require('hbs');
const mongoose = require('mongoose');
const logger = require('morgan');
const path = require('path');
const app_name = require('./package.json').name;
const debug = require('debug')(`${app_name}:${path.basename(__filename).split('.')[0]}`);
const session = require("express-session");
const MongoStore = require("connect-mongo")(session);
const flash = require('connect-flash');


mongoose.connect(process.env.DBURL, {useNewUrlParser: true})
  .then(x => {
    console.log(`Connected to Mongo! Database name: "${x.connections[0].name}"`)
  })
  .catch(err => {
    console.error('Error connecting to mongo', err)
  });

const app = express();

// Middleware Setup
app.use(logger('dev'));
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({
  extended: false
}));
app.use(cookieParser());

app.use(session({
  secret: "basic-auth-secret",
  cookie: {
    maxAge: 60000
  },
  store: new MongoStore({
    mongooseConnection: mongoose.connection,
    ttl: 24 * 60 * 60 // 1 day
  })
}));

app.use(flash());

require('./passport')(app);


app.use((req,res,next)=>{
  res.locals.user = req.user;
  let messages = [...req.flash('error'),...req.flash('info')];
  //console.log(messages);
  res.locals.messages = messages;
  next();
})

// Express View engine setup

app.use(require('node-sass-middleware')({
  src: path.join(__dirname, 'public'),
  dest: path.join(__dirname, 'public'),
  //indentedSyntax: true,
  outputStyle: 'extended', //'compressed'
  sourceMap: true
}));

app.set('views', path.join(__dirname, 'views'));
app.set('view engine', 'hbs');
app.use(express.static(path.join(__dirname, 'public')));
app.use(favicon(path.join(__dirname, 'public', 'images', 'favicon.ico')));
hbs.registerPartials(path.join(__dirname, 'views/partials'));


app.use(session({
  secret: "basic-auth-secret",
  cookie: { maxAge: 60000 },
  store: new MongoStore({
    mongooseConnection: mongoose.connection,
    ttl: 24 * 60 * 60 // 1 day
  })
}));


// default value for title local
app.locals.title = 'Passport Authentication';


const indexRoutes = require('./routes/index');
app.use('/', indexRoutes);

const authRoutes = require("./routes/authRoutes");
app.use('/', authRoutes);

const passportRoutes = require('./routes/passportRoutes');
app.use('/', passportRoutes);



module.exports = app;
