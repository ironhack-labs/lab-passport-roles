const mongoose = require("mongoose");
const Schema = mongoose.Schema;

const courseSchema = new Schema(
    {
        name: String,
        startingDate: Date,
        endDate:Date,
        level:String,
        available:Boolean

    }
    );

module.exports = mongoose.model("Course", courseSchema);

