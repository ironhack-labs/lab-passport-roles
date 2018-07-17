const Course = require("../models/course.model");
const createError = require("http-errors");
const mongoose = require("mongoose");

module.exports.create = (req, res, next) =>{
    res.render('courses/create');
};

module.exports.doCreate = (req, res, next) =>{
    const name = req.body.courseName;
    
    Course.findOne({courseName:name})
    .then(course =>{
        if (course) {
            res.render('courses/create', {course:course, errors: {courseName:'Course already exists'}});
            console.log('course exists');
        } else{ 
            const newCourse = new Course(req.body);
            newCourse.save()
            .then(course =>{
                console.log('course saved');
                res.redirect('/courses/list');
            })
            .catch(error =>{ 
                console.log('validation error', error);
                if (error instanceof mongoose.Error.ValidationError) {
                    res.render('courses/create', {errors: error.errors});
                } else{
                    console.log('last error');
                    next(error);
                }
            });
        }
    })
    .catch(error=>{
        next(error);
    });
};

module.exports.list = (req, res, next) =>{
    const criteria = {};

    Course.find(criteria)
    .populate('students')
    .then(courses =>{
        if (courses) {
            res.render('courses/list', {courses});
            
        } else{
            res.render('/courses/list', {errors: 'no courses available'});
        }
    })
    .catch(error =>{
        if (error instanceof mongoose.Error.CastError) {
            next(createError(404, `course not found`));
        } else{
            next(error);
        }
    });
};


module.exports.doDelete = (req, res, next) =>{    
    Course.findByIdAndRemove(req.params.id)
    .then(course =>{
        res.status(200).redirect('/courses/list');
    })
    .catch(error =>{
        if (error instanceof mongoose.Error.CastError) {
            next(createError(404, `course not found`));
            console.log('cast error');
        } else{
            console.log('last error');
            next(error);
        }
    }); 
};