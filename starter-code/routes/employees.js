const express = require("express");
const router = express.Router();
const User = require("../models/User");
const Course = require("../models/Course");

//Middleware
function isAdmin() {
  return (req, res, next) => {
    if (req.user.role === "BOSS") {
      next();
    } else {
      res.redirect("/employees/view");
    }
  };
}

function isTA() {
  return (req, res, next) => {
    if (req.user.role === "TA") {
      next();
    } else {
      res.redirect("/employees/view");
    }
  };
}

function isLoggedIn() {
  return (req, res, next) => {
    if (req.isAuthenticated()) {
      next();
    } else {
      res.redirect("/login");
    }
  };
}

/*
router.get('/course', isLoggedIn(), isTA(), (req, res, next) => {
  res.render("new-course");
});
router.post('/course', isLoggedIn(), isTA(), (req, res, next) => {
  const name = req.body.name;
  const type = req.body.type;
  const description = req.body.description;
  if (name === "") {
    res.render("employees/view");
    return;
  }

  Course.findOne({ name }, "name", (err, user) => {
    if (user !== null) {
      res.render("/employees/view", { message: "The course already exists" });
      return;
    }

    const newCourse = new Course({
      name: name,
      description: description,
      type: type,
    });

    newCourse.save()
      .then(() => {
        res.redirect("/employees/view");
      })
      .catch(err => {
        res.render("error");
      })
  });
})
*/

router.get("/", isLoggedIn(), isAdmin(), (req, res, next) => {
  User.find() //easy way is {title: search}
    .then(emps => {
      res.render("employees", { emps, master: req.user.username });
    })
    .catch(e => next(e));
});
router.get("/view", isLoggedIn(), (req, res, next) => {
  User.find() //easy way is {title: search}
    .then(emps => {
      res.render("employees-view", { emps, master: req.user.username });
    })
    .catch(e => next(e));
});

router.get("/detail/:id", isLoggedIn(), (req, res, next) => {
  const { id } = req.params;
  User.findById(id)
    .then(emp => {
      console.log("Req user" + req.user._id);
      console.log("Clicked Id" + id);

      if (req.user._id !== id)
        //console.log("Employee detail")
        res.render("employee-detail", emp);
      //console.log("Employee-Edit")
      else res.redirect("/employees/edit/" + id);
    })
    .catch(e => {
      console.log(e);
    });
});

router.get("/edit/:id", (req, res, next) => {
  const { id } = req.params;
  User.findById(id)
    .then(emp => {
      res.render("employee-edit", emp);
    })
    .catch(e => next(e));
});

router.post("/edit/:id", (req, res, next) => {
  const { id } = req.params;
  User.findByIdAndUpdate(id, { $set: req.body }, { new: true })
    .then(emp => {
      console.log(emp);
      res.redirect("/employees");
    })
    .catch(e => next(e));
});

router.get("/new", (req, res, next) => {
  res.render("new-employee");
});

router.post("/new", (req, res, next) => {
  User.register(req.body, req.body.password)
    .then(usr => {
      console.log(usr);
      res.redirect("/employees"); 
    })
    .catch(e => next(e));
});

router.get("/remove/:id", (req, res, next) => {
  const { id } = req.params;
  User.findByIdAndRemove(id)
    .then(emp => {
      res.redirect("/employees");
    })
    .catch(e => next(e));
});

router.get("/logout", (req, res, next) => {
  req.logOut();
  res.redirect("/login");
});

module.exports = router;
