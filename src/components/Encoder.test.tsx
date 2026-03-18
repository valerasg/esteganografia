import { render, screen, fireEvent, waitFor } from '@testing-library/react';
import { describe, it, expect, vi, beforeEach } from 'vitest';
import { Encoder } from './Encoder';
import * as crypto from '../utils/crypto';
import * as stegano from '../utils/stegano';

vi.mock('../utils/crypto', () => ({
  encryptMessage: vi.fn(),
}));

vi.mock('../utils/stegano', () => ({
  embedDataInImage: vi.fn(),
}));

describe('Encoder Component', () => {
  beforeEach(() => {
    vi.clearAllMocks();
    
    // Mock URL.createObjectURL since it's used for the image preview
    global.URL.createObjectURL = vi.fn(() => 'blob:mock-url');
    global.URL.revokeObjectURL = vi.fn();
  });

  it('renders initial state correctly with button disabled', () => {
    render(<Encoder />);
    expect(screen.getByText('Hide a Secret Message')).toBeInTheDocument();
    const btn = screen.getByRole('button', { name: /Encrypt & Embed/i });
    expect(btn).toBeDisabled();
  });

  it('enables the button when all fields are filled', () => {
    render(<Encoder />);
    
    const fileInput = document.querySelector('input[type="file"]') as HTMLInputElement;
    const messageInput = screen.getByPlaceholderText(/Type your highly sensitive message/i);
    const keyInput = screen.getByPlaceholderText(/-----BEGIN PUBLIC KEY-----/i);
    
    fireEvent.change(fileInput, { target: { files: [new File([''], 'test.png', { type: 'image/png' })] } });
    fireEvent.change(messageInput, { target: { value: 'secret' } });
    fireEvent.change(keyInput, { target: { value: 'public-key-pem' } });

    const btn = screen.getByRole('button', { name: /Encrypt & Embed/i });
    expect(btn).not.toBeDisabled();
  });

  it('handles the encryption process and shows success message', async () => {
    vi.mocked(crypto.encryptMessage).mockReturnValue('encrypted-string');
    vi.mocked(stegano.embedDataInImage).mockResolvedValue(new Blob(['imagestuff']));

    render(<Encoder />);
    
    const fileInput = document.querySelector('input[type="file"]') as HTMLInputElement;
    fireEvent.change(fileInput, { target: { files: [new File([''], 'test.png')] } });
    fireEvent.change(screen.getByPlaceholderText(/Type your highly sensitive message/i), { target: { value: 'secret' } });
    fireEvent.change(screen.getByPlaceholderText(/-----BEGIN PUBLIC KEY-----/i), { target: { value: 'key' } });

    fireEvent.click(screen.getByRole('button', { name: /Encrypt & Embed/i }));

    await waitFor(() => {
      expect(crypto.encryptMessage).toHaveBeenCalledWith('secret', 'key');
      expect(stegano.embedDataInImage).toHaveBeenCalled();
      expect(screen.getByText('Success! Message Secured.')).toBeInTheDocument();
      expect(screen.getByRole('link', { name: /Download Secure PNG Image/i })).toBeInTheDocument();
    });
  });

  it('displays error message if processing fails', async () => {
    vi.mocked(crypto.encryptMessage).mockImplementation(() => { throw new Error('Encryption failed'); });

    render(<Encoder />);
    
    const fileInput = document.querySelector('input[type="file"]') as HTMLInputElement;
    fireEvent.change(fileInput, { target: { files: [new File([''], 'test.png')] } });
    fireEvent.change(screen.getByPlaceholderText(/Type your highly sensitive message/i), { target: { value: 'secret' } });
    fireEvent.change(screen.getByPlaceholderText(/-----BEGIN PUBLIC KEY-----/i), { target: { value: 'key' } });

    fireEvent.click(screen.getByRole('button', { name: /Encrypt & Embed/i }));

    await waitFor(() => {
      expect(screen.getByText('Encryption failed')).toBeInTheDocument();
    });
  });
});
