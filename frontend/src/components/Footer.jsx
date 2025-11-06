import React from "react";

const Footer = () => {
  return (
    <footer className="bg-gray-900 text-gray-300 py-10 mt-auto border-t border-purple-500/20 relative">
      <div className="absolute inset-x-0 top-0 h-px bg-gradient-to-r from-transparent via-purple-500/50 to-transparent" />
      <div className="max-w-4xl mx-auto px-4">
        <div className="flex flex-wrap justify-center gap-8 mb-8">
          <a
            href="#/"
            className="text-sm hover:text-purple-400 transition-all duration-300 hover:translate-y-[-2px]"
          >
            Home
          </a>
          <span className="text-gray-700">•</span>
          <a
            href="#/privacy"
            className="text-sm hover:text-purple-400 transition-all duration-300 hover:translate-y-[-2px]"
          >
            Privacy
          </a>
          <span className="text-gray-700">•</span>
          <a
            href="#/terms"
            className="text-sm hover:text-purple-400 transition-all duration-300 hover:translate-y-[-2px]"
          >
            Terms
          </a>
          <span className="text-gray-700">•</span>
          <a
            href="mailto:contact@myblog.com"
            className="text-sm hover:text-purple-400 transition-all duration-300 hover:translate-y-[-2px]"
          >
            Contact
          </a>
        </div>
        <div className="text-center text-sm text-gray-500">
          © {new Date().getFullYear()} My Blog. All rights reserved.
        </div>
      </div>
    </footer>
  );
};

export default Footer;
