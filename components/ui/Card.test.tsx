import React from 'react';
import { render, screen } from '../../tests/utils/test-utils';
import { describe, it, expect } from 'vitest';
import { Card, CardHeader, CardContent, CardFooter } from './Card';

describe('Card components', () => {
    it('renders a Card with children', () => {
        render(<Card>Card Content</Card>);
        expect(screen.getByText('Card Content')).toBeInTheDocument();
    });

    it('renders a CardHeader with children', () => {
        render(<CardHeader>Header Content</CardHeader>);
        expect(screen.getByText('Header Content')).toBeInTheDocument();
        expect(screen.getByText('Header Content')).toHaveClass('flex flex-col space-y-1.5 p-6');
    });

    it('renders a CardContent with children', () => {
        render(<CardContent>Main Content</CardContent>);
        expect(screen.getByText('Main Content')).toBeInTheDocument();
        expect(screen.getByText('Main Content')).toHaveClass('p-6 pt-0');
    });

    it('renders a CardFooter with children', () => {
        render(<CardFooter>Footer Content</CardFooter>);
        expect(screen.getByText('Footer Content')).toBeInTheDocument();
        expect(screen.getByText('Footer Content')).toHaveClass('flex items-center p-6 pt-0');
    });

    it('composes all Card parts together', () => {
        render(
            <Card>
                <CardHeader>Header</CardHeader>
                <CardContent>Content</CardContent>
                <CardFooter>Footer</CardFooter>
            </Card>
        );
        expect(screen.getByText('Header')).toBeInTheDocument();
        expect(screen.getByText('Content')).toBeInTheDocument();
        expect(screen.getByText('Footer')).toBeInTheDocument();
    });
});
