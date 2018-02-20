const express      = require('express');
const path         = require('path');
const favicon      = require('serve-favicon');
const logger       = require('morgan');
const cookieParser = require('cookie-parser');
const bodyParser   = require('body-parser');
const mongoose     = require("mongoose");

const app = express();

// Controllers
const siteController = require("./routes/siteController");

// Mongoose configuration
mongoose.connect("mongodb://localhost/ibi-ironhack");

const User = require("./models/user");
const Course = require("./models/course");
const session       = require("express-session");
const bcrypt        = require("bcrypt");
const passport      = require("passport");
const LocalStrategy = require("passport-local").Strategy;
const FbStrategy = require('passport-facebook').Strategy;
const flash = require("connect-flash");

//enable sessions here

app.use(session({
  secret: "bliss",
  resave: true,
  saveUninitializer: true
}));

//initialize passport and session here

passport.serializeUser((user,cb)=>{
  cb(null, user._id);
});

passport.deserializeUser((id, cb)=>{
  User.findOne({"_id":id}, (err,user)=>{
    if(err) return cb(err);
    cb(null, user);
  })
});

app.use(flash());

passport.use(new LocalStrategy({passReqToCallback:true},(req, username, password, next)=>{
  User.findOne({username}, (err, user)=>{
    if(err) return next(err);
    if(!user) return next(null, false, {message: "Incorrect username"});
    if(!bcrypt.compareSync(password, user.password)) return next(null, false, {message: "Incorrect password"});
    return next(null, user);
  });
}));

passport.use(new FbStrategy({
  clientID: "2004252213161127",
  clientSecret: "23a2542f53ab00aa94291833e6c48ebd",
  callbackURL: "/auth/facebook/callback"
}, (accessToken, refreshToken, profile, done) => {
  User.findOne({ facebookID: profile.id }, (err, user) => {
    if (err) {
      return done(err);
    }
    if (user) {
      return done(null, user);
    }

    const newUser = new User({
      facebookID: profile.id,
      displayName: profile.displayName
    });

    newUser.save((err) => {
      if (err) {
        return done(err);
      }
      done(null, newUser);
    });
  });

}));

app.use(passport.initialize());
app.use(passport.session());

// view engine setup
app.set('views', path.join(__dirname, 'views'));
app.set('view engine', 'ejs');

// uncomment after placing your favicon in /public
//app.use(favicon(path.join(__dirname, 'public', 'favicon.ico')));
app.use(logger('combined'));
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: false }));
app.use(cookieParser());
app.use(express.static(path.join(__dirname, 'public')));

// Routes
app.use("/", siteController);
app.get("/auth/facebook", passport.authenticate("facebook"));
app.get("/auth/facebook/callback", passport.authenticate("facebook", {
  successRedirect: "/private",
  failureRedirect: "/login"
}));

// catch 404 and forward to error handler
app.use(function(req, res, next) {
  var err = new Error('Not Found');
  err.status = 404;
  next(err);
});

// error handler
app.use(function(err, req, res, next) {
  // set locals, only providing error in development
  res.locals.message = err.message;
  res.locals.error = req.app.get('env') === 'development' ? err : {};

  // render the error page
  res.status(err.status || 500);
  res.render('error');
});

app.listen(3000, function(err){
  if(err) console.log(err);
  console.log("Tu servidor esta funcionando");
})

module.exports = app;
