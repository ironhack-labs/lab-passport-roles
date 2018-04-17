const express = require('express');
const router  = express.Router();
const ensureLoggedIn = require("../middlewares/ensureLoggedIn");
const isAdmin = require("../middlewares/isAdmin");


/* GET home page */
router.get('/', (req, res, next) => {
  res.render('index', {user:req.user});
});






module.exports = router;
