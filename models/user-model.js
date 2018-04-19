const mongoose = require( "mongoose" );

const Schema = mongoose.Schema;

const userSchema = new Schema({
    name: { type: String, required: true },
    password: { type: String, required: true },
    role: {
        type: String,
        required: true,
        enum: [ "Boss", "developer", "TA" ]
    }
}, {
    timestamps: true
});

userSchema.virtual( "isBoss").get( function() {
    return this.role === "Boss";
})

const User = mongoose.model( "User", userSchema );

module.exports = User;