import { RouterProvider } from 'react-router-dom';

// project import
import router from 'routes';
import ThemeCustomization from 'themes';

import Locales from 'components/Locales';
import RTLLayout from 'components/RTLLayout';
import ScrollTop from 'components/ScrollTop';
import Customization from 'components/Customization';
import Snackbar from 'components/@extended/Snackbar';
import Notistack from 'components/third-party/Notistack';

// auth-provider
import { JWTProvider } from 'contexts/JWTContext';
import { QueryClient, QueryClientProvider } from '@tanstack/react-query';
const queryClient = new QueryClient();


// ==============================|| APP - THEME, ROUTER, LOCAL  ||============================== //

export default function App() {
  return (
    <QueryClientProvider client={queryClient}>
    <ThemeCustomization>
      <RTLLayout>
        <Locales>
          <ScrollTop>
            <JWTProvider>
              <>
                <Notistack>
                  <RouterProvider router={router} />
                  <Customization />
                  <Snackbar />
                </Notistack>
              </>
            </JWTProvider>
          </ScrollTop>
        </Locales>
      </RTLLayout>
    </ThemeCustomization>
    </QueryClientProvider>
  );
}
