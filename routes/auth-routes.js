const express = require('express');
const authRoutes = express.Router();
const passport     = require('passport');
//User model
const User = require("../models/user");
const ensureLogin =require("connect-ensure-login");

//Bcrypt to encrypt
const bcrypt =require("bcrypt");
const bcryptSalt = 10;
authRoutes.get("/",(req, res, next)=>{
  res.redirect("login");
});

authRoutes.get("/signup",(req, res, next)=>{
    res.render("auth/signup");
});

authRoutes.post("/signup",(req, res, next)=>{
    const username=req.body.username;
    const password=req.body.password;
    const role=req.body.role;
    const name=req.body.name;
    const lastname=req.body.lastname;
    const age=req.body.age;
    const gender=req.body.gender;
    const interest=req.body.insterest;
    const university=req.body.university;

    if(username===""||password===""){
        res.render("auth/signup", { message: "Indicate username and password"});
        return;
    }
    User.findOne({username},"username",(err, user)=>{
        if(user !== null){
            res.render("auth/signup",{message: "The username already exists"});
            return;
        }
        const salt = bcrypt.genSaltSync(bcryptSalt);
        const hashPass = bcrypt.hashSync(password, salt);

        const newUser =new User({
            username,
            password: hashPass,
            role,
            name,
            lastname,
            age,
            gender,
            interest,
            university
        });

        newUser.save((err)=>{
            if(err){
                res.render("auth/signup",{message: "Some error"});
            }else{
                res.redirect("/admin");
            }
        });
    });
});

const checkBoss  = checkRoles('BOSS');
const checkDeveloper = checkRoles('DEVELOPER');
const checkTA  = checkRoles('TA');
const checkEmp = checkEmployee();

authRoutes.get("/login", (req, res, next)=>{
    res.render("auth/login", {"message": req.flash("error")});
});

authRoutes.post("/login", passport.authenticate("local",{
    successRedirect: "/",
    failureRedirect: "/login",
    failureFlash: true,
    passReqToCallback: true
}));


authRoutes.get('/admin', checkBoss, (req, res) => {
    User.find().then(users=>{
        console.log(users);
        res.render('admin',{users, user: req.user});
      })
      .catch(e =>{
        console.log(e);
      })
    //res.render('admin', {user: req.user});
  });

  authRoutes.get('/admin/:id',(req, res, next)=>{
  let userID=req.params.id;
  User.remove({'_id':userID}).then(user=>{
    console.log(user);
    User.find().then(users=>{
        console.log(users);
        res.redirect("/admin");
        //res.render('admin',{users, user: req.user});
        //ren
      })
      .catch(e =>{
        console.log(e);
      })
    //res.render('admin',{user: req.user});
  }).catch(error=>{
    console.log(error);
  })
  console.log("id",userID);
  
}); 

authRoutes.get('/profile', checkEmp,(req, res) => {
  User.find({ "role": { $ne: "BOSS" } }).then(users=>{
      console.log(users);
      res.render('profile',{users, user: req.user});
    })
    .catch(e =>{
      console.log(e);
    })
  
});


  
  authRoutes.get('/profile/:id',(req, res, next)=>{
    let userID=req.params.id;
    User.findOne({'_id':userID}).then(user=>{
        console.log(user);
        res.render("profile-detail",{user});
      }).catch(error=>{
        console.log(error);
      })
    console.log("id",userID);
  }); 

  authRoutes.get('/profile/:id/edit',checkEmp,(req, res, next)=>{
    let userID=req.params.id;
    User.findOne({'_id':userID}).then(user=>{
        console.log(user);
        res.render("edit",{user});
      }).catch(error=>{
        console.log(error);
      })
    console.log("id",userID);
  }); 

  authRoutes.post('/profile/:id/edit',(req, res)=>{
    const {name, lastname, age, gender, interest, university}=req.body;
    const updates={name, lastname, age, gender, interest, university};
    User.findByIdAndUpdate(req.params.id, updates)
    .then(()=>{
        res.redirect("/profile");
      }).catch(error=>{
        return next(error);
      })
  });
   

  authRoutes.get('/courses', checkTA, (req, res) => {
    res.render('courses', {user: req.user});
  });

  function checkRoles(role) {
    return function(req, res, next) {
      if (req.isAuthenticated() && req.user.role === role) {
        return next();
      } else {
        res.redirect('/login')
      }
    }
  }
  function checkEmployee() {
    return function(req, res, next) {
      if (req.isAuthenticated() && ((req.user.role === 'DEVELOPER')||(req.user.role === 'TA'))) {
        return next();
      } else {
        res.redirect('/login')
      }
    }
  }




authRoutes.get("/private-page", ensureLogin.ensureLoggedIn(),(req, res)=>{
    res.render("private",{user: req.user});
})

authRoutes.get("/logout",(req, res)=>{
    req.logout();
    req.redirect("/login");
})

module.exports=authRoutes;