const mongoose = require('mongoose');
const bcrypt = require('bcrypt');
const SALT_WORK_FACTOR = 10;

const BOSS_ROLE = "Boss";
const DEV_ROLE = "Developer";
const TA_ROLE = "TA";

const userSchema = new mongoose.Schema({
    username: {
        type: String,
        required: [true, 'Username is required'],
        unique: true
    },
    password: {
        type: String,
        required: [true, 'Password is required']
    },
    role: {
        type: String,
        enum: [BOSS_ROLE, DEV_ROLE, TA_ROLE],
        default: TA_ROLE
    }
}, { timestamps: true} );

userSchema.pre('save', function(next) {

    if (!this.isModified('password')) {
        return next();
    }

    if (user.isAdmin()) {
        this.role = BOSS_ROLE;
    }

    bcrypt.genSalt(SALT_WORK_FACTOR)
        .then(salt => {
            bcrypt.hash(this.password, salt)
                .then(hash => {
                    this.password = hash;
                    next();
                })
        })
        .catch(error => next(error));

});

userSchema.methods.checkPassword = function(password) {
    return bcrypt.compare(password, this.password);
}
    
userSchema.methods.isAdmin = function() {
    return this.role === BOSS_ROLE;
} 

const User = mongoose.model('User', userSchema);
module.exports = User;