const mongoose = require('mongoose');
const User = require('../models/User.model');
const bcrypt = require("bcrypt");
const bcryptSalt = 10;
const salt = bcrypt.genSaltSync(bcryptSalt);
const hashPass = bcrypt.hashSync("holaaaa", salt);

const dbName="Employees";
mongoose.connect(`mongodb://localhost/${dbName}`);

const employees = [{
        username: "boss",
        password: hashPass,
        role: "Boss",
    }
]

User.create(employees, (err) => {
    if (err) {
        throw (err)
    }
    console.log(`Created ${employees.length} employees`)
    mongoose.connection.close();
});