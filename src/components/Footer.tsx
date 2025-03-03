import React from 'react';
import { Mail, ExternalLink } from 'lucide-react';
import { Link } from 'react-router-dom';

export const Footer: React.FC = () => {
  return (
    <footer className="text-gray-400 py-8 sm:py-12 bg-gray-900/50 backdrop-blur-sm relative z-10">
      <div className="container mx-auto px-4 sm:px-6">
        <div className="flex flex-col sm:flex-row justify-between items-center">
          <div className="flex items-center space-x-2 mb-4 sm:mb-0">
            <Mail className="w-6 h-6 text-blue-400" />
            <span className="text-white font-bold">Comerian - Gmail Drafter</span>
          </div>
          <div className="flex items-center space-x-6 text-sm mt-4 sm:mt-0">
            <Link to="/privacy" className="text-comerian-teal hover:text-comerian-accent transition-colors">
              Privacy Policy
            </Link>
            <a 
              href="https://comeriandigital.net" 
              target="_blank" 
              rel="noopener noreferrer"
              className="text-comerian-teal hover:text-comerian-accent transition-colors flex items-center"
            >
              <span>Comerian Digital</span>
              <ExternalLink className="h-3.5 w-3.5 ml-1" />
            </a>
          </div>
        </div>
      </div>
    </footer>
  );
};

export default Footer;