const mongoose = require('mongoose');
const Schema = mongoose.Schema;

const userSchema = new Schema({
    username: {
        type: String,
        required: true
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

userSchema.methods.checkRoles = function() {

    return function(req, res, next) {
        if (req.isAuthenticated() && (req.user.role === this.role || this.role === "Boss")) {
            return next();
        } else {
            res.redirect('/login')
        }
    }
};

const User = mongoose.model("User", userSchema);

module.exports = User;