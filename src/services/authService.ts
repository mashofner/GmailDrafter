import config from '../config';

// Types for authentication
export interface AuthUser {
  email: string;
  name?: string;
  accessToken: string;
  provider: string;
}

// Check if we're running on Netlify
const isNetlify = () => {
  return window.location.hostname.includes('netlify.app') || 
         window.location.hostname === 'gmaildrafter.comeriandigital.net';
};

// Initialize Netlify Identity Widget
export const initAuth = () => {
  if (config.debug) console.log('Initializing auth service');
  
  if (config.netlify.enabled && isNetlify()) {
    if (config.debug) console.log('Loading Netlify Identity Widget');
    
    // Load the Netlify Identity Widget script
    const script = document.createElement('script');
    script.src = 'https://identity.netlify.com/v1/netlify-identity-widget.js';
    script.async = true;
    
    script.onload = () => {
      if (config.debug) console.log('Netlify Identity Widget loaded');
      
      // Initialize the widget when it's loaded
      if (window.netlifyIdentity) {
        window.netlifyIdentity.on('init', (user) => {
          if (config.debug) console.log('Netlify Identity initialized', user ? 'with user' : 'without user');
        });
      }
    };
    
    script.onerror = (e) => {
      console.error('Failed to load Netlify Identity Widget', e);
    };
    
    document.body.appendChild(script);
  } else {
    if (config.debug) console.log('Not using Netlify Identity (development mode or disabled)');
  }
};

// Sign in with Netlify Identity
export const signIn = () => {
  if (config.debug) console.log('Sign in requested');
  
  if (window.netlifyIdentity) {
    if (config.debug) console.log('Using Netlify Identity for sign in');
    
    // Open the Netlify Identity modal with Google provider
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
  }
};