const mongoose = require("mongoose");
const Course = require("../models/courses.model");

const dbName = "starter-code";
mongoose.connect(`mongodb://localhost/${dbName}`);

const course = [
  {
    name: "WebDev",
    teacher: "German",
    duration: 9
  },
   {
     name: "UX",
     teacher: "Dani",
     duration: 9
   },
    {
      name: "Data",
      teacher: "Mark",
      duration: 9
    },
];

Course.create(course, err => {
  if (err) {
    throw err;
  }
  console.log(`Created ${course.length} courses`);
  mongoose.connection.close();
});



// const mongoose = require("mongoose");
// const User = require("../models/user.model");

// const bcrypt = require("bcrypt");
// const bcryptSalt = 10;
// const salt = bcrypt.genSaltSync(bcryptSalt);

// const dbName = "starter-code";
// mongoose.connect(`mongodb://localhost/${dbName}`);

// const user = [
//   {
//     username: "Boss",
//     password: bcrypt.hashSync("boss", salt),
//     role: "BOSS"
//   },
//   {
//     username: "Developer",
//     password: bcrypt.hashSync("developer", salt),
//     role: "DEVELOPER"
//   },
//   {
//     username: "TA",
//     password: bcrypt.hashSync("ta", salt),
//     role: "TA"
//   }
// ];

// User.create(user, err => {
//   if (err) {
//     throw err;
//   }
//   console.log(`Created ${user.length} users`);
//   mongoose.connection.close();
// });
