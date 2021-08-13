import React from 'react';
import dynamic from 'next/dynamic';
import { Provider, useSession } from 'next-auth/client';

import { AllProviders } from '../components/AllProviders';

/**
 * Dynamically load layouts. This codesplits and prevents code from the logged in layout from being
 * included in the bundle if we're rendering the logged out layout.
 */
const LoggedInLayout = dynamic(() =>
  import('../layouts/LoggedIn').then((mod) => mod.LoggedInLayout)
);

const LoggedOutLayout = dynamic(() =>
  import('../layouts/LoggedOut').then((mod) => mod.LoggedOutLayout)
);

/**
 * Renders a layout depending on the result of the useSession hook
 */
function AppWithAuth({ children }) {
  const [session] = useSession();

  return session ? (
    <LoggedInLayout>{children}</LoggedInLayout>
  ) : (
    <LoggedOutLayout>{children}</LoggedOutLayout>
  );
}

function App({ pageProps, Component }) {
  return (
    <AllProviders>
      <Provider session={pageProps.session}>
        <AppWithAuth>
          <Component {...pageProps} />
        </AppWithAuth>
      </Provider>
    </AllProviders>
  );
}

export default App;
