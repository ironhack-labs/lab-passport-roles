const express = require('express');
const router  = express.Router();
const User = require("../models/User");

function isLoggedIn(req,res,next){
  if(req.isAuthenticated()) return next();
  res.redirect("/auth/login");
}
function checkRole(role){
 return function(req,res,next){
   if(req.isAuthenticated() && req.user.role === role)
   return next();
   res.redirect("/private");
 }
}

const checkAdmin = checkRole("Boss");
const check = checkRole("Developer");

/* GET home page */
router.get('/', (req, res, next) => {
  res.render('index');
});

router.get("/private", isLoggedIn, (req,res)=>{
  res.render("Gprivate", {user: req.user});
})

router.get("/privateBoss", checkAdmin, (req, res) => {
  User.find()
    .then(users => {
      res.render('private', { user: req.user, users });
    })
})

router.get('/privateBoss/edit/:id', (req, res) => {
  User.findById(req.params.id)
    .then(user => {
      res.render("userDetails", { user });
    })
});

router.post('/privateBoss/edit/:id', (req, res) => {
  User.findByIdAndUpdate(req.params.id, { $set: req.body })
    .then(user => {
      res.redirect('/privateBoss');
    })
    .catch(err => {
      console.log(err);
    })
});

router.get('/privateBoss/delete/:id', (req, res) => {
  User.findByIdAndRemove(req.params.id)
    .then(() => {
      res.redirect('/privateBoss');
    })
});

module.exports = router;
