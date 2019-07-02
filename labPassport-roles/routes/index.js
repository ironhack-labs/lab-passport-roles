const express = require('express');
const router  = express.Router();
const {ensureLoggedIn} = require('connect-ensure-login')

/* GET home page */
router.get('/', (req, res, next) => {
  res.render('index');
});

router.get('/secret', ensureLoggedIn({setRedirectTo:'/auth/login'}),(req,res)=>{
  res.render('secret',{user:req.user})
})
module.exports = router;
