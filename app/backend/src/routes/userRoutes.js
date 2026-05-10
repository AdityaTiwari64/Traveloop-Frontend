const express = require('express');
const router = express.Router();
const userController = require('../controllers/userController');
const auth = require('../middleware/auth');
const upload = require('../middleware/upload');

router.use(auth);

router.get('/me', userController.getMe);
router.put('/me', upload.single('photo'), userController.updateMe);
router.delete('/me', userController.deleteMe);

router.get('/me/saved-destinations', userController.getSavedDestinations);
router.post('/me/saved-destinations', userController.addSavedDestination);
router.delete('/me/saved-destinations/:id', userController.deleteSavedDestination);

module.exports = router;
