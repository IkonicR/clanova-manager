
import { createRoot } from 'react-dom/client'
import App from './App.tsx'
import './index.css'

// Add global error handler
window.addEventListener('error', (event) => {
  console.error('Global error caught:', event.error);
});

// Add unhandled promise rejection handler
window.addEventListener('unhandledrejection', (event) => {
  console.error('Unhandled Promise Rejection:', event.reason);
});

console.log('Starting application...');

try {
  const rootElement = document.getElementById("root");
  if (!rootElement) {
    throw new Error("Root element not found");
  }
  
  const root = createRoot(rootElement);
  console.log('Root created, rendering App...');
  
  root.render(<App />);
  console.log('App rendered successfully');
} catch (error) {
  console.error('Error in main.tsx:', error);
}
