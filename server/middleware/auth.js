const jwt = require('jsonwebtoken');
const { User } = require('../models');

// Protect routes - verify JWT token
exports.protect = async (req, res, next) => {
  let token;

  if (req.headers.authorization && req.headers.authorization.startsWith('Bearer')) {
    token = req.headers.authorization.split(' ')[1];
  }

  if (!token) {
    return res.status(401).json({
      success: false,
      message: 'Not authorized to access this route'
    });
  }

  try {
    const decoded = jwt.verify(token, process.env.JWT_SECRET);
    req.user = await User.findByPk(decoded.id, {
      attributes: { exclude: ['password'] }
    });

    if (!req.user) {
      return res.status(401).json({
        success: false,
        message: 'User not found'
      });
    }

    next();
  } catch (error) {
    return res.status(401).json({
      success: false,
      message: 'Invalid or expired token'
    });
  }
};

// Role authorization
exports.authorize = (...roles) => {
  return (req, res, next) => {
    if (!roles.includes(req.user.role)) {
      return res.status(403).json({
        success: false,
        message: `User role ${req.user.role} is not authorized to access this route`
      });
    }
    next();
  };
};

// Check subscription tier
exports.checkSubscription = (...tiers) => {
  return (req, res, next) => {
    if (!tiers.includes(req.user.subscription_tier)) {
      return res.status(403).json({
        success: false,
        message: 'Upgrade your subscription to access this feature'
      });
    }
    next();
  };
};

// Check credits
exports.checkCredits = async (req, res, next) => {
  if (req.user.subscription_tier === 'pro' || req.user.subscription_tier === 'enterprise') {
    return next();
  }

  if (req.user.credits_remaining <= 0) {
    return res.status(403).json({
      success: false,
      message: 'Insufficient credits. Please upgrade your plan or purchase more credits.'
    });
  }

  next();
};
