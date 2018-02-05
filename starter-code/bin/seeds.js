/*jshint esversion: 6 */
const mongoose = require("mongoose");
const bcryptjs = require("bcryptjs");
const bcryptSalt = 14;
const User = require("../models/user");
const Course = require("../models/course");

mongoose.connect("mongodb://localhost/ibi-ironhack");
//var salt = bcryptjs.genSalt(bcryptSalt);
const password = "ironhack";

// var encryptedPass =
bcryptjs.genSalt(bcryptSalt, (err, salt) => {
  bcryptjs.hash(password, salt, (err, hash) => {
    if (err) {
      console.log("Damn! An error!");
    }

    const users = [
      new User({
        username: "theboss",
        name: "Gonzalo",
        familyName: "M.",
        password: hash,
        role: "Boss"
      }),
      new User({
        username: "Michael",
        name: "Michael",
        familyName: "M.",
        password: hash,
        role: "TA"
      }),
      new User({
        username: "Jean-Nicolas",
        name: "Jean-Nicolas",
        familyName: "P.",
        password: hash,
        role: "Developer"
      })
    ];
    // const boss = new User({
    //   username: "theboss",
    //   name: "Gonzalo",
    //   familyName: "M.",
    //   password: hash,
    //   role: "Boss"
    // });
    User.create(users, (err, user) => {
      if (err) {
        throw err;
      }
      console.log(user);
    });
    createCourses();

    // boss.save(err => {
    //   if (err) return console.log("Damn! An error!");
    //   console.log("Oh yeah!");
    // });
  });
});

const courses = [
  {
    name: "Introduction to Ruby on Rails",
    startingDate: new Date("2017-03-01"),
    endDate: new Date("2017-04-01"),
    level: "Beginner",
    available: true
  },
  {
    name: "Ruby on Rails Advanced",
    startingDate: new Date("2017-02-01"),
    endDate: new Date("2017-03-27"),
    level: "Advanced",
    available: true
  },
  {
    name: "Angular 2",
    startingDate: new Date("2017-04-15"),
    endDate: new Date("2017-06-30"),
    level: "Advanced",
    available: true
  },
  {
    name: "MongoDB",
    startingDate: new Date("2017-04-04"),
    endDate: new Date("2017-05-04"),
    level: "Advanced",
    available: true
  },
  {
    name: "Express Introduction",
    startingDate: new Date("2017-03-01"),
    endDate: new Date("2017-04-01"),
    level: "Beginner",
    available: true
  }
];

function createCourses() {
  Course.create(courses, (err, docs) => {
    if (err) {
      throw err;
    }
    docs.forEach(course => {
      console.log(course.name);
    });
    mongoose.connection.close();
  });
}
