const express = require('express');
const router  = express.Router();

router.get('/pepe', (req, res, next)=>{
  res.render('userBoss/userBoss')
})

module.exports = router;
