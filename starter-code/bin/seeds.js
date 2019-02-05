const mongoose = require("mongoose");
const User = require("../models/users.js");
const bcrypt = require("bcryptjs");

let salt = bcrypt.genSaltSync(10);
let hash = bcrypt.hashSync("boss", salt);

const users = [{name: "Daniel", pwd:hash, role:"Boss"}]

mongoose.connect('mongodb://localhost/lunesDESemana5')
.then(()=> User.insertMany(users).then().catch())
.catch(err => {console.log(err)})



