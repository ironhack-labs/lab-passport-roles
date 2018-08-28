const express = require("express");
const router = express.Router();
const ensureLogin = require("connect-ensure-login");
const Employee = require("../models/Employee");
const bcrypt = require("bcrypt");

router.use(ensureLogin.ensureLoggedIn("/auth/log-in"));

router.get("/", (req, res, next) => {
    res.render("add-employee");
});

router.post("/employee-list", (req, res, next) => {
    const { username, password, role } = req.body;

    const encrypted = bcrypt.hashSync(password, 10);

    new Employee({ username, password: encrypted, role })
        .save()
        .then(employees => {
            res.render("employee-list", { employees });
        })
        .catch(err => {
            if (err.code === 11000) {
                return res.render("create", { error: "user exists already" });
            }
            console.error(err);
            res.send("something went wrong");
        });
});

// router.get("/details/:id", (req, res) => {
//     const { id } = req.params;

//     Bear.findById(id).then(bear => {
//         if (!bear) return res.send("No such bear");
//         if (bear.user.toString() !== req.user._id.toString() && req.user.role !== "admin") {
//             res.send("NOT YOUR BEAR!");
//         }

//         res.send(bear);
//     });
// });

// router.get("/employee-list", (req, res, next) => {
//     if (req.user.role !== "boss") {
//         res.send("You should not be here!");
//     } else next();
// });


router.get("/employee-list", (req, res, next) => {
    console.log("Employee route!");
    Employee.find({}).then(employees => {
        res.render("employee-list", { employees });
    });
});

module.exports = router;
