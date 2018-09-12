const User = require('../models/user');

const boss = {
    username: "Albert",
    password: "al123456!",
    role: "Boss"
};

async function addBoss(obj) {
     const result = await User.create(obj);

     if(result) {
         console.log("Boss was added to database!");
     }

}

addBoss(boss);