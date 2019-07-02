//web server
const express = require("express");
//express instantiation
const app = express()
    //session management. we need this so we can hold the user id
const session = require("express-session");
//cipher algorithm with on-purpose delay
const bcrypt = require("bcrypt");
// Bcrypt to encrypt passwords - defines the bcrypt complexity and time taken to be calculated
const bcryptSalt = 10;
//authentication middleware
const passport = require("passport");
//passport authentication strategy (this case with username and password)
const LocalStrategy = require("passport-local").Strategy;
//middleware which validates you are logged in - otherwise it redirects you
const ensureLogin = require("connect-ensure-login");
//holds temporary information which is self-destroyed after being used. One-off in the session
const flash = require("connect-flash");
//it is our favourite ODM - gives you functionality on top of mongodb
const mongoose = require("mongoose")
    //this is needed in order to be able to pass information from html5 forms towards the views
const bodyParser = require('body-parser');
//path management
const path = require('path')
    //handlebars templating 
const hbs = require('hbs')
    //handlebars utilities
const Swag = require('swag');
//here you boot up swag so it is available in the views (made with handlebars)
Swag.registerHelpers(hbs);

const User = require("./models/user");

mongoose.Promise = Promise;
mongoose
    .connect('mongodb://localhost/PassportRoles')
    .then(() => {
        console.log('Connected to Mongo!')
    }).catch(err => {
        console.error('Error connecting to mongo', err)
    });

app.use(session({
    secret: "our-passport-local-strategy-app",
    resave: true,
    saveUninitialized: true
}));

app.use(flash());

app.use(express.static(path.join(__dirname, '/public')));
app.set('views', __dirname + '/views');
app.set('view engine', 'hbs');
hbs.registerPartials(__dirname + '/views/partials');

app.use(bodyParser.urlencoded({
    extended: true,
}));



app.use(passport.initialize());
app.use(passport.session());


passport.use(new LocalStrategy({
    passReqToCallback: true
}, (req, username, password, next) => {
    console.log("login")
    console.log(username)
    console.log(password)

    User.findOne({
        username
    }, (err, user) => {
        if (err) {
            return next(err);
        }

        console.log(user)
        if (!user) {
            return next(null, false, {
                message: "Incorrect username"
            });
        }
        if (!bcrypt.compareSync(password, user.password)) {
            return next(null, false, {
                message: "Incorrect password"
            });
        }

        return next(null, user);
    });
}));




passport.serializeUser((user, cb) => {
    console.log("serialize")
    console.log(user._id)
    cb(null, user._id);
});

passport.deserializeUser((id, cb) => {
    console.log("deserialize")
    console.log(id)
    User.findById(id, (err, user) => {
        if (err) {
            return cb(err);
        }
        console.log(user)
        cb(null, user);
    });
});



//TODO EL TEMA RUTAS -----------------------------------------------------
app.get('/', ensureLogin.ensureLoggedIn(), (req, res) => {
    res.render('base', {
        user: req.user,
        section: 'index'
    })
})

app.get("/signup", (req, res, next) => {
    res.render("base", {
        section: 'signup'
    });
});

app.post("/signup", (req, res, next) => {
    const username = req.body.username;
    const password = req.body.password;
    const role = req.body.role;

    if (username === "" || password === "") {
        res.render("base", {
            "message": "Indicate username and password",
            "section": "signup"
        });
        return;
    }

    User.findOne({
            username
        })
        .then(user => {
            if (user !== null) {
                res.render("base", {
                    "message": "The username already exists",
                    "section": "signup"
                });
                return;
            }

            const salt = bcrypt.genSaltSync(bcryptSalt);
            const hashPass = bcrypt.hashSync(password, salt);

            const newUser = new User({
                username,
                password: hashPass,
                role
            });

            newUser.save((err) => {
                if (err) {
                    res.render("base", {
                        message: "Something went wrong",
                        "section": "signup"
                    });
                } else {
                    res.redirect("/");
                }
            });
        })
        .catch(error => {
            next(error)
        })
});

app.get("/login", (req, res, next) => {
    res.render("base", {
        "message": req.flash("error"),
        "section": "login"
    });
});


// invoked via passport.use(new LocalStrategy({
app.post("/login", passport.authenticate("local", {
    successReturnToOrRedirect: "/",
    failureRedirect: "/login",
    failureFlash: true,
    passReqToCallback: true
}));

function checkRoles(roles) {
    return function(req, res, next) {
        if (req.isAuthenticated() && roles.includes(req.user.role)) {
            return next();
        } else {
            if (req.isAuthenticated()) {
                res.redirect('/')
            } else {
                res.redirect('/login')
            }
        }
    }
}

// js curry
const checkAll = checkRoles(['BOSS', 'DEVELOPER', 'TA']);
const checkBoss = checkRoles(['BOSS']);

app.get("/private-page-admin-editors", checkAll, (req, res) => {
    res.render("onlyforadminseditors", {
        user: req.user,
        "section": "private"
    });
});

app.get("/private-page-admin", checkBoss, (req, res) => {
    res.render("onlyforadmins", {
        user: req.user,
        "section": "private"
    });
});

app.get("/private-page", ensureLogin.ensureLoggedIn(), (req, res) => {
    console.log("private page")
    console.log(req.session)
    res.render("base", {
        user: req.user,
        "section": "private"
    });
});

app.get('/listUsers', (req, res, next) => {
    User
        .find()
        .then((allUsers) => {
            res.render('allusers', { allUsers });
        }).catch(error => {
            console.log(error);
        })
});

app.get('/users/:id', (req, res, next) => {
    User
        .findById(req.params.id)
        .then(oneuser => {
            res.render("showdetails", { oneuser })
        }).catch(error => {
            console.log(error);
        })
});

app.get('/users/:id/edit', ensureLogin.ensureLoggedIn(), (req, res, next) => {
    if (req.params.id == req.user._id || req.user.role == 'BOSS') {
        User
            .findById(req.params.id)
            .then(oneuser => {
                res.render("usersedit", { oneuser })
            }).catch(error => {
                console.log(error);
            })
    } else {
        res.redirect('/listUsers')
    }

});

app.post('/users/edit-new/:id', (req, res, next) => {
    User
        .updateOne({ _id: req.params.id }, {
            username: req.body.username,
            role: req.body.role,
        })
        .then(oneuser => {
            res.redirect("/listUsers")
        }).catch(error => {
            console.log("error de update")
            next(error);
        })
});




app.get("/logout", (req, res) => {
    req.logout();
    res.redirect("/login");
});

//finish


app.listen(3000)