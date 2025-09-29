import React from 'react';
import { render, screen, fireEvent } from '../../tests/utils/test-utils';
import { describe, it, expect, vi } from 'vitest';
import { Button } from './Button';

describe('Button component', () => {
    it('renders children correctly', () => {
        render(<Button>Click Me</Button>);
        expect(screen.getByText('Click Me')).toBeInTheDocument();
    });

    it('applies the correct classes for variant and size', () => {
        render(<Button variant="secondary" size="lg">Secondary Large</Button>);
        const button = screen.getByText('Secondary Large');
        expect(button).toHaveClass('bg-secondary text-secondary-foreground hover:bg-secondary/80'); // secondary variant
        expect(button).toHaveClass('h-11 rounded-md px-8'); // lg size
    });

    it('handles click events', () => {
        const handleClick = vi.fn();
        render(<Button onClick={handleClick}>Clickable</Button>);
        fireEvent.click(screen.getByText('Clickable'));
        expect(handleClick).toHaveBeenCalledTimes(1);
    });

    it('is disabled when the disabled prop is true', () => {
        const handleClick = vi.fn();
        render(<Button onClick={handleClick} disabled>Disabled Button</Button>);
        const button = screen.getByText('Disabled Button');
        expect(button).toBeDisabled();
        fireEvent.click(button);
        expect(handleClick).not.toHaveBeenCalled();
    });
});
