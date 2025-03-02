// Configuration for the application
const config = {
    // Get Google Client ID from environment variables or use a fallback for development
    googleClientId: import.meta.env.VITE_GOOGLE_CLIENT_ID || '1234567890-example.apps.googleusercontent.com',
    
    // API base URL - automatically detects if we're in production or development
    apiBaseUrl: import.meta.env.PROD ? '' : 'http://localhost:3000',
    
    // Debug mode
    debug: true,
  };
  
  // Log configuration in debug mode
  if (config.debug) {
    console.log('App configuration:', {
      ...config,
      googleClientId: config.googleClientId ? 'Set' : 'Not set'
    });
  }
  
  export default config;