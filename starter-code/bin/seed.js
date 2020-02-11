const mongoose = require("mongoose");
const bcrypt = require("bcrypt");
const saltRounds = 10;

function dbConnect(cb) {
    mongoose
        .connect("mongodb://localhost/ironhack", { useNewUrlParser: true, useUnifiedTopology: true })
        .then(x => {
            console.log(`Connected to Mongo! Database name: "${x.connections[0].name}"`);
            cb();
        })
        .catch(err => {
            console.error("Error connecting to mongo", err);
        });
}


dbConnect(() => {
    const User = require("../models/User");
    const salt = bcrypt.genSaltSync(saltRounds);
    const hash = bcrypt.hashSync('123', salt);

    const Course = require('../models/Course');
    const Alumni = require('../models/Alumni')

    boss = [
        {
            username: 'boss',
            password: hash,
            name: 'Alvaro',
            surname: 'Lopez',
            role: 'Boss'
        },
        {
            username: 'fran',
            password: hash,
            name: 'Fran',
            surname: 'Naranjo',
            role: 'TA'
        },
        {
            username: 'quique',
            password: hash,
            name: 'Enrique',
            surname: 'Montaño',
            role: 'TA'
        },
        {
            username: 'maria',
            password: hash,
            name: 'Maria',
            surname: 'Simó',
            role: 'TA'
        },
        {
            username: 'cesar',
            password: hash,
            name: 'Cesar',
            surname: 'Val Leiva',
            role: 'Developer'
        }
    ]

    Courses = [
        {
            course: 'Web',
            season: 'Web FT 0120',
            campus: 'Madrid',
            start: '2020-01-13',
            end: '2020-03-13',
            alumni: {
                name: 'Jose',
                surname: 'Henche'
            }
        },
        {
            course: 'Data',
            season: 'Data FT 0120',
            campus: 'Madrid',
            start: '2020-01-13',
            end: '2020-03-13'
        }
    ]

    Alumnis = [
        {
            name: 'Jose',
            surname: 'Henche',
            course: 'Web FT 0120'
        },
        {
            name: 'Pedro',
            surname: 'Sanchez',
            course: 'Web FT 0120'
        },
        {
            name: 'Alvaro',
            surname: 'Monasterio',
            course: 'Web FT 0120'
        }
    ]

    User.deleteMany()
        .then(() => {
            return User.create(boss)
        })
        .then(() => {
            return Course.deleteMany()
        })
        .then(() => {
            return Course.create(Courses)
        })
        .then(() => {
            return Alumni.deleteMany()
        })
        .then(() => {
            return Alumni.create(Alumnis)
        })
        .then(() => {
            console.log("succesfully added all the data");
            mongoose.connection.close();
            process.exit(0);
        });
});