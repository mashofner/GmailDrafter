import React from 'react';
import { ArrowLeft } from 'lucide-react';
import { Link } from 'react-router-dom';

const PrivacyPolicy: React.FC = () => {
  return (
    <div className="min-h-screen bg-gray-50">
      <header className="bg-white shadow-sm">
        <div className="max-w-7xl mx-auto px-4 py-4 sm:px-6 lg:px-8">
          <div className="flex items-center">
            <Link to="/" className="flex items-center text-blue-600 hover:text-blue-800">
              <ArrowLeft className="h-5 w-5 mr-2" />
              Back to Home
            </Link>
          </div>
        </div>
      </header>

      <main className="max-w-4xl mx-auto px-4 py-8 sm:px-6 lg:px-8">
        <div className="bg-white shadow rounded-lg p-6 mb-6">
          <h1 className="text-3xl font-bold text-gray-900 mb-6">Privacy Policy</h1>
          
          <div className="prose max-w-none">
            <p className="text-gray-600 mb-4">Last Updated: {new Date().toLocaleDateString()}</p>
            
            <h2 className="text-xl font-semibold text-gray-900 mt-6 mb-3">1. Introduction</h2>
            <p>Welcome to Gmail Drafter ("we," "our," or "us"). We respect your privacy and are committed to protecting your personal data. This Privacy Policy explains how we collect, use, and safeguard your information when you use our service.</p>
            
            <h2 className="text-xl font-semibold text-gray-900 mt-6 mb-3">2. Information We Collect</h2>
            <p>When you use Gmail Drafter, we collect the following types of information:</p>
            <ul className="list-disc pl-6 mb-4">
              <li><strong>Google Account Information:</strong> When you sign in with Google, we receive your email address and name.</li>
              <li><strong>Google Sheet Data:</strong> We process the data from Google Sheets that you provide access to.</li>
              <li><strong>Email Templates:</strong> We process the email templates you create within our application.</li>
            </ul>
            
            <h2 className="text-xl font-semibold text-gray-900 mt-6 mb-3">3. How We Use Your Information</h2>
            <p>We use your information for the following purposes:</p>
            <ul className="list-disc pl-6 mb-4">
              <li>To authenticate you and provide access to our service</li>
              <li>To process Google Sheet data for creating email drafts</li>
              <li>To create draft emails in your Gmail account based on your templates</li>
              <li>To improve and optimize our service</li>
            </ul>
            
            <h2 className="text-xl font-semibold text-gray-900 mt-6 mb-3">4. Data Storage and Security</h2>
            <p>We prioritize the security of your data:</p>
            <ul className="list-disc pl-6 mb-4">
              <li>We do not store your Google access tokens in cookies or local storage; they are kept in memory only during your active session.</li>
              <li>Your Google Sheet data is processed temporarily and is not permanently stored on our servers.</li>
              <li>We implement appropriate security measures to protect against unauthorized access or alteration of your data.</li>
            </ul>
            
            <h2 className="text-xl font-semibold text-gray-900 mt-6 mb-3">5. Third-Party Services</h2>
            <p>Our service integrates with the following third-party services:</p>
            <ul className="list-disc pl-6 mb-4">
              <li><strong>Google APIs:</strong> We use Google's APIs to access your Gmail and Google Sheets with your permission. Google's privacy policy applies to their processing of your data: <a href="https://policies.google.com/privacy" target="_blank" rel="noopener noreferrer" className="text-blue-600 hover:underline">https://policies.google.com/privacy</a></li>
              <li><strong>Netlify:</strong> We use Netlify to host our application. Netlify's privacy policy can be found at: <a href="https://www.netlify.com/privacy/" target="_blank" rel="noopener noreferrer" className="text-blue-600 hover:underline">https://www.netlify.com/privacy/</a></li>
            </ul>
            
            <h2 className="text-xl font-semibold text-gray-900 mt-6 mb-3">6. Your Rights</h2>
            <p>Depending on your location, you may have certain rights regarding your personal data, including:</p>
            <ul className="list-disc pl-6 mb-4">
              <li>The right to access your personal data</li>
              <li>The right to rectify inaccurate personal data</li>
              <li>The right to erasure of your personal data</li>
              <li>The right to restrict processing of your personal data</li>
              <li>The right to data portability</li>
              <li>The right to object to processing of your personal data</li>
            </ul>
            
            <h2 className="text-xl font-semibold text-gray-900 mt-6 mb-3">7. Changes to This Privacy Policy</h2>
            <p>We may update our Privacy Policy from time to time. We will notify you of any changes by posting the new Privacy Policy on this page and updating the "Last Updated" date.</p>
            
            <h2 className="text-xl font-semibold text-gray-900 mt-6 mb-3">8. Contact Us</h2>
            <p>If you have any questions about this Privacy Policy, please contact us at:</p>
            <p>Email: privacy@comeriandigital.net</p>
          </div>
        </div>
      </main>
      
      <footer className="bg-white border-t border-gray-200">
        <div className="max-w-7xl mx-auto px-4 py-6 sm:px-6 lg:px-8">
          <p className="text-sm text-gray-500 text-center">
            Gmail Drafter © {new Date().getFullYear()} | Create email drafts from Google Sheets
          </p>
        </div>
      </footer>
    </div>
  );
};

export default PrivacyPolicy;