const mongoose = require("mongoose");
const Course = require("../models/Course");

mongoose
  .connect("mongodb://localhost/alumhack", { useNewUrlParser: true })
  .then(x => console.log(`Connected to Mongo! Database name: "${x.connections[0].name}"`))
  .catch(err => console.error("Error connecting to mongo", err));

Course.deleteMany()
.then(()=>{
  const courses = [
    {
      title: "CRUD Creation from scratch",
      description: "Become a master of CRUD creation",
    },
    {
      title: "CRUD Creation from scratch VOL II",
      description: "Become a master of CRUD creation",
    },
    {
      title: "CRUD Creation from scratch VOL III",
      description: "Become a master of CRUD creation",
    },
  ];
  
  Course.insertMany(courses)

})

