const express = require("express");
const coursesRoutes = express.Router();
const bcrypt = require('bcrypt');

const { Course, validateCourse, checkRoles } = require("../models/course");



coursesRoutes.get("/courses/add", checkRoles("TA"), (req, res, next) => {
    res.render("courses/add-course");
});

coursesRoutes.post('/courses/add', checkRoles("TA"), async function(req, res, next)  {

    let { title, description, length } = req.body;

    let validateRes = validateCourse({
        title,
        description,
        length
    });

    console.log(validateRes);

    let errorMessage = null;

    if(validateRes) {
        errorMessage = validateRes.details[0].message;
        return res.status(400)
            .render("/courses/add-course", {
                message: errorMessage,
                title,
                description,
                length
            });

    }

    let course = await Course.findOne({ title });

    if(course) {

        errorMessage = "Course with this name already exists!";

        return res.status(400)
            .render('courses/add-course', {
                message:errorMessage,
                title,
                description,
                length
            });

    } else {

        try {
            course= new Course({ title, description, length });
            const result = await course.save();

            if(result) {
                res.status(201)
                    .redirect('/main');

            }

        } catch(ex) {
            next(ex);
        }

    }

});

coursesRoutes.get('/courses/del/:id', checkRoles("TA"),  async function(req, res, next)  {

    const { id } = req.params;

    try {
        await Course.findByIdAndRemove(id);

        res.status(204)
            .redirect('/main');

    } catch(ex) {
        next(ex);
    }

});

coursesRoutes.get('/courses/up/:id', checkRoles("TA"), async function(req, res, next)  {

    const { id } = req.params;

    try {

        const course = await Course.findById(id);

        if(course) {
            res.render("courses/up-course", {
                course: course.title,
                description: course.description,
                length: course.length
            });

        }

    } catch(ex) {
        next(ex);
    }
});


coursesRoutes.post('/courses/up', checkRoles("TA"), async function(req, res, next)  {
    let { title, description, length } = req.body;

    try {
        const course = await Course.findOneAndUpdate({ title: title }, { $set:{
                description: description,
                title : title,
                lenth: length
            }});

        if(!course) {
            res.status(203)
                .render('/courses/up-course', {
                    message: "Course wasn't found!"
                });
        } else {
            res.status(400)
                .redirect('/main');
        }

    } catch(ex) {
        next(ex);
    }

});

module.exports = coursesRoutes;