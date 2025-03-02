// Configuration for the application
const config = {
  // API base URL - automatically detects if we're in production or development
  apiBaseUrl: import.meta.env.PROD ? '' : 'http://localhost:3000',
  
  // Debug mode - set to false in production
  debug: import.meta.env.PROD ? false : true,
  
  // Netlify site URL - used for Identity
  netlifyUrl: import.meta.env.PROD ? window.location.origin : 'http://localhost:8888',
};

// Log configuration in debug mode
if (config.debug) {
  console.log('App configuration:', config);
  console.log('Running in:', import.meta.env.PROD ? 'production' : 'development');
  console.log('Site URL:', window.location.origin);
}

export default config;