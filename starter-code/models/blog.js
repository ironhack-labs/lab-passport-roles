// models/user.js
const mongoose = require("mongoose");
const Schema   = mongoose.Schema;

const schema = new Schema({
  name:String,
  title:String,
  category:String,
  tag:String,
  picture:String,
  text:String

}, {
  timestamps: { createdAt: "created_at", updatedAt: "updated_at" }
});

const Blog = mongoose.model("Blog", schema);

module.exports = Blog;