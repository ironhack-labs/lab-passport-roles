const express = require('express');
const router = express.Router();
const User = require("../models/user")
const LocalStrategy = require('passport-local').Strategy;
const passport = require('passport');
/* GET home page */
router.get('/', (req, res, next) => {
  res.render('index');
});

function checkRoles(role) {
  return function (req, res, next) {
    if (req.isAuthenticated() && req.user.role === role) {
      return next();
    } else {
      res.redirect('/')
    }
  }
}
const checkBoss = checkRoles('Boss');
const checkDeveloper = checkRoles('Developer');
const checkTA = checkRoles('TA');

router.get('/Boss', (req, res) => {
  User.find()
  .then(users=>
    res.render('Boss', { user:req.user, users })
.catch(err =>{next(err)}));
});

router.post('/signup',(req,res)=>{
    const {name,role,password}=req.body;
    const newUser= new User({name,role,password})
    newUser.save()
    .then(()=>{
        res.redirect('/Boss')
    })
    .catch((err)=> {
        console.log('error creating new user' + err)
    })
})
passport.serializeUser((user, cb) => {
  cb(null, user._id);
});

passport.deserializeUser((id, cb) => {
  User.findById(id, (err, user) => {
    if (err) { return cb(err); }
    cb(null, user);
  });
});

passport.use(new LocalStrategy((username, password, next) => {
  User.findOne({ username }, (err, user) => {
    if (err) {
      return next(err);
    }
    if (!user) {
      return next(null, false, { message: "Incorrect username" });
    }
    if (!bcrypt.compareSync(password, user.password)) {
      return next(null, false, { message: "Incorrect password" });
    }

    return next(null, user);
  });
}));

router.use(passport.initialize());
router.use(passport.session());
router.get('/Boss',(req,res)=>{
  res.render('/addemployee',{ user: req.user })
})

router.get('/loginDeveloper', checkDeveloper, (req, res) => {
  res.render('/Developer', { user: req.user });
});
router.get('/loginTA', checkTA, (req, res) => {
  res.render('/TA', { user: req.user });
});

module.exports = router;
