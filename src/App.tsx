import React, { useState, useEffect, useCallback } from 'react';
import { Mail, Sheet, Send, LogIn } from 'lucide-react';
import SheetDataTable from './components/SheetDataTable';
import EmailTemplateEditor from './components/EmailTemplateEditor';
import { findVariablesInTemplate } from './utils/templateUtils';
import { createGmailDraft } from './services/gmailService';
import { loadSheetData } from './services/sheetService';
import config from './config';

function App() {
  const [isSignedIn, setIsSignedIn] = useState(false);
  const [accessToken, setAccessToken] = useState('');
  const [sheetUrl, setSheetUrl] = useState('');
  const [sheetData, setSheetData] = useState<any[]>([]);
  const [headers, setHeaders] = useState<string[]>([]);
  const [emailTemplate, setEmailTemplate] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState('');
  const [success, setSuccess] = useState('');
  const [googleScriptLoaded, setGoogleScriptLoaded] = useState(false);

  // Initialize Google Identity Services
  useEffect(() => {
    const loadGoogleIdentity = () => {
      if (config.debug) console.log('Loading Google Identity Services...');
      const script = document.createElement('script');
      script.src = 'https://accounts.google.com/gsi/client';
      script.async = true;
      script.defer = true;
      script.onload = () => {
        if (config.debug) console.log('Google Identity Services loaded');
        setGoogleScriptLoaded(true);
      };
      script.onerror = (e) => {
        console.error('Failed to load Google Identity Services', e);
        setError('Failed to load Google authentication. Please try refreshing the page.');
      };
      document.body.appendChild(script);
    };

    loadGoogleIdentity();
  }, []);

  const initializeGoogleIdentity = useCallback(() => {
    if (!window.google) {
      console.error('Google client not available');
      setError('Google authentication is not available. Please try refreshing the page.');
      return;
    }
    
    if (!config.googleClientId) {
      console.error('Google client ID not set');
      setError('Google Client ID is missing. Please check your environment variables.');
      return;
    }

    if (config.debug) console.log('Initializing Google Identity with client ID:', config.googleClientId);
    
    try {
      window.google.accounts.id.initialize({
        client_id: config.googleClientId,
        callback: handleCredentialResponse,
      });

      window.google.accounts.oauth2.initTokenClient({
        client_id: config.googleClientId,
        scope: 'https://www.googleapis.com/auth/gmail.compose',
        callback: (tokenResponse: any) => {
          if (config.debug) console.log('Token received');
          setAccessToken(tokenResponse.access_token);
          setIsSignedIn(true);
        },
      });
      
      if (config.debug) console.log('Google Identity initialized successfully');
    } catch (err) {
      console.error('Error initializing Google Identity:', err);
      setError('Failed to initialize Google authentication. Please try again.');
    }
  }, []);

  useEffect(() => {
    if (googleScriptLoaded) {
      // Add a small delay to ensure Google API is fully loaded
      const timer = setTimeout(() => {
        initializeGoogleIdentity();
      }, 500);
      
      return () => clearTimeout(timer);
    }
  }, [googleScriptLoaded, initializeGoogleIdentity]);

  const handleCredentialResponse = (response: any) => {
    if (config.debug) console.log('Credential response received');
    // Request Gmail API access
    if (window.google?.accounts.oauth2) {
      window.google.accounts.oauth2.requestAccessToken({
        client_id: config.googleClientId,
        scope: 'https://www.googleapis.com/auth/gmail.compose',
      });
    } else {
      console.error('OAuth2 not available after authentication');
      setError('Authentication error. Please try again.');
    }
  };

  const handleSignIn = () => {
    if (config.debug) console.log('Sign in button clicked');
    
    if (!window.google) {
      console.error('Google API not loaded');
      setError('Google authentication is not available. Please try refreshing the page.');
      return;
    }
    
    if (!window.google.accounts.oauth2) {
      console.error('Google OAuth not available');
      setError('Google authentication is not available. Please try refreshing the page.');
      return;
    }
    
    try {
      window.google.accounts.oauth2.requestAccessToken({
        client_id: config.googleClientId,
        scope: 'https://www.googleapis.com/auth/gmail.compose',
      });
    } catch (err) {
      console.error('Error requesting access token:', err);
      setError('Failed to authenticate with Google. Please try again.');
    }
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
        await createGmailDraft(accessToken, {
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
          {isSignedIn && (
            <span className="text-sm text-green-600 font-medium">Signed in with Google</span>
          )}
        </div>
      </header>

      <main className="max-w-7xl mx-auto px-4 py-8 sm:px-6 lg:px-8">
        {/* Sign-in section */}
        {!isSignedIn ? (
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
          </p>
        </div>
      </footer>
    </div>
  );
}

export default App;