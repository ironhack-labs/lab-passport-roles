const mongoose = require("mongoose");
const Schema = mongoose.Schema;

const UserSchema = new Schema({
    username: String,
    name: String,
    familyName: String,
    password: String,
    role: {
        type: String,
        enum: ['Boss', 'Developer', 'TA'],
        default: 'Guest'
     }} ,{
        timestamps: { createdAt: "created_at", updatedAt: "updated_at" }
    });

const User = mongoose.model("User", UserSchema);

module.exports = User;