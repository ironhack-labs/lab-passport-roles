const mongoose  = require("mongoose");
const Schema = mongoose.Schema;

const userSchema = new Schema({
    name: String,
    pwd: String,
    role: {type:String, enum:["Boss","Developer","TA"]}
})

module.exports = mongoose.model("user",userSchema)