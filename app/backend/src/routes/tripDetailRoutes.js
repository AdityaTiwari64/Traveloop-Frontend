const express = require('express');
const router = express.Router({ mergeParams: true });
const budgetController = require('../controllers/budgetController');
const packingController = require('../controllers/packingController');
const noteController = require('../controllers/noteController');
const auth = require('../middleware/auth');

router.use(auth);

// Budget
router.get('/budget', budgetController.getBudget);
router.put('/budget', budgetController.updateBudget);
router.get('/budget/alerts', budgetController.getBudgetAlerts);

// Packing
router.get('/packing', packingController.getPackingList);
router.post('/packing', packingController.addItem);
router.put('/packing/:itemId', packingController.updateItem);
router.delete('/packing/:itemId', packingController.deleteItem);

// Notes
router.get('/notes', noteController.getNotes);
router.post('/notes', noteController.addNote);
router.put('/notes/:noteId', noteController.updateNote);
router.delete('/notes/:noteId', noteController.deleteNote);

module.exports = router;
