const passport = require("passport");
const express= require("express");

const User = require("../models/user-model");
const router = express.Router();

router.get("/signup", (req,res,next) =>{
    res.render("auth-views/signup-form")
})

router.post("/process-signup", (req,res,next) => {
    const { userName, password} = req.body;

    User.create({userName, password})
        .then(() => {
            res.redirect("/")
        })
        .catch((err) => {
            next(err)
        })
})

router.get("/login", (req, res, next) => {
    res.render("auth-views/login-form")
})

router.post("/process-login", (req, res, next) => {
    const { userName, password } = req.body;
    
    User.findOne({userName})
        .then((userDetails) => {
            console.log("hello");
            if(!userDetails){
                res.send("GTFO");
                return;
            }
            console.log("Hi there");
            req.login(userDetails, () => {
                console.log("logged in");
                res.redirect("/");
            });
        })
        .catch((err) => {
            next(err);
        });
        
})

module.exports = router;