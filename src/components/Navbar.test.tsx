import { render, screen, fireEvent } from '@testing-library/react';
import { describe, it, expect, vi } from 'vitest';
import { Navbar } from './Navbar';

describe('Navbar Component', () => {
  it('renders the logo and title correctly', () => {
    render(<Navbar theme="light" toggleTheme={() => {}} />);
    expect(screen.getByText('Stegano')).toBeInTheDocument();
  });

  it('calls toggleTheme when the theme button is clicked', () => {
    const toggleSpy = vi.fn();
    render(<Navbar theme="light" toggleTheme={toggleSpy} />);
    
    // The button has aria-label Toggle Theme
    const btn = screen.getByLabelText('Toggle Theme');
    fireEvent.click(btn);
    
    expect(toggleSpy).toHaveBeenCalledTimes(1);
  });

  it('has correct title attribute dynamically based on theme', () => {
    const { rerender } = render(<Navbar theme="light" toggleTheme={() => {}} />);
    expect(screen.getByLabelText('Toggle Theme')).toHaveAttribute('title', 'Switch to dark mode');

    rerender(<Navbar theme="dark" toggleTheme={() => {}} />);
    expect(screen.getByLabelText('Toggle Theme')).toHaveAttribute('title', 'Switch to light mode');
  });
});
