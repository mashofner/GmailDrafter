import React, { useState, useEffect } from 'react';
import { BrowserRouter as Router, Routes, Route, Link } from 'react-router-dom';
import { Mail, Sheet, Send, LogIn, LogOut } from 'lucide-react';
import SheetDataTable from './components/SheetDataTable';
import EmailTemplateEditor from './components/EmailTemplateEditor';
import { findVariablesInTemplate } from './utils/templateUtils';
import { createGmailDraft } from './services/gmailService';
import { loadSheetData } from './services/sheetService';
import { initAuth, signIn, signOut, onAuthStateChanged, AuthUser } from './services/authService';
import PrivacyPolicy from './pages/PrivacyPolicy';
import config from './config';

function HomePage() {
  const [user, setUser] = useState<AuthUser | null>(null);
  const [sheetUrl, setSheetUrl] = useState('');
  const [sheetData, setSheetData] = useState<any[]>([]);
  const [headers, setHeaders] = useState<string[]>([]);
  const [emailTemplate, setEmailTemplate] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState('');
  const [success, setSuccess] = useState('');

  // Initialize authentication
  useEffect(() => {
    if (config.debug) console.log('Initializing authentication');
    
    // Small delay to ensure DOM is fully loaded
    setTimeout(() => {
      initAuth();
      
      // Listen for authentication state changes
      const unsubscribe = onAuthStateChanged((authUser) => {
        setUser(authUser);
        if (authUser) {
          setSuccess('Successfully signed in!');
          setTimeout(() => setSuccess(''), 3000);
        }
      });
      
      // Cleanup function
      return () => {
        if (typeof unsubscribe === 'function') unsubscribe();
      };
    }, 100);
  }, []);

  const handleSignIn = () => {
    setError(''); // Clear any previous errors
    try {
      signIn();
    } catch (err: any) {
      setError(err.message || 'Failed to sign in');
    }
  };

  const handleSignOut = () => {
    signOut();
    setSuccess('Successfully signed out');
    setTimeout(() => setSuccess(''), 3000);
  };

  const handleLoadSheet = async () => {
    if (!sheetUrl) {
      setError('Please enter a Google Sheet URL');
      return;
    }

    setIsLoading(true);
    setError('');
    
    try {
      const result = await loadSheetData(sheetUrl);
      setHeaders(result.headers);
      setSheetData(result.data);
      setSuccess('Sheet loaded successfully!');
      setTimeout(() => setSuccess(''), 3000);
    } catch (err: any) {
      setError(err.message || 'Failed to load sheet data');
    } finally {
      setIsLoading(false);
    }
  };

  const handleCreateDrafts = async () => {
    if (!emailTemplate) {
      setError('Please enter an email template');
      return;
    }

    if (sheetData.length === 0) {
      setError('Please load a sheet first');
      return;
    }

    if (!user?.accessToken) {
      setError('Authentication required. Please sign in again.');
      return;
    }

    setIsLoading(true);
    setError('');
    
    try {
      let successCount = 0;
      
      for (const contact of sheetData) {
        let emailContent = emailTemplate;
        
        // Replace variables in template
        Object.keys(contact).forEach(key => {
          const regex = new RegExp(`{${key}}`, 'g');
          emailContent = emailContent.replace(regex, contact[key]);
        });
        
        // Create draft
        await createGmailDraft(user.accessToken, {
          to: contact.email || '',
          subject: 'Draft Email', // Could be customizable
          message: emailContent
        });
        
        successCount++;
      }
      
      setSuccess(`${successCount} drafts created successfully!`);
      setTimeout(() => setSuccess(''), 5000);
    } catch (err: any) {
      setError(err.message || 'Failed to create drafts');
    } finally {
      setIsLoading(false);
    }
  };

  // Find variables in the template to highlight
  const variables = findVariablesInTemplate(emailTemplate);

  return (
    <div className="min-h-screen bg-gray-50">
      <header className="bg-white shadow-sm">
        <div className="max-w-7xl mx-auto px-4 py-4 sm:px-6 lg:px-8 flex justify-between items-center">
          <div className="flex items-center space-x-2">
            <Mail className="h-6 w-6 text-blue-600" />
            <h1 className="text-xl font-bold text-gray-900">Gmail Drafter</h1>
          </div>
          {user && (
            <div className="flex items-center space-x-4">
              <span className="text-sm text-green-600 font-medium">
                Signed in as {user.email}
              </span>
              <button
                onClick={handleSignOut}
                className="inline-flex items-center px-3 py-1.5 border border-gray-300 text-xs font-medium rounded-md text-gray-700 bg-white hover:bg-gray-50"
              >
                <LogOut className="h-4 w-4 mr-1" />
                Sign Out
              </button>
            </div>
          )}
        </div>
      </header>

      <main className="max-w-7xl mx-auto px-4 py-8 sm:px-6 lg:px-8">
        {/* Notification messages */}
        {error && (
          <div className="mb-6 bg-red-50 border-l-4 border-red-500 p-4">
            <div className="flex">
              <div className="flex-shrink-0">
                <svg className="h-5 w-5 text-red-400" viewBox="0 0 20 20" fill="currentColor">
                  <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zM8.707 7.293a1 1 0 00-1.414 1.414L8.586 10l-1.293 1.293a1 1 0 101.414 1.414L10 11.414l1.293 1.293a1 1 0 001.414-1.414L11.414 10l1.293-1.293a1 1 0 00-1.414-1.414L10 8.586 8.707 7.293z" clipRule="evenodd" />
                </svg>
              </div>
              <div className="ml-3">
                <p className="text-sm text-red-700">{error}</p>
              </div>
            </div>
          </div>
        )}
        
        {success && (
          <div className="mb-6 bg-green-50 border-l-4 border-green-500 p-4">
            <div className="flex">
              <div className="flex-shrink-0">
                <svg className="h-5 w-5 text-green-400" viewBox="0 0 20 20" fill="currentColor">
                  <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z" clipRule="evenodd" />
                </svg>
              </div>
              <div className="ml-3">
                <p className="text-sm text-green-700">{success}</p>
              </div>
            </div>
          </div>
        )}
        
        {/* Sign-in section */}
        {!user ? (
          <div className="flex flex-col items-center justify-center py-12">
            <div className="text-center mb-8">
              <h2 className="text-2xl font-bold text-gray-900 mb-2">Welcome to Gmail Drafter</h2>
              <p className="text-gray-600">Sign in with Google to create email drafts from your Google Sheets data</p>
            </div>
            <button
              onClick={handleSignIn}
              className="flex items-center px-6 py-3 bg-blue-600 text-white font-medium rounded-md hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2"
            >
              <LogIn className="h-5 w-5 mr-2" />
              Sign in with Google
            </button>
            
            <div className="mt-2">
              <Link to="/privacy" className="text-sm text-blue-600 hover:text-blue-800">
                Privacy Policy
              </Link>
            </div>
            
            {/* Grayed out UI preview */}
            <div className="mt-12 w-full max-w-4xl opacity-50 pointer-events-none">
              <div className="bg-white shadow rounded-lg p-6 mb-6">
                <h3 className="text-lg font-medium text-gray-900 mb-4">Load Google Sheet</h3>
                <div className="flex space-x-4">
                  <input
                    type="text"
                    placeholder="Paste Google Sheet URL here"
                    className="flex-1 px-4 py-2 border border-gray-300 rounded-md"
                    disabled
                  />
                  <button
                    className="px-4 py-2 bg-green-600 text-white font-medium rounded-md"
                    disabled
                  >
                    <Sheet className="h-4 w-4 inline mr-2" />
                    Load Sheet
                  </button>
                </div>
              </div>
              
              <div className="bg-white shadow rounded-lg p-6 mb-6">
                <h3 className="text-lg font-medium text-gray-900 mb-4">Sheet Data Preview</h3>
                <div className="border border-gray-200 rounded-md overflow-hidden">
                  <table className="min-w-full divide-y divide-gray-200">
                    <thead className="bg-gray-50">
                      <tr>
                        <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Name</th>
                        <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Email</th>
                        <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Company</th>
                      </tr>
                    </thead>
                    <tbody className="bg-white divide-y divide-gray-200">
                      <tr>
                        <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">John Doe</td>
                        <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">john@example.com</td>
                        <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">Acme Inc</td>
                      </tr>
                    </tbody>
                  </table>
                </div>
              </div>
              
              <div className="bg-white shadow rounded-lg p-6">
                <h3 className="text-lg font-medium text-gray-900 mb-4">Email Template</h3>
                <textarea
                  placeholder="Hi {name}, ..."
                  className="w-full px-4 py-2 border border-gray-300 rounded-md h-40"
                  disabled
                ></textarea>
                <button
                  className="mt-4 px-6 py-2 bg-purple-600 text-white font-medium rounded-md"
                  disabled
                >
                  <Send className="h-4 w-4 inline mr-2" />
                  Create Drafts
                </button>
              </div>
            </div>
          </div>
        ) : (
          /* Main app UI when signed in */
          <div>
            {/* Google Sheet URL input */}
            <div className="bg-white shadow rounded-lg p-6 mb-6">
              <h2 className="text-lg font-medium text-gray-900 mb-4">Load Google Sheet</h2>
              <div className="flex space-x-4">
                <input
                  type="text"
                  value={sheetUrl}
                  onChange={(e) => setSheetUrl(e.target.value)}
                  placeholder="Paste Google Sheet URL here"
                  className="flex-1 px-4 py-2 border border-gray-300 rounded-md focus:ring-blue-500 focus:border-blue-500"
                />
                <button
                  onClick={handleLoadSheet}
                  disabled={isLoading || !sheetUrl}
                  className={`px-4 py-2 font-medium rounded-md flex items-center ${
                    isLoading || !sheetUrl
                      ? 'bg-gray-300 text-gray-500 cursor-not-allowed'
                      : 'bg-green-600 text-white hover:bg-green-700'
                  }`}
                >
                  <Sheet className="h-4 w-4 mr-2" />
                  {isLoading ? 'Loading...' : 'Load Sheet'}
                </button>
              </div>
            </div>
            
            {/* Sheet data table */}
            {headers.length > 0 && (
              <div className="bg-white shadow rounded-lg p-6 mb-6">
                <h2 className="text-lg font-medium text-gray-900 mb-4">Sheet Data Preview</h2>
                <SheetDataTable headers={headers} data={sheetData} />
              </div>
            )}
            
            {/* Email template editor */}
            <div className="bg-white shadow rounded-lg p-6">
              <h2 className="text-lg font-medium text-gray-900 mb-4">Email Template</h2>
              <p className="text-sm text-gray-500 mb-2">
                Use variables like {'{name}'} to personalize your emails. Available variables: {' '}
                {headers.map(header => `{${header}}`).join(', ')}
              </p>
              <EmailTemplateEditor
                value={emailTemplate}
                onChange={setEmailTemplate}
                variables={variables}
                availableVariables={headers}
              />
              <button
                onClick={handleCreateDrafts}
                disabled={isLoading || !emailTemplate || sheetData.length === 0}
                className={`mt-4 px-6 py-2 font-medium rounded-md flex items-center ${
                  isLoading || !emailTemplate || sheetData.length === 0
                    ? 'bg-gray-300 text-gray-500 cursor-not-allowed'
                    : 'bg-purple-600 text-white hover:bg-purple-700'
                }`}
              >
                <Send className="h-4 w-4 mr-2" />
                {isLoading ? 'Creating...' : 'Create Drafts'}
              </button>
            </div>
          </div>
        )}
      </main>
      
      <footer className="bg-white border-t border-gray-200 mt-12">
        <div className="max-w-7xl mx-auto px-4 py-6 sm:px-6 lg:px-8">
          <p className="text-sm text-gray-500 text-center">
            Gmail Drafter © {new Date().getFullYear()} | Create email drafts from Google Sheets
            {' | '}
            <Link to="/privacy" className="text-blue-600 hover:text-blue-800">
              Privacy Policy
            </Link>
          </p>
        </div>
      </footer>
    </div>
  );
}

function App() {
  return (
    <Router>
      <Routes>
        <Route path="/" element={<HomePage />} />
        <Route path="/privacy" element={<PrivacyPolicy />} />
      </Routes>
    </Router>
  );
}

export default App;