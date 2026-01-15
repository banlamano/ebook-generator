import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import apiClient from '../config/api';
import { useAuth } from '../context/AuthContext';
import Navbar from '../components/Navbar';
import Footer from '../components/Footer';
import { Check, Zap } from 'lucide-react';
import toast from 'react-hot-toast';

const Pricing = () => {
  const { user } = useAuth();
  const navigate = useNavigate();
  const [loading, setLoading] = useState(false);
  const [plans, setPlans] = useState(null);

  useEffect(() => {
    loadPlans();
  }, []);

  const loadPlans = async () => {
    try {
      const response = await apiClient.get('/api/subscriptions/plans');
      setPlans(response.data.data);
    } catch (error) {
      console.error('Failed to load plans:', error);
    }
  };

  const handleSubscribe = async (planType) => {
    if (!user) {
      navigate('/register');
      return;
    }

    if (planType === 'free') {
      toast.error('You are already on the free plan');
      return;
    }

    setLoading(true);

    try {
      const response = await apiClient.post('/api/subscriptions/create-checkout-session', {
        plan: planType
      });
      
      // Redirect to Stripe checkout
      window.location.href = response.data.data.url;
    } catch (error) {
      toast.error(error.response?.data?.message || 'Failed to create checkout session');
      setLoading(false);
    }
  };

  const planDetails = [
    {
      name: 'Free',
      price: 0,
      type: 'free',
      description: 'Perfect for trying out the platform',
      features: [
        '3 ebook generations',
        'Basic templates',
        'PDF export only',
        'Community support'
      ],
      cta: 'Get Started',
      highlighted: false
    },
    {
      name: 'Basic',
      price: 19,
      type: 'basic',
      description: 'Great for occasional creators',
      features: [
        '50 ebook generations/month',
        'All templates',
        'All export formats (PDF, EPUB, MOBI, DOCX)',
        'Email support',
        'Custom branding'
      ],
      cta: 'Start Basic',
      highlighted: false
    },
    {
      name: 'Pro',
      price: 49,
      type: 'pro',
      description: 'Best for professional authors',
      features: [
        'Unlimited ebook generations',
        'Priority AI generation',
        'All templates + custom templates',
        'All export formats',
        'Priority support',
        'API access',
        'Advanced analytics'
      ],
      cta: 'Start Pro',
      highlighted: true
    },
    {
      name: 'Enterprise',
      price: 199,
      type: 'enterprise',
      description: 'For teams and agencies',
      features: [
        'Everything in Pro',
        'White-label options',
        'Dedicated support',
        'Custom integrations',
        'SLA guarantee',
        'Team collaboration',
        'Volume discounts'
      ],
      cta: 'Start Enterprise',
      highlighted: false
    }
  ];

  return (
    <div className="min-h-screen bg-gray-50">
      <Navbar />

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-16">
        {/* Header */}
        <div className="text-center mb-16">
          <h1 className="text-5xl font-bold text-gray-900 mb-4">
            Simple, Transparent Pricing
          </h1>
          <p className="text-xl text-gray-600 max-w-2xl mx-auto">
            Choose the perfect plan for your ebook creation needs. All plans include AI-powered generation.
          </p>
        </div>

        {/* Pricing Cards */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8 mb-16">
          {planDetails.map((plan) => (
            <div
              key={plan.type}
              className={`rounded-2xl p-8 ${
                plan.highlighted
                  ? 'bg-gradient-to-br from-indigo-600 to-purple-600 text-white shadow-2xl transform scale-105'
                  : 'bg-white border-2 border-gray-200'
              }`}
            >
              {plan.highlighted && (
                <div className="flex items-center space-x-2 mb-4">
                  <Zap className="h-5 w-5 text-yellow-300" />
                  <span className="text-sm font-semibold text-yellow-300">MOST POPULAR</span>
                </div>
              )}
              
              <h3 className={`text-2xl font-bold mb-2 ${plan.highlighted ? 'text-white' : 'text-gray-900'}`}>
                {plan.name}
              </h3>
              
              <div className="mb-4">
                <span className={`text-5xl font-bold ${plan.highlighted ? 'text-white' : 'text-gray-900'}`}>
                  ${plan.price}
                </span>
                <span className={`text-lg ${plan.highlighted ? 'text-indigo-100' : 'text-gray-600'}`}>
                  /month
                </span>
              </div>

              <p className={`mb-6 ${plan.highlighted ? 'text-indigo-100' : 'text-gray-600'}`}>
                {plan.description}
              </p>

              <button
                onClick={() => handleSubscribe(plan.type)}
                disabled={loading || (user && user.subscription_tier === plan.type)}
                className={`w-full py-3 rounded-lg font-semibold transition ${
                  plan.highlighted
                    ? 'bg-white text-indigo-600 hover:bg-gray-100'
                    : 'bg-indigo-600 text-white hover:bg-indigo-700'
                } disabled:opacity-50 disabled:cursor-not-allowed`}
              >
                {user && user.subscription_tier === plan.type ? 'Current Plan' : plan.cta}
              </button>

              <ul className="mt-8 space-y-4">
                {plan.features.map((feature, index) => (
                  <li key={index} className="flex items-start">
                    <Check className={`h-5 w-5 mr-3 flex-shrink-0 ${
                      plan.highlighted ? 'text-green-300' : 'text-green-600'
                    }`} />
                    <span className={`text-sm ${plan.highlighted ? 'text-indigo-50' : 'text-gray-600'}`}>
                      {feature}
                    </span>
                  </li>
                ))}
              </ul>
            </div>
          ))}
        </div>

        {/* FAQ Section */}
        <div className="bg-white rounded-2xl p-8 border border-gray-200">
          <h2 className="text-3xl font-bold text-gray-900 mb-8 text-center">
            Frequently Asked Questions
          </h2>
          
          <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
            <div>
              <h3 className="text-lg font-semibold text-gray-900 mb-2">
                Can I change plans later?
              </h3>
              <p className="text-gray-600">
                Yes! You can upgrade or downgrade your plan at any time. Changes take effect immediately.
              </p>
            </div>

            <div>
              <h3 className="text-lg font-semibold text-gray-900 mb-2">
                What payment methods do you accept?
              </h3>
              <p className="text-gray-600">
                We accept all major credit cards through our secure Stripe payment processor.
              </p>
            </div>

            <div>
              <h3 className="text-lg font-semibold text-gray-900 mb-2">
                Is there a refund policy?
              </h3>
              <p className="text-gray-600">
                Yes, we offer a 14-day money-back guarantee on all paid plans. No questions asked.
              </p>
            </div>

            <div>
              <h3 className="text-lg font-semibold text-gray-900 mb-2">
                Do credits roll over?
              </h3>
              <p className="text-gray-600">
                No, unused credits reset at the start of each billing cycle. Pro and Enterprise plans have unlimited generations.
              </p>
            </div>
          </div>
        </div>
      </div>

      <Footer />
    </div>
  );
};

export default Pricing;
