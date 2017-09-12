const app = require('express')();
const globals = require('./config/globals');

//conexion a bd
require('mongoose').connect(globals.dbUrl,{useMongoClient:true})
.then( () => console.log("Connected to db!"));

//config express
require('./config/express')(app);

// Controllers
const siteController = require("./routes/siteController");
const authRouter = require('./routes/auth');


// default value for title local
app.locals.title = 'Passport-roles';

// Routes
app.use("/", siteController);
app.use('/', authRouter);

//Errors
require('./config/error-handler')(app);

module.exports = app;
