const stripe = require('stripe')(process.env.STRIPE_SECRET_KEY);
const { Subscription, Payment, User } = require('../models');
const logger = require('../utils/logger');

// Subscription plans
const PLANS = {
  free: {
    name: 'Free',
    price: 0,
    credits: 3,
    features: ['3 ebook generations', 'Basic templates', 'PDF export only']
  },
  basic: {
    name: 'Basic',
    price: 19,
    price_id: process.env.STRIPE_BASIC_PRICE_ID,
    credits: 50,
    features: ['50 ebook generations/month', 'All templates', 'All export formats', 'Email support']
  },
  pro: {
    name: 'Pro',
    price: 49,
    price_id: process.env.STRIPE_PRO_PRICE_ID,
    credits: 999999,
    features: ['Unlimited generations', 'Priority AI generation', 'Custom templates', 'Priority support', 'API access']
  },
  enterprise: {
    name: 'Enterprise',
    price: 199,
    price_id: process.env.STRIPE_ENTERPRISE_PRICE_ID,
    credits: 999999,
    features: ['Everything in Pro', 'White-label options', 'Dedicated support', 'Custom integrations', 'SLA guarantee']
  }
};

// @desc    Get subscription plans
exports.getPlans = async (req, res) => {
  try {
    res.json({
      success: true,
      data: PLANS
    });
  } catch (error) {
    logger.error('Get plans error:', error);
    res.status(500).json({
      success: false,
      message: 'Failed to fetch plans'
    });
  }
};

// @desc    Create Stripe checkout session
exports.createCheckoutSession = async (req, res) => {
  try {
    const { plan } = req.body;

    if (!PLANS[plan] || plan === 'free') {
      return res.status(400).json({
        success: false,
        message: 'Invalid plan selected'
      });
    }

    // Create or get Stripe customer
    let customerId = req.user.stripe_customer_id;
    
    if (!customerId) {
      const customer = await stripe.customers.create({
        email: req.user.email,
        metadata: {
          user_id: req.user.id
        }
      });
      customerId = customer.id;
      await User.update(
        { stripe_customer_id: customerId },
        { where: { id: req.user.id } }
      );
    }

    // Create checkout session
    const session = await stripe.checkout.sessions.create({
      customer: customerId,
      payment_method_types: ['card'],
      line_items: [
        {
          price: PLANS[plan].price_id,
          quantity: 1
        }
      ],
      mode: 'subscription',
      success_url: `${process.env.CLIENT_URL}/dashboard?success=true&session_id={CHECKOUT_SESSION_ID}`,
      cancel_url: `${process.env.CLIENT_URL}/pricing?canceled=true`,
      metadata: {
        user_id: req.user.id,
        plan: plan
      }
    });

    res.json({
      success: true,
      data: {
        sessionId: session.id,
        url: session.url
      }
    });
  } catch (error) {
    logger.error('Create checkout session error:', error);
    res.status(500).json({
      success: false,
      message: 'Failed to create checkout session'
    });
  }
};

// @desc    Handle Stripe webhooks
exports.handleWebhook = async (req, res) => {
  const sig = req.headers['stripe-signature'];
  let event;

  try {
    event = stripe.webhooks.constructEvent(
      req.body,
      sig,
      process.env.STRIPE_WEBHOOK_SECRET
    );
  } catch (err) {
    logger.error('Webhook signature verification failed:', err);
    return res.status(400).send(`Webhook Error: ${err.message}`);
  }

  try {
    switch (event.type) {
      case 'checkout.session.completed':
        await handleCheckoutCompleted(event.data.object);
        break;
      
      case 'invoice.payment_succeeded':
        await handlePaymentSucceeded(event.data.object);
        break;
      
      case 'customer.subscription.deleted':
        await handleSubscriptionDeleted(event.data.object);
        break;
      
      case 'customer.subscription.updated':
        await handleSubscriptionUpdated(event.data.object);
        break;
    }

    res.json({ received: true });
  } catch (error) {
    logger.error('Webhook handler error:', error);
    res.status(500).json({ error: 'Webhook handler failed' });
  }
};

// Handle checkout completed
async function handleCheckoutCompleted(session) {
  const userId = session.metadata.user_id;
  const plan = session.metadata.plan;

  // Create subscription
  await Subscription.create({
    user_id: userId,
    plan_type: plan,
    status: 'active',
    stripe_subscription_id: session.subscription,
    start_date: new Date(),
    renewal_date: new Date(Date.now() + 30 * 24 * 60 * 60 * 1000), // 30 days
    amount: PLANS[plan].price
  });

  // Update user
  await User.update(
    {
      subscription_tier: plan,
      credits_remaining: PLANS[plan].credits
    },
    { where: { id: userId } }
  );

  // Record payment
  await Payment.create({
    user_id: userId,
    stripe_payment_id: session.payment_intent,
    amount: PLANS[plan].price,
    status: 'succeeded',
    description: `Subscription: ${PLANS[plan].name}`
  });
}

// Handle payment succeeded
async function handlePaymentSucceeded(invoice) {
  const subscription = await stripe.subscriptions.retrieve(invoice.subscription);
  const userId = subscription.metadata.user_id;

  // Renew credits
  const user = await User.findByPk(userId);
  if (user) {
    await user.update({
      credits_remaining: PLANS[user.subscription_tier].credits
    });
  }
}

// Handle subscription deleted
async function handleSubscriptionDeleted(subscription) {
  await Subscription.update(
    { status: 'cancelled' },
    { where: { stripe_subscription_id: subscription.id } }
  );

  const sub = await Subscription.findOne({
    where: { stripe_subscription_id: subscription.id }
  });

  if (sub) {
    await User.update(
      {
        subscription_tier: 'free',
        credits_remaining: PLANS.free.credits
      },
      { where: { id: sub.user_id } }
    );
  }
}

// Handle subscription updated
async function handleSubscriptionUpdated(subscription) {
  await Subscription.update(
    {
      status: subscription.status,
      cancel_at_period_end: subscription.cancel_at_period_end
    },
    { where: { stripe_subscription_id: subscription.id } }
  );
}

// @desc    Get current subscription
exports.getCurrentSubscription = async (req, res) => {
  try {
    const subscription = await Subscription.findOne({
      where: {
        user_id: req.user.id,
        status: 'active'
      },
      order: [['created_at', 'DESC']]
    });

    res.json({
      success: true,
      data: subscription
    });
  } catch (error) {
    logger.error('Get subscription error:', error);
    res.status(500).json({
      success: false,
      message: 'Failed to fetch subscription'
    });
  }
};

// @desc    Cancel subscription
exports.cancelSubscription = async (req, res) => {
  try {
    const subscription = await Subscription.findOne({
      where: {
        user_id: req.user.id,
        status: 'active'
      }
    });

    if (!subscription) {
      return res.status(404).json({
        success: false,
        message: 'No active subscription found'
      });
    }

    // Cancel at period end
    await stripe.subscriptions.update(subscription.stripe_subscription_id, {
      cancel_at_period_end: true
    });

    await subscription.update({ cancel_at_period_end: true });

    res.json({
      success: true,
      message: 'Subscription will be cancelled at the end of the billing period'
    });
  } catch (error) {
    logger.error('Cancel subscription error:', error);
    res.status(500).json({
      success: false,
      message: 'Failed to cancel subscription'
    });
  }
};

// @desc    Reactivate subscription
exports.reactivateSubscription = async (req, res) => {
  try {
    const subscription = await Subscription.findOne({
      where: {
        user_id: req.user.id,
        status: 'active',
        cancel_at_period_end: true
      }
    });

    if (!subscription) {
      return res.status(404).json({
        success: false,
        message: 'No subscription to reactivate'
      });
    }

    await stripe.subscriptions.update(subscription.stripe_subscription_id, {
      cancel_at_period_end: false
    });

    await subscription.update({ cancel_at_period_end: false });

    res.json({
      success: true,
      message: 'Subscription reactivated successfully'
    });
  } catch (error) {
    logger.error('Reactivate subscription error:', error);
    res.status(500).json({
      success: false,
      message: 'Failed to reactivate subscription'
    });
  }
};
