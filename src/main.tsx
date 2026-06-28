import { StrictMode } from 'react';
import { createRoot } from 'react-dom/client';
import './globalStyles.css';
import 'react-toastify/dist/ReactToastify.css';
import App from './App';
import { ThemeProvider as ModeProvider } from '@/contexts/ThemeContext';

createRoot(document.getElementById('root')!).render(
    <StrictMode>
        <ModeProvider>
            <App />
        </ModeProvider>
    </StrictMode>
);
