const express = require('express');

const router = express.Router(); // a route middleware

const userController = require('../controllers/userController');
const authController = require('../controllers/authController')

router.post('/signup', authController.signup)
router.post('/login', authController.login)
router.get('/logout', authController.logout)


// router.use(authController.restrictTo('admin'));
router
  .route('/')
  .get(userController.getAllUser)
  .post(userController.createUser);

router
  .route('/:id')
  .get(userController.getUser)
  .patch(userController.updateUser)
  .delete(userController.deleteUser);

module.exports = router;
