const express = require('express');
const router = express.Router();
const userController = require('../controllers/userController');
const { protect } = require('../middleware/auth');

// All routes are protected
router.use(protect);

// @route   GET /api/user/profile
// @desc    Get user profile
// @access  Private
router.get('/profile', userController.getProfile);

// @route   PUT /api/user/profile
// @desc    Update user profile
// @access  Private
router.put('/profile', userController.updateProfile);

// @route   PUT /api/user/password
// @desc    Change password
// @access  Private
router.put('/password', userController.changePassword);

// @route   GET /api/user/usage
// @desc    Get usage statistics
// @access  Private
router.get('/usage', userController.getUsageStats);

module.exports = router;
