import React from 'react';
// Fix: Use namespace import for react-router-dom to handle potential module resolution issues.
import * as ReactRouterDOM from 'react-router-dom';
import Button from '../components/ui/Button';

const NotFoundPage: React.FC = () => {
  return (
    <div className="text-center py-20">
      <h1 className="text-6xl font-extrabold text-primary-500">404</h1>
      <h2 className="text-3xl font-bold mt-4">Page Not Found</h2>
      <p className="text-lg text-foreground/70 mt-2">Sorry, the page you are looking for does not exist.</p>
      <ReactRouterDOM.Link to="/" className="mt-8 inline-block">
        <Button>Go to Homepage</Button>
      </ReactRouterDOM.Link>
    </div>
  );
};

export default NotFoundPage;
