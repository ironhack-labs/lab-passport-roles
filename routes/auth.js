const express = require ("express");
const router = express.Router();
const User = require("../models/User");
const Course = require("../models/Course");
const passport = require("passport");

const checkRole = (role) => (req, res, next) => {
    if (!req.isAuthenticated()) return res.redirect("/login");
    if (req.user.role === role) return next();
    return res.send ("NO tienes permiso");
  };
  
function isAuthenticated(req,res,next){
    if (req.isAuthenticated()){
        return next()
    }else{
        res.redirect("/login");
    }
}

function isLoggedIn (req,res,next){
    if(req.isAuthenticated()){
        res.redirect("/admin");
    }else{
        next();
    }
}

router.get("/alumni", checkRole("ALUMNI"),  (req,res, next)=>{
    Promise.all([User.find(),Course.find()])
    .then(results=>{
        const ctx = {
            users: results[0],
            courses: results[1],
        }
        res.render("./auth/alumni",ctx)
    })
    .catch(e=>next(e))
})

router.get("/perfilA/delete/:id", isAuthenticated, (req,res)=>{
    Course.findByIdAndRemove(req.params.id)
    .then( () =>{
        res.redirect('/perfilA');
    })
})

router.get("/admin/delete/:id", isAuthenticated, (req,res)=>{
    User.findByIdAndRemove(req.params.id)
    .then( () =>{
        res.redirect('/admin');
    })
})

router.post("/perfilA/edit/:id", isAuthenticated, (req,res)=>{
    Course.findByIdAndUpdate(req.params.id, req.body, {new:true})
    .then(()=>{
        res.redirect("/perfilA");
    })
    .catch(e=>next(e))
})

router.get("/perfilA/edit/:id", (req,res)=>{
    Course.findById(req.params.id)
    .then(courses=>{
        res.render('./auth/editCourses', {courses});
    })
    .catch(e=>next(e))
})

router.post("/admin/edit/:id", isAuthenticated, (req,res)=>{
    User.findByIdAndUpdate(req.params.id, req.body, {new:true})
    .then(()=>{
        res.redirect("/admin");
    })
    .catch(e=>next(e))
})

router.get("/admin/edit/:id", (req,res)=>{
    User.findById(req.params.id)
    .then(users=>{
        res.render('./auth/editUser', {users});
    })
    .catch(e=>next(e))
})

router.post("/newCourse", (req,res,next)=>{
    Course.create(req.body)
    .then(()=>{
        res.redirect('/perfilA')
    })
    .catch(e=>next(e))
})

router.get("/newCourse", (req,res,next)=>{
    res.render('./auth/newCourse');
})

router.get("/signup", checkRole("BOSS"), (req,res,next)=>{
    res.render('./auth/signup');
  })
  
  router.get("/admin", checkRole("BOSS"), (req,res,next)=>{
      User.find()
      .then(users=>{
        res.render('./auth/admin', {users});
      })
  })

router.get("/logout", (req,res,next)=>{
    req.logout();
    res.redirect("/login");
})

router.get("/perfilA", checkRole("TA"),  (req,res, next)=>{
    Promise.all([User.find(),Course.find()])
    .then(results=>{
        const ctx = {
            users: results[0],
            courses: results[1],
        }
        res.render("./auth/perfilA",ctx)
    })
    .catch(e=>next(e))
})


router.get("/admin", isAuthenticated, (req,res)=>{
    const admin = req.user.role === "BOSS";
    res.render("./auth/admin", {admin});
})

router.post("/login", passport.authenticate("local"),(req,res,next)=>{
    req.app.locals.user = req.user;
    if (req.user.role === "TA") return res.redirect("/perfilA");
    if (req.user.role === "BOSS") return res.redirect("/admin");
    if (req.user.role === "ALUMNI") return res.redirect("/alumni");
})

router.get("/login", isLoggedIn, (req,res)=>{
    res.render('./auth/login');
})

router.post("/signup",(req,res,next)=>{
    User.register(req.body, req.body.password)
    .then(user=>res.redirect("/login"))
    .catch(e=>next(e))
})

//'./auth/signup'

module.exports = router;