const express = require('express');
const User = require('../models/User.model')
const router = express.Router();


router.get('/home', async (req, res) => {
    const {user} = req 
    try{
        let employees = await User.find({_id:{$ne:user._id}})
        res.render('home',{user,employees})
    }catch(error){
        console.log(error)
        res.render('/login')
    }
});


router.get('/edit/:id', async (req, res) => {
    const {id} = req.params 
    try{
        const employee = await User.findById({ _id: id});
        console.log(employee)
        res.render('edit-profile',employee)
    }catch(error){
        console.log(error)
        res.render('home',{_id:id})
    }
});

router.post('/edit/:id', async (req, res) => {
    const {id} = req.params 
    const { password, name, email} = req.body
    try{
        console.log(req.body)
        const employee = await User.findById({ _id: id});
        if(password){
            employee.password = password
        }
        if(name){
            employee.name =name
        }
        if(email && email!==''){
            employee.email = email
        }
        await employee.save()

        res.render('edit-profile',employee)
    }catch(error){
        console.log(error)
        res.redirect(`/edit/${id}`)
    }
});



module.exports = router;
