const mongoose = require('mongoose');
const User = require('../models/user');
const bcrypt = require('bcrypt');
const bcryptSalt = 10;

const dbName = 'passport-roles';
mongoose.connect(`mongodb://localhost/${dbName}`);

const salt = bcrypt.genSaltSync(bcryptSalt);
const hash = bcrypt.hashSync('imtheboss', salt);

const boss = [{
    name: 'Odon',
    username: 'bossman',
    password: hash,
    role: 'Boss',
    profile: 'https://scontent.fmia1-2.fna.fbcdn.net/v/t1.0-9/35201806_1802266996506313_9025460235912871936_n.jpg?_nc_cat=0&oh=21234819dee47e66cd3fd44621b1a3c5&oe=5BE93E21'
}];

User.create(boss, (err) => {
    if(err) {throw err;}
    console.log(`Created your boss`);
    mongoose.connection.close();
});