const mongoose=require('mongoose');
const Schema=mongoose.Schema;

const courseSchema = new Schema ({
  name: String,
  startingDate: {Type: Date},
  endDate: {Type: Date},
  level: String,
  available: Boolean,
  alumni: [{type:Schema.Types.ObjectId, ref:'User'}],
},
  {
    timestamps: { createdAt: "created_at", updatedAt: "updated_at" }
});

const Course = mongoose.model('Course',courseSchema);

module.exports =Course;
