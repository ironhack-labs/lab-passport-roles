const express = require('express');
const router  = express.Router();

// const checkRole = (req,res)=>{
//   if(req.user.role === "BOSS") return next();
//     res.send("no tienes acceso");
// }


/* GET home page */
router.get('/', (req, res, next) => {
  res.render('index');
});

module.exports = router;
