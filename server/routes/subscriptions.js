const express = require('express');
const router = express.Router();
const subscriptionController = require('../controllers/subscriptionController');
const { protect } = require('../middleware/auth');

// @route   GET /api/subscriptions/plans
// @desc    Get subscription plans
// @access  Public
router.get('/plans', subscriptionController.getPlans);

// @route   POST /api/subscriptions/create-checkout-session
// @desc    Create Stripe checkout session
// @access  Private
router.post('/create-checkout-session', protect, subscriptionController.createCheckoutSession);

// @route   POST /api/subscriptions/webhook
// @desc    Handle Stripe webhooks
// @access  Public
router.post('/webhook', express.raw({ type: 'application/json' }), subscriptionController.handleWebhook);

// @route   GET /api/subscriptions/current
// @desc    Get current subscription
// @access  Private
router.get('/current', protect, subscriptionController.getCurrentSubscription);

// @route   POST /api/subscriptions/cancel
// @desc    Cancel subscription
// @access  Private
router.post('/cancel', protect, subscriptionController.cancelSubscription);

// @route   POST /api/subscriptions/reactivate
// @desc    Reactivate subscription
// @access  Private
router.post('/reactivate', protect, subscriptionController.reactivateSubscription);

module.exports = router;
