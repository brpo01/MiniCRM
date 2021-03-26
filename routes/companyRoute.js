const express = require('express');

const router = express.Router(); // a route middleware

const companyController = require('../controllers/companyController');
// const employeeRouter = require('./employeeRoute')

//NESTED ROUTES
// router.use('/:companyId/employees', employeeRouter);


router
  .route('/')
  .get(companyController.getAllCompany)
  .post(companyController.createCompany);

router
  .route('/:id')
  .get(companyController.getCompany)
  .patch(companyController.updateCompany)
  .delete(companyController.deleteCompany);

module.exports = router;
