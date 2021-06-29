
require("dotenv/config");


require("./db");


const express = require("express");

const hbs = require("hbs");

const app = express();


require("./config")(app);
require("./config/session.config")(app)

const projectName = "lab-express-auth-roles";
const capitalized = (string) => string[0].toUpperCase() + string.slice(1).toLowerCase();

app.locals.title = `${capitalized(projectName)} created with IronLauncher`;

require('./routes')(app)

require("./error-handling")(app);

module.exports = app;


