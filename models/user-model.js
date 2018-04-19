const mongoose = require('mongoose');
const Schema = mongoose.Schema;

const userSchema = new Schema ({
    fullName: {type: String, required: true},
    email: {type: String, required: true},
    encryptedPassword: {type : String},
    role: {
        type: String,
        enum: ["Boss", "Developer", "TA"],
        default: "Developer"
    }
}, {
    timestamps: true
});

userSchema.virtual("isBoss").get(function(){
    return this.role === "Boss";
});

userSchema.virtual("isTA").get(function(){
    return this.role === "TA";
});

const User = mongoose.model("User", userSchema);

module.exports = User;