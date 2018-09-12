const mongoose = require('mongoose');
const Schema = mongoose.Schema;
const Joi = require('joi');

const userSchema = new Schema({
    username: {
        type: String,
        required: true,
        unique: true
    },
    password: {
        type: String,
        required: true
    },
    role: {
        type: String,
        enum: ["Boss", "Developer", "TA"],
        default: "Developer"
    }
});

function checkRoles(role) {

    return function(req, res, next) {
        if (req.isAuthenticated() && (req.user.role === role || req.user.role === "Boss")) {
            return next();
        } else {
            res.render("auth/login", { "message": "Only Boss can manage company's stuff!" });

        }
    }
}

const User = mongoose.model("User", userSchema);

function validateUser(userData) {

    let user = {
        username: Joi.string().max(50).required(),
        password: Joi.string().min(8).required(),
        role: Joi.string().required()
    };

    let result = Joi.validate(userData, user);
    let { error } =  result;

    return error;

}

module.exports = {
    User,
    validateUser,
    checkRoles
};