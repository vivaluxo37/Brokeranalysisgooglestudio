
import React from 'react';
import { useTheme } from '../../hooks/useTheme';
import { Button } from './button';
import { Icons } from '../../constants';

const ThemeToggle: React.FC = () => {
  const { theme, toggleTheme } = useTheme();

  return (
    <Button onClick={toggleTheme} variant="ghost" size="sm" className="p-2">
      {theme === 'light' ? <Icons.moon className="h-5 w-5" /> : <Icons.sun className="h-5 w-5" />}
    </Button>
  );
};

export default ThemeToggle;
