const { model, Schema } = require("mongoose");

const courseSchema = new Schema(
  {
    title: {
      type: String,
      unique: true,
      required: true
    },
    body: String,
    alumni: [Schema.Types.ObjectId]
  },
  {
    timestamps: true
  }
);

module.exports = model("Course", courseSchema);
