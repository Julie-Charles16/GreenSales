import { StrictMode } from 'react'
import { createRoot } from 'react-dom/client'
import './index.css'
import App from './App.tsx'
import 'bootstrap/dist/css/bootstrap.min.css';
import 'bootstrap/dist/js/bootstrap.bundle.min.js';
import 'bootstrap-icons/font/bootstrap-icons.css';
import { AuthProvider } from './context/auth/AuthProvider';
import { ToastProvider } from './context/toast/ToastProvider.tsx';

createRoot(document.getElementById('root')!).render(
  <AuthProvider>
    <ToastProvider>
      <StrictMode>
        <App />
      </StrictMode>
    </ToastProvider>
  </AuthProvider>,
)

