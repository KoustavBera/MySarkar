import {
  Phone,
  Mail,
  MapPin,
  Facebook,
  Twitter,
  Linkedin,
  Instagram,
  ArrowRightIcon,
  Shield,
  Globe,
  FileText,
} from "lucide-react";
import React from "react";
import { Link } from "react-router-dom";

export const Footer = () => {
  return (
    <footer className="w-full bg-purple-50 border-t-4 border-purple-800 mt-20">
      {/* Newsletter Section */}
      <div className="max-w-6xl mx-auto px-4 py-12">
        <div className="bg-gradient-to-r from-purple-600  to-blue-600 border-2 border-b-4 border-r-4 border-purple-800 rounded-2xl p-8 text-center text-white mb-12">
          <h3 className="text-2xl font-bold mb-4">
            Stay Updated with Government Schemes
          </h3>
          <p className="mb-6 opacity-90">
            Get notified about new schemes and updates directly in your inbox
          </p>
          <div className="flex flex-col text-white sm:flex-row gap-4 justify-center max-w-md mx-auto">
            <input
              type="email"
              placeholder="Enter your email"
              className="flex-1 px-4 py-3 border-2 border-b-4 border-r-4 border-purple-800 bg-white rounded-lg  text-gray-800 focus:outline-none focus:ring-2 focus:ring-purple-300"
            />
            <button className="bg-white text-purple-700 hover:bg-gray-100 font-bold py-3 px-6 rounded-lg border-2 border-b-4 border-r-4 border-purple-800 transition duration-200 inline-flex items-center gap-2">
              Subscribe
              <ArrowRightIcon size={16} />
            </button>
          </div>
        </div>

        {/* Main Footer Content */}
        <div className="grid grid-cols-1 lg:grid-cols-4 gap-8 mb-8">
          {/* Company Info */}
          <div className="bg-white border-2 border-b-4 border-r-4 border-purple-800 rounded-2xl p-6">
            <h3 className="text-2xl font-bold text-purple-800 mb-4">
              MySarkar
            </h3>
            <p className="text-gray-600 mb-4 text-sm">
              Simplifying government processes with AI-powered assistance. Your
              trusted partner for navigating schemes and services.
            </p>
            <div className="bg-purple-100 rounded-full px-3 py-1 text-xs font-semibold text-purple-800 inline-block">
              Easing accessibility since 2025
            </div>
          </div>

          {/* Quick Links */}
          <div className="bg-white border-2 border-b-4 border-r-4 border-purple-800 rounded-2xl p-6">
            <h4 className="font-bold text-purple-800 mb-4 text-lg">
              Quick Links
            </h4>
            <div className="space-y-3">
              {[
                { name: "Home", path: "/" },
                { name: "Schemes", path: "/scheme" },
                { name: "Document Scanner", path: "/scan" },
                { name: "AI Assistant", path: "/apply" },
                { name: "Help Center", path: "/help" },
              ].map((link, index) => (
                <Link
                  key={index}
                  to={link.path}
                  className="block text-gray-600 hover:text-purple-700 text-sm transition duration-200 hover:translate-x-1"
                >
                  {link.name}
                </Link>
              ))}
            </div>
          </div>

          {/* Services */}
          <div className="bg-white border-2 border-b-4 border-r-4 border-purple-800 rounded-2xl p-6">
            <h4 className="font-bold text-purple-800 mb-4 text-lg">
              Our Services
            </h4>
            <div className="space-y-3">
              {[
                { icon: Globe, name: "Scheme Discovery" },
                { icon: FileText, name: "Document Digitization" },
                { icon: Shield, name: "Secure Storage" },
                { name: "Multilingual Support" },
                { name: "Voice Assistant" },
                { name: "Application Tracking" },
              ].map((service, index) => (
                <div
                  key={index}
                  className="flex items-center gap-2 text-gray-600 text-sm"
                >
                  {service.icon && (
                    <service.icon size={16} className="text-purple-600" />
                  )}
                  <span>{service.name}</span>
                </div>
              ))}
            </div>
          </div>

          {/* Contact Info */}
          <div className="bg-white border-2 border-b-4 border-r-4 border-purple-800 rounded-2xl p-6">
            <h4 className="font-bold text-purple-800 mb-4 text-lg">
              Contact Us
            </h4>
            <div className="space-y-4">
              <div className="flex items-center gap-3">
                <div className="bg-purple-100 p-2 rounded-lg">
                  <Phone className="text-purple-700" size={16} />
                </div>
                <div>
                  <div className="text-gray-800 font-medium text-sm">
                    1800-123-4567
                  </div>
                  <div className="text-gray-500 text-xs">
                    Mon-Fri, 9 AM - 6 PM
                  </div>
                </div>
              </div>

              <div className="flex items-center gap-3">
                <div className="bg-purple-100 p-2 rounded-lg">
                  <Mail className="text-purple-700" size={16} />
                </div>
                <div>
                  <div className="text-gray-800 font-medium text-sm">
                    support@mysarkar.gov.in
                  </div>
                  <div className="text-gray-500 text-xs">
                    24/7 email support
                  </div>
                </div>
              </div>

              <div className="flex items-center gap-3">
                <div className="bg-purple-100 p-2 rounded-lg">
                  <MapPin className="text-purple-700" size={16} />
                </div>
                <div>
                  <div className="text-gray-800 font-medium text-sm">
                    Kolkata, West Bengal
                  </div>
                  <div className="text-gray-500 text-xs">
                    Service Centers Available
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Social Media & Bottom Section */}
        <div className="border-t-2 border-purple-300 pt-8">
          <div className="flex flex-col md:flex-row justify-between items-center gap-6">
            {/* Social Media */}
            <div className="flex items-center gap-4">
              <span className="text-gray-600 font-medium">Follow us:</span>
              <div className="flex gap-3">
                {[
                  {
                    icon: Facebook,
                    bgColor: "bg-blue-100",
                    hoverColor: "hover:bg-blue-200",
                  },
                  {
                    icon: Twitter,
                    bgColor: "bg-sky-100",
                    hoverColor: "hover:bg-sky-200",
                  },
                  {
                    icon: Linkedin,
                    bgColor: "bg-blue-100",
                    hoverColor: "hover:bg-blue-200",
                  },
                  {
                    icon: Instagram,
                    bgColor: "bg-pink-100",
                    hoverColor: "hover:bg-pink-200",
                  },
                ].map((social, index) => (
                  <button
                    key={index}
                    className={`${social.bgColor} ${social.hoverColor} border-2 border-b-4 border-r-4 border-purple-800 p-3 rounded-lg transition duration-200 hover:translate-y-[-2px]`}
                  >
                    <social.icon className="text-purple-700" size={20} />
                  </button>
                ))}
              </div>
            </div>

            {/* Legal Links */}
            <div className="flex flex-wrap gap-6 text-sm">
              {[
                "Privacy Policy",
                "Terms of Service",
                "Cookie Policy",
                "Accessibility",
              ].map((link, index) => (
                <Link
                  key={index}
                  to={`/${link.toLowerCase().replace(/\s+/g, "-")}`}
                  className="text-gray-600 hover:text-purple-700 transition duration-200"
                >
                  {link}
                </Link>
              ))}
            </div>
          </div>

          {/* Copyright */}
          <div className="mt-8 pt-6 border-t border-purple-200 text-center">
            <div className="flex flex-col md:flex-row justify-between items-center gap-4">
              <p className="text-gray-600 text-sm">
                © 2025 MySarkar. All rights reserved. | Government of India
                Initiative
              </p>
              <div className="flex items-center gap-4 text-xs text-gray-500">
                <span className="bg-green-100 border border-green-300 px-2 py-1 rounded-full">
                  🟢 All systems operational
                </span>
                <span>Last updated: August 2025</span>
              </div>
            </div>
          </div>
        </div>
      </div>
    </footer>
  );
};
