import { render, screen, fireEvent } from '@testing-library/react';
import { describe, it, expect, vi } from 'vitest';
import App from './App';

describe('App Component', () => {
  it('renders the application title', () => {
    render(<App />);
    expect(screen.getByText(/Secure Steganography/i)).toBeInTheDocument();
  });

  it('toggles theme when the theme button is clicked', () => {
    render(<App />);
    const themeButton = screen.getByLabelText(/Toggle Theme/i);
    
    // Default theme is dark
    expect(document.documentElement.classList.contains('dark')).toBe(true);

    // Toggle to light
    fireEvent.click(themeButton);
    expect(document.documentElement.classList.contains('dark')).toBe(false);

    // Toggle back to dark
    fireEvent.click(themeButton);
    expect(document.documentElement.classList.contains('dark')).toBe(true);
  });

  it('switches between Hide and Reveal tabs', () => {
    render(<App />);
    
    const revealTabButton = screen.getByText(/Reveal Message \(Decode\)/i);
    const hideTabButton = screen.getByText(/Hide Message \(Encode\)/i);

    // Initially on Encode tab
    expect(screen.getByText(/Hide a Message/i)).toBeInTheDocument();

    // Switch to Decode
    fireEvent.click(revealTabButton);
    expect(screen.getByText(/Reveal a Message/i)).toBeInTheDocument();

    // Switch back to Encode
    fireEvent.click(hideTabButton);
    expect(screen.getByText(/Hide a Message/i)).toBeInTheDocument();
  });

  it('renders the key generator toolkit', () => {
    render(<App />);
    expect(screen.getByText(/Testing Toolkit: Generate Keys/i)).toBeInTheDocument();
  });
});
