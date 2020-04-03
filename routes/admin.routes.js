const express = require('express');
const User = require('../models/User.model')
const router = express.Router();

/* GET home page */
router.get('/plataform-admin', async (req, res) => {
    try{
        let employees = await User.find({accessLevel:{$not:/BOSS/}})
        res.render('plataform-admin',{employees})
    }catch(error){
        console.log(error)
    }
});

router.post('/new-employee', async (req, res) => {
    try{
        const {username,password,name,accessLevel} =req.body

        const newUser = new User({ name, username, password, accessLevel });
        await newUser.save();
    
        res.redirect('/admin/plataform-admin')
    }catch(error){
        console.log(error)

        if (error.message.includes('required')) {
            res.render('plataform-admin', { errorMessage: 'Por favor, preencha todos os campos' });
            return;
          }
      
          if (error.message.includes('username')) {
            res.render('plataform-admin', { errorMessage: 'Usuário já cadastrado. Por favor escolha outro nome de usuário' });
            return;
          }
    }
});

router.get('/employee/:id', async (req, res) => {
    try{
        const {id} = req.params 
        let employee = await User.findById(id)
        res.render('employee-detail',employee)
    }catch(error){
        console.log(error)
        res.redirect('/admin/plataform-admin')
    }
});

router.post('/update-employee/:id', async (req, res) => {
    try{
        const {accessLevel} =req.body
        const {id} = req.params

        const employee = await User.findById(id);
        employee.accessLevel=accessLevel
        await employee.save();
    
        res.redirect('/admin/plataform-admin')
    }catch(error){
        console.log(error)
    }
});

router.get('/deletar/:id', async (req, res) => {
    try{
        const {id} = req.params 
        await User.deleteOne({ _id: id});
        res.redirect('/admin/plataform-admin')
    }catch(error){
        console.log(error)
        res.redirect('/admin/plataform-admin')
    }
});



module.exports = router;
