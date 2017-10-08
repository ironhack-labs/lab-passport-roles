const mongoose = require('mongoose');
const mongoDB = "mongodb://localhost/ibi-ironhack";
mongoose.connect(mongoDB, {useMongoClient: true});
const Schema = mongoose.Schema;

const courseSchema = new Schema({
  name: String,
  startingDate: Date,
  endDate: Date,
  level: {
    type: String,
    enum: ["Beginner", "Advanced"]
  },
  available: Boolean,
});

const Course = mongoose.model("Course", courseSchema);

module.exports = Course;
