import { render, screen, fireEvent, waitFor } from '@testing-library/react';
import { describe, it, expect, vi } from 'vitest';
import { KeyGenerator } from './KeyGenerator';
import * as crypto from '../utils/crypto';

// Mock the crypto module so tests run instantly and predictably
vi.mock('../utils/crypto', () => ({
  generateKeyPair: vi.fn(),
}));

describe('KeyGenerator Component', () => {
  it('renders the initial state correctly', () => {
    render(<KeyGenerator />);
    expect(screen.getByText('Testing Toolkit')).toBeInTheDocument();
    expect(screen.getByRole('button', { name: /Generate Key Pair/i })).toBeInTheDocument();
  });

  it('generates keys and displays them when clicked', async () => {
    const mockGenerateKeyPair = vi.mocked(crypto.generateKeyPair);
    mockGenerateKeyPair.mockReturnValue({
      publicKey: 'mocked-public-key',
      privateKey: 'mocked-private-key'
    });

    render(<KeyGenerator />);
    const button = screen.getByRole('button', { name: /Generate Key Pair/i });
    
    // Click button
    fireEvent.click(button);

    // Should indicate generating
    expect(screen.getByRole('button')).toHaveTextContent(/Generating/i);

    // Wait for the setTimeout in the component to finish
    await waitFor(() => {
      expect(screen.getByText('Public Key')).toBeInTheDocument();
    });

    // Keys should be visible in textareas
    const textareas = screen.getAllByRole('textbox');
    expect(textareas).toHaveLength(2);
    
    // The component sets public key to first textarea and private to second
    expect(textareas[0]).toHaveValue('mocked-public-key');
    expect(textareas[1]).toHaveValue('mocked-private-key');
  });

  it('handles crypto errors gracefully', async () => {
    const mockGenerateKeyPair = vi.mocked(crypto.generateKeyPair);
    mockGenerateKeyPair.mockImplementation(() => { throw new Error('Generation failed'); });
    const consoleSpy = vi.spyOn(console, 'error').mockImplementation(() => {});

    render(<KeyGenerator />);
    fireEvent.click(screen.getByRole('button', { name: /Generate Key Pair/i }));

    // Wait for generating state to finish
    await waitFor(() => {
      expect(screen.getByRole('button')).toHaveTextContent('Generate Key Pair');
    });

    // Should not render textareas if it failed
    expect(screen.queryByText('Public Key')).not.toBeInTheDocument();
    expect(consoleSpy).toHaveBeenCalledWith('Key generation failed', expect.any(Error));

    consoleSpy.mockRestore();
  });
});
