import { StrictMode } from 'react';
import { createRoot } from 'react-dom/client';
import { BrowserRouter } from 'react-router-dom';
import App from './App';
import { TemplateProvider } from './context/TemplateContext';
import './index.css';

createRoot(document.getElementById('root')!).render(
  <StrictMode>
    <BrowserRouter>
      <TemplateProvider>
        <App />
      </TemplateProvider>
    </BrowserRouter>
  </StrictMode>
);