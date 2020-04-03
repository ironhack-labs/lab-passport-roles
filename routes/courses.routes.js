const express = require('express');
const Course = require('../models/Course.model')
const router = express.Router();
const User = require('../models/User.model')


router.get('/new', async (req, res) => {
    try{
        const {user} = req
        if(user.accessLevel==='TA'){
            return res.render('new-courses')
        }
        let employees = await User.find({_id:{$ne:user._id}})

        return res.redirect('home',{user,errorMessage:'Você não está autorizado a criar cursos',employees})
    }catch(error){
        console.log(error)
    }
});


module.exports = router;
