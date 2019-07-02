const{Router}= require('express')
const router= Router()

router.get('/ironhack',(req,res)=>{
  res.render('ironhack')
})
module.exports=router