import { render, screen } from '@testing-library/react';
import { describe, it, expect } from 'vitest';
import { SectionTitle } from './SectionTitle';

describe('SectionTitle Component', () => {
  it('renders children correctly', () => {
    render(<SectionTitle>My Awesome Section</SectionTitle>);
    expect(screen.getByText('My Awesome Section')).toBeInTheDocument();
    expect(screen.getByRole('heading', { level: 2 })).toBeInTheDocument();
  });
});
