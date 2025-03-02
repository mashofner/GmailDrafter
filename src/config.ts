// Configuration for the application
const config = {
  // API base URL - automatically detects if we're in production or development
  apiBaseUrl: import.meta.env.PROD ? '' : 'http://localhost:3000',
  
  // Netlify Identity configuration
  netlify: {
    enabled: true,
    // The site URL is used for redirects after authentication
    siteUrl: import.meta.env.PROD 
      ? 'https://gmaildrafter.comeriandigital.net' 
      : 'http://localhost:5173'
  },
  
  // Debug mode
  debug: true,
};

// Log configuration in debug mode
if (config.debug) {
  console.log('App configuration:', {
    ...config,
    siteUrl: config.netlify.siteUrl
  });
}

export default config;