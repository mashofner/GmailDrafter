import config from '../config';

// Types for authentication
export interface AuthUser {
  email: string;
  name?: string;
  accessToken: string;
  provider: string;
}

// Google OAuth client ID
const GOOGLE_CLIENT_ID = import.meta.env.VITE_GOOGLE_CLIENT_ID || '';

// In-memory token storage (no localStorage)
let currentUser: AuthUser | null = null;

// Initialize Google Auth
export const initAuth = () => {
  if (config.debug) console.log('Initializing Google auth service');
  
  // Load the Google Identity Services script if not already loaded
  if (!document.querySelector('script[src="https://accounts.google.com/gsi/client"]')) {
    const script = document.createElement('script');
    script.src = 'https://accounts.google.com/gsi/client';
    script.async = true;
    script.defer = true;
    
    script.onload = () => {
      if (config.debug) console.log('Google Identity Services script loaded');
      initGoogleAuth();
    };
    
    script.onerror = (e) => {
      console.error('Failed to load Google Identity Services script', e);
    };
    
    document.body.appendChild(script);
  } else {
    // Script exists but might not be fully loaded yet
    if (window.google?.accounts) {
      initGoogleAuth();
    } else {
      setTimeout(initGoogleAuth, 500);
    }
  }
};

// Initialize Google Auth after script is loaded
const initGoogleAuth = () => {
  if (window.google?.accounts) {
    try {
      if (config.debug) console.log('Google Identity Services initialized');
    } catch (e) {
      console.error('Error setting up Google Auth:', e);
    }
  } else {
    if (config.debug) console.log('Google Identity Services not available yet, retrying...');
    setTimeout(initGoogleAuth, 500);
  }
};

// Sign in with Google
export const signIn = () => {
  if (config.debug) console.log('Sign in with Google requested');
  
  if (!window.google?.accounts) {
    console.error('Google Identity Services not available');
    throw new Error('Authentication service not available. Please try refreshing the page.');
  }
  
  if (!GOOGLE_CLIENT_ID) {
    console.error('Google Client ID not configured');
    throw new Error('Google authentication is not properly configured. Please check your environment variables.');
  }
  
  const tokenClient = window.google.accounts.oauth2.initTokenClient({
    client_id: GOOGLE_CLIENT_ID,
    scope: 'https://www.googleapis.com/auth/gmail.compose https://www.googleapis.com/auth/userinfo.email https://www.googleapis.com/auth/userinfo.profile',
    callback: async (tokenResponse: any) => {
      if (tokenResponse.error) {
        console.error('Error during Google authentication:', tokenResponse);
        return;
      }
      
      try {
        // Get user info with the access token
        const userInfoResponse = await fetch('https://www.googleapis.com/oauth2/v3/userinfo', {
          headers: {
            'Authorization': `Bearer ${tokenResponse.access_token}`
          }
        });
        
        const userInfo = await userInfoResponse.json();
        
        // Create auth user object and store in memory only (not localStorage)
        currentUser = {
          email: userInfo.email,
          name: userInfo.name,
          accessToken: tokenResponse.access_token,
          provider: 'google'
        };
        
        // Trigger auth state change
        const authStateChangeEvent = new CustomEvent('authStateChanged', { detail: currentUser });
        window.dispatchEvent(authStateChangeEvent);
      } catch (error) {
        console.error('Error fetching user info:', error);
      }
    }
  });
  
  // Request the token with consent screen
  tokenClient.requestAccessToken({ prompt: 'consent' });
};

// Sign out
export const signOut = () => {
  // Clear in-memory user data
  const token = currentUser?.accessToken;
  currentUser = null;
  
  // Revoke Google token if available
  if (token && window.google?.accounts) {
    window.google.accounts.oauth2.revoke(token, () => {
      if (config.debug) console.log('Token revoked');
    });
  }
  
  // Trigger auth state change
  const authStateChangeEvent = new CustomEvent('authStateChanged', { detail: null });
  window.dispatchEvent(authStateChangeEvent);
};

// Get current user
export const getCurrentUser = (): AuthUser | null => {
  return currentUser;
};

// Listen for authentication events
export const onAuthStateChanged = (callback: (user: AuthUser | null) => void) => {
  // Check initial state
  callback(currentUser);
  
  // Listen for auth state changes
  const handleAuthStateChange = (event: CustomEvent<AuthUser | null>) => {
    callback(event.detail);
  };
  
  window.addEventListener('authStateChanged', handleAuthStateChange as EventListener);
  
  // Return a function to remove the listener
  return () => {
    window.removeEventListener('authStateChanged', handleAuthStateChange as EventListener);
  };
};