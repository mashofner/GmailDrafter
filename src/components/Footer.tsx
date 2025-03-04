import React from 'react';
import { Mail, ExternalLink } from 'lucide-react';
import { Link } from 'react-router-dom';

export const Footer: React.FC = () => {
  return (
    <footer className="text-gray-400 py-6 sm:py-8 bg-gray-900/50 backdrop-blur-sm relative z-10">
      <div className="container mx-auto px-4 sm:px-6">
        <div className="flex flex-col sm:flex-row justify-between items-center">
          <div className="flex items-center space-x-2 mb-4 sm:mb-0">
            <Mail className="w-5 h-5 sm:w-6 sm:h-6 text-blue-400" />
            <span className="text-white font-bold text-sm sm:text-base">Comerian - Gmail Drafter</span>
          </div>
          <div className="flex items-center space-x-4 sm:space-x-6 text-xs sm:text-sm mt-2 sm:mt-0">
            <Link to="/privacy" className="text-comerian-teal hover:text-comerian-accent transition-colors">
              Privacy Policy
            </Link>
            <a 
              href="https://comeriandigital.net" 
              target="_blank" 
              rel="noopener noreferrer"
              className="text-comerian-teal hover:text-comerian-accent transition-colors flex items-center"
            >
              <span>Built by Comerian</span>
              <ExternalLink className="h-3 w-3 sm:h-3.5 sm:w-3.5 ml-1" />
            </a>
          </div>
        </div>
      </div>
    </footer>
  );
};

export default Footer;