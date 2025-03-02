/// <reference types="vite/client" />

interface ImportMetaEnv {
  readonly VITE_GOOGLE_CLIENT_ID: string;
}

interface ImportMeta {
  readonly env: ImportMetaEnv;
}

interface Window {
  google?: {
    accounts: {
      id: {
        initialize: (config: any) => void;
        renderButton: (element: HTMLElement, config: any) => void;
      };
      oauth2: {
        initTokenClient: (config: any) => void;
        requestAccessToken: (config: any) => void;
      };
    };
  };
  netlifyIdentity: {
    on: (event: string, callback: any) => void;
    open: (tab?: string) => void;
    close: () => void;
    currentUser: () => any;
    logout: () => void;
  };
}