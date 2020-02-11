const mongoose = require('mongoose');
const User = require('../models/user.model');

const dbName = 'passport-role-lab';
mongoose.connect(`mongodb://localhost/${dbName}`)

const users = [{
  username: "superjefe",
  occupation: "$2b$10$9VWx8T./N8zQoKUbapN/auC3qqHqGTK2Zbxtiv6peGOIxPYjpJ9Cm", //password:yosoyelquemanda
  role: "Boss",
}, ];

User.insertMany(users)