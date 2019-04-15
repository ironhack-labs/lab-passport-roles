const express = require('express');
const router  = express.Router();

// Passport config
const session = require('express-session');
const passport = require('passport');
const LocalStrategy = require('passport-local').Strategy;
const bcrypt = require('bcrypt');
const bcriptSalt = 10;
const ensureLogin = require("connect-ensure-login");
const flash = require('connect-flash');

const User = require('../models/User');

router.use(session({
  secret: 'dfgh4567*¨REFGEFVCÇ¨Ñ^*',
  resave: true,
  saveUninitialized: true,
}))

passport.serializeUser((user, cb) => {
  cb(null, user._id);
});

passport.deserializeUser((id, cb) => {
  User.findById(id)
    .then(user => cb(null, user))
    .catch(err => cb(err));
})

router.use(flash());
passport.use(new LocalStrategy({passReqToCallback: true}, (req, username, password, next) => {
  User.findOne({ username }, (err, user) => {
    if (err) return next(err);
    if (!user) return next(null, false, { message: "Incorrect username" });
    if (!bcrypt.compareSync(password, user.password)) return next(null, false, { message: "Incorrect password" });

    return next(null, user);
  });
}));

router.use(passport.initialize());
router.use(passport.session());
// END passport config

router.get('/', (req, res, next) => {
  res.render('index', {user: req.user});
});

function checkRoles(roles) {
	return function (req, res, next) {
		if (req.isAuthenticated() && roles.includes(req.user.role)) {
			return next();
		} else {
			if (req.isAuthenticated()) {
				res.redirect('/')
			}	else {
				res.redirect('/login')
			}
		}
	}
}

const bossLevel = checkRoles(['Boss']);
const developerLevel = checkRoles(['Boss', 'Developer']);
const taLevel = checkRoles(['Boss', 'Developer', 'TA']);

function encryptPassword(password){
  const salt = bcrypt.genSaltSync(bcriptSalt);
  return hashPass = bcrypt.hashSync(password, salt);
}

router.get('/signup', (req, res, next) => {
  res.render('auth/signup');
});

router.post('/signup', (req, res, next) => {
  const username = req.body.username;
  const password = req.body.password;

  if(username === "" || password === ""){
    res.render('auth/signup', {message: 'Username and password are required!'});
    return;
  }

  User.findOne({username})
    .then(user => {
      if(user){
        res.render('auth/signup', { message: 'The username already exists!'});
        return;
      }

      User.create({username, password: encryptPassword(hashPass)})
        .then(() => res.redirect('/'))
        .catch(err => {
          res.render('auth/signup', {message: 'Something went wrong'});
          next(err);
        });
    });

});

router.get('/login', (req, res, next) => {
  res.render('auth/login');
});

router.post("/login", passport.authenticate('local', {
  successRedirect: '/',
  failureRedirect: '/login',
  failureFlash: true,
  passReqToCallback: true,
}));

router.get('/logout', (req, res, next) => {
  req.logOut();
  res.redirect('/login');
});

router.get('/admin', bossLevel, (req, res, next) => {
  res.render('admin/index');
});

router.get('/admin/users', bossLevel, (req, res, next) => {
  User.find({ $or:[{'role': 'Boss'}, {'role': 'Developer'}, {'role': 'TA'}]})
    .then(users => res.render('admin/users/list', {users}))
    .catch(err => console.error(err));
});

router.get('/admin/users/new', bossLevel, (req, res, next) => {
  res.render('admin/users/new');
});

router.post('/admin/users/new', bossLevel, (req, res, next) => {
  User.create({
    username: req.body.username,
    password: encryptPassword(req.body.password),
    role: req.body.role,
  })
  .then( () => res.redirect('/admin/users'))
  .catch(err => console.error(err));
});

router.post('/admin/users/delete/:id', (req, res, next) => {
  User.findByIdAndRemove(req.params.id)
    .then(() => res.redirect('/admin/users'))
    .catch(err => console.error(err));
});

router.get('/:username', (req, res, next) => {
  User.findOne({username: req.params.username})
    .then(user => {
      let owner = req.user ? req.user._id === user._id : false;
      res.render('profile/view', {user, owner});
      return;
    })
    .catch(err => console.error(err));
});

router.get('/:username/edit', (req, res, next) => {
  if(req.user && req.user.username === req.params.username){
    res.render('profile/edit', {user: req.user});
    return;
  }
  res.redirect('/login');
});

router.post('/:username/edit', (req, res, next) => {
  User.findOneAndUpdate({username: req.params.username}, {username: req.body.username, description: req.body.description})
    .then(user => res.redirect(`/${user.username}`))
    .catch(err => console.error(err));
});

module.exports = router;