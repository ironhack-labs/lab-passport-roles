const express 		= require('express');
const router  		= express.Router();
const passport		= require("passport");
const ensureLogin 	= require("connect-ensure-login");
// User model
const User 			= require("../models/user");
// Course model
const Course      = require("../models/course");
// Bcrypt to encrypt passwords
const bcrypt    	= require("bcrypt");
const bcryptSalt  	= 10;

// Roles
function checkRoles(role) {
  return function(req, res, next) {
    if (req.isAuthenticated() && req.user.role === role) {
      return next();
    } else {
      res.redirect('/login')
    }
  }
}

const checkBoss = checkRoles('Boss');
const checkDev 	= checkRoles('Developper');
const checkTA  	= checkRoles('TA');

// GET home page
router.get('/', (req, res, next) => {
  res.render('index');
});

// GET route login
router.get("/login", (req, res, next) => {
  res.render("login",{ "message": req.flash("error") });
});

// POST route login
router.post("/login", passport.authenticate("local", {
  successRedirect: "/",
  failureRedirect: "login",
  failureFlash: true,
  passReqToCallback: true
}));

// GET route logout
router.get("/logout", (req, res) => {
  req.logout();
  res.redirect("/login");
});

/* -------------------------------------------------------------------------------------- */
/* --------------------------------------- B O S S -------------------------------------- */
/* -------------------------------------------------------------------------------------- */

// GET route private_page_boss index
router.get('/private_page_boss', ensureLogin.ensureLoggedIn(), checkBoss, (req, res) => {
  res.render('private_page_boss', {user: req.user});
});

// GET route show all employes
router.get('/employes', ensureLogin.ensureLoggedIn(), checkBoss, (req, res, next) => {
  User.find()
    .then(employes => {
      res.render('employes/index', { employes: employes });
    })
    .catch(error => {
      console.log('Error while getting the employes from the DB: ', error);
    })
});

// GET route new employe
router.get('/employes/new', ensureLogin.ensureLoggedIn(), checkBoss, (req, res, next) => {
	res.render("employes/new");
});

// POST route new employe
router.post('/employes/new', ensureLogin.ensureLoggedIn(), checkBoss, (req, res, next) => {
  	const { username, password, role } = req.body;
  	const salt 		= bcrypt.genSaltSync(bcryptSalt);
	const hashPass 	= bcrypt.hashSync(password, salt);
  	const newEmploye = new User({
  		username,
  		password: hashPass,
  		role 
  	})
  newEmploye.save()
  .then((employe) => {
    res.redirect('/employes');
  })
  .catch((error) => {
    console.log(error);
  })
});

// POST route delete employe
router.post('/employes/:id/delete', ensureLogin.ensureLoggedIn(), checkBoss, function(req, res){
	User.findByIdAndRemove({_id: req.params.id}) 
	.then((employe) => {
    	res.redirect('/employes');
  })
  .catch((error) => {
    console.log(error);
  })
});

/* -------------------------------------------------------------------------------------- */
/* ----------------------------------------- T A ---------------------------------------- */
/* -------------------------------------------------------------------------------------- */

// GET route private_page_ta
router.get('/private_page_ta', ensureLogin.ensureLoggedIn(), checkTA, (req, res) => {
  res.render('private_page_ta', {user: req.user});
});

// GET route show all users
router.get('/users_ta', ensureLogin.ensureLoggedIn(), checkTA, (req, res, next) => {
  User.find()
    .then(users => {
      res.render('users_ta/index', { users: users });
    })
    .catch(error => {
      console.log('Error while getting the users from the DB: ', error);
    })
});

// GET route show all courses
router.get('/users_ta/courses_list', ensureLogin.ensureLoggedIn(), checkTA, (req, res, next) => {
  Course.find()
    .then(courses => {
      res.render('users_ta/courses_list', { courses: courses });
    })
    .catch(error => {
      console.log('Error while getting the courses from the DB: ', error);
    })
});

// GET route create course
router.get('/users_ta/create_course', ensureLogin.ensureLoggedIn(), checkTA, (req, res) => {
  res.render('users_ta/create_course', {user: req.user});
});

// POST route create course
router.post('/users_ta/create_course', ensureLogin.ensureLoggedIn(), checkTA, (req, res, next) => {
    const { author, title, description } = req.body;
    const newCourse = new Course({
      author,
      title,
      description
    })
  newCourse.save()
  .then((course) => {
    res.redirect('/users_ta/courses_list');
  })
  .catch((error) => {
    console.log(error);
  })
});

// POST route delete course
router.post('/users_ta/:id/delete', ensureLogin.ensureLoggedIn(), checkTA, function(req, res){
  Course.findByIdAndRemove({_id: req.params.id}) 
  .then((employe) => {
      res.redirect('/users_ta/courses_list');
  })
  .catch((error) => {
    console.log(error);
  })
});

// GET route edit profile
router.get('/users_ta/:id/edit', ensureLogin.ensureLoggedIn(), checkTA, (req, res, next) => {
	User.findOne({_id: req.params.id}) 
	.then(user => {
      res.render('users_ta/edit', { user: user });
    })
  	.catch((error) => {
    	console.log(error);
  	})
});

// POST route edit profile
router.post('/users_ta/:id/edit', ensureLogin.ensureLoggedIn(), checkTA, (req, res, next) => {
  User.updateOne({_id: req.params.id}, {$set: req.body})
  .then(user => {
    res.redirect('/users_ta/'+req.params.id);
  })
});

// GET route one user by ID
router.get('/users_ta/:userId', ensureLogin.ensureLoggedIn(), checkTA, (req, res, next) => {
  User.findById(req.params.userId)
    .then(theUser => {
      res.render('users_ta/show', { user: theUser });
    })
    .catch(error => {
      console.log('Error while retrieving user details: ', error);
    })
});

/* -------------------------------------------------------------------------------------- */
/* ---------------------------------------- D E V --------------------------------------- */
/* -------------------------------------------------------------------------------------- */

// GET route private_page_dev
router.get('/private_page_dev', ensureLogin.ensureLoggedIn(), checkDev, (req, res) => {
  res.render('private_page_dev', {user: req.user});
});

// GET route show all users
router.get('/users', ensureLogin.ensureLoggedIn(), checkDev, (req, res, next) => {
  User.find()
    .then(users => {
      res.render('users/index', { users: users });
    })
    .catch(error => {
      console.log('Error while getting the users from the DB: ', error);
    })
});

// GET route show all courses
router.get('/users/courses_list', ensureLogin.ensureLoggedIn(), checkDev, (req, res, next) => {
  Course.find()
    .then(courses => {
      res.render('users/courses_list', { courses: courses });
    })
    .catch(error => {
      console.log('Error while getting the courses from the DB: ', error);
    })
});

// GET route edit profile
router.get('/users/:id/edit', ensureLogin.ensureLoggedIn(), checkDev, (req, res, next) => {
	User.findOne({_id: req.params.id}) 
	.then(user => {
      res.render('users/edit', { user: user });
    })
  	.catch((error) => {
    	console.log(error);
  	})
});

// POST route edit profile
router.post('/users/:id/edit', ensureLogin.ensureLoggedIn(), checkDev, (req, res, next) => {
  User.updateOne({_id: req.params.id}, {$set: req.body})
  .then(user => {
    res.redirect('/users/'+req.params.id);
  })
});

// GET route one user by ID
router.get('/users/:userId', ensureLogin.ensureLoggedIn(), checkDev, (req, res, next) => {
  User.findById(req.params.userId)
    .then(theUser => {
      res.render('users/show', { user: theUser });
    })
    .catch(error => {
      console.log('Error while retrieving user details: ', error);
    })
});

module.exports = router;