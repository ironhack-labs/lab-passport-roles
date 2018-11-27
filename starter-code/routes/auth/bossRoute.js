const router = require("express").Router();
const User = require("../../models/User");
const passport = require("passport");

router.get('/createBOSS',(req,res,next)=>{
    const user = {
        username: 'Mike',
        email: 'mike@gmail.com',
        role: 'Boss'
    }
    User.register(user,'1234')
        .then(user => {
            res.json(user);
        })
        .catch(e => next(e));
})


module.exports = router;