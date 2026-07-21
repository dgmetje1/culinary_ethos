import { FC } from 'react';
import { Auth0Provider, Auth0ProviderOptions, AppState } from '@auth0/auth0-react';
import { QueryClientProvider } from '@tanstack/react-query';

import App from '@/components/App';
import config from '@/config';
import { queryClient } from '@/lib/core/queryClient';

const auth0configProps: Auth0ProviderOptions = {
  clientId: config.auth0ClientId,
  domain: config.auth0Domain,
  authorizationParams: {
    redirect_uri: window.location.origin,
    audience: config.auth0ApiAudience,
  },
  onRedirectCallback: (appState?: AppState) => {
    if (appState?.returnTo) {
      window.location.href = appState.returnTo;
    }
  },
};

const Main: FC = () => (
  <Auth0Provider {...auth0configProps}>
    <QueryClientProvider client={queryClient}>
      <App />
    </QueryClientProvider>
  </Auth0Provider>
);

export default Main;
