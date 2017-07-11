// Iteration #1
const User = require('../models/User');
const mongoose = require('mongoose');

// mongoose.Promise = Promise;

mongoose.connect("mongodb://localhost/ibi-ironhack")
        .then(() => {
          let boss = {
            username: "The Boss",
            password: "holaboss",
            role: "Boss"
          };


          let userBoss = new User(boss);

          userBoss.save((err, obj) => {
            if (err) {
              console.log(err);
            } else {
              console.log(`New user created
                    Named ${obj.username}
                    with ${obj.password} password
                    and ${obj.role} as role`);
            }
          });
        });
