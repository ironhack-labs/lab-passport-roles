const express = require('express');
const router  = express.Router();

const checkRole = (role)=>(req,res,next)=>{
  if(!req.isAuthenticated()) return res.redirect('/login');
  if(req.user.role === role) return next()
  return res.send('no tienes permiso')

};

router.get('/boss', checkRole('DEVELOPER'), (req, res, next)=>{
  res.send('Has pasado el primer nivel de seguridad')
})

/* GET home page */
router.get('/', (req, res, next) => {
  res.render('index');
});

module.exports = router;
