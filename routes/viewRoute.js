const express = require('express');

const router = express.Router();
const paginate = require('express-paginate');
const companyModel = require('../models/companyModel');
const viewController = require('../controllers/viewController');
const authController = require('../controllers/authController');

router.use(authController.isLoggedIn);
router.use(paginate.middleware(10, 10));
router.get('/', viewController.getCompany, async (req, res, next) => {
  try {
    const [results, itemCount] = await Promise.all([
      companyModel.find({}).limit(req.query.limit).skip(req.skip).lean().exec(),
      companyModel.count({}),
    ]);

    const pageCount = Math.ceil(itemCount / req.query.limit);

    if (req.accepts('json')) {
      // inspired by Stripe's API response for list objects
      res.json({
        object: 'list',
        has_more: paginate.hasNextPages(req)(pageCount),
        data: results,
      });
    } else {
      res.render('company', {
        company: results,
        pageCount,
        itemCount,
        pages: paginate.getArrayPages(req)(3, pageCount, req.query.page),
      });
    }
  } catch (err) {
    next(err);
  }
});

// router.get('/company', viewController.getCompany)
router.get('/login', viewController.login);
router.get(
  '/company/:slug',
  authController.isLoggedIn,
  viewController.getEmployees
);

module.exports = router;
