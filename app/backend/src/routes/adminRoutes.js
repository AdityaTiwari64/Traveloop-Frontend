const express = require('express');
const router = express.Router();
const adminController = require('../controllers/adminController');
const auth = require('../middleware/auth');
const admin = require('../middleware/admin');

router.use(auth);
router.use(admin);

router.get('/stats', adminController.getStats);
router.get('/users', adminController.listAllUsers);
router.get('/trips', adminController.listAllTrips);

module.exports = router;
