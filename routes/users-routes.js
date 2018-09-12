const express = require("express");
const usersRoutes = express.Router();
const bcrypt = require('bcrypt');

const { User, validateUser, checkRoles } = require("../models/user");



usersRoutes.get("/users/add", (req, res, next) => {
    res.render("users/add-user");
});

usersRoutes.post('/users/add', async function(req, res, next)  {

    let { username, password, role } = req.body;

    let validateRes = validateUser({
        username,
        password,
        role
    });

    let errorMessage = null;

    if(validateRes) {
        errorMessage = validateRes.details[0].message;
        return res.status(400)
            .render("/users/add-user", {
                message: errorMessage,
                username,
                password,
                role
            });

    }

    let user = await User.findOne({ username });

    if(user) {

        errorMessage = "User with this name already exists!";

        return res.status(400)
            .render('users/add-user', {
                message:errorMessage,
                username,
                password,
                role
            });

    } else {

        try {
            const salt = await bcrypt.genSalt(10);
            password = await bcrypt.hash(password, salt);

            user = new User({ username, password, role });
            const result = await user.save();

            if(result) {
                res.status(201)
                    .redirect('/main');

            }

        } catch(ex) {
            next(ex);
        }

    }

});

usersRoutes.get('/users/del/:id', checkRoles("Boss"),  async function(req, res, next)  {

   const { id } = req.params;

   try {
        await User.findByIdAndRemove(id);

       res.status(204)
           .redirect('/main');

   } catch(ex) {
       next(ex);
   }

});

usersRoutes.get('/users/up/:id', async function(req, res, next)  {

    const { id } = req.params;

    try {

        const user = await User.findById(id);

        if(user) {
            res.render("users/up-user", {
                user: user.username,
                role: user.role
            });

        }

    } catch(ex) {
        next(ex);
    }
});


usersRoutes.post('/users/up', async function(req, res, next)  {
    let { username, role } = req.body;

    try {
        const user = await User.findOneAndUpdate({ username: username }, { $set:{
            role: role
            }});

        if(!user) {
            res.status(203)
                .render('/users/up-user', {
                    message: "User wasn't found!"
                });
        } else {
            res.status(400)
                .redirect('/main');
        }

    } catch(ex) {
        next(ex);
    }

});

module.exports = usersRoutes;