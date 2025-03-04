import React, { useState, useEffect } from 'react';
import { X, CheckCircle, AlertCircle, Mail } from 'lucide-react';

interface NotificationProps {
  message: string;
  type: 'success' | 'error';
  count?: number;
  onClose: () => void;
}

const Notification: React.FC<NotificationProps> = ({ 
  message, 
  type, 
  count,
  onClose 
}) => {
  const [isVisible, setIsVisible] = useState(true);
  const [isExiting, setIsExiting] = useState(false);

  // Auto-close after 8 seconds
  useEffect(() => {
    const timer = setTimeout(() => {
      handleClose();
    }, 8000);

    return () => clearTimeout(timer);
  }, []);

  const handleClose = () => {
    setIsExiting(true);
    setTimeout(() => {
      setIsVisible(false);
      onClose();
    }, 300); // Match the transition duration
  };

  if (!isVisible) return null;

  return (
    <div 
      className={`fixed top-24 right-6 z-50 max-w-md w-full transform transition-all duration-300 ${
        isExiting ? 'translate-x-full opacity-0' : 'translate-x-0 opacity-100'
      }`}
    >
      <div 
        className={`rounded-lg shadow-lg p-4 flex items-start ${
          type === 'success' 
            ? 'bg-gradient-to-r from-comerian-teal/90 to-comerian-teal/80 border border-comerian-teal/30' 
            : 'bg-gradient-to-r from-red-600/90 to-red-500/80 border border-red-400/30'
        }`}
      >
        <div className="flex-shrink-0 mr-3">
          {type === 'success' ? (
            <div className="bg-white/20 rounded-full p-2">
              <CheckCircle className="h-6 w-6 text-white" />
            </div>
          ) : (
            <div className="bg-white/20 rounded-full p-2">
              <AlertCircle className="h-6 w-6 text-white" />
            </div>
          )}
        </div>
        
        <div className="flex-1">
          <div className="flex justify-between items-start">
            <h3 className="text-lg font-semibold text-white">
              {type === 'success' ? 'Success!' : 'Error'}
            </h3>
            <button 
              onClick={handleClose}
              className="text-white/80 hover:text-white transition-colors"
            >
              <X className="h-5 w-5" />
            </button>
          </div>
          
          <p className="text-white/90 mt-1">{message}</p>
          
          {type === 'success' && count && (
            <div className="mt-3 flex items-center text-white/90">
              <Mail className="h-4 w-4 mr-2" />
              <span>
                {count} {count === 1 ? 'draft' : 'drafts'} created in Gmail
              </span>
            </div>
          )}
          
          {type === 'success' && (
            <div className="mt-3">
              <a 
                href="https://mail.google.com/mail/u/0/#drafts" 
                target="_blank" 
                rel="noopener noreferrer"
                className="inline-flex items-center px-3 py-1.5 bg-white/20 hover:bg-white/30 transition-colors rounded text-sm text-white font-medium"
              >
                View in Gmail
              </a>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default Notification;