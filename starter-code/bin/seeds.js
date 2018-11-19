const mongoose        = require("mongoose");
const AdminUser       = require("../models/Users");
const bcrypt          = require("bcrypt");


/////Conexión a mongoose
mongoose
  .connect('mongodb://localhost/passport-roles', {useNewUrlParser: true})
  .then(x => {
    console.log(`Connected to Mongo! Database name: "${x.connections[0].name}"`)
  })
  .catch(err => {
    console.error('Error connecting to mongo', err)
  });


/////Contraseñas.
const bossPasword = '123';

/////Hash
const saltRounds = 10;
const salt  = bcrypt.genSaltSync(saltRounds);
const hashBoss = bcrypt.hashSync(bossPasword, salt);

/////Employees creater.
  const boss = [
    {
      name: 'Jorge',
      password: hashBoss,
      role: 'Boss'
    }
  ];
/////Creaciones.
  AdminUser.create(boss)
    .then(user =>{  
      console.log(user);
      return mongoose.disconnect();

    })
    .then(()=>{ console.log("disconnect mongoDB")} )
    .catch(err =>{console.log(err)}) 
    