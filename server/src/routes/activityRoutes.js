const express = require('express');
const router = express.Router();
const activityController = require('../controllers/activityController');
const auth = require('../middleware/authMiddleware');

router.get('/feed', auth, activityController.getFeed);
router.post('/', auth, activityController.createActivity);
router.get('/user/:userId', auth, activityController.getUserActivities);

// Like & Comment Routes
router.post('/:id/like', auth, activityController.toggleLike);
router.post('/:id/comment', auth, activityController.addComment);

module.exports = router;
