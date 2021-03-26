const express = require('express');

const router = express.Router(); // a route middleware

const employeeController = require('../controllers/employeeController');

router
  .route('/')
  .get(employeeController.getAllEmployee)
  .post(employeeController.createEmployee);

router
  .route('/:id')
  .get(employeeController.getEmployee)
  .patch(employeeController.updateEmployee)
  .delete(employeeController.deleteEmployee);

module.exports = router;
