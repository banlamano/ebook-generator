import React from 'react';
import { Link } from 'react-router-dom';
import Navbar from '../components/Navbar';
import Footer from '../components/Footer';
import { BookOpen, Zap, Download, Edit3, Sparkles, CheckCircle, ArrowRight } from 'lucide-react';

const Landing = () => {
  const features = [
    {
      icon: <Sparkles className="h-8 w-8 text-indigo-600" />,
      title: "AI-Powered Generation",
      description: "Let AI create professional ebook content in minutes, not months."
    },
    {
      icon: <Edit3 className="h-8 w-8 text-indigo-600" />,
      title: "Rich Text Editor",
      description: "Edit and customize your ebook with our powerful built-in editor."
    },
    {
      icon: <Download className="h-8 w-8 text-indigo-600" />,
      title: "Multiple Formats",
      description: "Export to PDF, EPUB, MOBI, and DOCX with one click."
    },
    {
      icon: <BookOpen className="h-8 w-8 text-indigo-600" />,
      title: "Template Library",
      description: "Choose from dozens of pre-built templates for any niche."
    },
    {
      icon: <Zap className="h-8 w-8 text-indigo-600" />,
      title: "Lightning Fast",
      description: "Generate complete ebooks in under 10 minutes."
    },
    {
      icon: <CheckCircle className="h-8 w-8 text-indigo-600" />,
      title: "Professional Quality",
      description: "AI-generated content that reads naturally and engages readers."
    }
  ];

  const steps = [
    {
      number: "01",
      title: "Choose a Topic",
      description: "Select your ebook topic and customize parameters like tone, length, and audience."
    },
    {
      number: "02",
      title: "AI Generates Content",
      description: "Our AI creates a complete outline and generates high-quality content for each chapter."
    },
    {
      number: "03",
      title: "Edit & Customize",
      description: "Use our rich text editor to refine and personalize your ebook."
    },
    {
      number: "04",
      title: "Export & Share",
      description: "Download in your preferred format and start selling or sharing immediately."
    }
  ];

  return (
    <div className="min-h-screen bg-white">
      <Navbar />

      {/* Hero Section */}
      <section className="relative overflow-hidden bg-gradient-to-br from-indigo-50 via-white to-purple-50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-20 md:py-32">
          <div className="text-center">
            <h1 className="text-5xl md:text-6xl lg:text-7xl font-bold text-gray-900 mb-6">
              Create Professional Ebooks
              <span className="block gradient-text">With AI in Minutes</span>
            </h1>
            <p className="text-xl text-gray-600 mb-8 max-w-3xl mx-auto">
              Transform your ideas into complete, professionally-formatted ebooks using the power of AI. 
              No writing experience required.
            </p>
            <div className="flex flex-col sm:flex-row gap-4 justify-center items-center">
              <Link
                to="/register"
                className="bg-indigo-600 text-white px-8 py-4 rounded-lg text-lg font-semibold hover:bg-indigo-700 transition flex items-center space-x-2"
              >
                <span>Start Creating Free</span>
                <ArrowRight className="h-5 w-5" />
              </Link>
              <Link
                to="/pricing"
                className="border-2 border-indigo-600 text-indigo-600 px-8 py-4 rounded-lg text-lg font-semibold hover:bg-indigo-50 transition"
              >
                View Pricing
              </Link>
            </div>
            <p className="mt-4 text-sm text-gray-500">
              No credit card required • 3 free ebooks to start
            </p>
          </div>
        </div>
      </section>

      {/* Features Section */}
      <section id="features" className="py-20 bg-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-16">
            <h2 className="text-4xl font-bold text-gray-900 mb-4">
              Everything You Need to Create Amazing Ebooks
            </h2>
            <p className="text-xl text-gray-600">
              Powerful features that make ebook creation effortless
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
            {features.map((feature, index) => (
              <div
                key={index}
                className="p-6 bg-white border border-gray-200 rounded-xl hover:shadow-lg transition card-hover"
              >
                <div className="mb-4">{feature.icon}</div>
                <h3 className="text-xl font-semibold text-gray-900 mb-2">
                  {feature.title}
                </h3>
                <p className="text-gray-600">{feature.description}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* How It Works */}
      <section className="py-20 bg-gray-50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-16">
            <h2 className="text-4xl font-bold text-gray-900 mb-4">
              How It Works
            </h2>
            <p className="text-xl text-gray-600">
              Four simple steps to your complete ebook
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
            {steps.map((step, index) => (
              <div key={index} className="relative">
                <div className="bg-white p-6 rounded-xl border border-gray-200 h-full">
                  <div className="text-5xl font-bold text-indigo-100 mb-4">
                    {step.number}
                  </div>
                  <h3 className="text-xl font-semibold text-gray-900 mb-2">
                    {step.title}
                  </h3>
                  <p className="text-gray-600">{step.description}</p>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="py-20 bg-indigo-600">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
          <h2 className="text-4xl font-bold text-white mb-4">
            Ready to Create Your First Ebook?
          </h2>
          <p className="text-xl text-indigo-100 mb-8">
            Join thousands of authors creating professional ebooks with AI
          </p>
          <Link
            to="/register"
            className="inline-block bg-white text-indigo-600 px-8 py-4 rounded-lg text-lg font-semibold hover:bg-gray-100 transition"
          >
            Get Started Now - It's Free
          </Link>
        </div>
      </section>

      <Footer />
    </div>
  );
};

export default Landing;
