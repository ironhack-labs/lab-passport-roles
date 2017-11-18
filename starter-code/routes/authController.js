const express =require ("express");
const router=express.Router();
const passport =require ("passport");
const {ensureLoggedIn, ensureLoggedOut}= require('connect-ensure-login');


router.get ('/', (req,res,next)=>{
  res.render('auth/auth-main');
  });

router.get('/login', ensureLoggedOut(), (req, res, next) => {
  res.render('auth/login', { "message": req.flash("error") });
});

router.post('/login', ensureLoggedOut(), passport.authenticate('local-login', {
  successReturnToOrRedirect:'/private',
  failureRedirect : '/auth/login'
}));

router.get('/signup', ensureLoggedOut(), (req, res, next)  => {
  res.render('auth/signup');
});

router.post('/signup', ensureLoggedOut(), passport.authenticate('local-signup', {
  successRedirect : '/private',
  failureRedirect : '/auth/signup'
}));

router.get('/logout', ensureLoggedIn(), (req,res)=>{
  req.logout();
  res.redirect('/');
});


module.exports =router;
