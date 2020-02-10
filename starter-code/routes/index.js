const express = require('express');
const router  = express.Router();

const ensureLogin = require("connect-ensure-login");

/* GET home page */
router.get('/', ensureLogin.ensureLoggedIn(), (req, res) => {
	const user = {user: req.user};
	const role = req.user.role[0];
	user[role] = role;
	
	res.render('index', user)
})

module.exports = router;