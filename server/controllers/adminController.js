const { User, Ebook, Payment, Subscription } = require('../models');
const { Op } = require('sequelize');
const logger = require('../utils/logger');

// @desc    Get system statistics
exports.getStats = async (req, res) => {
  try {
    const totalUsers = await User.count();
    const totalEbooks = await Ebook.count();
    const activeSubscriptions = await Subscription.count({
      where: { status: 'active' }
    });

    const totalRevenue = await Payment.sum('amount', {
      where: { status: 'succeeded' }
    });

    const recentUsers = await User.count({
      where: {
        created_at: {
          [Op.gte]: new Date(Date.now() - 30 * 24 * 60 * 60 * 1000)
        }
      }
    });

    const recentEbooks = await Ebook.count({
      where: {
        created_at: {
          [Op.gte]: new Date(Date.now() - 30 * 24 * 60 * 60 * 1000)
        }
      }
    });

    res.json({
      success: true,
      data: {
        totalUsers,
        totalEbooks,
        activeSubscriptions,
        totalRevenue: totalRevenue || 0,
        recentUsers,
        recentEbooks
      }
    });
  } catch (error) {
    logger.error('Get stats error:', error);
    res.status(500).json({
      success: false,
      message: 'Failed to fetch statistics'
    });
  }
};

// @desc    Get all users
exports.getUsers = async (req, res) => {
  try {
    const { page = 1, limit = 20, search, subscription_tier } = req.query;
    const offset = (page - 1) * limit;

    const where = {};
    
    if (search) {
      where[Op.or] = [
        { email: { [Op.like]: `%${search}%` } },
        { name: { [Op.like]: `%${search}%` } }
      ];
    }

    if (subscription_tier) {
      where.subscription_tier = subscription_tier;
    }

    const { count, rows: users } = await User.findAndCountAll({
      where,
      attributes: { exclude: ['password'] },
      order: [['created_at', 'DESC']],
      limit: parseInt(limit),
      offset: parseInt(offset)
    });

    res.json({
      success: true,
      data: users,
      pagination: {
        total: count,
        page: parseInt(page),
        pages: Math.ceil(count / limit)
      }
    });
  } catch (error) {
    logger.error('Get users error:', error);
    res.status(500).json({
      success: false,
      message: 'Failed to fetch users'
    });
  }
};

// @desc    Get single user
exports.getUser = async (req, res) => {
  try {
    const user = await User.findByPk(req.params.id, {
      attributes: { exclude: ['password'] },
      include: [
        {
          model: Ebook,
          as: 'ebooks'
        },
        {
          model: Subscription,
          as: 'subscriptions'
        }
      ]
    });

    if (!user) {
      return res.status(404).json({
        success: false,
        message: 'User not found'
      });
    }

    res.json({
      success: true,
      data: user
    });
  } catch (error) {
    logger.error('Get user error:', error);
    res.status(500).json({
      success: false,
      message: 'Failed to fetch user'
    });
  }
};

// @desc    Update user
exports.updateUser = async (req, res) => {
  try {
    const user = await User.findByPk(req.params.id);

    if (!user) {
      return res.status(404).json({
        success: false,
        message: 'User not found'
      });
    }

    const allowedUpdates = [
      'name', 'email', 'role', 'subscription_tier', 
      'credits_remaining', 'is_verified'
    ];

    const updates = {};
    allowedUpdates.forEach(field => {
      if (req.body[field] !== undefined) {
        updates[field] = req.body[field];
      }
    });

    await user.update(updates);

    res.json({
      success: true,
      data: user,
      message: 'User updated successfully'
    });
  } catch (error) {
    logger.error('Update user error:', error);
    res.status(500).json({
      success: false,
      message: 'Failed to update user'
    });
  }
};

// @desc    Delete user
exports.deleteUser = async (req, res) => {
  try {
    const user = await User.findByPk(req.params.id);

    if (!user) {
      return res.status(404).json({
        success: false,
        message: 'User not found'
      });
    }

    await user.destroy();

    res.json({
      success: true,
      message: 'User deleted successfully'
    });
  } catch (error) {
    logger.error('Delete user error:', error);
    res.status(500).json({
      success: false,
      message: 'Failed to delete user'
    });
  }
};

// @desc    Get all ebooks
exports.getAllEbooks = async (req, res) => {
  try {
    const { page = 1, limit = 20, status } = req.query;
    const offset = (page - 1) * limit;

    const where = {};
    if (status) {
      where.status = status;
    }

    const { count, rows: ebooks } = await Ebook.findAndCountAll({
      where,
      include: [{
        model: User,
        as: 'user',
        attributes: ['id', 'name', 'email']
      }],
      order: [['created_at', 'DESC']],
      limit: parseInt(limit),
      offset: parseInt(offset)
    });

    res.json({
      success: true,
      data: ebooks,
      pagination: {
        total: count,
        page: parseInt(page),
        pages: Math.ceil(count / limit)
      }
    });
  } catch (error) {
    logger.error('Get all ebooks error:', error);
    res.status(500).json({
      success: false,
      message: 'Failed to fetch ebooks'
    });
  }
};

// @desc    Get revenue statistics
exports.getRevenue = async (req, res) => {
  try {
    const { period = '30' } = req.query; // days
    const startDate = new Date(Date.now() - parseInt(period) * 24 * 60 * 60 * 1000);

    const payments = await Payment.findAll({
      where: {
        created_at: { [Op.gte]: startDate },
        status: 'succeeded'
      },
      order: [['created_at', 'ASC']]
    });

    const totalRevenue = payments.reduce((sum, p) => sum + parseFloat(p.amount), 0);
    const avgRevenue = payments.length > 0 ? totalRevenue / payments.length : 0;

    res.json({
      success: true,
      data: {
        totalRevenue,
        avgRevenue,
        transactionCount: payments.length,
        payments
      }
    });
  } catch (error) {
    logger.error('Get revenue error:', error);
    res.status(500).json({
      success: false,
      message: 'Failed to fetch revenue data'
    });
  }
};
