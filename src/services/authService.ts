import config from '../config';

// Types for authentication
export interface AuthUser {
  email: string;
  name?: string;
  accessToken: string;
  provider: string;
}

// Initialize Netlify Identity Widget
export const initAuth = () => {
  if (config.debug) console.log('Initializing auth service');
  
  // Check if the script is already loaded
  if (window.netlifyIdentity) {
    if (config.debug) console.log('Netlify Identity Widget already loaded');
    initNetlifyIdentity();
    return;
  }
  
  // Load the Netlify Identity Widget script if not already loaded
  const existingScript = document.querySelector('script[src="https://identity.netlify.com/v1/netlify-identity-widget.js"]');
  
  if (!existingScript) {
    if (config.debug) console.log('Loading Netlify Identity Widget script');
    const script = document.createElement('script');
    script.src = 'https://identity.netlify.com/v1/netlify-identity-widget.js';
    script.async = true;
    
    script.onload = () => {
      if (config.debug) console.log('Netlify Identity Widget loaded');
      initNetlifyIdentity();
    };
    
    script.onerror = (e) => {
      console.error('Failed to load Netlify Identity Widget', e);
    };
    
    document.body.appendChild(script);
  } else {
    // Script exists but might not be fully loaded yet
    if (config.debug) console.log('Netlify Identity Widget script exists, waiting for load');
    setTimeout(initNetlifyIdentity, 500);
  }
};

// Initialize Netlify Identity after script is loaded
const initNetlifyIdentity = () => {
  if (window.netlifyIdentity) {
    try {
      // Set up event listeners
      window.netlifyIdentity.on('init', (user) => {
        if (config.debug) console.log('Netlify Identity initialized', user ? 'with user' : 'without user');
      });
      
      window.netlifyIdentity.on('error', (err) => {
        console.error('Netlify Identity error:', err);
      });
      
      // Check if we need to initialize the widget
      if (typeof window.netlifyIdentity.init === 'function') {
        // Use the current site URL for identity
        const siteUrl = window.location.origin;
        if (config.debug) console.log('Initializing Netlify Identity with site URL:', siteUrl);
        
        window.netlifyIdentity.init({
          APIUrl: `${siteUrl}/.netlify/identity`,
          locale: 'en'
        });
      }
    } catch (e) {
      console.error('Error setting up Netlify Identity:', e);
    }
  } else {
    if (config.debug) console.log('Netlify Identity not available yet, retrying...');
    setTimeout(initNetlifyIdentity, 500);
  }
};

// Sign in with Netlify Identity
export const signIn = () => {
  if (config.debug) console.log('Sign in requested');
  
  if (window.netlifyIdentity) {
    if (config.debug) console.log('Using Netlify Identity for sign in');
    
    // Open the Netlify Identity modal
    window.netlifyIdentity.open('login');
  } else {
    console.error('Netlify Identity not available');
    throw new Error('Authentication service not available. Please try refreshing the page.');
  }
};

// Sign out
export const signOut = () => {
  if (window.netlifyIdentity) {
    window.netlifyIdentity.logout();
  }
};

// Get current user
export const getCurrentUser = (): AuthUser | null => {
  if (window.netlifyIdentity) {
    const user = window.netlifyIdentity.currentUser();
    
    if (user) {
      // Extract the token from the Netlify Identity user
      return {
        email: user.email,
        name: user.user_metadata?.full_name,
        accessToken: user.token?.access_token || '',
        provider: user.app_metadata?.provider || 'email'
      };
    }
  }
  
  return null;
};

// Listen for authentication events
export const onAuthStateChanged = (callback: (user: AuthUser | null) => void) => {
  if (window.netlifyIdentity) {
    // Listen for login events
    window.netlifyIdentity.on('login', (user) => {
      if (config.debug) console.log('User logged in', user);
      
      if (user) {
        const authUser: AuthUser = {
          email: user.email,
          name: user.user_metadata?.full_name,
          accessToken: user.token?.access_token || '',
          provider: user.app_metadata?.provider || 'email'
        };
        
        // Close the modal after login
        window.netlifyIdentity.close();
        
        callback(authUser);
      }
    });
    
    // Listen for logout events
    window.netlifyIdentity.on('logout', () => {
      if (config.debug) console.log('User logged out');
      callback(null);
    });
    
    // Initial check
    const currentUser = getCurrentUser();
    if (currentUser) {
      callback(currentUser);
    }
  } else {
    // If netlifyIdentity is not available yet, wait and try again
    setTimeout(() => onAuthStateChanged(callback), 500);
  }
};