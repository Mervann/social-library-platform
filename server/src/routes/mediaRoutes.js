const express = require('express');
const router = express.Router();
const mediaController = require('../controllers/mediaController');
const auth = require('../middleware/authMiddleware');

router.get('/search', auth, mediaController.searchMedia);
router.get('/showcase', auth, mediaController.getShowcase);
router.get('/details/:type/:id', auth, mediaController.getContentDetails);

module.exports = router;
