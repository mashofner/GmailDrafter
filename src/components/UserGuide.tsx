import React from 'react';
import { X, Mail, Sheet, Send, LogIn, ChevronRight } from 'lucide-react';

interface UserGuideProps {
  onClose: () => void;
}

const UserGuide: React.FC<UserGuideProps> = ({ onClose }) => {
  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/70">
      <div className="bg-card-bg border border-card-border rounded-xl shadow-xl max-w-3xl w-full max-h-[90vh] overflow-y-auto">
        <div className="sticky top-0 bg-comerian-dark p-4 flex justify-between items-center border-b border-card-border">
          <h2 className="text-lg sm:text-xl font-bold text-white">How to Use Gmail Drafter</h2>
          <button 
            onClick={onClose}
            className="text-comerian-gray hover:text-white transition-colors"
            aria-label="Close guide"
          >
            <X className="h-5 w-5" />
          </button>
        </div>
        
        <div className="p-4 sm:p-6">
          <div className="prose prose-invert max-w-none">
            <p className="text-comerian-gray text-sm sm:text-base">
              Gmail Drafter helps you create personalized email drafts in bulk using data from Google Sheets. 
              Follow these simple steps to get started:
            </p>
            
            <div className="mt-6 space-y-6 sm:space-y-8">
              <div className="flex flex-col sm:flex-row">
                <div className="flex-shrink-0 flex items-center justify-center w-10 h-10 rounded-full bg-comerian-teal/20 text-comerian-teal mb-3 sm:mb-0 sm:mr-4">
                  <LogIn className="h-5 w-5" />
                </div>
                <div>
                  <h3 className="text-base sm:text-lg font-medium text-white mb-2">Step 1: Sign in with Google</h3>
                  <p className="text-comerian-gray text-sm sm:text-base">
                    Click the "Sign in with Google" button to authenticate. This gives the app permission to:
                  </p>
                  <ul className="list-disc pl-5 mt-2 text-comerian-gray text-sm sm:text-base">
                    <li>Read your Google Sheets data</li>
                    <li>Create draft emails in your Gmail account</li>
                  </ul>
                  <p className="text-comerian-gray mt-2 text-sm sm:text-base">
                    <strong>Note:</strong> We never store your Google credentials. Your access token is kept in memory only during your active session.
                  </p>
                </div>
              </div>
              
              <div className="flex flex-col sm:flex-row">
                <div className="flex-shrink-0 flex items-center justify-center w-10 h-10 rounded-full bg-comerian-teal/20 text-comerian-teal mb-3 sm:mb-0 sm:mr-4">
                  <Sheet className="h-5 w-5" />
                </div>
                <div>
                  <h3 className="text-base sm:text-lg font-medium text-white mb-2">Step 2: Prepare your Google Sheet</h3>
                  <p className="text-comerian-gray text-sm sm:text-base">
                    Create a Google Sheet with your contact data. Make sure:
                  </p>
                  <ul className="list-disc pl-5 mt-2 text-comerian-gray text-sm sm:text-base">
                    <li>The first row contains column headers (these will be your variable names)</li>
                    <li>Each subsequent row contains data for one contact</li>
                    <li>The sheet is shared with anyone who has the link (view access)</li>
                    <li><strong>Include an "email" column</strong> with recipient email addresses - these will be used in the "To" field of your drafts</li>
                  </ul>
                  <p className="text-comerian-gray mt-2 text-sm sm:text-base">
                    Copy the URL of your Google Sheet and paste it in the "Load Google Sheet" field, then click "Load Sheet".
                  </p>
                </div>
              </div>
              
              <div className="flex flex-col sm:flex-row">
                <div className="flex-shrink-0 flex items-center justify-center w-10 h-10 rounded-full bg-comerian-teal/20 text-comerian-teal mb-3 sm:mb-0 sm:mr-4">
                  <Mail className="h-5 w-5" />
                </div>
                <div>
                  <h3 className="text-base sm:text-lg font-medium text-white mb-2">Step 3: Create your email template</h3>
                  <p className="text-comerian-gray text-sm sm:text-base">
                    Write your email template in the editor. Use variables from your sheet by enclosing column names in curly braces.
                  </p>
                  <div className="bg-comerian-dark p-3 rounded-md mt-2 text-white font-mono text-xs sm:text-sm">
                    Hi {'{name}'},<br/><br/>
                    
                    Thanks for your interest in our products at {'{company}'}. I'd like to schedule a call to discuss how we can help with your needs.<br/><br/>
                    
                    Best regards,<br/>
                    Your Name
                  </div>
                  <p className="text-comerian-gray mt-2 text-sm sm:text-base">
                    You can use the "Insert" buttons above the editor to easily add variables.
                  </p>
                  <p className="text-comerian-gray mt-2 text-sm sm:text-base">
                    <strong>Note:</strong> You don't need to include the recipient's email in your template - it will automatically be used in the "To" field of each draft.
                  </p>
                </div>
              </div>
              
              <div className="flex flex-col sm:flex-row">
                <div className="flex-shrink-0 flex items-center justify-center w-10 h-10 rounded-full bg-comerian-teal/20 text-comerian-teal mb-3 sm:mb-0 sm:mr-4">
                  <Send className="h-5 w-5" />
                </div>
                <div>
                  <h3 className="text-base sm:text-lg font-medium text-white mb-2">Step 4: Create your drafts</h3>
                  <p className="text-comerian-gray text-sm sm:text-base">
                    Click the "Create Drafts" button to generate personalized email drafts in your Gmail account. The app will:
                  </p>
                  <ul className="list-disc pl-5 mt-2 text-comerian-gray text-sm sm:text-base">
                    <li>Create one draft for each row in your sheet</li>
                    <li>Address each draft to the email address from the corresponding row</li>
                    <li>Replace variables with the corresponding data from each row</li>
                    <li>Save these as drafts in your Gmail account (they won't be sent automatically)</li>
                  </ul>
                  <p className="text-comerian-gray mt-2 text-sm sm:text-base">
                    You can then review and send these drafts from your Gmail account at your convenience.
                  </p>
                </div>
              </div>
            </div>
            
            <div className="mt-6 sm:mt-8 p-4 bg-comerian-teal/10 border border-comerian-teal/20 rounded-lg">
              <h3 className="text-base sm:text-lg font-medium text-white mb-2">Tips for Success</h3>
              <ul className="list-disc pl-5 text-comerian-gray text-sm sm:text-base">
                <li>Make sure your Google Sheet is properly formatted with headers in the first row</li>
                <li><strong>Always include an "email" column</strong> with recipient email addresses</li>
                <li>Preview your data in the "Sheet Data Preview" section before creating drafts</li>
                <li>Use the variable highlighting feature to ensure all variables are properly formatted</li>
                <li>Review your drafts in Gmail before sending them</li>
              </ul>
            </div>
            
            <div className="mt-6 sm:mt-8 text-center">
              <button
                onClick={onClose}
                className="px-6 py-2 bg-comerian-teal text-white font-medium rounded-md hover:bg-comerian-accent transition-colors"
              >
                Got it, let's get started!
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default UserGuide;