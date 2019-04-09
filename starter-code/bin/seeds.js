const mongoose  	= require('mongoose');
const User			= require('../models/user');
const Course		= require('../models/course');

// Bcrypt to encrypt passwords
const bcrypt 		= require("bcrypt");
const bcryptSalt 	= 10;

const dbName 	= 'passport-roles';
mongoose.connect(`mongodb://localhost/${dbName}`);

const salt 	= bcrypt.genSaltSync(bcryptSalt);
const hashPass = bcrypt.hashSync('test', salt);

const courses		= [
	{
		author 		: 'TA_1',
		title 		: 'My course 1',
		description : 'Lorem ipsum dolor sit amet, consectetur adipiscing elit, sed do eiusmod tempor incididunt ut labore et dolore magna aliqua. Ut enim ad minim veniam, quis nostrud exercitation ullamco laboris nisi ut aliquip ex ea commodo consequat. Duis aute irure dolor in reprehenderit in voluptate velit esse cillum dolore eu fugiat nulla pariatur. Excepteur sint occaecat cupidatat non proident, sunt in culpa qui officia deserunt mollit anim id est laborum.'
	},
	{
		author 		: 'TA_2',
		title 	: 'My course 2',
		description 	 	: 'Lorem ipsum dolor sit amet, consectetur adipiscing elit, sed do eiusmod tempor incididunt ut labore et dolore magna aliqua. Ut enim ad minim veniam, quis nostrud exercitation ullamco laboris nisi ut aliquip ex ea commodo consequat. Duis aute irure dolor in reprehenderit in voluptate velit esse cillum dolore eu fugiat nulla pariatur. Excepteur sint occaecat cupidatat non proident, sunt in culpa qui officia deserunt mollit anim id est laborum.'
	},
	{
		author 		: 'TA_3',
		title 	: 'My course 3',
		description 	 	: 'Lorem ipsum dolor sit amet, consectetur adipiscing elit, sed do eiusmod tempor incididunt ut labore et dolore magna aliqua. Ut enim ad minim veniam, quis nostrud exercitation ullamco laboris nisi ut aliquip ex ea commodo consequat. Duis aute irure dolor in reprehenderit in voluptate velit esse cillum dolore eu fugiat nulla pariatur. Excepteur sint occaecat cupidatat non proident, sunt in culpa qui officia deserunt mollit anim id est laborum.'
	},
	{
		author 		: 'TA_4',
		title 	: 'My course 4',
		description 	 	: 'Lorem ipsum dolor sit amet, consectetur adipiscing elit, sed do eiusmod tempor incididunt ut labore et dolore magna aliqua. Ut enim ad minim veniam, quis nostrud exercitation ullamco laboris nisi ut aliquip ex ea commodo consequat. Duis aute irure dolor in reprehenderit in voluptate velit esse cillum dolore eu fugiat nulla pariatur. Excepteur sint occaecat cupidatat non proident, sunt in culpa qui officia deserunt mollit anim id est laborum.'
	}
]

Course.create(courses,(err) => {
  if(err){
    trow(err)
  }
  console.log(`Created ${courses.length} courses`)
  mongoose.connection.close();
});

// const users		= [
// 	{
// 		username : 'Boss',
// 		password : hashPass,
// 		role 	 : 'Boss'
// 	},
// 	{
// 		username : 'Developper_1',
// 		password : hashPass,
// 		role 	 : 'Developper'
// 	},
// 	{
// 		username : 'Developper_2',
// 		password : hashPass,
// 		role 	 : 'Developper'
// 	},
// 	{
// 		username : 'Developper_3',
// 		password : hashPass,
// 		role 	 : 'Developper'
// 	},
// 	{
// 		username : 'Developper_4',
// 		password : hashPass,
// 		role 	 : 'Developper'
// 	},
// 	{
// 		username : 'Developper_5',
// 		password : hashPass,
// 		role 	 : 'Developper'
// 	},
// 	{
// 		username : 'Developper_6',
// 		password : hashPass,
// 		role 	 : 'Developper'
// 	},
// 	{
// 		username : 'Developper_7',
// 		password : hashPass,
// 		role 	 : 'Developper'
// 	},
// 	{
// 		username : 'Developper_8',
// 		password : hashPass,
// 		role 	 : 'Developper'
// 	},
// 	{
// 		username : 'Developper_9',
// 		password : hashPass,
// 		role 	 : 'Developper'
// 	},
// 	{
// 		username : 'Developper_10',
// 		password : hashPass,
// 		role 	 : 'Developper'
// 	},
// 	{
// 		username : 'TA_1',
// 		password : hashPass,
// 		role 	 : 'TA'
// 	},
// 	{
// 		username : 'TA_2',
// 		password : hashPass,
// 		role 	 : 'TA'
// 	},
// 	{
// 		username : 'TA_3',
// 		password : hashPass,
// 		role 	 : 'TA'
// 	},
// 	{
// 		username : 'TA_4',
// 		password : hashPass,
// 		role 	 : 'TA'
// 	}
// ]

// User.create(users,(err) => {
//   if(err){
//     trow(err)
//   }
//   console.log(`Created ${users.length} users`)
//   mongoose.connection.close();
// });