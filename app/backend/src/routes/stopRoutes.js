const express = require('express');
const router = express.Router({ mergeParams: true });
const stopController = require('../controllers/tripStopController');
const auth = require('../middleware/auth');

router.use(auth);

router.get('/', stopController.getStops);
router.post('/', stopController.addStop);
router.put('/:stopId', stopController.updateStop);
router.delete('/:stopId', stopController.deleteStop);
router.post('/:stopId/activities', stopController.addActivityToStop);
router.delete('/:stopId/activities/:activityId', stopController.deleteActivityFromStop);

module.exports = router;
