import React, { useState, useEffect } from 'react';
import { BrowserRouter as Router, Routes, Route, Link } from 'react-router-dom';
import { Mail, Sheet, Send, LogIn, LogOut, ChevronRight, HelpCircle, ExternalLink } from 'lucide-react';
import SheetDataTable from './components/SheetDataTable';
import EmailTemplateEditor from './components/EmailTemplateEditor';
import { findVariablesInTemplate } from './utils/templateUtils';
import { createGmailDraft } from './services/gmailService';
import { loadSheetData } from './services/sheetService';
import { initAuth, signIn, signOut, onAuthStateChanged, AuthUser } from './services/authService';
import PrivacyPolicy from './pages/PrivacyPolicy';
import NeuralNetwork from './components/NeuralNetwork';
import Footer from './components/Footer';
import UserGuide from './components/UserGuide';
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
  const [showGuide, setShowGuide] = useState(false);

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
    <div className="min-h-screen bg-gradient-to-b from-gray-950 via-gray-900 to-gray-800 relative overflow-hidden">
      <div className="fixed inset-0 z-0 bg-gradient-to-tr from-blue-500/5 via-transparent to-purple-500/5">
        <NeuralNetwork />
      </div>
      
      <header className="bg-transparent backdrop-blur-sm relative z-10">
        <div className="max-w-7xl mx-auto px-6 py-6 sm:px-8 lg:px-10 flex justify-between items-center">
          <div className="flex items-center space-x-3">
            <Mail className="h-7 w-7 text-comerian-accent" />
            <h1 className="text-xl font-bold text-white">Comerian - Gmail Drafter</h1>
          </div>
          <div className="flex items-center space-x-6">
            {/* Comerian link - now more distinct */}
            <a 
              href="https://comeriandigital.net" 
              target="_blank" 
              rel="noopener noreferrer"
              className="px-3 py-1.5 rounded-md border border-comerian-teal/30 bg-comerian-teal/10 text-comerian-teal hover:bg-comerian-teal/20 transition-colors flex items-center"
            >
              <span>Built by Comerian</span>
              <ExternalLink className="h-3.5 w-3.5 ml-1.5" />
            </a>
            
            {/* Help button - now more distinct */}
            <button
              onClick={() => setShowGuide(!showGuide)}
              className="px-3 py-1.5 rounded-md border border-comerian-accent/30 bg-comerian-accent/10 text-comerian-accent hover:bg-comerian-accent/20 transition-colors flex items-center"
              aria-label="Show user guide"
            >
              <HelpCircle className="h-4 w-4 mr-1.5" />
              <span>Help</span>
            </button>
            
            {user && (
              <>
                <span className="text-sm font-medium text-comerian-accent">
                  Signed in as {user.email}
                </span>
                <button
                  onClick={handleSignOut}
                  className="inline-flex items-center px-3 py-1.5 border border-comerian-teal text-xs font-medium rounded-md text-white bg-transparent hover:bg-comerian-teal/20 transition-colors"
                >
                  <LogOut className="h-4 w-4 mr-1" />
                  Sign Out
                </button>
              </>
            )}
          </div>
        </div>
      </header>

      <main className="max-w-7xl mx-auto px-4 py-8 sm:px-6 lg:px-8 relative z-10">
        {/* User Guide */}
        {showGuide && <UserGuide onClose={() => setShowGuide(false)} />}
        
        {/* Notification messages */}
        {error && (
          <div className="mb-6 bg-red-900/30 border-l-4 border-red-500 p-4 rounded shadow-sm">
            <div className="flex">
              <div className="flex-shrink-0">
                <svg className="h-5 w-5 text-red-400" viewBox="0 0 20 20" fill="currentColor">
                  <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zM8.707 7.293a1 1 0 00-1.414 1.414L8.586 10l-1.293 1.293a1 1 0 101.414 1.414L10 11.414l1.293 1.293a1 1 0 001.414-1.414L11.414 10l1.293-1.293a1 1 0 00-1.414-1.414L10 8.586 8.707 7.293z" clipRule="evenodd" />
                </svg>
              </div>
              <div className="ml-3">
                <p className="text-sm text-red-200">{error}</p>
              </div>
            </div>
          </div>
        )}
        
        {success && (
          <div className="mb-6 bg-comerian-teal/10 border-l-4 border-comerian-teal p-4 rounded shadow-sm">
            <div className="flex">
              <div className="flex-shrink-0">
                <svg className="h-5 w-5 text-comerian-teal" viewBox="0 0 20 20" fill="currentColor">
                  <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z" clipRule="evenodd" />
                </svg>
              </div>
              <div className="ml-3">
                <p className="text-sm text-comerian-accent">{success}</p>
              </div>
            </div>
          </div>
        )}
        
        {!user ? (
          <div className="flex flex-col items-center justify-center py-12">
            <div className="text-center mb-10">
              <h2 className="text-3xl font-bold mb-4 text-white">
                Welcome to Gmail Drafter
              </h2>
              <p className="text-comerian-gray text-lg max-w-2xl mx-auto">
                Sign in with Google to create email drafts from your Google Sheets data
              </p>
            </div>
            
            <div className="flex flex-col items-center">
              <button
                onClick={handleSignIn}
                className="flex items-center px-8 py-3 bg-[#3b82f6] text-white font-medium rounded-md hover:shadow-lg transition-shadow btn-hover-effect"
              >
                <LogIn className="h-5 w-5 mr-2" />
                Sign in with Google
              </button>
              
              <div className="mt-4 text-center">
                <Link to="/privacy" className="text-sm text-comerian-teal hover:text-comerian-accent transition-colors">
                  Privacy Policy
                </Link>
              </div>
            </div>
          </div>
        ) : null}
        
        {/* Main app UI - shown to all users, but disabled for non-authenticated users */}
        <div className={`w-full max-w-4xl mx-auto ${!user ? 'opacity-50 pointer-events-none mt-12' : ''}`}>
          {/* Google Sheet URL input */}
          <div className="card mb-6">
            <h3 className="text-lg font-semibold text-white mb-4">Load Google Sheet</h3>
            <div className="flex space-x-4">
              <input
                type="text"
                value={sheetUrl}
                onChange={(e) => setSheetUrl(e.target.value)}
                placeholder="Paste Google Sheet URL here"
                className="flex-1 px-4 py-2 bg-comerian-dark border border-card-border rounded-md focus:ring-comerian-teal focus:border-comerian-teal text-white"
                disabled={!user || isLoading}
              />
              <button
                onClick={handleLoadSheet}
                disabled={isLoading || !sheetUrl || !user}
                className={`px-4 py-2 font-medium rounded-md flex items-center ${
                  isLoading || !sheetUrl || !user
                    ? 'bg-gray-700 text-gray-400 cursor-not-allowed'
                    : 'bg-[#3b82f6] text-white hover:bg-[#2563eb] transition-colors btn-hover-effect'
                }`}
              >
                {isLoading ? (
                  <>
                    <div className="animate-spin h-4 w-4 mr-2 border-t-2 border-b-2 border-white rounded-full"></div>
                    Loading...
                  </>
                ) : (
                  <>
                    <Sheet className="h-4 w-4 mr-2" />
                    Load Sheet
                  </>
                )}
              </button>
            </div>
            <p className="mt-2 text-sm text-comerian-gray">
              Your sheet should have column headers in the first row. These will be used as variables in your email template.
            </p>
          </div>
          
          {/* Sheet data table */}
          <div className="card mb-6">
            <h3 className="text-lg font-semibold text-white mb-4">Sheet Data Preview</h3>
            <SheetDataTable 
              headers={headers} 
              data={sheetData} 
              isLoading={isLoading}
            />
          </div>
          
          {/* Email template editor */}
          <div className="card">
            <h3 className="text-lg font-semibold text-white mb-4">Email Template</h3>
            {user && headers.length > 0 && (
              <p className="text-sm text-comerian-gray mb-2">
                Use variables like {'{name}'} to personalize your emails. Available variables: {' '}
                {headers.map(header => `{${header}}`).join(', ')}
              </p>
            )}
            <EmailTemplateEditor
              value={emailTemplate}
              onChange={setEmailTemplate}
              variables={variables}
              availableVariables={headers.length > 0 ? headers : ['name', 'email', 'company']}
              disabled={!user}
            />
            <button
              onClick={handleCreateDrafts}
              disabled={isLoading || !emailTemplate || sheetData.length === 0 || !user}
              className={`mt-4 px-6 py-2 font-medium rounded-md flex items-center ${
                isLoading || !emailTemplate || sheetData.length === 0 || !user
                  ? 'bg-gray-700 text-gray-400 cursor-not-allowed'
                  : 'bg-[#3b82f6] text-white hover:bg-[#2563eb] transition-shadow btn-hover-effect'
              }`}
            >
              {isLoading ? (
                <>
                  <div className="animate-spin h-4 w-4 mr-2 border-t-2 border-b-2 border-white rounded-full"></div>
                  Creating...
                </>
              ) : (
                <>
                  <Send className="h-4 w-4 mr-2" />
                  Create Drafts
                </>
              )}
            </button>
          </div>
        </div>
      </main>
      
      <Footer />
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