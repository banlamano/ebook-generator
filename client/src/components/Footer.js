import React from 'react';
import { Link } from 'react-router-dom';
import { BookOpen, Mail, Twitter, Linkedin, Github } from 'lucide-react';

const Footer = () => {
  return (
    <footer className="bg-gray-900 text-gray-300">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        <div className="grid grid-cols-1 md:grid-cols-4 gap-8">
          {/* Brand */}
          <div className="col-span-1">
            <div className="flex items-center space-x-2 mb-4">
              <BookOpen className="h-8 w-8 text-indigo-400" />
              <span className="text-xl font-bold text-white">AI Ebook Generator</span>
            </div>
            <p className="text-sm text-gray-400">
              Create professional ebooks in minutes with the power of AI. No writing experience required.
            </p>
          </div>

          {/* Product */}
          <div>
            <h3 className="text-white font-semibold mb-4">Product</h3>
            <ul className="space-y-2">
              <li>
                <Link to="/pricing" className="text-sm hover:text-white transition">
                  Pricing
                </Link>
              </li>
              <li>
                <Link to="/templates" className="text-sm hover:text-white transition">
                  Templates
                </Link>
              </li>
              <li>
                <a href="#features" className="text-sm hover:text-white transition">
                  Features
                </a>
              </li>
              <li>
                <a href="#" className="text-sm hover:text-white transition">
                  API Documentation
                </a>
              </li>
            </ul>
          </div>

          {/* Company */}
          <div>
            <h3 className="text-white font-semibold mb-4">Company</h3>
            <ul className="space-y-2">
              <li>
                <a href="#" className="text-sm hover:text-white transition">
                  About Us
                </a>
              </li>
              <li>
                <a href="#" className="text-sm hover:text-white transition">
                  Blog
                </a>
              </li>
              <li>
                <a href="#" className="text-sm hover:text-white transition">
                  Careers
                </a>
              </li>
              <li>
                <a href="#" className="text-sm hover:text-white transition">
                  Contact
                </a>
              </li>
            </ul>
          </div>

          {/* Legal */}
          <div>
            <h3 className="text-white font-semibold mb-4">Legal</h3>
            <ul className="space-y-2">
              <li>
                <a href="#" className="text-sm hover:text-white transition">
                  Privacy Policy
                </a>
              </li>
              <li>
                <a href="#" className="text-sm hover:text-white transition">
                  Terms of Service
                </a>
              </li>
              <li>
                <a href="#" className="text-sm hover:text-white transition">
                  Cookie Policy
                </a>
              </li>
              <li>
                <a href="#" className="text-sm hover:text-white transition">
                  Refund Policy
                </a>
              </li>
            </ul>
          </div>
        </div>

        <div className="border-t border-gray-800 mt-8 pt-8 flex flex-col md:flex-row justify-between items-center">
          <p className="text-sm text-gray-400">
            © 2024 AI Ebook Generator. All rights reserved.
          </p>
          <div className="flex space-x-6 mt-4 md:mt-0">
            <a href="#" className="text-gray-400 hover:text-white transition">
              <Twitter className="h-5 w-5" />
            </a>
            <a href="#" className="text-gray-400 hover:text-white transition">
              <Linkedin className="h-5 w-5" />
            </a>
            <a href="#" className="text-gray-400 hover:text-white transition">
              <Github className="h-5 w-5" />
            </a>
            <a href="#" className="text-gray-400 hover:text-white transition">
              <Mail className="h-5 w-5" />
            </a>
          </div>
        </div>
      </div>
    </footer>
  );
};

export default Footer;
