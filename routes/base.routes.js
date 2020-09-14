const express = require("express");
const router = express.Router();
const bcrypt = require("bcrypt");
const bcryptSalt = 10;

const User = require("../models/User.model");

const checkLoggedIn = (req, res, next) =>
    req.isAuthenticated() ?
    next() :
    res.render("auth/login", {
        message: "Unauthorized, log in to continue.",
    });

const checkRole = (rolesToCheck) => {
    return (req, res, next) => {
        if (req.isAuthenticated() && rolesToCheck.includes(req.user.role)) {
            next();
        } else {
            res.render("auth/login", {
                message: "Unauthorized, you do not have access.",
            });
        }
    };
};

// Endpoints
router.get("/", (req, res) => res.render("index"));

router.get(
    "/platform",
    checkLoggedIn,
    checkRole(["BOSS", "TA", "DEV"]),
    (req, res, next) => {
        User.find()
            .then((allUsers) =>
                res.render("auth/platform", {
                    allUsers,
                    user: req.user,
                    isBoss: req.user.role === "BOSS",
                })
            )
            .catch((err) => next(err));
    }
);

router.get(
    "/admin-employees",
    checkLoggedIn,
    checkRole(["BOSS"]),
    (req, res, next) => {
        User.find({
                role: {
                    $in: ["TA", "DEV"],
                },
            })
            .then((allEmployees) =>
                res.render("auth/admin-employees", {
                    allEmployees,
                })
            )
            .catch((err) => next(err));
    }
);

router.get(
    "/add-employee",
    checkLoggedIn,
    checkRole(["BOSS"]),
    (req, res, next) => res.render("auth/add")
);

router.post(
    "/add-employee",
    checkLoggedIn,
    checkRole(["BOSS"]),
    (req, res, next) => {
        const {
            username,
            name,
            password,
            profileImg,
            description,
            facebookId,
            role,
        } = req.body;

        const salt = bcrypt.genSaltSync(bcryptSalt);
        const hashPass = bcrypt.hashSync(password, salt);

        User.create({
                username,
                name,
                password: hashPass,
                profileImg,
                description,
                facebookId,
                role,
            })
            .then(() => res.redirect("/admin-employees"))
            .catch((err) => next(err));
    }
);

router.post(
    "/:employee_id/delete-employee",
    checkLoggedIn,
    checkRole(["BOSS"]),
    (req, res, next) => {
        const employeeId = req.params.employee_id;

        User.findByIdAndDelete(employeeId)
            .then(() => res.redirect("/admin-employees"))
            .catch((err) => next(err));
    }
);

router.get(
    "/profile/:user_id",
    checkLoggedIn,
    checkRole(["BOSS", "TA", "DEV"]),
    (req, res, next) => {

        const user_id = req.params.user_id

        User.findById(user_id)
            .then(foundUser => res.render("auth/profile", foundUser))
            .catch(err => next(err))
    }
);

router.get("/my-profile", checkLoggedIn, (req, res, next) => res.render('auth/myprofile', req.user));

router.get('/edit', checkLoggedIn, (req, res, next) => res.render('auth/edit', req.user))

router.post('/edit/:user_id', checkLoggedIn, (req, res, next) => {

    const user_id = req.params.user_id
    const { username, name,  profileImg, description, facebookId } = req.body

    User.findByIdAndUpdate(user_id, { username, name,  profileImg, description, facebookId })
        .then(() => res.redirect('/my-profile'))
        .catch(err => next(err))
})

module.exports = router;