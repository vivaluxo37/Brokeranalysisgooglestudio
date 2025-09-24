import React from 'react';
import { Icons } from '../../constants';
import Button from '../ui/Button';

interface ShareButtonsProps {
  title: string;
  url: string;
}

const ShareButtons: React.FC<ShareButtonsProps> = ({ title, url }) => {
  const encodedTitle = encodeURIComponent(title);
  const encodedUrl = encodeURIComponent(url);

  const platforms = {
    twitter: {
      url: `https://twitter.com/intent/tweet?text=${encodedTitle}&url=${encodedUrl}`,
      icon: <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M22 4s-.7 2.1-2 3.4c1.6 1.4 3.3 4.9 3.3 4.9-6.1-1.4-6.1-6.1-6.1-6.1s-2.1-2.1-4.2 0c-5.6 2.8-7 6.1-7 6.1s-1.4 1.4 0 2.8c1.4 1.4 2.8 0 2.8 0s.7-2.1 2.8-2.8c2.1-.7 4.2-1.4 4.2-1.4s-2.8.7-2.8 2.8c0 2.1 2.1 2.8 2.1 2.8s-.7 1.4-2.8 1.4c-2.1 0-4.2.7-4.2.7s-1.4-2.1 0-4.2c1.4-2.1 2.8-2.1 2.8-2.1s-2.8-1.4-4.2-1.4c-1.4 0-2.8.7-2.8.7s-2.1 2.1-2.1 6.1c0 4.2 2.1 5.6 2.1 5.6s2.1 1.4 4.2 0 4.2-2.8 4.2-2.8-2.1 1.4-4.2 0c-2.1-.7-2.8-2.8-2.8-2.8s2.8 2.1 6.1 1.4c3.3-.7 4.9-4.9 4.9-4.9s-1.4-1.4-3.4-2.1c1.4-1.4 2.1-2.8 2.1-2.8s-2.8 1.4-4.9 1.4c-2.1 0-3.4-.7-3.4-.7s2.1-2.1 4.2-2.1c2.1 0 3.4.7 3.4.7s.7-2.1 0-2.8z"/></svg>,
    },
    facebook: {
      url: `https://www.facebook.com/sharer/sharer.php?u=${encodedUrl}`,
      icon: <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M18 2h-3a5 5 0 0 0-5 5v3H7v4h3v8h4v-8h3l1-4h-4V7a1 1 0 0 1 1-1h3z"/></svg>,
    },
    linkedin: {
      url: `https://www.linkedin.com/shareArticle?mini=true&url=${encodedUrl}&title=${encodedTitle}`,
      icon: <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M16 8a6 6 0 0 1 6 6v7h-4v-7a2 2 0 0 0-2-2 2 2 0 0 0-2 2v7h-4v-7a6 6 0 0 1 6-6z"/><rect x="2" y="9" width="4" height="12"/><circle cx="4" cy="4" r="2"/></svg>,
    },
  };

  return (
    <div className="flex items-center gap-4">
      <span className="text-sm font-semibold text-foreground/80">Share this article:</span>
      <div className="flex items-center gap-2">
        {Object.entries(platforms).map(([name, { url, icon }]) => (
          <a
            key={name}
            href={url}
            target="_blank"
            rel="noopener noreferrer"
            className="p-2 rounded-full text-foreground/70 bg-input hover:bg-primary-600 hover:text-white transition-colors"
            aria-label={`Share on ${name}`}
          >
            {React.cloneElement(icon, { className: 'h-5 w-5' })}
          </a>
        ))}
      </div>
    </div>
  );
};

export default ShareButtons;
