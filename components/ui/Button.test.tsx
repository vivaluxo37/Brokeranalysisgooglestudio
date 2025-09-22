import React from 'react';
import { render, screen, fireEvent } from '@testing-library/react';
import { describe, it, expect, vi } from 'vitest';
import Button from './Button';

describe('Button component', () => {
    it('renders children correctly', () => {
        render(<Button>Click Me</Button>);
        expect(screen.getByText('Click Me')).toBeInTheDocument();
    });

    it('applies the correct classes for variant and size', () => {
        render(<Button variant="secondary" size="lg">Secondary Large</Button>);
        const button = screen.getByText('Secondary Large');
        expect(button).toHaveClass('bg-card text-foreground hover:bg-input'); // secondary variant
        expect(button).toHaveClass('px-6 py-3 text-lg'); // lg size
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
