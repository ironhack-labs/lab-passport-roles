const mongoose = require("mongoose");
const Schema = mongoose.Schema;

const courseSchema = new Schema({
    name: {
        type: String,
    },
    type: {
        type: String,
        enum: [
            "Web",
            "Data",
            "UX"
        ],
    }
})

const courseModel = mongoose.model("courses", courseSchema);
module.exports = courseModel