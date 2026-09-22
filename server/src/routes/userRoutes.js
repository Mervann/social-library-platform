const express = require('express');
const router = express.Router();
const userController = require('../controllers/userController');
const auth = require('../middleware/authMiddleware');

router.get('/search', auth, userController.searchUsers);
router.put('/profile', auth, userController.updateProfile);
router.get('/:id', auth, userController.getProfile);
router.post('/:id/follow', auth, userController.followUser);
router.delete('/:id/follow', auth, userController.unfollowUser);

module.exports = router;
