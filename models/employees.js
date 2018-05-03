const mongoose = require("mongoose");
const Schema   = mongoose.Schema;

const checkBoss  = checkRoles('BOSS');
const checkDeveloper = checkRoles('DEVELOPER');
const checkIntern  = checkRoles('Intern');


