const {Router} = require('express')
const router = Router()
const {postSignup}= require('../controllers/authControllers')

router.get('/boss-page',(req,res)=>{
  res.render('boss-page')

})

router.get('/auth/signup',(req,res)=>{
  res.render('auth/signup')
})

router.post('/signup',postSignup)




module.exports = router
