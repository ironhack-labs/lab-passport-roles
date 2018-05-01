const express = require('express');
const router  = express.Router();
const User = require('../models/User');
const passport = require('passport');

const checkRole = (req,res,next) => {
	User.findOne({username:req.body.username})
	.then(user => {
		if(user.role === 'BOSS') {
			return next();
		} else {
			res.send('No tienes acceso');
		}
	}).catch(e => console.log(e));
	
}

router.get('/signup', (req, res, next) => {
  res.render('./auth/signup');
});

router.post('/signup',(req,res,next) => {

	if(req.body.password1 !== req.body.password2) {
		req.body.error = 'Tu password no coincide';
		return res.render('./auth/signup',req.body);
	}
	req.body.password = req.body.password1;
	User.register(req.body,req.body.password1, (err,user) => {
		console.log(err);
		if(err) return next(err);
		res.send('si funcionó');
		//res.redirect('/login');
	});
});

router.post('/login',checkRole,passport.authenticate('local'),(req,res,next) => {
	res.redirect('/signup');
});

router.get('/login',(req,res,next) => {
	res.render('./auth/login');
})

module.exports = router;