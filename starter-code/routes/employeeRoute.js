const {Router} = require('express')
const router = Router()

router.get('/employees',(req,res)=>{
  res.render('employees')

})

module.exports = router