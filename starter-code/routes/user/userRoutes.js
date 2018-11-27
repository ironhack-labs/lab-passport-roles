const router = require("express").Router();
const User = require("../../models/User");
const passport = require("passport");


function checkIfIsHere(req, res, next) {
    console.log("loged??", req.isAuthenticated());
    if (req.isAuthenticated()) {
        return next();
    }
    return res.redirect("/auth/login");
}

function checkIfIs(role) {
    return function(req, res, next) {
        if (req.user.role === role) return next();
        return res.send({ message: `No eres un ${role}` });
    };
}

router.get("/list",checkIfIsHere,(req, res) => {
    console.log(req.user.role)
    User.find()
        .then(users => {
            const isBoss = req.user.role === "Boss"
            console.log(isBoss)
            res.render('user/list',{users, isBoss})
        })
        .catch(e => res.next(e))
});

router.get('/detail/:id',(req,res,next)=>{
   const {id} = req.params
    User.findById(id)
        .then(user => res.render('user/detail',user))
})

router.get("/edit",(req,res,next)=>{
    const user = req.user;
    console.log(user)
    res.render('user/edit',user)
})

router.post("/edit",(req,res,next)=>{
    const {username, email} = req.body;

    User.findOneAndUpdate({$set:{username,email}})
        .then(user => res.redirect('/user/list'))
        .catch(e => next(e))
})


router.get('/delete/:id',(req,res,next)=>{
    const {id} = req.params
    User.findByIdAndDelete(id)
        .then(user => res.redirect('/user/list'))
})
module.exports = router;