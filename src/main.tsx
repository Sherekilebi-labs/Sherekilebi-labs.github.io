import { createRoot } from 'react-dom/client';
import '@fontsource/jetbrains-mono/latin-400.css';
import './styles.css';
import './dark-theme.css';
import App from './App';
import { BrowserRouter } from 'react-router-dom';

createRoot(document.getElementById('root')!).render(<BrowserRouter><App/></BrowserRouter>);
