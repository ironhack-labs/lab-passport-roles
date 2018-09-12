const mongoose = require('mongoose');
const Schema = mongoose.Schema;
const Joi = require('joi');

const courseSchema = new Schema({
    title: {
        type: String,
        required: true,
        unique: true
    },
    description: {
        type: String
    },
    length: {
        type: String,
        enum: ["1 week", "1 month", "1 year"]
    }
});

function checkRoles(role) {

    return function(req, res, next) {
        if (req.isAuthenticated() && (req.user.role === role || req.user.role === "TA")) {
            return next();
        } else {
            res.render("auth/login", { "message": "Only TA can modify courses!" });
        }
    }
}

const Course = mongoose.model("Course", courseSchema);

function validateCourse(courseData) {

    let course = {
        title: Joi.string().required(),
        description: Joi.string().required(),
        length: Joi.string().required()
    };

    let result = Joi.validate(courseData, course);
    let { error } =  result;

    return error;

}

module.exports = {
    Course,
    validateCourse,
    checkRoles
};