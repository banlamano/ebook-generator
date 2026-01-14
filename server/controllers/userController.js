const { User, Ebook, Payment } = require('../models');
const logger = require('../utils/logger');
const bcrypt = require('bcryptjs');

// @desc    Get user profile
exports.getProfile = async (req, res) => {
  try {
    const user = await User.findByPk(req.user.id, {
      attributes: { exclude: ['password'] }
    });

    res.json({
      success: true,
      data: user
    });
  } catch (error) {
    logger.error('Get profile error:', error);
    res.status(500).json({
      success: false,
      message: 'Failed to fetch profile'
    });
  }
};

// @desc    Update user profile
exports.updateProfile = async (req, res) => {
  try {
    const { name, email } = req.body;

    const user = await User.findByPk(req.user.id);

    const updates = {};
    if (name) updates.name = name;
    if (email && email !== user.email) {
      // Check if email already exists
      const existingUser = await User.findOne({ where: { email } });
      if (existingUser) {
        return res.status(400).json({
          success: false,
          message: 'Email already in use'
        });
      }
      updates.email = email;
      updates.is_verified = false;
    }

    await user.update(updates);

    res.json({
      success: true,
      data: user,
      message: 'Profile updated successfully'
    });
  } catch (error) {
    logger.error('Update profile error:', error);
    res.status(500).json({
      success: false,
      message: 'Failed to update profile'
    });
  }
};

// @desc    Change password
exports.changePassword = async (req, res) => {
  try {
    const { currentPassword, newPassword } = req.body;

    if (!currentPassword || !newPassword) {
      return res.status(400).json({
        success: false,
        message: 'Please provide current and new password'
      });
    }

    if (newPassword.length < 6) {
      return res.status(400).json({
        success: false,
        message: 'New password must be at least 6 characters'
      });
    }

    const user = await User.findByPk(req.user.id);

    // Verify current password
    const isValid = await user.comparePassword(currentPassword);
    if (!isValid) {
      return res.status(401).json({
        success: false,
        message: 'Current password is incorrect'
      });
    }

    // Update password
    await user.update({ password: newPassword });

    res.json({
      success: true,
      message: 'Password changed successfully'
    });
  } catch (error) {
    logger.error('Change password error:', error);
    res.status(500).json({
      success: false,
      message: 'Failed to change password'
    });
  }
};

// @desc    Get usage statistics
exports.getUsageStats = async (req, res) => {
  try {
    const ebookCount = await Ebook.count({
      where: { user_id: req.user.id }
    });

    const completedEbooks = await Ebook.count({
      where: {
        user_id: req.user.id,
        status: 'completed'
      }
    });

    const totalPayments = await Payment.sum('amount', {
      where: {
        user_id: req.user.id,
        status: 'succeeded'
      }
    });

    res.json({
      success: true,
      data: {
        totalEbooks: ebookCount,
        completedEbooks,
        creditsRemaining: req.user.credits_remaining,
        subscriptionTier: req.user.subscription_tier,
        totalSpent: totalPayments || 0
      }
    });
  } catch (error) {
    logger.error('Get usage stats error:', error);
    res.status(500).json({
      success: false,
      message: 'Failed to fetch usage statistics'
    });
  }
};
