import React from 'react';
import { ArrowLeft } from 'lucide-react';
import { Link } from 'react-router-dom';
import NeuralNetwork from '../components/NeuralNetwork';
import Footer from '../components/Footer';

const PrivacyPolicy: React.FC = () => {
  return (
    <div className="min-h-screen bg-gradient-to-b from-gray-950 via-gray-900 to-gray-800 relative overflow-hidden">
      <div className="fixed inset-0 z-0 bg-gradient-to-tr from-blue-500/5 via-transparent to-purple-500/5">
        <NeuralNetwork />
      </div>
      
      <header className="bg-transparent backdrop-blur-sm relative z-10">
        <div className="max-w-7xl mx-auto px-4 py-4 sm:px-6 lg:px-8">
          <div className="flex items-center">
            <Link to="/" className="flex items-center text-comerian-accent hover:text-white transition-colors">
              <ArrowLeft className="h-5 w-5 mr-2" />
              Back to Home
            </Link>
          </div>
        </div>
      </header>

      <main className="max-w-4xl mx-auto px-4 py-6 sm:py-8 sm:px-6 lg:px-8 relative z-10">
        <div className="card">
          <h1 className="text-2xl sm:text-3xl font-bold text-white mb-6">Privacy Policy</h1>
          
          <div className="prose max-w-none text-comerian-gray">
            <p className="text-comerian-gray mb-6 text-sm sm:text-base">Last Updated: {new Date().toLocaleDateString()}</p>
            
            <h2 className="text-lg sm:text-xl font-semibold text-white mt-6 mb-3">1. Introduction</h2>
            <p className="text-sm sm:text-base">Welcome to Comerian Gmail Drafter ("we," "our," or "us"). We respect your privacy and are committed to protecting your personal data. This Privacy Policy explains how we collect, use, and safeguard your information when you use our service.</p>
            
            <h2 className="text-lg sm:text-xl font-semibold text-white mt-6 mb-3">2. Information We Collect</h2>
            <p className="text-sm sm:text-base">When you use Comerian Gmail Drafter, we collect the following types of information:</p>
            <ul className="list-disc pl-6 mb-4 text-sm sm:text-base">
              <li><strong>Google Account Information:</strong> When you sign in with Google, we receive your email address and name.</li>
              <li><strong>Google Sheet Data:</strong> We process the data from Google Sheets that you provide access to.</li>
              <li><strong>Email Templates:</strong> We process the email templates you create within our application.</li>
            </ul>
            
            <h2 className="text-lg sm:text-xl font-semibold text-white mt-6 mb-3">3. How We Use Your Information</h2>
            <p className="text-sm sm:text-base">We use your information for the following purposes:</p>
            <ul className="list-disc pl-6 mb-4 text-sm sm:text-base">
              <li>To authenticate you and provide access to our service</li>
              <li>To process Google Sheet data for creating email drafts</li>
              <li>To create draft emails in your Gmail account based on your templates</li>
              <li>To improve and optimize our service</li>
            </ul>
            
            <h2 className="text-lg sm:text-xl font-semibold text-white mt-6 mb-3">4. Data Storage and Security</h2>
            <p className="text-sm sm:text-base">We prioritize the security of your data:</p>
            <ul className="list-disc pl-6 mb-4 text-sm sm:text-base">
              <li>We do not store your Google access tokens in cookies or local storage; they are kept in memory only during your active session.</li>
              <li>Your Google Sheet data is processed temporarily and is not permanently stored on our servers.</li>
              <li>We implement appropriate security measures to protect against unauthorized access or alteration of your data.</li>
            </ul>
            
            <h2 className="text-lg sm:text-xl font-semibold text-white mt-6 mb-3">5. Third-Party Services</h2>
            <p className="text-sm sm:text-base">Our service integrates with the following third-party services:</p>
            <ul className="list-disc pl-6 mb-4 text-sm sm:text-base">
              <li><strong>Google APIs:</strong> We use Google's APIs to access your Gmail and Google Sheets with your permission. Google's privacy policy applies to their processing of your data: <a href="https://policies.google.com/privacy" target="_blank" rel="noopener noreferrer" className="text-comerian-teal hover:text-comerian-accent transition-colors">https://policies.google.com/privacy</a></li>
              <li><strong>Netlify:</strong> We use Netlify to host our application. Netlify's privacy policy can be found at: <a href="https://www.netlify.com/privacy/" target="_blank" rel="noopener noreferrer" className="text-comerian-teal hover:text-comerian-accent transition-colors">https://www.netlify.com/privacy/</a></li>
            </ul>
            
            <h2 className="text-lg sm:text-xl font-semibold text-white mt-6 mb-3">6. Your Rights</h2>
            <p className="text-sm sm:text-base">Depending on your location, you may have certain rights regarding your personal data, including:</p>
            <ul className="list-disc pl-6 mb-4 text-sm sm:text-base">
              <li>The right to access your personal data</li>
              <li>The right to rectify inaccurate personal data</li>
              <li>The right to erasure of your personal data</li>
              <li>The right to restrict processing of your personal data</li>
              <li>The right to data portability</li>
              <li>The right to object to processing of your personal data</li>
            </ul>
            
            <h2 className="text-lg sm:text-xl font-semibold text-white mt-6 mb-3">7. About Comerian</h2>
            <p className="text-sm sm:text-base">This application was built by <a href="https://comeriandigital.net" target="_blank" rel="noopener noreferrer" className="text-comerian-teal hover:text-comerian-accent transition-colors">Comerian</a>, a company specializing in digital solutions and software development. Visit our website to learn more about our services and other applications.</p>
            
            <h2 className="text-lg sm:text-xl font-semibold text-white mt-6 mb-3">8. Changes to This Privacy Policy</h2>
            <p className="text-sm sm:text-base">We may update our Privacy Policy from time to time. We will notify you of any changes by posting the new Privacy Policy on this page and updating the "Last Updated" date.</p>
          </div>
        </div>
      </main>
      
      <Footer />
    </div>
  );
};

export default PrivacyPolicy;