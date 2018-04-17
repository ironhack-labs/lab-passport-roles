const express = require("express");
const router = express.Router();
const debug = require("../log")(__filename);

/* GET home page */
router.get("/", (req, res, next) => {
  if (req.isAuthenticated()) {
    let user = req.user;
    let boss;
    if(user.role == 'Boss'){
      boss = true;
    }
    let data = {
      user: req.user,
      boss: boss
    }
    
    res.render("index", {data});
  } else {
    debug('Not logged');
    res.render("index");
  }
});

module.exports = router;
