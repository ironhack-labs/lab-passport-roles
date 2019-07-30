require('dotenv').config();

const bodyParser   = require('body-parser');
const cookieParser = require('cookie-parser');
const express      = require('express');
const favicon      = require('serve-favicon');
const hbs          = require('hbs');
// const mongoose     = require('mongoose');  // ME LA LLEVO A CONFIG JUNTO CON LO DEMÁS
const logger       = require('morgan');
const path         = require('path');


const session = require('express-session');    // NO OLVIDAR INICIALIZAR ESTAS TRES VARIABLES
const passport = require('passport');
const flash = require("connect-flash");


  // .connect('mongodb://localhost/starter-code', {useNewUrlParser: true})            //ME LO LLEVO A MONGOOSE.CONFIG
  // .then(x => {
  //   console.log(`Connected to Mongo! Database name: "${x.connections[0].name}"`)
  // })
  // .catch(err => {
  //   console.error('Error connecting to mongo', err)
  // });

  require('./configs/mongoose.config')    // HAGO EL REQUIRE DE MONGOOSE PARA QUE SE DECLARE AQUI
  require('./configs/passport.config')    // EL MISMO REQUIRE QUE XON MONGOOSE QUE ESTA EN EL CONFIG


const app_name = require('./package.json').name;
const debug = require('debug')(`${app_name}:${path.basename(__filename).split('.')[0]}`);

const app = express();

// Middleware Setup
app.use(logger('dev'));
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: false }));
app.use(cookieParser());

// Express View engine setup

app.use(require('node-sass-middleware')({
  src:  path.join(__dirname, 'public'),
  dest: path.join(__dirname, 'public'),
  sourceMap: true
}));
      

app.set('views', path.join(__dirname, 'views'));
app.set('view engine', 'hbs');
app.use(express.static(path.join(__dirname, 'public')));
app.use(favicon(path.join(__dirname, 'public', 'images', 'favicon.ico')));


//CONFIGURA LA SESION

app.use(session({
  secret: "secret",
  resave: true,
  saveUninitialized: true
}))







//FLASH ERROR 

app.use(flash())


//INICIALIZAR EL PASSPORT Y LA SESION
app.use(passport.initialize())
app.use (passport.session())

// default value for title local
app.locals.title = 'Express - Generated with IronGenerator';



const indexRoutes = require('./routes/index.routes');
app.use('/', indexRoutes);

const authRoutes = require('./routes/auth.routes');
app.use('/', authRoutes);

const rolesRoutes = require('./routes/roles.routes');
app.use('/roles', rolesRoutes);

const developersRoutes = require ('./routes/developer-list.routes')
app.use ('/developer', developersRoutes )


module.exports = app;
