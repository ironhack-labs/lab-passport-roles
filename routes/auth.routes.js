const express = require('express');
const User = require('../models/User.model')
const router = express.Router();

/* GET home page */
router.get('/plataform-admin', async (req, res) => {
    try{
        let employess = await User.find({accessLevel:{$not:/BOSS/}})
        res.render('plataform-admin',{employess})
    }catch(error){
        console.log(error)
    }
});

router.post('/new-employee', async (req, res) => {
    try{
        const {username,password,name,accessLevel} =req.body

        const newUser = new User({ name, username, password, accessLevel });
        await newUser.save();
    
        res.render('plataform-admin')
    }catch(error){
        console.log(error)

        if (error.message.includes('required')) {
            res.render('/plataform-admin', { errorMessage: 'Por favor, preencha todos os campos' });
            return;
          }
      
          if (error.message.includes('username')) {
            res.render('/plataform-admin', { errorMessage: 'Usuário já cadastrado. Por favor escolha outro nome de usuário' });
            return;
          }
    }
});


module.exports = router;
