import React from 'react';
import ReactDOM from 'react-dom/client';
import { BrowserRouter } from 'react-router-dom';
import './src/index.css';

// Simple test component
function SimpleApp() {
  return (
    <div>
      <h1>Simple Test App</h1>
      <p>If you see this, the basic setup is working.</p>
    </div>
  );
}

const rootElement = document.getElementById('root');
if (!rootElement) {
  throw new Error("Could not find root element to mount to");
}

const root = ReactDOM.createRoot(rootElement);
root.render(
  <React.StrictMode>
    <BrowserRouter>
      <SimpleApp />
    </BrowserRouter>
  </React.StrictMode>
);