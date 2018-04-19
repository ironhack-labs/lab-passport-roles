const express = require("express");
const router = express.Router();
const User = require("../models/user-model");

router.get("/boss/employees", (req, res, next) => {
    
    // if you aren't logged in or you are NOT an admin
    if (!req.user || req.user.role !== "Boss"){
        // ... go straight to the 404 page (sneaky!)
        next();
        return;
    }

    User.find()
        .then((usersFromDb) => {
            res.locals.employeesList = usersFromDb;
            res.render("boss-views/employees-list-page"); 
        })
        .catch((err) => {
            next(err);
        });
});

router.get("/ta/employees", (req, res, next) => {
    
    // if you aren't logged in or you are NOT an admin
    if (!req.user || req.user.role !== "TA"){
        // ... go straight to the 404 page (sneaky!)
        next();
        return;
    }

    User.find()
        .then((usersFromDb) => {
            res.locals.employeesList = usersFromDb;
            res.render("ta-views/info");   
        })
        .catch((err) => {
            next(err);
        });
});

router.get("/boss/:id/delete", (req, res, next) => {
    if (!req.user || req.user.role !== "Boss"){
        // ... go straight to the 404 page (sneaky!)
        next();
        return;
    }

    User.findByIdAndRemove(req.params.id)
        .then(() => {
            res.redirect('/boss/employees')
        })
        .catch((err) => {
            next(err);
        })
});

router.get("/boss/:id/edit", (req, res, next) => {
    if (!req.user || req.user.role !== "Boss"){
        // ... go straight to the 404 page (sneaky!)
        next();
        return;
    }

    User.findByIdAndUpdate(req.params.id)
        .then((employeeDetails) => {
            res.locals.id = req.params.id;
            res.locals.employee = employeeDetails;
            res.render('boss-views/employee-edit');
            // res.redirect('/boss/employees');
        })
        .catch((err) => {
            next(err);
        })
});

router.post("/process-edit/:id", (req, res, next) => {
    if (!req.user || req.user.role !== "Boss"){
        // ... go straight to the 404 page (sneaky!)
        next();
        return;
    }

    const {fullName, email, role} = req.body;

    if (!(role in {Boss: "Boss", TA: "TA", Developer: "Developer"})){
        res.redirect(`/boss/${req.params.id}/edit`);
        return;
    };

    User.findByIdAndUpdate(
        req.params.id, 
        {fullName, email, role},
        {runValidators: true}
    )
        .then(() => {
            res.redirect('/boss/employees');
        })
        .catch((err) => {
            next(err);
        });

})

module.exports = router;