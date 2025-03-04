import React, { useState } from 'react';
import { MessageSquare, X, ThumbsUp, Lightbulb, Mail, Phone } from 'lucide-react';

interface FeedbackButtonProps {
  recipientEmail: string;
}

const FeedbackButton: React.FC<FeedbackButtonProps> = ({ recipientEmail }) => {
  const [isOpen, setIsOpen] = useState(false);

  const handleOpenFeedback = () => {
    setIsOpen(true);
  };

  const handleCloseFeedback = () => {
    setIsOpen(false);
  };

  const handleSendFeedback = () => {
    const subject = encodeURIComponent('Feedback for Gmail Drafter');
    const body = encodeURIComponent(
      'Hi,\n\nI have some feedback about the Gmail Drafter app:\n\n[Your feedback here]\n\nAlso, here are some other micro-SaaS ideas I\'d like to see:\n\n[Your ideas here]\n\n'
    );
    window.open(`mailto:${recipientEmail}?subject=${subject}&body=${body}`, '_blank');
    setIsOpen(false);
  };

  const handleSendText = () => {
    const message = encodeURIComponent(
      'Hi, I have feedback about the Gmail Drafter app: [Your feedback here]'
    );
    window.open(`sms:5017647572?body=${message}`, '_blank');
    setIsOpen(false);
  };

  return (
    <>
      <button
        onClick={handleOpenFeedback}
        className="fixed bottom-6 right-6 z-40 bg-comerian-accent text-white p-4 rounded-full shadow-lg hover:bg-comerian-teal transition-colors"
        aria-label="Provide feedback"
      >
        <MessageSquare className="h-6 w-6" />
      </button>

      {isOpen && (
        <div className="fixed inset-0 bg-black/70 flex items-center justify-center z-50 p-4">
          <div className="bg-card-bg border border-card-border rounded-lg shadow-xl max-w-md w-full p-6 relative">
            <button
              onClick={handleCloseFeedback}
              className="absolute top-4 right-4 text-comerian-gray hover:text-white"
              aria-label="Close feedback dialog"
            >
              <X className="h-5 w-5" />
            </button>
            
            <h3 className="text-2xl font-bold text-white mb-4 flex items-center">
              <ThumbsUp className="h-6 w-6 mr-3 text-comerian-accent" />
              We'd Love Your Feedback!
            </h3>
            
            <div className="bg-comerian-teal/10 border border-comerian-teal/30 rounded-lg p-4 mb-5">
              <p className="text-comerian-gray mb-3">
                This is a new micro-SaaS app and we're actively collecting feedback to improve it.
              </p>
              <p className="text-comerian-accent font-medium flex items-start">
                <Lightbulb className="h-5 w-5 mr-2 flex-shrink-0 mt-0.5" />
                <span>We'd also love to hear your ideas for other micro-SaaS tools that would be helpful to you!</span>
              </p>
            </div>
            
            <div className="space-y-3">
              <button
                onClick={handleSendFeedback}
                className="w-full py-3 px-4 bg-comerian-accent text-white rounded-md hover:bg-comerian-teal transition-colors flex items-center justify-center font-medium"
              >
                <Mail className="h-5 w-5 mr-2" />
                Send Feedback via Email
              </button>
              
              <button
                onClick={handleSendText}
                className="w-full py-3 px-4 bg-comerian-teal text-white rounded-md hover:bg-comerian-accent transition-colors flex items-center justify-center font-medium"
              >
                <Phone className="h-5 w-5 mr-2" />
                Send Feedback via Text
              </button>
              
              <p className="text-sm text-comerian-gray text-center mt-2">
                Your feedback helps us build better tools for you!
              </p>
            </div>
          </div>
        </div>
      )}
    </>
  );
};

export default FeedbackButton;