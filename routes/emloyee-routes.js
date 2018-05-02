const express = require('express');
const employeeRouter  = express.Router();
const Employee = require("../models/employee-model");

// DISPLAY ALL THE Employees
// url: localhost:3000/employee
employeeRouter.get('/', (req, res, next) => {
    Employee.find()
    .then( responseFromDB => {
      
        res.render('employees/list-view', { employees: responseFromDB });
    } )
    .catch( error => {
        console.log("Error while displaying:", error );
    } )
});

// CREATE - GET ROUTE
// url: localhost:3000/empoyees/add-new
employeesRouter.get('/add-new', (req, res, next) => {
    // render follows the physical path (views/employees/new-view)
    res.render("employees/new-view")
})

// CREATE - POST ROUTE
// this page is what we put in the form in the action part
// url: localhost:3000/employees/create but this page won't be displayed because it's POST method
employeeRouter.post('/create', (req, res, next) => {
    const employeeUserName = req.body.theUserName;
 
    const employeeRole = req.body.theRole;
 
    const newEmployee = new Employee({
        username:employeeUserName,
        role: employeeRole,
       
    })
    newEmployee.save()
    .then(() => {
        // res.redirect just redirects the app to the certain page
        // res.redirect has "/" before, and res.render DOESN'T HAVE IT
        res.redirect('/employees');
    })
    .catch(err => {
        console.log("Error while saving: ", err)
    })
})

// EDIT - GET ROUTE
// url: localhost:3000/employees/edit/1234567890
employeeRouter.get('/edit/:id', (req, res, next) => {
    const employeeId = req.params.id;
    // console.log(employeeId);
    Employee.findById(employeeId)
    .then(employeeFromDB => {
        res.render("employees/edit-view", { employee: employeeFromDB })
    })
})

// EDIT - POST ROUTE
employeeRouter.post('/update/:id', (req, res, next) => {
    const employeeId = req.params.id;
    const editedUserName = req.body.editedUserName;
    const editedTole = req.body.editedRole;
    
    // console.log("editedName: ", editedName)
    Employee.findByIdAndUpdate(employeeId, {
        username: editedUserName,
        role:  editedRole
        
    })
    .then(() => {
        res.redirect(`/employees/${employeeId}`)
    })
    .catch( error => {
        console.log("Error while updating: ", error)
    })
})

// DELETE 
// url: localhost:3000/employees/1234567890/delete
// this route is post route so it won't be displayed, it's the action part of the delete form
employeeRouter.post('/:theId/delete', (req, res, next) => {
    const employeeId = req.params.theId;
    Employee.findByIdAndRemove(employeeId)
    .then(() => {
        res.redirect("/employees");
    })
    .catch( error => {
        console.log("Error while deleting: ", error)
    })
})

// DETAILS PAGE
// url: localhost:3000/employees/1234567890
employeeRouter.get('/:theId', (req, res, next) => {
    const employeeId = req.params.theId;
    // console.log(employeeId)
    Employee.findById(employeeId)
    .then(oneEmployeeFromDB => {
        // console.log(oneEmployeeFromDB)
        res.render('employees/details-view', { employee: oneEmployeeFromDB })
    })
    .catch( error => {
        console.log("Error while getting details: ", error)
    })
})

module.exports = employeeRouter;