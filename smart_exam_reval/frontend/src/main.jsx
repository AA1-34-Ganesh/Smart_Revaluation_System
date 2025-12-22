import { StrictMode } from 'react'
import { createRoot } from 'react-dom/client'
import './index.css'
import App from './App.jsx'



// Safety: Unregister any existing service workers to prevent caching issues in dev
if ('serviceWorker' in navigator) {
  navigator.serviceWorker.getRegistrations().then((registrations) => {
    for (let registration of registrations) {
      console.log("Unregistering Service Worker:", registration);
      registration.unregister();
    }
  });
}

const rootElement = document.getElementById('root');
if (!rootElement) {
  console.error(" Main.jsx: Root element not found!");
} else {
  console.log(" Main.jsx: Root element found:", rootElement);
  
  try {
    const root = createRoot(rootElement);
    console.log(" Main.jsx: Root created, rendering App...");
    
    root.render(
      <StrictMode>
        <App />
      </StrictMode>,
    );
  
  } catch (e) {
    console.error(" Main.jsx: Application Crash:", e);
    document.body.innerHTML = `<div style="color: red; padding: 20px;"><h1>Application Crash</h1><pre>${e.message}</pre></div>`;
  }
}