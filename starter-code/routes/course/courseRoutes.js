const router = require("express").Router();
const Course = require("../../models/Course");
const User = require("../../models/User");
const passport = require("passport");


function checkIfIs(role) {
    return function(req, res, next) {
        if (req.user.role === role) return next();
        return res.send({ message: `No eres un ${role}` });
    };
}


router.get('/list',(req,res,next)=>{
    Course.find()
        .then(courses => {
            const isTA = req.user.role === "TA"
            res.render('course/list',{courses, isTA})
        })
        .catch(e => next(e))
})

router.get('/detail/:id',(req,res,next)=>{
    const {id} = req.params
    Course.findById(id).populate('userID')
        .then(course => {
            console.log(course)
            res.render('course/detail',course)
        })
        .catch(e=> next(e))
})

router.get("/create",checkIfIs('TA'), (req, res, next) => {
    res.render("course/create");
});

router.post("/create", (req, res, next) => {
    const {id} = req.user
    req.body['userID'] = id
    Course.create(req.body)
        .then(course=>{
            User.findByIdAndUpdate(id,{$push:{courses:course._id}})
                .then(user=>{
                    res.redirect(`/course/list`)
                }).catch(e=>next(e))
        }).catch(error=>{
            next(error)
    })
});

router.get("/edit/:id",(req,res,next)=>{
    const {id} = req.params;
    Course.findById(id)
        .then(course => res.render('course/edit',course))
        .catch(e => next(e))
})

router.post("/edit",(req,res,next)=>{
    const {name} = req.body;

    Course.findOneAndUpdate({$set:{name}})
        .then(course => res.redirect('/course/list'))
        .catch(e => next(e))
})

router.get('/delete/:id',(req,res,next)=>{
    const {id} = req.params
    Course.findByIdAndDelete(id)
        .then(course => res.redirect('/course/list'))
})
module.exports = router