const mongoose = require('mongoose');
const User = require('../models/user');
const Course = require('../models/course');
const bcrypt = require("bcrypt");
const dbName = 'passport-roles';
mongoose.connect(`mongodb://127.0.0.1/${dbName}`);
const salt = bcrypt.genSaltSync();


let users = [{
  username: 'boss', 
  password: bcrypt.hashSync('bossy', salt),
  role: 'BOSS',
  firstName: 'Montasar',
  lastName: 'the Teacher',
  profilePic: 'https://media.licdn.com/dms/image/C5103AQE2k0nIlhzbBA/profile-displayphoto-shrink_200_200/0?e=1567641600&v=beta&t=eVYzJNYpqEX6vUvhnW46Lz-eO2UO8t6mealJ1CMJ350' 
}, {
  username: 'seed1',
  password: bcrypt.hashSync('seed1', salt),
  role: 'DEVELOPER',
  firstName: 'Jan',
  lastName: 'Heuermann',
  profilePic: 'https://avatars0.githubusercontent.com/u/3618384?s=460&v=4' 
}, {
  username: 'seed2',
  password: bcrypt.hashSync('seed2', salt),
  role: 'DEVELOPER',
  firstName: 'Mathias',
  lastName: 'Lenz',
  profilePic: 'https://mk0smallimprovetyqer.kinstacdn.com/wp-content/uploads/2018/07/Matthias.png'
},{
  username: 'adri',
  password: bcrypt.hashSync('demo', salt),
  role: 'BOSS',
  firstName: 'Adri',
  lastName: 'Gispen',
  profilePic: 'https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcR2mnwJ16AAfCwD_WCoAbtZlCty5FLPAijU2hImOywmJNvNDHIx'
}, {
  username: 'min',
  password: bcrypt.hashSync('min', salt),
  role: 'TA',
  firstName: 'Min', 
  lastName: 'the TA', 
  profilePic: 'https://media.licdn.com/dms/image/C4D03AQHFmLuvgBARZg/profile-displayphoto-shrink_200_200/0?e=1567641600&v=beta&t=kfFb73B-dQmM5Lq_RQJOFfXHL3OTx0oHTUrxY0A2fd4'
}];

let courses = [{
  name: 'Dating 101',
  description: 'Advice for singles, from singles. The best advice.',
  teacher: 'seed1'
}, {
  name: 'Nix',
  description: `The story of the discovery and reconnaissance of Pluto is an utterly fascinating piece of modern seafaring in space. That not only for the magnificent engineering achievements, which were carried out all along the way, but also because it made us vividly realise how much there is yet to be learned about our own Solar System.`,
  teacher: 'seed1'
}, {
  name: 'NPM', 
  description: `Learn to install all the packages, all the time (if they're needed).`,
  teacher: 'boss'
}]


User.create(users).then(users => {
  console.log("Users successfully created! ", users);
  return users;
}).then(users => {
  let boss = users.find(el => el.username == 'boss');
  let seed1 = users.find(el => el.username == 'seed1');
  let dbCourses = courses.map(el => el.teacher == 'seed1' ? Object.assign({}, el, { teacher: seed1._id }) : Object.assign({}, el, { teacher: boss._id }));
  console.log(dbCourses);
  Course.create(dbCourses).then(courses => {
    console.log('Courses created!', courses);
    mongoose.connection.close();
  }).catch(err => console.log("error creating courses: ", err));
})
.catch(err => console.log("error encountered adding users: ", err));

