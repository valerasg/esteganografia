import { render, screen, fireEvent } from '@testing-library/react';
import { describe, it, expect, vi } from 'vitest';
import { FileInput } from './FileInput';

describe('FileInput Component', () => {
  it('renders the label correctly', () => {
    render(<FileInput label="Upload Here" accept="image/*" onChange={() => {}} />);
    expect(screen.getByText('Upload Here')).toBeInTheDocument();
  });

  it('displays the selected file name if provided', () => {
    render(<FileInput label="Upload" accept="image/*" onChange={() => {}} selectedFileName="secret_image.png" />);
    expect(screen.getByText('secret_image.png')).toBeInTheDocument();
    expect(screen.getByText(/Click to replace file/i)).toBeInTheDocument();
  });

  it('triggers the onChange handler when a file is selected', async () => {
    const handleChange = vi.fn();
    render(<FileInput label="Upload" accept="image/*" onChange={handleChange} />);
    
    // Get the hidden input element
    // Since input is actually a custom styled element wrapping a hidden file input, we grab the input type="file"
    const inputEl = document.querySelector('input[type="file"]') as HTMLInputElement;
    expect(inputEl).toBeDefined();

    const file = new File(['hello'], 'hello.png', { type: 'image/png' });

    fireEvent.change(inputEl, {
      target: { files: [file] },
    });

    expect(handleChange).toHaveBeenCalledTimes(1);
    expect(handleChange).toHaveBeenCalledWith(file);
  });
});
