const mongoose = require('mongoose');
const User = require('../models/user.model');
const Course = require('../models/course.model');

module.exports.index = (req, res, next) => {
    Course.find({})
        .then(courses => {
            res.render("course/index", { courses: courses }) 
        })
        .catch(error => next(error))
}

module.exports.courseDetails = (req, res, next) => {
    Course.findOne({_id: req.params.id})
        .then(course => {
            res.render("course/details", { course: course })
        })
        .catch(error => next(error))
}

module.exports.new = (req, res, next) => {
    User.find({role: "TA"})
        .then(tas => {
            res.render("course/new", { tas: tas })
        })
        .catch(error => {
            res.render("course/new", { error: { message: "Error searching TAs"} });
        })
}

module.exports.doNew = (req, res, next) => {
    console.log(req.body.name);
    Course.findOne({name: req.body.name})
        .then( course => {
            if(course != null) {
                res.render("course/new", {
                    error: { message: "There is another course with the same name" },
                    course: req.body
                })
            }
            else {
                course = new Course(
                    {
                        name: req.body.name,
                        description: req.body.description,
                        creatorTA: req.user._id,
                        assignedTA: req.body.assignedTA,
                        duration: req.body.duration
                    }
                )
                course.save()
                    .then( res.redirect("/course") )
                    .catch(error => {
                        if (error instanceof mongoose.Error.ValidationError) {
                            res.render('course/new', {  
                                error: { message: error.errors } 
                            });
                        } else {
                            next(error);
                        }

                    })
            }
        }
            
        )
        .catch(
            error => res.render("course/new", {
                error: {
                    message: "Error creating course"
                }
            })
        )
}

module.exports.edit = (req, res, next) => {
    Course.findById(req.params.id)
        .then(course => {
            User.find({role: "TA"})
                .then(tas => {
                    res.render("course/edit", { 
                        course: course,
                        tas: tas
                    })
            })
            .catch(error => {
                res.render("course/edit", { error: { message: "Error searching TAs"} });
            })
        })
        .catch(error => next(error))
}

module.exports.doEdit = (req, res, next) => {
    Course.findById(req.params.id)
        .then(course => {
            if(course != null) {
                course.name = req.body.name;
                course.description = req.body.description;
                course.assignedTA = req.body.assignedTA;
                course.duration = req.body.duration;
                course.save()
                    .then(() => {
                        res.redirect("/course")
                    })
                    .catch(error => { next(error) })
            }
            else {
                res.send("No se ha encontrado el curso")
            }
        })
}

module.exports.delete = (req, res, next) => {
    Course.findByIdAndRemove(req.params.id)
        .then(res.redirect("/course"))
        .catch(error => next(error))
}