const mongoose = require("mongoose");
const Schema = mongoose.Schema;

const courseSchema = new Schema ({
    title : {
        type: String,
        required : true,
        unique : true
    },
    type : {
        type: String,
        enum : [
            "Part Time",
            "Full Time"
        ],
    },
    location : {
        type : String,
        enum : [
            "Madrid",
            "Barcelona"
        ]
    }
})

const courseModel = mongoose.model("courses", courseSchema);
module.exports = courseModel