import React from 'react';

interface TagProps {
  children: React.ReactNode;
  className?: string;
}

const Tag: React.FC<TagProps> = ({ children, className = '' }) => {
  const classes = `inline-block bg-primary-100 text-primary-800 dark:bg-primary-900/50 dark:text-primary-300 text-xs font-semibold mr-2 px-2.5 py-0.5 rounded-full ${className}`;
  return <span className={classes}>{children}</span>;
};

export default Tag;