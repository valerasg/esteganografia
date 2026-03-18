import { render, screen } from '@testing-library/react';
import { describe, it, expect } from 'vitest';
import { Footer } from './Footer';

describe('Footer Component', () => {
  it('renders copyright year and project name', () => {
    render(<Footer />);
    const year = new Date().getFullYear().toString();
    const copyrightText = screen.getByText(new RegExp(year));
    expect(copyrightText).toBeInTheDocument();
    expect(copyrightText).toHaveTextContent(/Secure Steganography\. All rights reserved/i);
  });

  it('renders the View Source link with correct href', () => {
    render(<Footer />);
    const link = screen.getByRole('link', { name: /View Source/i });
    expect(link).toBeInTheDocument();
    expect(link).toHaveAttribute('href', 'https://github.com/valerasg/esteganografia');
    expect(link).toHaveAttribute('target', '_blank');
  });
});
