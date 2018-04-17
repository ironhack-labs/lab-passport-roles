const express = require('express');
const router  = express.Router();
const ensureLoggedIn = require("../middlewares/ensureLoggedIn");
const isAdmin = require("../middlewares/isAdmin");


/* GET home page */
router.get('/', (req, res, next) => {
  res.render('index', {user:req.user});
});

/* GET admin page */
router.get('/adminpage', [ensureLoggedIn('/auth/login'), isAdmin('/')], (req, res, next) => {
  res.render('adminPage',{user:req.user});
});

router.get('/addnewuser', [ensureLoggedIn('/auth/login'), isAdmin('/')], (req, res, next) => {
  res.render('addNewUser',{user:req.user});
});

router.get('/deleteuser', [ensureLoggedIn('/auth/login'), isAdmin('/')], (req, res, next) => {
  res.render('deleteUser',{user:req.user});
});



module.exports = router;
