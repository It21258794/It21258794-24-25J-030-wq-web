import {StrictMode} from 'react';
import {createRoot} from 'react-dom/client';
import './index.css';
import {RouterProvider} from 'react-router-dom';
import router from './routes/Router.tsx';
import {SnackbarProvider} from 'notistack';
import {AuthProvider} from './components/auth/AuthProvider.tsx';

createRoot(document.getElementById('root')!).render(
  <StrictMode>
    <SnackbarProvider>
      <AuthProvider>
        <RouterProvider router={router} />
      </AuthProvider>
    </SnackbarProvider>
  </StrictMode>
);
