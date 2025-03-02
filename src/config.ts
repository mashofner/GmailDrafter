// Configuration for the application
const config = {
  // API base URL - automatically detects if we're in production or development
  apiBaseUrl: import.meta.env.PROD ? '' : 'http://localhost:3000',
  
  // Debug mode
  debug: true,
};

// Log configuration in debug mode
if (config.debug) {
  console.log('App configuration:', config);
}

export default config;