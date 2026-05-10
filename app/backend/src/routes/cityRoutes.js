const express = require('express');
const router = express.Router();
const cityController = require('../controllers/cityController');

router.get('/', cityController.listCities);
router.get('/search', cityController.searchCities);
router.get('/:id', cityController.getCityById);

module.exports = router;
