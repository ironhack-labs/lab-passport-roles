const express = require('express');
const router  = express.Router();

const checkIfRole = (req,res,next)=>{
  if(req.user.role === "BOSS"){
    return next();
  }else res.send("No jala bro")
}

/* GET home page */
router.get('/', (req, res, next) => {
  res.render('index');
});

module.exports = router;
