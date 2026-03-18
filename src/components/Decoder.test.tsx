import { render, screen, fireEvent, waitFor } from '@testing-library/react';
import { describe, it, expect, vi, beforeEach } from 'vitest';
import { Decoder } from './Decoder';
import * as crypto from '../utils/crypto';
import * as stegano from '../utils/stegano';

vi.mock('../utils/crypto', () => ({
  decryptMessage: vi.fn(),
}));

vi.mock('../utils/stegano', () => ({
  extractDataFromImage: vi.fn(),
}));

describe('Decoder Component', () => {
  beforeEach(() => {
    vi.clearAllMocks();
    global.URL.createObjectURL = vi.fn(() => 'blob:mock-url');
    global.URL.revokeObjectURL = vi.fn();
  });

  it('renders correctly and has disabled button initially', () => {
    render(<Decoder />);
    expect(screen.getByText('Reveal a Secret Message')).toBeInTheDocument();
    expect(screen.getByRole('button', { name: /Extract & Decrypt/i })).toBeDisabled();
  });

  it('enables the button when image and key are provided', () => {
    render(<Decoder />);
    
    const fileInput = document.querySelector('input[type="file"]') as HTMLInputElement;
    const keyInput = screen.getByPlaceholderText(/-----BEGIN PRIVATE KEY-----/i);
    
    fireEvent.change(fileInput, { target: { files: [new File([''], 'encoded.png')] } });
    fireEvent.change(keyInput, { target: { value: 'private-key' } });

    expect(screen.getByRole('button', { name: /Extract & Decrypt/i })).not.toBeDisabled();
  });

  it('successfully extracts and decrypts data', async () => {
    vi.mocked(stegano.extractDataFromImage).mockResolvedValue('extracted-encrypted-text');
    vi.mocked(crypto.decryptMessage).mockReturnValue('The secret identity is revealed');

    render(<Decoder />);
    
    const fileInput = document.querySelector('input[type="file"]') as HTMLInputElement;
    fireEvent.change(fileInput, { target: { files: [new File([''], 'encoded.png')] } });
    fireEvent.change(screen.getByPlaceholderText(/-----BEGIN PRIVATE KEY-----/i), { target: { value: 'private-key' } });

    fireEvent.click(screen.getByRole('button', { name: /Extract & Decrypt/i }));

    await waitFor(() => {
      expect(stegano.extractDataFromImage).toHaveBeenCalled();
      expect(crypto.decryptMessage).toHaveBeenCalledWith('extracted-encrypted-text', 'private-key');
    });

    expect(screen.getByText('The secret identity is revealed')).toBeInTheDocument();
  });

  it('displays error if extraction or decryption fails', async () => {
    vi.mocked(stegano.extractDataFromImage).mockRejectedValue(new Error('Image is corrupted'));
    const consoleSpy = vi.spyOn(console, 'error').mockImplementation(() => {});

    render(<Decoder />);
    
    const fileInput = document.querySelector('input[type="file"]') as HTMLInputElement;
    fireEvent.change(fileInput, { target: { files: [new File([''], 'bad.png')] } });
    fireEvent.change(screen.getByPlaceholderText(/-----BEGIN PRIVATE KEY-----/i), { target: { value: 'private-key' } });

    fireEvent.click(screen.getByRole('button', { name: /Extract & Decrypt/i }));

    await waitFor(() => {
      expect(screen.getByText('Image is corrupted')).toBeInTheDocument();
    });

    consoleSpy.mockRestore();
  });
});
