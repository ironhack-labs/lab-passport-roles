const express = require('express');
const router  = express.Router();

/* GET home page */
router.get('/', (req, res, next) => {
  res.render('index');
});

router.post("/", passport.authenticate("local", {
  successRedirect: "/private",
  failureRedirect: "/",
  failureFlash:false,
  passReqToCallback: true
}));


module.exports = router;
