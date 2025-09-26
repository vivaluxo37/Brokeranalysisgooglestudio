
import React from 'react';

interface CardProps {
  children: React.ReactNode;
  className?: string;
}

const Card: React.FC<CardProps> = ({ children, className = '' }) => {
  const classes = `bg-card rounded-xl border border-input shadow-lg transition-all hover:shadow-primary-900/20 ${className}`;
  return <div className={classes}>{children}</div>;
};

export const CardHeader: React.FC<CardProps> = ({ children, className = '' }) => {
  return <div className={`p-6 border-b border-input ${className}`}>{children}</div>;
}

export const CardContent: React.FC<CardProps> = ({ children, className = '' }) => {
  return <div className={`p-6 ${className}`}>{children}</div>;
}

export const CardFooter: React.FC<CardProps> = ({ children, className = '' }) => {
  return <div className={`p-6 pt-0 border-t border-input ${className}`}>{children}</div>;
}


export default Card;
