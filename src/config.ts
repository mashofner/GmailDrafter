// Configuration for the application
const config = {
  // API base URL - automatically detects if we're in production or development
  apiBaseUrl: import.meta.env.PROD ? '' : 'http://localhost:3000',
  
  // Debug mode - set to false in production
  debug: import.meta.env.DEV ? true : false,
  
  // Site URL
  siteUrl: window.location.origin,
};

// Log configuration in debug mode
if (config.debug) {
  console.log('App configuration:', config);
  console.log('Running in:', import.meta.env.PROD ? 'production' : 'development');
  console.log('Site URL:', window.location.origin);
}

export default config;