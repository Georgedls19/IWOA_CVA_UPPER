import { BrowserRouter } from 'react-router-dom';
import AppContent from '../src/AppContent/AppContent';
import { ThemeProvider } from './context/themeContext';

export default function App() {
  return (
    <BrowserRouter>
      <ThemeProvider>
        <AppContent />
      </ThemeProvider>
    </BrowserRouter>
  );
}
